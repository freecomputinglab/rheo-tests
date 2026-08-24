#set document(author: "Ada Lovelace")

= Chapter One

This vertebra sets a Typst document author via `#set document(author: ...)`
but defines NO `rheo-author` variable. Today's EPUB author extraction only
reads a `rheo-author` variable or scrapes an HTML `<meta name="author">` tag
— neither exists here — so today's `dc:creator` should be absent.
