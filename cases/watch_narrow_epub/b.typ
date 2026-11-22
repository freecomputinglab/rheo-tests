#import "/typ/rheo.typ": rheo-ligament-bind, rheo-ligament-get
= B
#rheo-ligament-bind("greeting")
#context {
  let pairs = rheo-ligament-get("greeting")
  let vals = if pairs == none {
    query(label("rheo-ligament:attach")).filter(m => m.value.key == "greeting").map(m => m.value.value)
  } else { pairs.map(p => p.value) }
  [Greeting: #vals.join(", ")]
}
