// Originally: a title with a double quote must round-trip through
// rheo-context().spine, exercising util::typst_literal's string escaping.
// Since rheo-delete-metadata-scan-t4f, spine title is purely path-derived
// (Vertebra.title never reads #set document(...) at all), so this quoted
// title is no longer reachable via rheo-context().spine -- the reader below
// now just regression-guards that reality (path-derived "Quoted", not the
// quoted content). Escaping arbitrary document content is still exercised
// elsewhere: metadata-of/rheo-metadata return title as Content (not a
// string), so no string-escaping question even arises there.
#set document(title: [She said "hello"])

= Quoted
