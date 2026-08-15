= Chapter One

This vertebra sets no document author at all: no `#set document(author: ...)`
and no `rheo-author` variable. The EPUB build must still succeed, with a
missing author only ever producing an absent/empty `dc:creator`, never a hard
build error.
