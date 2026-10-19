//! A seeded random walk of mixed edits over the `cases/watch_narrow_rookery`
//! fixture, run through the scenario runner (`src/helpers/scenario.rs`) with
//! the full-compile oracle checked after every step. Unlike the hand-written
//! `watch_narrow_rookery_smoke` scenario, this one catches staleness that
//! only shows up after an unusual edit history. Ignored by default — it
//! needs a `../rookery` checkout.
//!
//! Two runs with the same `RHEO_SOAK_SEED`/`RHEO_SOAK_STEPS` must choose the
//! exact same sequence of edits: the walk is driven by a tiny xorshift64
//! PRNG, and every edit's target is resolved against a model of the fixture
//! that this file maintains in lockstep with the edits it hands out — never
//! against a live directory listing — so the sequence never depends on
//! timing or on what the previous step's rebuild actually did.

use rheo_tests::helpers::scenario::{Expect, Scenario, Step, rookery_setup};
use std::collections::{HashMap, HashSet};

/// A ten-line xorshift64 PRNG — no RNG crate pulled in for one soak test.
struct Xorshift64(u64);

impl Xorshift64 {
    fn new(seed: u64) -> Self {
        Xorshift64(if seed == 0 {
            0x9e37_79b9_7f4a_7c15
        } else {
            seed
        })
    }

    fn next_u64(&mut self) -> u64 {
        let mut x = self.0;
        x ^= x << 13;
        x ^= x >> 7;
        x ^= x << 17;
        self.0 = x;
        x
    }

    fn below(&mut self, n: usize) -> usize {
        (self.next_u64() % n as u64) as usize
    }
}

fn env_u64(key: &str, default: u64) -> u64 {
    std::env::var(key)
        .ok()
        .and_then(|v| v.parse().ok())
        .unwrap_or(default)
}

fn leak(s: String) -> &'static str {
    Box::leak(s.into_boxed_str())
}

/// The edit vocabulary. Every variant's `name` in a failure report also names
/// its target, so a failing step can be replayed by seed alone.
#[derive(Clone, Copy, Debug)]
enum SoakEdit {
    BodyWord,
    Retitle,
    ToggleTag,
    AddLink,
    RemoveLink,
    PostTitle,
    NewPage,
    DeletePage,
    LibTouch,
}

/// Weighted towards content edits (~70%) over structural ones (~30%).
fn pick_edit(rng: &mut Xorshift64) -> SoakEdit {
    use SoakEdit::*;
    if rng.below(10) < 7 {
        match rng.below(6) {
            0 => BodyWord,
            1 => Retitle,
            2 => ToggleTag,
            3 => AddLink,
            4 => RemoveLink,
            _ => PostTitle,
        }
    } else {
        match rng.below(3) {
            0 => NewPage,
            1 => DeletePage,
            _ => LibTouch,
        }
    }
}

/// One note page's simulated state: which idea ids it owns, and which other
/// ideas it currently references via a literal `@idea:` ref.
struct Note {
    path: String,
    ideas: Vec<String>,
    refs: HashSet<String>,
}

/// Mirrors the fixture's mutable state exactly, so a target chosen here is
/// guaranteed to exist on disk when the matching `Step` runs — the walk
/// never touches anything but its own edits.
struct Model {
    notes: Vec<Note>,
    tags: HashMap<String, Vec<String>>,
    /// The fixture's original 14 idea ids. `AddLink` only ever points at one
    /// of these — never at a soak-created page — so `DeletePage` can never
    /// leave a dangling `@idea:` ref behind in a surviving file.
    base_ideas: Vec<String>,
    post_titles: [String; 3],
    next_new: u32,
}

