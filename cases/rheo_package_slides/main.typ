// @rheo:test
// @rheo:formats html
// @rheo:description Tests that @rheo/slides:0.1.0 is downloaded, cached, and compiled correctly

#import "@rheo/slides:0.1.0": template, slide

#show: template.with(title: "Test Slides")

#slide[
  == First Slide

  Hello from slide one.
]

#slide[
  == Second Slide

  Hello from slide two.
]
