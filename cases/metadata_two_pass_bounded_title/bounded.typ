// `set document(title: ...)` inside a bounded top-level code block: correct
// for this page's own compiled <title> (Typst's DocumentInfo collection is
// unscoped), but invisible to rheo's ordinary single-pass metadata beacon --
// see docs/limitations.md and cases/metadata_show_and_code_block/. Gated
// two-pass resolution (`rheo compile --metadata-two-pass`) recovers it for
// cross-vertebra reads (metadata-of, @handle) by feeding Rust's post-compile
// DocumentInfo back in as a second-pass sys.inputs override.
#{
  set document(title: [Two Pass Title])
}

= Bounded page

Title set via a bounded code block.
