= Migrate Target Syntax

Pre-0.5.0 sources referenced the removed target key three ways.
`rheo migrate` rewrites each onto the `rheo-context.target` form.

Helper call: #rheo-target()

Key probe: #("rheo-target" in sys.inputs)

Direct read: #sys.inputs.rheo-target
