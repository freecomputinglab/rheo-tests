// @test-formats: html
// @test-description: The cross-vertebra link rule decides from spine-flat alone

= Main

A label naming a vertebra becomes that vertebra's page:
#link(<other>)[the other page].

A label naming NOTHING in the spine is left to Typst, which resolves it to
wherever the element sits: #link(<a-section>)[a section].
