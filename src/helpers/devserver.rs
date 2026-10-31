//! Drives `rheo watch` as a real subprocess: spawn it, discover the port its
//! dev server bound (it advances past ports already in use — see
//! `../rheo/crates/html/src/server.rs`), and issue plain HTTP/1.1 requests
//! against it. Exercises the dev server binary itself rather than its
//! library internals, so this is the same capability a served-vs-compiled
//! parity test needs (fetch a served page over HTTP and inspect its bytes).

use super::cli::rheo_cli_command;
use std::io::{BufRead, BufReader, Read, Write};
use std::net::TcpStream;
use std::path::Path;
use std::process::{Child, Stdio};
use std::sync::{Arc, Mutex};
use std::time::{Duration, Instant};

/// Upper bound on waiting for the server to report its port. `rheo watch` is
/// spawned via `cargo run`, which may need to build the binary first.
const STARTUP_TIMEOUT: Duration = Duration::from_secs(30);
/// Upper bound on a single HTTP round-trip and on `wait_for_edit`'s total budget.
const IO_TIMEOUT: Duration = Duration::from_secs(8);
/// How long to leave an edit alone before re-applying it — see
/// [`DevServer::wait_for_edit`]. Must exceed the dev server's own debounce
/// (`debounce_duration`, 1s, in `../rheo/crates/core/src/assets/watch.rs`),
/// which is RESET by every filesystem event: re-writing faster than that keeps
/// pushing the deadline back and the rebuild never fires at all.
const REEDIT_INTERVAL: Duration = Duration::from_millis(1500);
/// Upper bound on [`DevServer::edit_and_wait_for_rebuild`]. Debug-built rheo
/// is slow, and a narrowed-rebuild round can run the Typst compiler several
/// times over.
const REBUILD_TIMEOUT: Duration = Duration::from_secs(60);
/// How long the rebuild count must sit unchanged before
/// [`DevServer::edit_and_wait_for_rebuild`] is willing to return — a
/// re-applied edit (see [`REEDIT_INTERVAL`]) can trigger one extra rebuild
/// after the count first grows, and that must not leak into the next call.
const REBUILD_QUIESCE: Duration = Duration::from_millis(2500);

/// A running `rheo watch --open` subprocess. Killed (whole process group, so
/// `cargo run`'s child survives no `kill` on the wrapper alone) on drop —
/// including on panic, since drop runs during unwind.
pub struct DevServer {
    child: Child,
    port: u16,
    log: Arc<Mutex<String>>,
}

impl DevServer {
    /// Spawns `rheo watch <project_path> --open <extra_args>` and blocks until
    /// the dev server reports its port.
    ///
    /// `RUST_LOG` names three crates explicitly: `rheo_html` for the bound-URL
    /// line this waits for, `rheo` for the CLI's own warnings — without which
    /// [`Self::log`] cannot see a failed in-memory rebuild at all — and
    /// `rheo_core` for the `narrowed: `/`full rebuild: ` line each rebuild logs
    /// (see [`Self::rebuild_lines`]).
    pub fn start(project_path: &Path, extra_args: &[&str]) -> Self {
        let mut cmd = rheo_cli_command();
        cmd.arg("watch")
            .arg(project_path)
            .arg("--open")
            .args(extra_args)
            .env("TYPST_IGNORE_SYSTEM_FONTS", "1")
            .env("BROWSER", "chromium")
            .env("RUST_LOG", "rheo=info,rheo_html=info,rheo_core=info")
            .stdout(Stdio::piped())
            .stderr(Stdio::piped());
        set_own_process_group(&mut cmd);

        let mut child = cmd.spawn().expect("failed to spawn `rheo watch`");
        let log = Arc::new(Mutex::new(String::new()));
        spawn_reader(child.stdout.take().unwrap(), log.clone());
        spawn_reader(child.stderr.take().unwrap(), log.clone());

        let deadline = Instant::now() + STARTUP_TIMEOUT;
        loop {
            let port = log.lock().unwrap().lines().find_map(parse_port);
            if let Some(port) = port {
                return DevServer { child, port, log };
            }
            if let Some(status) = child.try_wait().expect("failed to poll child") {
                panic!(
                    "`rheo watch` exited early ({status}) before reporting a port:\n{}",
                    log.lock().unwrap()
                );
            }
            if Instant::now() > deadline {
                kill_group(&mut child);
                panic!(
                    "`rheo watch` did not report a server URL within {STARTUP_TIMEOUT:?}:\n{}",
                    log.lock().unwrap()
                );
            }
            std::thread::sleep(Duration::from_millis(50));
        }
    }

