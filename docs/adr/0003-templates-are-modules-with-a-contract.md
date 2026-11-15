# Templates are JavaScript modules governed by a written contract

A template is a folder with `template.js` (a module exporting `render(data)`),
`template.css` and `sample.js`, and it must follow `docs/TEMPLATE-CONTRACT.md`.
Templates are presentation only: they never add fields to the Document, and a
field they need but the schema does not have is added to `app/schema.js`
instead.

The alternatives were HTML files with a `{{mustache}}` style template language
(another mini language to design, document and maintain) and CSS-only variants
of one semantic document (which cannot express a genuinely different layout,
such as a two column design). JavaScript modules need no template language at
all and leave the template author in full control of the markup. The cost is
that the contract has to be written down and kept true, which is why the
contract, the shared helpers and the shared icon set are part of the project
rather than things each template reinvents.
