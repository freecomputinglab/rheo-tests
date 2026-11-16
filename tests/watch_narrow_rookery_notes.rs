//! Scripted sequences of realistic note edits on the `watch_narrow_rookery`
//! fixture, each step checked against a fresh full compile (see
//! `src/helpers/scenario.rs`). All four need a `../rookery` checkout and are
//! ignored: a narrowed rebuild still leaves rookery's aggregation pages
//! (`everything.html`, `outline-alpha.html`, per-idea `ideas/*.html`) truncated
//! or stale, or leaves a ghost page for a renamed/deleted idea. See each test's
//! `#[ignore]` reason for its current symptom.

use rheo_tests::helpers::scenario::{Expect, Scenario, Step, rookery_setup};
use std::fs;

#[test]
#[ignore = "rheo/rookery: narrowed rebuild leaves everything.html/outline-alpha.html outline truncated to the narrowed pages' ideas, ideas/n03a.html's backlink window from n07a keeps its pre-edit text, and ideas/n07a.html survives the idea's deletion (fails 3/3)"]
fn note_lifecycle() {
    // n07a has no inbound @idea:/#window references from any other page, so
    // deleting its idea call (below) doesn't break an unrelated page's link —
    // unlike n03a, which n07 itself refers to.
    let scenario = Scenario {
        name: "note_lifecycle",
        steps: vec![
            Step::replace(
                "edit n07a body",
                Expect::AnyNarrowed,
                "content/notes/n07.typ",
                "Follows up on @idea:n03a.",
                "Checks in on @idea:n03a.",
            ),
            Step::replace(
                "retitle n07a",
                Expect::AnyNarrowed,
                "content/notes/n07.typ",
                "title: [N07 A]",
                "title: [N07 Renamed]",
            ),
            Step::replace(
                "add tag beta to n07a",
                Expect::AnyNarrowed,
                "content/notes/n07.typ",
                "tags: (\"alpha\",)",
                "tags: (\"alpha\", \"beta\")",
            ),
            Step::replace(
                "remove tag beta from n07a",
                Expect::AnyNarrowed,
                "content/notes/n07.typ",
                "tags: (\"alpha\", \"beta\")",
                "tags: (\"alpha\",)",
            ),
            Step::new("delete n07a's idea call", Expect::AnyNarrowed, |project| {
                let path = project.join("content/notes/n07.typ");
                let src = fs::read_to_string(&path).unwrap_or_else(|e| panic!("read: {e}"));
                let block = "#idea(\"n07a\", title: [N07 Renamed], tags: (\"alpha\",))[\n  Checks in on @idea:n03a.\n]\n";
                let next = if src.contains(block) {
                    src.replacen(block, "", 1)
                } else {
                    src
                };
                fs::write(&path, next).unwrap_or_else(|e| panic!("write: {e}"));
            }),
            Step::new("restore n07a's idea call", Expect::AnyNarrowed, |project| {
                let path = project.join("content/notes/n07.typ");
                let src = fs::read_to_string(&path).unwrap_or_else(|e| panic!("read: {e}"));
                let block = "#idea(\"n07a\", title: [N07 Renamed], tags: (\"alpha\",))[\n  Checks in on @idea:n03a.\n]\n";
                let anchor = "= Note n07\n\n";
                let next = if src.contains(block) {
                    src
                } else {
                    let idx = src.find(anchor).unwrap_or_else(|| {
                        panic!("anchor {anchor:?} not found in {}", path.display())
                    }) + anchor.len();
                    let mut next = src;
                    next.insert_str(idx, block);
                    next
                };
                fs::write(&path, next).unwrap_or_else(|e| panic!("write: {e}"));
            }),
        ],
    };

    scenario
        .run("cases/watch_narrow_rookery", rookery_setup)
        .assert_clean();
}

