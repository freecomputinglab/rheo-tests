// rheo-context: each vertebra sees its own handle plus the full ordered spine.

Handle: #rheo-context.handle

Spine handles: #rheo-context.spine.map(v => v.handle).join(", ")

Spine paths: #rheo-context.spine.map(v => v.path).join(", ")

Pages: #rheo-context.spine.len()