/// `n01a` -> `"N01 A"`, `s3a` -> `"S3 A"` — the `title: [..]` text rheo's
/// fixture uses for an idea id, derived instead of tabulated so a
/// soak-created page's id and title agree automatically.
fn idea_label(id: &str) -> String {
    let prefix = &id[..1];
    let rest = &id[1..];
    let digits_end = rest
        .find(|c: char| !c.is_ascii_digit())
        .unwrap_or(rest.len());
    let (digits, suffix) = rest.split_at(digits_end);
    format!(
        "{}{digits} {}",
        prefix.to_uppercase(),
        suffix.to_uppercase()
    )
}

fn tags_literal(tags: &[String]) -> String {
    let inner = tags
        .iter()
        .map(|t| format!("\"{t}\""))
        .collect::<Vec<_>>()
        .join(", ");
    format!("({inner},)")
}

fn short_name(path: &str) -> &str {
    path.rsplit('/').next().unwrap().trim_end_matches(".typ")
}

impl Model {
    fn new() -> Self {
        let base: &[(&str, &[(&str, &str)])] = &[
            ("n01", &[("n01a", "alpha")]),
            ("n02", &[("n02a", "beta")]),
            ("n03", &[("n03a", "gamma")]),
            ("n04", &[("n04a", "alpha")]),
            ("n05", &[("n05a", "beta")]),
            ("n06", &[("n06a", "gamma")]),
            ("n07", &[("n07a", "alpha")]),
            ("n08", &[("n08a", "beta")]),
            ("n09", &[("n09a", "gamma")]),
            ("n10", &[("n10a", "alpha")]),
            ("n11", &[("n11a", "beta"), ("n11b", "gamma")]),
            ("n12", &[("n12a", "alpha"), ("n12b", "beta")]),
        ];
        // The fixture's own cross-references (see cases/watch_narrow_rookery).
        let initial_refs: &[(&str, &str)] = &[
            ("n02", "n01a"),
            ("n04", "n02a"),
            ("n07", "n03a"),
            ("n09", "n06a"),
            ("n10", "n08a"),
            ("n12", "n10a"),
        ];

        let mut notes = Vec::new();
        let mut tags = HashMap::new();
        let mut base_ideas = Vec::new();
        for (name, ideas) in base {
            let path = format!("content/notes/{name}.typ");
            let mut ids = Vec::new();
            for (id, tag) in *ideas {
                ids.push(id.to_string());
                tags.insert(id.to_string(), vec![tag.to_string()]);
                base_ideas.push(id.to_string());
            }
            let refs = initial_refs
                .iter()
                .filter(|(n, _)| *n == *name)
                .map(|(_, r)| r.to_string())
                .collect();
            notes.push(Note {
                path,
                ideas: ids,
                refs,
            });
        }

        Model {
            notes,
            tags,
            base_ideas,
            post_titles: [
                "Post 1".to_string(),
                "Post 2".to_string(),
                "Post 3".to_string(),
            ],
            next_new: 0,
        }
    }

    /// A fixed word pair guaranteed present in `path`'s *current* body text —
    /// the original fixture sentence for a base note, or the soak's own
    /// template sentence for a created one. Reapplying the same pair to the
    /// same note a second time is harmless: `Step::replace` rewrites the
    /// already-swapped text unchanged rather than toggling back.
    fn body_word_pair(path: &str) -> (&'static str, &'static str) {
        match short_name(path) {
            "n01" => ("first note", "initial note"),
            "n02" => ("Builds on", "Extends from"),
            "n03" => ("Says hello", "Says howdy"),
            "n04" => ("Extends @idea", "Builds on @idea"),
            "n05" => ("standalone note", "solitary note"),
            "n06" => ("note of its own", "note on its own"),
            "n07" => ("Follows up", "Catches up"),
            "n08" => ("note of its own", "note on its own"),
            "n09" => ("Picks up", "Takes up"),
            "n10" => ("Replies to", "Responds to"),
            "n11" => ("First of a pair", "Primary of a pair"),
            "n12" => ("First of a pair", "Primary of a pair"),
            _ => ("fresh note", "newly added note"),
        }
    }