#[test]
#[ignore = "rheo/rookery: after a narrowed backlink/retitle edit, everything.html's outline is truncated to the narrowed pages' ideas (e.g. only N01 A instead of all 14 rows) (fails 3/3)"]
fn backlinks_follow_links() {
    let scenario = Scenario {
        name: "backlinks_follow_links",
        steps: vec![
            // Each from/to pair below is chosen so `from` is never a substring
            // of `to` — `Step::replace`/a custom closure's retry checks for
            // `from`'s absence (or `to`'s presence) to decide it already
            // applied, and a plain text append makes `from` a prefix of `to`,
            // which re-matches on retry and duplicates the edit.
            Step::replace(
                "add a link to n01a from n05",
                Expect::AnyNarrowed,
                "content/notes/n05.typ",
                "A standalone note.",
                "A standalone note, now linking @idea:n01a.",
            ),
            Step::replace(
                "retitle n01a",
                Expect::AnyNarrowed,
                "content/notes/n01.typ",
                "title: [N01 A]",
                "title: [N01 Renamed]",
            ),
            Step::replace(
                "remove the link to n01a from n05",
                Expect::AnyNarrowed,
                "content/notes/n05.typ",
                "A standalone note, now linking @idea:n01a.",
                "A standalone note.",
            ),
            Step::new(
                "add links to n01a from n07 and n12 in one step",
                Expect::AnyNarrowed,
                |project| {
                    let n07_path = project.join("content/notes/n07.typ");
                    let n07_src =
                        fs::read_to_string(&n07_path).unwrap_or_else(|e| panic!("read: {e}"));
                    let n07_final = "Follows up on @idea:n03a, and also @idea:n01a.";
                    let n07_next = if n07_src.contains(n07_final) {
                        n07_src
                    } else {
                        n07_src.replacen("Follows up on @idea:n03a.", n07_final, 1)
                    };
                    fs::write(&n07_path, n07_next).unwrap_or_else(|e| panic!("write: {e}"));

                    let n12_path = project.join("content/notes/n12.typ");
                    let n12_src =
                        fs::read_to_string(&n12_path).unwrap_or_else(|e| panic!("read: {e}"));
                    let n12_final = "First of a pair, now also linking @idea:n01a.";
                    let n12_next = if n12_src.contains(n12_final) {
                        n12_src
                    } else {
                        n12_src.replacen("First of a pair.", n12_final, 1)
                    };
                    fs::write(&n12_path, n12_next).unwrap_or_else(|e| panic!("write: {e}"));
                },
            ),
        ],
    };

    scenario
        .run("cases/watch_narrow_rookery", rookery_setup)
        .assert_clean();
}

