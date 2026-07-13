// sys.inputs.rheo-context: packages detect a rheo build without tripping the
// unbound-variable trap on the per-file `#let rheo-context`. sys.inputs carries
// only the global spine (no handle); the handle comes from the per-file #let.

Detected: #("rheo-context" in sys.inputs)

Sys spine pages: #sys.inputs.rheo-context.spine-flat.len()

Guarded handle: #(if "rheo-context" in sys.inputs { rheo-context.handle } else { "native" })
