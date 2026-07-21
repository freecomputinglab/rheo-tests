// Uses rheo-context(), so its absence in any format would be a compile error.

= #rheo-context().handle

This is #rheo-context().handle of #rheo-context().spine-flat.len() pages.

The output extension for this format is ext=#rheo-context().at("ext", default: "absent").

// Explicit field assertions across every format. target/ext are format-gated:
// present for html/epub, absent for PDF. Detected from the data fields
// themselves (no target() — that needs #context in the PDF build). Invisible.
#{
  let ctx = rheo-context()

  // Fields present in every format.
  assert(type(ctx.handle) == str, message: "handle must be str")
  assert(type(ctx.spine) == array, message: "spine must be array")
  assert(type(ctx.spine-flat) == array, message: "spine-flat must be array")

  // target/ext: both present (html/epub) or both absent (PDF), never one.
  assert(("target" in ctx) == ("ext" in ctx), message: "target and ext must appear together")
  if "target" in ctx {
    // html/epub: target is the format name, ext the extension, kept in lockstep.
    assert(type(ctx.target) == str, message: "target must be str")
    assert(ctx.target == "html" or ctx.target == "epub", message: "target must be 'html'|'epub', got " + ctx.target)
    assert(type(ctx.ext) == str, message: "ext must be str")
    assert((ctx.ext == "html") == (ctx.target == "html"), message: "html target must give html ext, got ext=" + ctx.ext + " target=" + ctx.target)
    assert((ctx.ext == "xhtml") == (ctx.target == "epub"), message: "epub target must give xhtml ext, got ext=" + ctx.ext + " target=" + ctx.target)
  } else {
    // PDF: no target/ext (documents fall back to Typst native target()=="paged").
    assert("ext" not in ctx, message: "PDF: ext must be absent, got " + repr(ctx.at("ext", default: none)))
  }

  // sys.inputs.rheo-context parity (no per-file handle; presence of target/ext matches).
  let s = sys.inputs.rheo-context
  assert("handle" not in s, message: "sys.inputs.rheo-context must NOT carry per-file handle")
  assert(s.spine == ctx.spine, message: "sys.inputs spine must equal rheo-context().spine")
  assert(s.spine-flat == ctx.spine-flat, message: "sys.inputs spine-flat must equal rheo-context().spine-flat")
  assert(("target" in s) == ("target" in ctx), message: "sys/ctx target presence must match")
  assert(("ext" in s) == ("ext" in ctx), message: "sys/ctx ext presence must match")
}
