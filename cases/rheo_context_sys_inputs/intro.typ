// sys.inputs.rheo-context: packages detect a rheo build without tripping the
// unbound-variable trap on the per-file `#let rheo-context()`. sys.inputs carries
// only the global spine (no handle); the handle comes from the per-file #let.

Detected: #("rheo-context" in sys.inputs)

Sys spine pages: #sys.inputs.rheo-context.spine-flat.len()

Guarded handle: #(if "rheo-context" in sys.inputs { rheo-context().handle } else { "native" })

// Explicit assertions for every rheo-context() field + sys.inputs parity.
// Invisible (assert => none): they hard-fail the compile if the data shape
// regresses, without altering the byte-for-byte HTML reference.
#{
  let ctx = rheo-context()

  // handle — the only per-file field.
  assert(type(ctx.handle) == str, message: "handle must be str, got " + repr(type(ctx.handle)))
  assert(ctx.handle == "intro", message: "intro.typ handle must be 'intro', got " + ctx.handle)

  // spine-flat — flat pre-order list of clickable vertebrae.
  assert(type(ctx.spine-flat) == array, message: "spine-flat must be array")
  assert(ctx.spine-flat.len() == 2, message: "expected 2 vertebrae, got " + str(ctx.spine-flat.len()))
  for v in ctx.spine-flat {
    assert(type(v) == dictionary, message: "spine-flat entry must be dict")
    // `metadata` was removed from spine-flat entries by rheo-meta-beacons-2o5;
    // per-vertebra metadata now comes from `rheo-context().metadata-of`.
    assert(v.keys().sorted() == ("handle", "path", "title"), message: "spine-flat entry keys: " + repr(v.keys()))
    assert(type(v.handle) == str, message: "spine-flat handle must be str")
    assert(type(v.path) == str, message: "spine-flat path must be str")
    assert(type(v.title) == str, message: "spine-flat title must be str")
  }
  assert(ctx.spine-flat.map(v => v.handle).contains("intro"), message: "spine-flat must contain 'intro'")
  assert(ctx.spine-flat.map(v => v.handle).contains("chapters:one"), message: "spine-flat must contain 'chapters:one'")

  // spine — recursive tree; every node dict has (title, handle, path, children).
  // handle/path are str for clickable vertebrae, none for group nodes.
  assert(type(ctx.spine) == array, message: "spine must be array")
  let check-node(n) = {
    assert(type(n) == dictionary, message: "spine node must be dict")
    assert(n.keys().sorted() == ("children", "handle", "path", "title"), message: "spine node keys: " + repr(n.keys()))
    assert(type(n.title) == str, message: "node title must be str")
    assert(n.handle == none or type(n.handle) == str, message: "node handle must be str or none")
    assert(n.path == none or type(n.path) == str, message: "node path must be str or none")
    assert(type(n.children) == array, message: "node children must be array")
    for c in n.children { check-node(c) }
  }
  for n in ctx.spine { check-node(n) }

  // target / ext — present for html/epub; this is an html build.
  assert(ctx.target == "html", message: "target must be 'html', got " + repr(ctx.at("target", default: none)))
  assert(ctx.ext == "html", message: "ext must be 'html', got " + repr(ctx.at("ext", default: none)))

  // sys.inputs.rheo-context — the file-independent data dict (NO per-file handle).
  let s = sys.inputs.rheo-context
  assert(type(s) == dictionary, message: "sys.inputs.rheo-context must be dict")
  assert("handle" not in s, message: "sys.inputs.rheo-context must NOT carry per-file handle")
  assert(s.spine == ctx.spine, message: "sys.inputs spine must equal rheo-context().spine")
  assert(s.spine-flat == ctx.spine-flat, message: "sys.inputs spine-flat must equal rheo-context().spine-flat")
  assert(s.target == ctx.target, message: "sys.inputs target must equal rheo-context().target")
  assert(s.ext == ctx.ext, message: "sys.inputs ext must equal rheo-context().ext")
}
