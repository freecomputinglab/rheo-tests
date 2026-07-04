// @test-formats: html
// @test-description: Feed entry title/date default to #document metadata (no rheo-* overrides)

#set document(title: [Defaults Title], date: datetime(year: 2025, month: 1, day: 15))

= Defaults Title

This vertebra declares no rheo-feed overrides. Its feed entry title and
timestamp default to the #document metadata above.
