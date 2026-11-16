//! Structural scenarios against the rookery fixture (`cases/watch_narrow_rookery`):
//! page creation/deletion, edits to the shared `content/lib.typ`, batched
//! multi-file edits, and a full revert-to-start round trip. These change the
//! project's STRUCTURE rather than one note's content, which is where state
//! left over from an earlier rebuild can leak into a later one. All four are
//! ignored: each needs a `../rookery` checkout and currently fails (see each
//! test's `#[ignore]` reason).

use rheo_tests::helpers::narrow::html_tree_diffs;
use rheo_tests::helpers::scenario::{Expect, Scenario, Step, rookery_setup};
use std::fs;
use std::path::Path;
use std::sync::{Arc, Mutex};
use walkdir::WalkDir;

const N13_V1: &str = "#import \"../lib.typ\": demo\n\
#import \"@rookery/core:0.1.1\": idea, hyperlink\n\
#show ref: hyperlink\n\
#show: demo\n\
\n\
= Note n13\n\
\n\
#idea(\"n13a\", title: [N13 A], tags: (\"alpha\",))[\n\
  Links to @idea:n01a.\n\
]\n";

const N13_V2: &str = "#import \"../lib.typ\": demo\n\
#import \"@rookery/core:0.1.1\": idea, hyperlink\n\
#show ref: hyperlink\n\
#show: demo\n\
\n\
= Note n13\n\
\n\
#idea(\"n13a\", title: [N13 A], tags: (\"alpha\",))[\n\
  Links again to @idea:n01a.\n\
]\n";

#[test]
#[ignore = "rheo/rookery: new page n13 narrows to n13 alone, so everything.html's outline is truncated to one row; deleting n13 (full rebuild) leaves ideas/n13a.html on disk; also flaky ideas/n01a.html stale backlink window (fails 3/3)"]
fn add_and_remove_pages() {
    let scenario = Scenario {
        name: "add_and_remove_pages",
        steps: vec![
            Step::write(
                "create page n13",
                Expect::Any,
                "content/notes/n13.typ",
                N13_V1,
            ),
            Step::new("edit page n13 body", Expect::AnyNarrowed, |project| {
                fs::write(project.join("content/notes/n13.typ"), N13_V2).unwrap_or_else(|e| {
                    panic!("write content/notes/n13.typ: {e}");
                });
            }),
            Step::remove("delete page n13", Expect::Full, "content/notes/n13.typ"),
            Step::write(
                "recreate page n13",
                Expect::Any,
                "content/notes/n13.typ",
                N13_V2,
            ),
        ],
    };

    let report = scenario.run("cases/watch_narrow_rookery", rookery_setup);
    report.assert_clean();
}

#[test]
#[ignore = "rheo/rookery: after a narrowed note-body edit, notes/n05.html's <figure id=\"loc-1\"> loses its id, ideas/n06a.html's backlink window keeps its pre-edit text, and the alpha-tag rename leaves everything.html's outline stale (fails 3/3)"]
fn library_edit_between_narrowed_edits() {
    let scenario = Scenario {
        name: "library_edit_between_narrowed_edits",
        steps: vec![
            Step::replace(
                "edit a note body",
                Expect::AnyNarrowed,
                "content/notes/n05.typ",
                "A standalone note.",
                "A changed standalone note.",
            ),
            Step::replace(
                "change the idea-page banner",
                Expect::Full,
                "content/lib.typ",
                "Minted page for #what.",
                "Rebranded page for #what.",
            ),
            Step::replace(
                "edit a different note body",
                Expect::AnyNarrowed,
                "content/notes/n09.typ",
                "Picks up the thread from @idea:n06a.",
                "Picks up the thread differently from @idea:n06a.",
            ),
            Step::new(
                "rename the alpha tag everywhere it is used",
                Expect::Any,
                |project| {
                    for rel in [
                        "content/notes/n01.typ",
                        "content/notes/n04.typ",
                        "content/notes/n07.typ",
                        "content/notes/n10.typ",
                        "content/notes/n12.typ",
                    ] {
                        let path = project.join(rel);
                        let src = fs::read_to_string(&path)
                            .unwrap_or_else(|e| panic!("read {}: {e}", path.display()));
                        let next = src.replace("\"alpha\"", "\"alpha-renamed\"");
                        fs::write(&path, next)
                            .unwrap_or_else(|e| panic!("write {}: {e}", path.display()));
                    }
                },
            ),
            Step::replace(
                "revert the idea-page banner",
                Expect::Full,
                "content/lib.typ",
                "Rebranded page for #what.",
                "Minted page for #what.",
            ),
        ],
    };

    let report = scenario.run("cases/watch_narrow_rookery", rookery_setup);
    report.assert_clean();
}