    /// Issues `GET <path>` against the running server and returns the response
    /// body. Panics on any I/O error or if it doesn't complete within
    /// [`IO_TIMEOUT`].
    pub fn get(&self, path: &str) -> String {
        let mut stream = TcpStream::connect(("127.0.0.1", self.port))
            .unwrap_or_else(|e| panic!("connect to dev server on port {}: {e}", self.port));
        stream.set_read_timeout(Some(IO_TIMEOUT)).unwrap();
        stream.set_write_timeout(Some(IO_TIMEOUT)).unwrap();
        write!(
            stream,
            "GET {path} HTTP/1.1\r\nHost: 127.0.0.1\r\nConnection: close\r\n\r\n"
        )
        .expect("write HTTP request");
        let mut response = String::new();
        stream
            .read_to_string(&mut response)
            .expect("read HTTP response");
        match response.split_once("\r\n\r\n") {
            Some((_, body)) => body.to_string(),
            None => response,
        }
    }

    /// Everything the server has written to stdout/stderr so far.
    ///
    /// The dev server serves from disk whenever its in-memory rebuild has not
    /// landed, and that fallback is always correct — so a served-vs-compiled
    /// comparison cannot tell a working in-memory path from a failing one. The
    /// only observable difference is the warning the CLI logs when
    /// `compile_for_watch` returns an error.
    pub fn log(&self) -> String {
        self.log.lock().unwrap().clone()
    }

    /// Applies `edit`, then polls `get(path)` until `pred` accepts the body,
    /// re-applying `edit` every [`REEDIT_INTERVAL`] until [`IO_TIMEOUT`].
    ///
    /// The retry is not belt-and-braces; without it this is flaky by
    /// construction. `rheo watch` logs its bound URL — which [`Self::start`]
    /// waits for — from `plugin.open(...)`, but registers its filesystem
    /// watcher later, after the initial build and the initial in-memory
    /// compile (see `run_watch` in `../rheo/crates/cli/src/lib.rs`). An edit
    /// landing in that window is not merely late: nothing is watching, so no
    /// rebuild is ever triggered and a one-shot poll can only time out.
    ///
    /// Re-writing the same bytes still emits a modify event, so a later attempt
    /// lands once the watcher is live — but only if attempts are spaced beyond
    /// the server's debounce. See [`REEDIT_INTERVAL`].
    pub fn wait_for_edit(
        &self,
        path: &str,
        edit: impl Fn(),
        pred: impl Fn(&str) -> bool,
    ) -> String {
        let deadline = Instant::now() + IO_TIMEOUT;
        let mut last_edit: Option<Instant> = None;
        loop {
            if last_edit.is_none_or(|t| t.elapsed() >= REEDIT_INTERVAL) {
                edit();
                last_edit = Some(Instant::now());
            }
            let body = self.get(path);
            if pred(&body) {
                return body;
            }
            if Instant::now() > deadline {
                panic!("condition on {path} not met within {IO_TIMEOUT:?}; last body:\n{body}");
            }
            std::thread::sleep(Duration::from_millis(100));
        }
    }

    /// The message portion of every rebuild line logged so far — either a
    /// `narrowed: ...` or a `full rebuild: ...` line, see `RebuildPath::log`
    /// in `../rheo/crates/core/src/build.rs`. The tracing-formatted prefix
    /// (timestamp and level) is stripped, leaving only the fixed, grep-stable
    /// message the log line starts with.
    pub fn rebuild_lines(&self) -> Vec<String> {
        self.log()
            .lines()
            .filter_map(|line| {
                ["narrowed: ", "full rebuild: "]
                    .iter()
                    .find_map(|marker| line.find(marker))
                    .map(|start| line[start..].to_string())
            })
            .collect()
    }

