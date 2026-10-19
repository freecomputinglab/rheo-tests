#import "/typ/rheo.typ": rheo-ligament-attach, rheo-ligament-bind, rheo-ligament-get
= X
#rheo-ligament-attach("kx", "x1")
#rheo-ligament-bind("ky")
#context {
  let live = query(label("rheo-ligament:attach")).filter(m => m.value.key == "ky").map(m => m.value.value)
  let stored = rheo-ligament-get("ky")
  let extra = if stored == none {
    ()
  } else {
    stored.map(p => p.value).filter(v => not live.contains(v))
  }
  let vals = live + extra
  [X sees: #vals.join(", ")]
}
