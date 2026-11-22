//! A scripted `rheo watch` session over the operator's real waterline
//! rookery site (~860 pages, `[watch] narrow = true`) — the site where stale
//! derived pages were actually reported. Machine-local: copies `WATERLINE_DIR`
//! into a tempdir (never building in place) and compares the on-disk build
//! after every step against a fresh full compile. Needs a release `rheo`
//! binary, since a full compile of this site takes tens of seconds.

use rheo_tests::helpers::scenario::{Expect, Scenario, Step};
use std::path::Path;

/// Asserts `project` lives under the system temp dir — the scenario's own
/// tempdir copy, never the real `WATERLINE_DIR` checkout. A step that somehow
/// received the real site's path would silently start editing the
/// operator's working tree, which this test must never do.
fn assert_in_tempdir(project: &Path) {
    let tmp = std::env::temp_dir();
    let tmp_canon = tmp.canonicalize().unwrap_or_else(|_| tmp.clone());
    let project_canon = project
        .canonicalize()
        .unwrap_or_else(|_| project.to_path_buf());
    assert!(
        project_canon.starts_with(&tmp_canon),
        "refusing to edit {}: not under the system temp dir {}",
        project.display(),
        tmp.display()
    );
}

/// Wraps a step's edit closure with [`assert_in_tempdir`], run before the
/// edit itself on every (possibly retried) invocation.
fn guarded(name: &'static str, expect: Expect, edit: impl Fn(&Path) + 'static) -> Step {
    Step::new(name, expect, move |project| {
        assert_in_tempdir(project);
        edit(project);
    })
}

#[test]
#[ignore = "machine-local; needs WATERLINE_DIR"]
fn waterline_session() {
    let waterline_dir = std::env::var("WATERLINE_DIR").unwrap_or_else(|_| {
        panic!(
            "waterline_session: set WATERLINE_DIR to a waterline rookery checkout \
             (e.g. /home/lox/code/waterline/rookery)"
        )
    });
    assert!(
        Path::new(&waterline_dir).join("rheo.toml").is_file(),
        "waterline_session: {waterline_dir:?} has no rheo.toml — set WATERLINE_DIR to a \
         waterline rookery checkout"
    );

    const IDEA_REF_ADD: &str =
        "\n@idea:harvard[Harvard] is where I did my undergraduate, for what it's worth.\n";

    let scenario = Scenario {
        name: "waterline_session",
        steps: vec![
            guarded(
                "edit prose in newest weeknote",
                Expect::AnyNarrowed,
                |project| {
                    let path = project.join("writing/weeknotes/26w40.typ");
                    let src = std::fs::read_to_string(&path)
                        .unwrap_or_else(|e| panic!("read {}: {e}", path.display()));
                    let next = if src.contains("it was really quite good!") {
                        src.replacen(
                            "it was really quite good!",
                            "it was really quite excellent!",
                            1,
                        )
                    } else {
                        assert!(
                            src.contains("it was really quite excellent!"),
                            "neither the original nor the edited sentence is in {}",
                            path.display()
                        );
                        src
                    };
                    std::fs::write(&path, next)
                        .unwrap_or_else(|e| panic!("write {}: {e}", path.display()));
                },
            ),
            guarded("retitle a nest idea note", Expect::AnyNarrowed, |project| {
                let path = project.join("nest/tidbits.typ");
                let src = std::fs::read_to_string(&path)
                    .unwrap_or_else(|e| panic!("read {}: {e}", path.display()));
                let next = if src.contains("title: [Zoom room]") {
                    src.replacen("title: [Zoom room]", "title: [Zoom Room]", 1)
                } else {
                    assert!(
                        src.contains("title: [Zoom Room]"),
                        "neither the original nor the retitled heading is in {}",
                        path.display()
                    );
                    src
                };
                std::fs::write(&path, next)
                    .unwrap_or_else(|e| panic!("write {}: {e}", path.display()));
            }),
            guarded(
                "add an idea reference from a blog post",
                Expect::AnyNarrowed,
                |project| {
                    let path = project.join("writing/blog/a-comparison-of-elm-and-react.typ");
                    let mut src = std::fs::read_to_string(&path)
                        .unwrap_or_else(|e| panic!("read {}: {e}", path.display()));
                    if !src.ends_with(IDEA_REF_ADD) {
                        src.push_str(IDEA_REF_ADD);
                    }
                    std::fs::write(&path, src)
                        .unwrap_or_else(|e| panic!("write {}: {e}", path.display()));
                },
            ),
            guarded(
                "remove that idea reference",
                Expect::AnyNarrowed,
                |project| {
                    let path = project.join("writing/blog/a-comparison-of-elm-and-react.typ");
                    let src = std::fs::read_to_string(&path)
                        .unwrap_or_else(|e| panic!("read {}: {e}", path.display()));
                    let next = src.replacen(IDEA_REF_ADD, "", 1);
                    std::fs::write(&path, next)
                        .unwrap_or_else(|e| panic!("write {}: {e}", path.display()));
                },
            ),
            guarded(
                "edit a comment in the shared prelude",
                Expect::Full,
                |project| {
                    let path = project.join("_lib/prelude.typ");
                    let src = std::fs::read_to_string(&path)
                        .unwrap_or_else(|e| panic!("read {}: {e}", path.display()));
                    let next = if src.contains("THE SORT IS A CONSTRUCTOR, not a directory.") {
                        src.replacen(
                            "THE SORT IS A CONSTRUCTOR, not a directory.",
                            "THE SORT IS A CONSTRUCTOR, not a folder.",
                            1,
                        )
                    } else {
                        assert!(
                            src.contains("THE SORT IS A CONSTRUCTOR, not a folder."),
                            "neither comment wording is in {}",
                            path.display()
                        );
                        src
                    };
                    std::fs::write(&path, next)
                        .unwrap_or_else(|e| panic!("write {}: {e}", path.display()));
                },
            ),
        ],
    };

    let report = scenario.run(&waterline_dir, |_project| {});
    report.assert_clean();
}
