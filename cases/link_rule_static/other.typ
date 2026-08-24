// @test-formats: html
// @test-description: A handle-named label wins over a colliding authored one

= Other

== A Section <a-section>

The paragraph below carries an authored `<main>` label, colliding with the
handle of `main.typ`. A link to that name resolves to the VERTEBRA, not to this
local element — the rule reads `sys.inputs.rheo-context.spine-flat`, so a
handle always wins, whatever else in the project claims the same label:
#link(<main>)[the main page].

This paragraph is the colliding claimant. <main>