    fn apply(&mut self, edit: SoakEdit, rng: &mut Xorshift64) -> Step {
        match edit {
            SoakEdit::BodyWord => self.body_word(rng),
            SoakEdit::Retitle => self.retitle(rng),
            SoakEdit::ToggleTag => self.toggle_tag(rng),
            SoakEdit::AddLink => self.add_link(rng),
            SoakEdit::RemoveLink => self
                .remove_link(rng)
                .unwrap_or_else(|| self.post_title(rng)),
            SoakEdit::PostTitle => self.post_title(rng),
            SoakEdit::NewPage => self.new_page(),
            SoakEdit::DeletePage => self.delete_page(rng).unwrap_or_else(|| self.lib_touch()),
            SoakEdit::LibTouch => self.lib_touch(),
        }
    }

    fn body_word(&mut self, rng: &mut Xorshift64) -> Step {
        let idx = rng.below(self.notes.len());
        let path = self.notes[idx].path.clone();
        let (from, to) = Self::body_word_pair(&path);
        let name = leak(format!("BodyWord {}", short_name(&path)));
        Step::replace(name, Expect::Any, leak(path), from, to)
    }

    fn retitle(&mut self, rng: &mut Xorshift64) -> Step {
        let idx = rng.below(self.notes.len());
        let note = &self.notes[idx];
        let id = note.ideas[rng.below(note.ideas.len())].clone();
        let path = note.path.clone();
        let label = idea_label(&id);
        let from = format!("title: [{label}]");
        let to = format!("title: [{label} Soak]");
        let name = leak(format!("Retitle {id}"));
        Step::replace(name, Expect::Any, leak(path), leak(from), leak(to))
    }

    fn toggle_tag(&mut self, rng: &mut Xorshift64) -> Step {
        let idx = rng.below(self.notes.len());
        let note_path = self.notes[idx].path.clone();
        let id = self.notes[idx].ideas[rng.below(self.notes[idx].ideas.len())].clone();
        let current = self.tags.get(&id).cloned().unwrap_or_default();
        let next = if current.len() == 1 {
            let extra = ["alpha", "beta", "gamma"]
                .into_iter()
                .find(|t| *t != current[0])
                .unwrap()
                .to_string();
            vec![current[0].clone(), extra]
        } else {
            vec![current[0].clone()]
        };
        let from = format!("tags: {}", tags_literal(&current));
        let to = format!("tags: {}", tags_literal(&next));
        self.tags.insert(id.clone(), next);
        let name = leak(format!("ToggleTag {id}"));
        Step::replace(name, Expect::Any, leak(note_path), leak(from), leak(to))
    }

    fn add_link(&mut self, rng: &mut Xorshift64) -> Step {
        let idx = rng.below(self.notes.len());
        let candidates: Vec<String> = self
            .base_ideas
            .iter()
            .filter(|id| !self.notes[idx].ideas.contains(id) && !self.notes[idx].refs.contains(*id))
            .cloned()
            .collect();
        if candidates.is_empty() {
            return self.post_title(rng);
        }
        let target = candidates[rng.below(candidates.len())].clone();
        let note = &mut self.notes[idx];
        note.refs.insert(target.clone());
        let path = note.path.clone();
        let name = leak(format!("AddLink {}->{target}", short_name(&path)));
        let text = leak(format!("\n\nSee also @idea:{target}.\n"));
        Step::append(name, Expect::Any, leak(path), text)
    }