#[test]
#[ignore = "rheo/rookery: after a batched narrowed edit of four note pages, ideas/n01a.html's backlink window keeps its pre-edit text (fails 3/3)"]
fn batched_multi_file_edit() {
    let scenario = Scenario {
        name: "batched_multi_file_edit",
        steps: vec![
            Step::new(
                "edit four note pages in one batch",
                Expect::Any,
                |project| {
                    let edits: &[(&str, &str, &str)] = &[
                        (
                            "content/notes/n02.typ",
                            "Builds on @idea:n01a.",
                            "Builds further on @idea:n01a.",
                        ),
                        (
                            "content/notes/n03.typ",
                            "Says hello to the fixture.",
                            "Says hello loudly to the fixture.",
                        ),
                        (
                            "content/notes/n05.typ",
                            "A standalone note.",
                            "A truly standalone note.",
                        ),
                        (
                            "content/notes/n08.typ",
                            "A note of its own.",
                            "A note entirely of its own.",
                        ),
                    ];
                    for (rel, from, to) in edits {
                        let path = project.join(rel);
                        let src = fs::read_to_string(&path)
                            .unwrap_or_else(|e| panic!("read {}: {e}", path.display()));
                        let next = if src.contains(from) {
                            src.replacen(from, to, 1)
                        } else {
                            assert!(
                                src.contains(to),
                                "neither {from:?} nor {to:?} found in {}",
                                path.display()
                            );
                            src
                        };
                        fs::write(&path, next)
                            .unwrap_or_else(|e| panic!("write {}: {e}", path.display()));
                    }
                },
            ),
            Step::new(
                "edit a page and lib.typ together",
                Expect::Full,
                |project| {
                    let page = project.join("content/notes/n04.typ");
                    let src = fs::read_to_string(&page)
                        .unwrap_or_else(|e| panic!("read {}: {e}", page.display()));
                    let next = if src.contains("Extends @idea:n02a.") {
                        src.replacen("Extends @idea:n02a.", "Extends further @idea:n02a.", 1)
                    } else {
                        src
                    };
                    fs::write(&page, next)
                        .unwrap_or_else(|e| panic!("write {}: {e}", page.display()));

                    let lib = project.join("content/lib.typ");
                    let lib_src = fs::read_to_string(&lib)
                        .unwrap_or_else(|e| panic!("read {}: {e}", lib.display()));
                    let lib_next = if lib_src.contains("Minted page for #what.") {
                        lib_src.replacen(
                            "Minted page for #what.",
                            "Minted page (batched) for #what.",
                            1,
                        )
                    } else {
                        lib_src
                    };
                    fs::write(&lib, lib_next)
                        .unwrap_or_else(|e| panic!("write {}: {e}", lib.display()));
                },
            ),
        ],
    };

    let report = scenario.run("cases/watch_narrow_rookery", rookery_setup);
    report.assert_clean();
}

/// Recursively copies every file under `src` to `dest` (both must exist;
/// `dest`'s own tree is assumed empty), preserving relative paths — a
/// snapshot of `build/html` taken before any step, so a later step can
/// compare the settled post-revert tree against it with [`html_tree_diffs`].
fn copy_tree(src: &Path, dest: &Path) {
    for entry in WalkDir::new(src).into_iter().filter_map(Result::ok) {
        let rel = entry
            .path()
            .strip_prefix(src)
            .expect("walked entry under src");
        let out = dest.join(rel);
        if entry.file_type().is_dir() {
            fs::create_dir_all(&out).unwrap_or_else(|e| panic!("mkdir {}: {e}", out.display()));
        } else {
            if let Some(parent) = out.parent() {
                fs::create_dir_all(parent)
                    .unwrap_or_else(|e| panic!("mkdir {}: {e}", parent.display()));
            }
            fs::copy(entry.path(), &out).unwrap_or_else(|e| {
                panic!("copy {} -> {}: {e}", entry.path().display(), out.display())
            });
        }
    }
}

