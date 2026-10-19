#import "/typ/rheo.typ": rheo-ligament-attach, rheo-ligament-bind, rheo-ligament-get
= Y
#rheo-ligament-bind("kx")
#context {
  let live = query(label("rheo-ligament:attach")).filter(m => m.value.key == "kx").map(m => m.value.value)
  let stored = rheo-ligament-get("kx")
  let extra = if stored == none {
    ()
  } else {
    stored.map(p => p.value).filter(v => not live.contains(v))
  }
  let vals = live + extra
  let first = if vals.len() > 0 { vals.first() } else { "?" }
  rheo-ligament-attach("ky", "y-of-" + first)
}
