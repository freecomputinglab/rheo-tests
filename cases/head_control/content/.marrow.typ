// Control asset consumed internally by rheo (once rheo-head-control-cbr
// lands) and appended to every compiled page's `<head>`. It must NEVER be
// written to the actual build output under the reserved `.rheo/` prefix.
#asset(
  ".rheo/head.html",
  "<link rel=\"alternate\" type=\"application/atom+xml\" href=\"https://example.com/feed.xml\" title=\"Test Feed\">",
)

// Ordinary asset alongside the control asset: proves normal assets still get
// written to the build output while `.rheo/`-prefixed ones do not.
#asset("extra/hello.txt", "hi")
