//! A smoke test for the scenario runner (`src/helpers/scenario.rs`) and the
//! `cases/watch_narrow_rookery` fixture: one body edit to a note page and one
//! append to a plain page, each checked against a fresh full compile.
//! Ignored by default — it needs a `../rookery` checkout.

use rheo_tests::helpers::scenario::{Expect, Scenario, Step, rookery_setup};

#[test]
#[ignore = "needs ../rookery checkout"]
fn rookery_smoke() {
    let scenario = Scenario {
        name: "rookery_smoke",
        steps: vec![
            Step::replace(
                "edit a note body",
                Expect::AnyNarrowed,
                "content/notes/n03.typ",
                "Says hello to the fixture.",
                "Says howdy to the fixture.",
            ),
            Step::append(
                "append to a plain page",
                Expect::AnyNarrowed,
                "content/posts/p1.typ",
                "\nAn extra sentence.\n",
            ),
        ],
    };

    let report = scenario.run("cases/watch_narrow_rookery", rookery_setup);
    report.assert_clean();
}
