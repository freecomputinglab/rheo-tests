// @test-formats: html
// @test-description: rheo-feed-exclude = true omits this vertebra from the feed (page still built)

#set document(title: [Excluded], date: datetime(year: 2025, month: 6, day: 1))

#let rheo-feed-exclude = true

= Excluded

This vertebra opts out of the feed with the boolean rheo-feed-exclude. Its HTML
page is still generated; only its feed entry is dropped.
