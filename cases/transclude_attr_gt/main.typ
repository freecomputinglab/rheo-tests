// @rheo:test
// @rheo:expect error
// @rheo:error-patterns "feed.xml", "rheo-content"
// @rheo:description Case for rheo-tests-transclude-malformed-zk1: a <rheo-content> placeholder with a `>` inside an attribute value never matches the tag regex at all, so it must fail the build naming the asset instead of surviving into output as literal text.

= Transclude Attribute With Greater-Than

Content.
