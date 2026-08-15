#set document(title: [First Chapter])

= First

First chapter content.

// Per rheo/docs/spikes/typst-native-metadata.md Q6 (combined PDF leaks title
// across vertebrae inside the one shared #document(...)), the confirmed
// mitigation is to gate beacon emission to OnePerVertebra (HTML/EPUB) layouts
// only, and have `metadata-of` return an empty dict under combined PDF rather
// than emit a beacon at all. `metadata-of` doesn't exist yet, so this line is
// expected to hard-fail compilation today.
Metadata-of self under combined PDF (expected empty dict per Q6): #context repr((rheo-context().metadata-of)("first"))