#[test]
#[ignore = "rheo/rookery: after moving #idea n11b between pages, narrowed rebuild leaves everything.html's outline empty/truncated instead of the full set with n11b at its new page (fails 3/3)"]
fn note_moves_between_pages() {
    let block = "#idea(\"n11b\", title: [N11 B], tags: (\"gamma\",))[\n  Second of a pair.\n]\n";
    let edited_block = "#idea(\"n11b\", title: [N11 B], tags: (\"gamma\",))[\n  Second of a pair, now elsewhere.\n]\n";

    let scenario = Scenario {
        name: "note_moves_between_pages",
        steps: vec![
            Step::new(
                "cut n11b from n11 and paste it into n05",
                Expect::AnyNarrowed,
                move |project| {
                    let n11_path = project.join("content/notes/n11.typ");
                    let n05_path = project.join("content/notes/n05.typ");
                    let n11_src =
                        fs::read_to_string(&n11_path).unwrap_or_else(|e| panic!("read: {e}"));
                    if n11_src.contains(block) {
                        let n11_next = n11_src.replacen(&format!("\n{block}"), "\n", 1);
                        fs::write(&n11_path, n11_next).unwrap_or_else(|e| panic!("write: {e}"));
                        let mut n05_src =
                            fs::read_to_string(&n05_path).unwrap_or_else(|e| panic!("read: {e}"));
                        n05_src.push('\n');
                        n05_src.push_str(block);
                        fs::write(&n05_path, n05_src).unwrap_or_else(|e| panic!("write: {e}"));
                    } else {
                        fs::write(&n11_path, &n11_src).unwrap_or_else(|e| panic!("write: {e}"));
                        let n05_src =
                            fs::read_to_string(&n05_path).unwrap_or_else(|e| panic!("read: {e}"));
                        fs::write(&n05_path, &n05_src).unwrap_or_else(|e| panic!("write: {e}"));
                    }
                },
            ),
            Step::replace(
                "edit n11b's body in its new page",
                Expect::AnyNarrowed,
                "content/notes/n05.typ",
                "Second of a pair.",
                "Second of a pair, now elsewhere.",
            ),
            Step::new(
                "move n11b back from n05 to n11",
                Expect::AnyNarrowed,
                move |project| {
                    let n11_path = project.join("content/notes/n11.typ");
                    let n05_path = project.join("content/notes/n05.typ");
                    let n05_src =
                        fs::read_to_string(&n05_path).unwrap_or_else(|e| panic!("read: {e}"));
                    if n05_src.contains(edited_block) {
                        let n05_next = n05_src.replacen(&format!("\n{edited_block}"), "", 1);
                        fs::write(&n05_path, n05_next).unwrap_or_else(|e| panic!("write: {e}"));
                        let mut n11_src =
                            fs::read_to_string(&n11_path).unwrap_or_else(|e| panic!("read: {e}"));
                        n11_src.push('\n');
                        n11_src.push_str(edited_block);
                        fs::write(&n11_path, n11_src).unwrap_or_else(|e| panic!("write: {e}"));
                    } else {
                        fs::write(&n05_path, &n05_src).unwrap_or_else(|e| panic!("write: {e}"));
                        let n11_src =
                            fs::read_to_string(&n11_path).unwrap_or_else(|e| panic!("read: {e}"));
                        fs::write(&n11_path, &n11_src).unwrap_or_else(|e| panic!("write: {e}"));
                    }
                },
            ),
        ],
    };

    scenario
        .run("cases/watch_narrow_rookery", rookery_setup)
        .assert_clean();
}

#[test]
#[ignore = "rheo: after renaming n09a to n09z, narrowed rebuild leaves ghost ideas/n09a.html on disk (extra in actual), also on the following body edit (fails 3/3)"]
fn rename_note_id() {
    let scenario = Scenario {
        name: "rename_note_id",
        steps: vec![
            Step::new(
                "rename n09a to n09z everywhere",
                Expect::AnyNarrowed,
                |project| {
                    let n09_path = project.join("content/notes/n09.typ");
                    let n09_src =
                        fs::read_to_string(&n09_path).unwrap_or_else(|e| panic!("read: {e}"));
                    let n09_next = if n09_src.contains("#idea(\"n09a\"") {
                        n09_src.replacen("#idea(\"n09a\"", "#idea(\"n09z\"", 1)
                    } else {
                        n09_src
                    };
                    fs::write(&n09_path, n09_next).unwrap_or_else(|e| panic!("write: {e}"));

                    let n11_path = project.join("content/notes/n11.typ");
                    let n11_src =
                        fs::read_to_string(&n11_path).unwrap_or_else(|e| panic!("read: {e}"));
                    let n11_next = if n11_src.contains("#window(\"n09a\")") {
                        n11_src.replacen("#window(\"n09a\")", "#window(\"n09z\")", 1)
                    } else {
                        n11_src
                    };
                    fs::write(&n11_path, n11_next).unwrap_or_else(|e| panic!("write: {e}"));
                },
            ),
            Step::replace(
                "edit the renamed note's body",
                Expect::AnyNarrowed,
                "content/notes/n09.typ",
                "Picks up the thread from @idea:n06a.",
                "Picks up the thread from @idea:n06a now renamed.",
            ),
        ],
    };

    scenario
        .run("cases/watch_narrow_rookery", rookery_setup)
        .assert_clean();
}
