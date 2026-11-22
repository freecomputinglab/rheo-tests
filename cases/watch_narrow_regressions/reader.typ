#import "/typ/rheo.typ": rheo-ligament-bind, rheo-ligament-get
= Reader
#rheo-ligament-bind("items")
#context {
  let live = query(label("rheo-ligament:attach")).filter(m => m.value.key == "items").map(m => m.value.value)
  let stored = rheo-ligament-get("items")
  let extra = if stored == none {
    ()
  } else {
    stored.map(p => p.value).filter(v => not live.contains(v))
  }
  let ids = live + extra
  [Items: #ids.join(", ")]
}
