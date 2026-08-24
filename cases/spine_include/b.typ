// @rheo:test
// @rheo:formats html
// @rheo:description rheo-tests-spine-include-mwa: flat `[spine] include` reorders b, a, c ahead of alphabetical order, with no group-node URL prefix (contrast cases/spine_sections) and d.typ dropped for matching no pattern.

#set document(title: [B])

= B

Spine order: #rheo-context().spine-flat.map(v => v.handle).join(", ")

Handle: #rheo-context().handle