#[test]
#[ignore = "rheo/rookery: after narrowed note/post edits, ideas/n01a.html and ideas/n06a.html backlink windows keep their pre-edit text and everything.html's outline is stale after the alpha rename (fails 3/3)"]
fn revert_to_start() {
    let snapshot_dir = tempfile::tempdir().expect("snapshot tempdir");
    let snapshot_path = snapshot_dir.path().to_path_buf();
    let revert_diffs: Arc<Mutex<Option<Vec<String>>>> = Arc::new(Mutex::new(None));
    let revert_diffs_for_step = revert_diffs.clone();

    let scenario = Scenario {
        name: "revert_to_start",
        steps: vec![
            // Step 1: no-op from the fixture's point of view — snapshots the
            // settled initial build/html, then makes a harmless same-bytes
            // write so a rebuild actually fires (the runner needs a real
            // filesystem event to observe one).
            Step::new("snapshot before edits", Expect::AnyNarrowed, {
                let snapshot_path = snapshot_path.clone();
                move |project: &Path| {
                    let build_html = project.join("build/html");
                    copy_tree(&build_html, &snapshot_path);

                    let search_typ = project.join("content/search.typ");
                    let src = fs::read_to_string(&search_typ)
                        .unwrap_or_else(|e| panic!("read {}: {e}", search_typ.display()));
                    fs::write(&search_typ, src)
                        .unwrap_or_else(|e| panic!("write {}: {e}", search_typ.display()));
                }
            }),
            Step::replace(
                "edit 1: note body",
                Expect::AnyNarrowed,
                "content/notes/n02.typ",
                "Builds on @idea:n01a.",
                "Builds on @idea:n01a, revised.",
            ),
            Step::append(
                "edit 2: append to a post",
                Expect::AnyNarrowed,
                "content/posts/p1.typ",
                "\nA sentence that will be reverted.\n",
            ),
            Step::new(
                "edit 3: rename alpha on two pages",
                Expect::Any,
                |project| {
                    for rel in ["content/notes/n04.typ", "content/notes/n07.typ"] {
                        let path = project.join(rel);
                        let src = fs::read_to_string(&path)
                            .unwrap_or_else(|e| panic!("read {}: {e}", path.display()));
                        let next = src.replace("\"alpha\"", "\"alpha-tmp\"");
                        fs::write(&path, next)
                            .unwrap_or_else(|e| panic!("write {}: {e}", path.display()));
                    }
                },
            ),
            Step::replace(
                "edit 4: idea-page banner",
                Expect::Full,
                "content/lib.typ",
                "Minted page for #what.",
                "Temporarily minted page for #what.",
            ),
            Step::replace(
                "edit 5: another note body",
                Expect::AnyNarrowed,
                "content/notes/n09.typ",
                "Picks up the thread from @idea:n06a.",
                "Picks up a different thread from @idea:n06a.",
            ),
            // Revert every edited file to its original bytes in one step.
            Step::new("revert all edits", Expect::Any, |project| {
                let reverts: &[(&str, &str, &str)] = &[
                    (
                        "content/notes/n02.typ",
                        "Builds on @idea:n01a, revised.",
                        "Builds on @idea:n01a.",
                    ),
                    (
                        "content/notes/n09.typ",
                        "Picks up a different thread from @idea:n06a.",
                        "Picks up the thread from @idea:n06a.",
                    ),
                    (
                        "content/lib.typ",
                        "Temporarily minted page for #what.",
                        "Minted page for #what.",
                    ),
                ];
                for (rel, from, to) in reverts {
                    let path = project.join(rel);
                    let src = fs::read_to_string(&path)
                        .unwrap_or_else(|e| panic!("read {}: {e}", path.display()));
                    let next = src.replace(from, to);
                    fs::write(&path, next)
                        .unwrap_or_else(|e| panic!("write {}: {e}", path.display()));
                }
                for rel in ["content/notes/n04.typ", "content/notes/n07.typ"] {
                    let path = project.join(rel);
                    let src = fs::read_to_string(&path)
                        .unwrap_or_else(|e| panic!("read {}: {e}", path.display()));
                    let next = src.replace("\"alpha-tmp\"", "\"alpha\"");
                    fs::write(&path, next)
                        .unwrap_or_else(|e| panic!("write {}: {e}", path.display()));
                }
                let p1 = project.join("content/posts/p1.typ");
                let src = fs::read_to_string(&p1)
                    .unwrap_or_else(|e| panic!("read {}: {e}", p1.display()));
                let next = src.replace("\nA sentence that will be reverted.\n", "");
                fs::write(&p1, next).unwrap_or_else(|e| panic!("write {}: {e}", p1.display()));
            }),
            // Compares the settled post-revert tree against the step-1
            // snapshot (the previous step's rebuild has already quiesced by
            // the time this closure runs), then makes one more harmless
            // same-bytes write so the runner sees a final rebuild line.
            Step::new("compare against the initial snapshot", Expect::Any, {
                let snapshot_path = snapshot_path.clone();
                let revert_diffs = revert_diffs_for_step.clone();
                move |project: &Path| {
                    let build_html = project.join("build/html");
                    let diffs = html_tree_diffs(&build_html, &snapshot_path);
                    *revert_diffs.lock().unwrap() = Some(diffs);

                    let search_typ = project.join("content/search.typ");
                    let src = fs::read_to_string(&search_typ)
                        .unwrap_or_else(|e| panic!("read {}: {e}", search_typ.display()));
                    fs::write(&search_typ, src)
                        .unwrap_or_else(|e| panic!("write {}: {e}", search_typ.display()));
                }
            }),
        ],
    };

    let report = scenario.run("cases/watch_narrow_rookery", rookery_setup);
    report.assert_clean();

    let diffs = revert_diffs
        .lock()
        .unwrap()
        .take()
        .expect("comparison step must have run");
    assert!(
        diffs.is_empty(),
        "build/html after revert does not match the initial snapshot:\n{}",
        diffs.join("\n\n")
    );
}
