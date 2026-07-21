// Second vertebra so the spine has more than one page.

Detected: #("rheo-context" in sys.inputs)

Sys spine pages: #sys.inputs.rheo-context.spine-flat.len()

Guarded handle: #(if "rheo-context" in sys.inputs { rheo-context().handle } else { "native" })
