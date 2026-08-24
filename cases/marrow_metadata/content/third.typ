= Third

Vertebra with no `#set document(...)` at all. Per cases/spine_document_metadata,
rheo still resolves SOME title for it -- its own path-derived fallback
("Third", baked into the synthesized `#document(..., title: [...])[...]`
wrapper) -- so only `date`/`author`/`description`/`keywords` are genuinely
absent for this vertebra, not `title`.
