// @test-formats: html
// @test-description: rheo-feed-* variables override the #document title/date

#set document(title: [Doc Title], date: datetime(year: 2020, month: 2, day: 2))

#let rheo-feed-title = "Override Title"
#let rheo-feed-updated = "2030-03-03T00:00:00Z"

= Doc Title

This vertebra sets #document title/date but also declares rheo-feed-title and
rheo-feed-updated, which must win over the document metadata in the feed.
