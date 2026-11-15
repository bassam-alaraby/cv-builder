# CV Builder

A free, open source CV builder. Edit a clean, ATS friendly resume template in
your browser and save it as a PDF.

- No account, no server, no database. Your CV lives in your browser and never
  leaves your device.
- The preview on the right *is* the document that gets printed: what you see is
  what lands on the paper.
- Click any word in the preview to jump to the field that writes it.
- The PDF contains real, selectable text, so applicant tracking systems can
  read it.

## Use it

Open <https://bassam-alaraby.github.io/cv-builder/> and start typing. The
preview updates as you go and your work is saved in the browser as you type.

When you are happy with it:

1. Press **Print / Save as PDF**.
2. In the print dialog choose **Save as PDF** as the destination, **Default**
   margins (the template sets them), **100%** scale, and turn **headers and
   footers** off.
3. Save. Chrome names the file after the name in your CV.

Because the CV is stored only in this browser, clearing your browser data
deletes it. Use **Export JSON** now and then to keep a copy, and **Import
JSON** to load one back on another device.

## Templates

The first template is *Classic*: a single column, serif, ATS friendly résumé
in the style of the classic LaTeX resume templates.

Adding your own is a folder and three files. Read
[docs/TEMPLATE-CONTRACT.md](docs/TEMPLATE-CONTRACT.md) — it is written so that
you can hand it and a plain HTML CV to someone (or to an assistant) and get a
working template back.

```
templates/<your-id>/
├── template.js   export function render(data) -> html
├── template.css  the styles
└── sample.js     the placeholder CV it ships with
```

Register it in `templates/index.js`. When a second template exists, a template
picker appears in the app.

## Running it locally

The app is static, but it uses ES modules, so it needs to be served over HTTP
rather than opened from the file system:

```sh
python3 -m http.server 8000
# then open http://localhost:8000
```

Run the tests (they cover the document model, the helpers and the import
check):

```sh
npm test
```

## Deploying

The site is GitHub Pages, served from the root of the `main` branch. Every
path in the project is relative, so it also works behind any other path.

1. Push to `main`.
2. In the repository settings, set **Pages → Build and deployment → Source** to
   **Deploy from a branch**, branch `main`, folder `/ (root)`.

## How it is put together

```
index.html              the app shell
app/
  schema.js             the document shape: sections, fields, import check
  model.js              every change a user can make to a document
  form.js               the editor form, generated from the schema
  preview.js            rendering the template, page estimate, click-to-edit
  paths.js              field paths: preview <-> form
  helpers.js            shared formatting: dates, links, bullets
  icons.js              the built-in contact icons
  storage.js            localStorage, JSON export and import
  main.js               wiring
templates/              one folder per template, plus the registry
docs/TEMPLATE-CONTRACT.md
test/                   node:test suites
```

## Decisions

The reasoning behind the bigger choices is in `docs/adr/`:

- [0001](docs/adr/0001-no-build-plain-es-modules.md) — no build step, plain ES modules
- [0002](docs/adr/0002-pdf-by-browser-print.md) — the PDF comes from the browser's print dialog
- [0003](docs/adr/0003-templates-are-modules-with-a-contract.md) — templates are modules governed by a contract

The vocabulary is in [GLOSSARY.md](GLOSSARY.md).

## License

MIT — see [LICENSE](LICENSE).

The Computer Modern Serif fonts in `assets/fonts/` are under the SIL Open Font
License 1.1; the licence text is in `assets/fonts/OFL.txt`.