    /// Applies `edit`, then waits for a new rebuild line to appear, returning
    /// the last one logged. Like [`Self::wait_for_edit`], re-applies `edit`
    /// every [`REEDIT_INTERVAL`] for the same reason: the watcher registers
    /// late, after the initial build, so an edit landing before that is never
    /// seen at all.
    ///
    /// Once the rebuild count has grown, this keeps polling until it has held
    /// steady for [`REBUILD_QUIESCE`] — a re-applied `edit` can still be
    /// in flight and trigger one more rebuild, which must not leak into
    /// whatever the caller does next. Panics with the full log if no new
    /// rebuild line appears within [`REBUILD_TIMEOUT`].
    pub fn edit_and_wait_for_rebuild(&self, edit: impl Fn()) -> String {
        let deadline = Instant::now() + REBUILD_TIMEOUT;
        let initial_count = self.rebuild_lines().len();
        let mut last_edit: Option<Instant> = None;
        let mut grown_at: Option<Instant> = None;
        let mut last_count = initial_count;
        loop {
            // Stop re-applying `edit` once growth has been observed: rewriting
            // the file again (even to identical bytes) still emits a modify
            // event, which would keep retriggering rebuilds and prevent the
            // count from ever holding steady.
            if grown_at.is_none() && last_edit.is_none_or(|t| t.elapsed() >= REEDIT_INTERVAL) {
                edit();
                last_edit = Some(Instant::now());
            }
            let lines = self.rebuild_lines();
            if lines.len() > last_count {
                last_count = lines.len();
                grown_at = Some(Instant::now());
            }
            if lines.len() > initial_count
                && let Some(grown_at) = grown_at
                && grown_at.elapsed() >= REBUILD_QUIESCE
            {
                return lines.last().cloned().expect("rebuild count grew");
            }
            if Instant::now() > deadline {
                panic!(
                    "no new rebuild line within {REBUILD_TIMEOUT:?}; log:\n{}",
                    self.log()
                );
            }
            std::thread::sleep(Duration::from_millis(100));
        }
    }
}

impl Drop for DevServer {
    fn drop(&mut self) {
        kill_group(&mut self.child);
    }
}

fn spawn_reader(pipe: impl Read + Send + 'static, log: Arc<Mutex<String>>) {
    std::thread::spawn(move || {
        for line in BufReader::new(pipe).lines().map_while(Result::ok) {
            let mut log = log.lock().unwrap();
            log.push_str(&line);
            log.push('\n');
        }
    });
}

/// Extracts the port from a `web server started url=http://localhost:PORT` line.
fn parse_port(line: &str) -> Option<u16> {
    let (_, after) = line.rsplit_once("localhost:")?;
    after
        .split(|c: char| !c.is_ascii_digit())
        .next()?
        .parse()
        .ok()
}

/// Makes the spawned child its own process-group leader, so its full
/// descendant tree (e.g. `cargo run`'s actual `rheo` child) can be killed
/// together — killing only the immediate child risks leaving `rheo watch`
/// running, bound to its port, after the test exits.
#[cfg(unix)]
fn set_own_process_group(cmd: &mut std::process::Command) {
    use std::os::unix::process::CommandExt;
    cmd.process_group(0);
}
#[cfg(not(unix))]
fn set_own_process_group(_cmd: &mut std::process::Command) {}

#[cfg(unix)]
fn kill_group(child: &mut Child) {
    // SAFETY: `child.id()` is this process's own process-group leader (see
    // `set_own_process_group`); negating it targets the whole group.
    unsafe {
        libc::kill(-(child.id() as i32), libc::SIGKILL);
    }
    child.wait().ok();
}
#[cfg(not(unix))]
fn kill_group(child: &mut Child) {
    child.kill().ok();
    child.wait().ok();
}
