// Hand-rolled Atom feed built from Typst primitives alone -- no @rheo
// package, no rheo.toml `[html] feed_*` keys, no `#let rheo-feed-*`
// variables. Proves the primitives (transclusion, rheo-metadata-all,
// sys.inputs.rheo-context.spine-flat) are sufficient to replace the deleted
// Rust feed generator. At parity with the old
// ref/cases/feed_asset_verify/feed.xml; the deliberate parity deltas are
// recorded in this test's doc comment (tests/harness.rs's
// test_marrow_atom_feed).

#let base = "https://example.com"

#let escape-xml(s) = s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")

#let rfc3339(dt) = dt.display("[year]-[month]-[day]") + "T" + dt.display("[hour]:[minute]:[second]") + "+00:00"

#context {
  let by-handle = (:)
  for m in rheo-metadata-all() {
    by-handle.insert(m.handle, m)
  }

  // Skip any vertebra with no authored date -- there is no output-mtime
  // fallback from Typst (unlike the old Rust generator), so an undated
  // vertebra is left out rather than dated arbitrarily.
  let dated = sys.inputs.rheo-context.spine-flat.filter(v => "date" in by-handle.at(v.handle, default: (:)))

  let entry-url(v) = base + "/" + v.path.replace(".typ", ".html")

  let entries-xml = dated.map(v => {
    let m = by-handle.at(v.handle)
    let url = entry-url(v)
    (
      "<entry>"
      + "<title>" + escape-xml(v.title) + "</title>"
      + "<id>" + url + "</id>"
      + "<updated>" + rfc3339(m.date) + "</updated>"
      + "<link href=\"" + url + "\" rel=\"alternate\"/>"
      + "<content type=\"html\"><rheo-content page=\"" + v.path.replace(".typ", ".html") + "\"/></content>"
      + "</entry>"
    )
  }).join("")

  let feed-updated = if dated.len() > 0 {
    let dates = dated.map(v => by-handle.at(v.handle).date)
    rfc3339(dates.fold(dates.first(), (acc, d) => if d > acc { d } else { acc }))
  } else {
    rfc3339(datetime(year: 1970, month: 1, day: 1, hour: 0, minute: 0, second: 0))
  }

  asset(
    "feed.xml",
    "<?xml version=\"1.0\"?>\n"
    + "<feed xmlns=\"http://www.w3.org/2005/Atom\">"
    + "<title>Marrow Atom Feed</title>"
    + "<id>" + base + "/feed.xml</id>"
    + "<updated>" + feed-updated + "</updated>"
    + "<author><name>Rheo</name></author>"
    + "<link href=\"" + base + "/feed.xml\" rel=\"self\"/>"
    + entries-xml
    + "</feed>",
  )
}
