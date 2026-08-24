#import "/template.typ": book
#show: book

= Date Templated

Date is set ONLY inside `#show: book` (template.typ, outside content_dir) --
no literal `#set document(...)` in this file at all. The resolved date must
be the real templated value, since the beacon reads live `document.date` the
same way it reads `document.title` (already proven to resolve correctly
through template-applied `#show:` wrappers, see cases/metadata_template_title).
