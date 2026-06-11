// @rheo:test
// @rheo:formats html,pdf
// @rheo:description Long-form article with custom HTML elements and code examples

#let html-element(body, name: "div", attrs: (:)) = context {
  if target() == "html" or target() == "epub" {
    html.elem(name, attrs: attrs, body)
  } else {
    block(body)
    [#attrs]
  }
}

#let custom-element(name, attrs: (:)) = html-element.with(name: name).with(attrs: attrs)

#let header = custom-element("header")
#let authors = custom-element("doc-authors")
#let author = custom-element("doc-author")
#let author-name = custom-element("doc-author-name")
#let author-affiliation = custom-element("doc-author-affiliation")
#let publication-date = custom-element("doc-publication-date")
#let abstract = custom-element("doc-abstract")
#let section = custom-element("section")
#let definition = custom-element("dfn-container")

#let defined-word(id: "", body) = custom-element("dfn")(attrs: (id: id), body)

#let callout(body) = custom-element("div")(attrs: (class: "callout"), body)
#let def-link(id, body) = custom-element("a")(attrs: (href: "#" + id, data-target: "dfn"), body)
#let code-step = custom-element("code-step")
#let span = custom-element("span")
#let code-def(id, body) = span(attrs: (id: id), body)
#let code-description = custom-element("code-description")
#let code-desc-block(body) = {
  let verbatimize(items, indent) = {
    items
      .filter(child => child.func() == enum.item)
      .map(item => {
        if item.body.has("children") {
          let children = item.body.children
          let item-idx = children.position(child => child.func() == enum.item)
          if item-idx != none {
            let prefix = children.slice(0, item-idx)
            (span(indent), prefix.join(), "\n", verbatimize(children.slice(item-idx), indent + "  ")).join()
          } else {
            (span(indent), children.join()).join()
          }
        } else {
          (span(indent), item.body).join()
        }
      })
      .join("\n")
  }
  html.pre(html.code(verbatimize(body.children, "")))
}

#let code-steps(body) = {
  body
    .children
    .map(child => {
      if child.has("body") {
        code-step(child.body)
      } else {
        child
      }
    })
    .join()
}

#set document(title: "Portable EPUBs")

#header[
  #title()
  #authors[
    #author[
      #author-name[Will Crichton]
      #author-affiliation[Brown University]
    ]
  ]
  #publication-date[January 25, 2024]
  #abstract[
    Despite decades of advances in document rendering technology, most of the world's documents are stuck in the 1990s due to the limitations of PDF.
    Yet, modern document formats like HTML have yet to provide a competitive alternative to PDF. This post explores what prevents HTML documents from being portable, and I propose a way forward based on the EPUB format. To demonstrate my ideas, this post is presented using a prototype EPUB reading system.
  ]
]

= The Good and Bad of PDF <good-and-bad-pdf>

PDF is the de facto file format for reading and sharing digital documents like papers, textbooks, and flyers. People use PDF for several reasons:

- *PDFs are self-contained.* A PDF is a single file that contains all the images, fonts, and other data needed to render it.

- *PDFs are rendered consistently.* A PDF specifies precisely how it should be rendered.

- *PDFs are stable over time.* PDFs from decades ago still render the same today.

Yet, in the 32 years since the initial release of PDF, a lot has changed. People use phones, tablets, and e-readers to read digital documents. These changes have laid bare the limitations of PDF.

= Can't We Just Fix PDF? <cant-fix-pdf>

A simple answer is to improve the PDF format. After all, we already have billions of PDFs — why reinvent the wheel?

But in practice, I don't think we can just fix the PDF format, at least within a reasonable time frame.

= The Good and Bad of HTML <good-and-bad-html>

In the meantime, we already have a structured document format which can be flexibly and interactively rendered: HTML.

- *HTML can more easily adapt to different screen sizes.*
- *HTML can be more easily understood by a program.*
- *HTML can more easily express interaction.*

However, HTML is lacking where PDF shines:
- *HTML is not self-contained.*
- *HTML is not always rendered consistently.*
- *HTML is not fully stable over time.*

So I've been thinking: *how can we design HTML documents to gain the benefits of PDFs without losing the key strengths of HTML?*

= Self-Contained HTML with EPUB <epub-intro>

First, how can we make HTML documents self-contained? The most sensible format for this purpose is EPUB.

EPUB is a "distribution and interchange format for digital publications and documents". An EPUB is a ZIP archive of web files: HTML, CSS, JS, and assets like images and fonts.

#par[#definition[
  Hence, I will propose a new format which I call a #defined-word(id: "portable-epub")[*portable EPUB*], which is an EPUB with additional requirements.
]]

= Principles for Consistent EPUB Rendering <rendering-principles>

I think the core solution for consistently rendering EPUBs comes down to this:

+ The document format needs to establish a subset of HTML which could represent most documents.
+ Reading systems need to guarantee consistent rendering.

#callout[
  *Portable HTML rendering requirement:* reading systems must guarantee reasonable rendering.
]

= Where To Go From Here? <where-to-go>

Every time I have told someone "I want to replace PDF", the statement has been met with extreme skepticism. Hopefully this document has convinced you that HTML-via-EPUB could potentially be a viable alternative.

= But What About... <but-what-about>

*...security?* You might dislike the idea that document authors can run arbitrary Javascript. But then again, you presumably use both a PDF reader and a web browser daily.

*...privacy?* EPUBs should not follow web trends in tracking and telemetry.

*...aesthetics?* People often intuit that LaTeX-generated PDFs look prettier than HTML documents.

*...page citations?* I think we should cite content by block numbers rather than pages.
