// @rheo:test
// @rheo:expect error
// @rheo:error-patterns "feed.xml", "rheo-content"
// @rheo:description Case for rheo-tests-transclude-malformed-zk1: a <rheo-content> placeholder missing the required page attribute must fail the build naming the asset, not survive into output as literal text.

= Transclude Missing Page

Content.