    fn remove_link(&mut self, rng: &mut Xorshift64) -> Option<Step> {
        let candidates: Vec<usize> = self
            .notes
            .iter()
            .enumerate()
            .filter(|(_, n)| !n.refs.is_empty())
            .map(|(i, _)| i)
            .collect();
        if candidates.is_empty() {
            return None;
        }
        let idx = candidates[rng.below(candidates.len())];
        let refs: Vec<String> = self.notes[idx].refs.iter().cloned().collect();
        let target = refs[rng.below(refs.len())].clone();
        self.notes[idx].refs.remove(&target);
        let path = self.notes[idx].path.clone();
        let name = leak(format!("RemoveLink {}-/>{target}", short_name(&path)));
        let from = leak(format!("@idea:{target}"));
        Some(Step::replace(
            name,
            Expect::Any,
            leak(path),
            from,
            leak(target.clone()),
        ))
    }

    fn post_title(&mut self, rng: &mut Xorshift64) -> Step {
        let i = rng.below(3);
        let n = i + 1;
        let path = format!("content/posts/p{n}.typ");
        let base = format!("Post {n}");
        let current = self.post_titles[i].clone();
        let next = if current.ends_with(" Soak") {
            base.clone()
        } else {
            format!("{base} Soak")
        };
        let from = format!("title: \"{current}\"");
        let to = format!("title: \"{next}\"");
        self.post_titles[i] = next;
        let name = leak(format!("PostTitle p{n}"));
        Step::replace(name, Expect::Any, leak(path), leak(from), leak(to))
    }

    fn new_page(&mut self) -> Step {
        let k = self.next_new;
        self.next_new += 1;
        let id = format!("s{k}a");
        let path = format!("content/notes/s{k}.typ");
        let label = idea_label(&id);
        let content = format!(
            "#import \"../lib.typ\": demo\n\
             #import \"@rookery/core:0.1.1\": idea, hyperlink, window\n\
             #show ref: hyperlink\n\
             #show: demo\n\n\
             = Note s{k}\n\n\
             #idea(\"{id}\", title: [{label}], tags: (\"alpha\",))[\n\
             \u{20}\u{20}A fresh note from the soak.\n\
             ]\n"
        );
        self.notes.push(Note {
            path: path.clone(),
            ideas: vec![id.clone()],
            refs: HashSet::new(),
        });
        self.tags.insert(id, vec!["alpha".to_string()]);
        let name = leak(format!("NewPage s{k}"));
        Step::write(name, Expect::Any, leak(path), leak(content))
    }

    fn delete_page(&mut self, rng: &mut Xorshift64) -> Option<Step> {
        let candidates: Vec<usize> = self
            .notes
            .iter()
            .enumerate()
            .filter(|(_, n)| short_name(&n.path).starts_with('s'))
            .map(|(i, _)| i)
            .collect();
        if candidates.is_empty() {
            return None;
        }
        let idx = candidates[rng.below(candidates.len())];
        let note = self.notes.remove(idx);
        for id in &note.ideas {
            self.tags.remove(id);
        }
        let name = leak(format!("DeletePage {}", short_name(&note.path)));
        Some(Step::remove(name, Expect::Any, leak(note.path)))
    }

    fn lib_touch(&mut self) -> Step {
        Step::replace(
            "LibTouch",
            Expect::Any,
            "content/lib.typ",
            "Minted page for #what.",
            "Minted page for #what. (soak)",
        )
    }
}

fn build_steps(seed: u64, count: u64) -> Vec<Step> {
    let mut rng = Xorshift64::new(seed);
    let mut model = Model::new();
    (0..count)
        .map(|_| {
            let edit = pick_edit(&mut rng);
            model.apply(edit, &mut rng)
        })
        .collect()
}

#[test]
#[ignore = "soak; needs ../rookery checkout"]
fn rookery_soak() {
    let seed = env_u64("RHEO_SOAK_SEED", 1);
    let count = env_u64("RHEO_SOAK_STEPS", 25);
    eprintln!("rookery_soak: seed={seed} steps={count}");

    let steps = build_steps(seed, count);
    let scenario = Scenario {
        name: "rookery_soak",
        steps,
    };
    let report = scenario.run("cases/watch_narrow_rookery", rookery_setup);
    report.assert_clean();
}
