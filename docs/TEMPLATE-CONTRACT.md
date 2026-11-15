# Template Contract

Everything a template has to do to work in CV Builder, written down so that a
template can be built from nothing but this file and a plain HTML CV.

Read this before you write `template.js`. If a rule here and the code disagree,
the code wins — but the code is meant to match this file.

---

## 1. What a template is

A template is a **presentation** of a document: markup and styling, no content.
It never stores data, never changes data, and never adds fields. Two templates
can show the same CV in completely different ways.

A template is a folder:

```
templates/<your-id>/
├── template.js   the render function
├── template.css  the styles (loaded as a stylesheet, so relative font URLs work)
└── sample.js     the placeholder document this template ships with
```

`template.js` must export exactly one function:

```js
export function render(data) {
  return '<div class="cv">…</div>'; // a complete HTML fragment
}
```

`render` is called every time the document changes, so it must be a pure
function of `data`: no state, no timers, no event handlers.

---

## 2. The data you are given

`data` is a plain object, already filtered: hidden sections are gone, and
nothing has been renamed. Its shape:

```js
{
  profile: {
    name: 'First Last',
    headline: 'Software Engineer',
    contacts: {
      rows: [
        {
          items: [
            { type: 'website', text: 'example.com', link: 'https://example.com' },
            { type: 'email', text: 'first.last@example.com', link: 'mailto:first.last@example.com' },
          ],
        },
      ],
    },
  },
  sections: [
    { key: 'summary', type: 'summary', heading: 'Objective', body: '…' },
    { key: 'education', type: 'education', heading: 'Education', entries: [ … ] },
    { key: 'custom[0]', type: 'custom', heading: 'Awards', entries: [ … ] },
  ],
}
```

### Profile

| Field | Meaning |
| --- | --- |
| `profile.name` | The person's name. Always present, may be empty. |
| `profile.headline` | One line under the name. May be empty. |
| `profile.contacts.rows` | The contact area: a list of rows, each with a list of items. |

A contact item has:

| Field | Meaning |
| --- | --- |
| `type` | One of `phone`, `email`, `website`, `github`, `linkedin`, `location`, `x`, `other`. |
| `text` | What to print. Never contains `https://` or `http://`. |
| `link` | The `href` to use, or `''` when the item is not a link (a location). |

Rules for the contact area:

* Rows and items are **user built**: the number of rows, and the number of
  items in each row, come from the user. Render every row you are given.
* Items and rows keep the order the user chose.
* An item whose `text` is empty should be skipped — but keep counting, so the
  Field Paths stay correct (see §3).
* `text` is already display ready. Do not re-derive it, do not add a scheme to
  it, do not print `link` as visible text.

### Sections

`sections` is the list of **visible** sections, in canonical order. Each one
carries:

| Field | Meaning |
| --- | --- |
| `key` | The address of the section inside the document. Use it to build Field Paths. |
| `type` | The kind of section. Decides the entry shape. |
| `heading` | The heading to print, verbatim. The user can rename it. |
| `body` | Only on `summary`: one paragraph of text. |
| `entries` | On every other type: the list of entries. |

Section types and their entries:

| `type` | Entry fields | Notes |
| --- | --- | --- |
| `summary` | — (`body` instead) | One paragraph. |
| `education` | `institution`, `degree`, `location`, `dates` | |
| `experience` | `role`, `organisation`, `location`, `dates`, `bullets` | |
| `projects` | `name`, `stack`, `dates`, `bullets`, `url` | |
| `skills` | `label`, `items` | `items` is one comma separated string. |
| `courses` | `name`, `provider`, `dates`, `note` | |
| `languages` | `label`, `items` | Same shape as `skills`. |
| `custom` | `title`, `subtitle`, `dates`, `bullets` | The escape hatch for anything else. |

`dates` is always `{ start, end }`, both strings. An empty `end` means the
thing is ongoing — use the helper, do not write "Present" yourself.

A section with nothing in it should be skipped entirely, heading included.

**A template cannot add fields.** If your design needs a field that does not
exist (a "sidebar", "references", "awards"), either:

1. use the `custom` section type, or
2. extend `app/schema.js` (and the form, the sample and the import check come
   with it) and say so in your pull request.

Never hack around the schema inside a template.

---

## 3. Field Paths — the click-to-edit contract

Every piece of text the user can edit must sit in an element with a
`data-field` attribute holding the **Field Path** of the value it shows.

```html
<b data-field="sections.education.entries[0].institution">Some University</b>
```

When the user clicks that word in the preview, the app focuses the control
that edits it and scrolls it into view. Without `data-field`, the text is
inert.

The path grammar:

```
profile.name
profile.headline
profile.contacts.rows[0].items[1].value
sections.education.heading
sections.education.entries[0].institution
sections.education.entries[0].dates.start
sections.summary.body
sections.custom[0].entries[2].title
```

* `sections.<key>.…` — `<key>` is `education`, `custom[0]`, and so on. It is
  exactly `section.key` from §2. Build it as `` `sections.${section.key}` ``
  rather than typing it.
* Entry indices count from zero and follow the order you were given.
* `sections.<key>.heading` is the section heading itself.
* `sections.summary.body` is the summary paragraph.
* A contact item is `profile.contacts.rows[<row>].items[<item>].value`.

Two special cases:

* **Date ranges** print as one string ("2024 – Present"), so they carry the
  path of the start field: `data-field="sections.education.entries[0].dates.start"`.
  Clicking the range focuses the start input; the end input sits next to it.
* **Contact items** use the `.value` path, even when the item is a link.

Indices are always the ones you were given. Do not renumber after filtering
out empty entries: count with the original index (`entries.map((entry, i) => …)`)
and skip the empty ones inside the loop.

---

## 4. Helpers and icons you may import

Both modules live in `app/` and are shared, so every template formats things
the same way.

```js
import { formatRange, toLines, stripScheme, escapeHtml } from '../../app/helpers.js';
import { icon } from '../../app/icons.js';
```

| Helper | What it does |
| --- | --- |
| `formatRange(dates)` | `{ start: '2024', end: '' }` → `'2024 – Present'`. Empty end means ongoing. |
| `toLines(text)` | Splits a bullet textarea into a list of non empty lines. |
| `stripScheme(url)` | Removes `https://` / `http://` from a URL. |
| `escapeHtml(text)` | Escapes text for safe interpolation. Use it on everything you print. |
| `icon(type)` | The inline SVG for a contact type. Generic outline shapes, no brand marks. |

`icon(type)` returns a complete `<svg>` element marked `aria-hidden`, so it
carries no text and never reaches the printed words.

---

## 5. The page and printing

The app owns the sheet: an A4 box with `12mm 14mm` margins, and the browser
paginates it when the user prints. Your CSS may set:

```css
:root {
  --page-margin: 12mm 14mm;
}

@page {
  size: A4;
  margin: 12mm 14mm;
}
```

Change both together or neither — the app reads `--page-margin` to draw the
screen sheet, and the browser reads `@page` to lay out the paper.

Print rules your CSS must follow:

```css
@media print {
  .cv-section-head {
    break-after: avoid;
  }

  .cv-entry,
  .cv-list li {
    break-inside: avoid;
  }
}
```

* A heading must never be the last thing on a page.
* An entry must never be split across a page.
* No fixed heights, no absolute positioning, no `overflow: hidden`: the content
  simply flows and the browser breaks it.

---

## 6. ATS rules

The PDF is a picture of words for some parsers and text for others, so:

* **One column.** No tables, no sidebars, no multi column layouts.
* **Real text.** No images of text, no text inside images, no canvas.
* **Reading order.** Name, then contact, then sections top to bottom. The
  markup order is the reading order — do not reorder with CSS.
* **Icons carry no words.** Use `icon(type)`. Never put a letter or a symbol
  inside an icon that a parser would read as content.
* **Links print readable.** Use `item.text` (or `stripScheme(url)`), never the
  raw `href`.
* **Plain language.** No emoji, no dingbat bullets (use `list-style: disc`),
  no text in images.
* **Headings are headings.** Use a real heading element or a styled div with
  the section heading class — never a bold paragraph pretending to be one.

---

## 7. Class names

The app does not style your markup; these names are a convention so templates
look and behave alike. Use them where they fit:

| Class | Used for |
| --- | --- |
| `cv` | The root element of your fragment. |
| `cv-header`, `cv-name`, `cv-headline` | The name block. |
| `cv-contact-row`, `cv-contact` | The contact area. |
| `cv-section` | One section. |
| `cv-section-head` | The section heading. |
| `cv-entry` | One entry inside a section. |
| `cv-row` | A line with something on the left and something on the right. |
| `cv-sub` | A second, quieter line under an entry. |
| `cv-skills` | A block of `label: items` pairs. |
| `cv-list` | A bullet list. |
| `cv-meta` | A quiet line under an entry, e.g. a project link. |
| `cv-p`, `cv-note` | A paragraph of body text. |

The app styles exactly one thing inside your markup: elements with a
`data-field` attribute get a dashed outline on hover and a highlight when the
matching field is focused. Everything else is yours.

---

## 8. The sample

`sample.js` exports the placeholder document the template ships with:

```js
export const sample = {
  version: 1,
  profile: { … },
  sections: { … },
};
```

Rules:

* Generic placeholders only — "First Last", "Company Name", "Project Name".
  No real person, no real contact details, no real URLs.
* **Every section type on**, so a new visitor sees what the template can do.
* The shape must match §2 exactly, or the app falls back to the classic
  template's sample and your template looks broken on first load.

---

## 9. Registering the template

Add it to `templates/index.js`:

```js
export const templates = [
  { id: 'classic', name: 'Classic', description: '…' },
  { id: 'your-id', name: 'Your Name', description: 'One line about the layout.' },
];
```

The first entry is the default. When a second template exists, a template
picker appears in the app's navigation.

---

## 10. Building a template from a plain HTML CV

The workflow this contract exists for. Hand someone a plain HTML CV and this
file, and they should be able to return a working template folder.

1. **Read the HTML.** Split it into the header (name, headline, contacts) and
   the sections below it.
2. **Map the sections.** Each part of the CV becomes a section type. Anything
   that does not fit a type becomes a `custom` section. Note which sections
   are optional — they will be toggled off in the sample only if they are
   empty of content, so keep the canonical order of the document.
3. **Copy `templates/classic/template.js` and `template.css`** as the starting
   point. They are a working example of every rule here.
4. **Add `data-field` to every editable text**, using the paths in §3.
5. **Keep the print rules** (§5) and check the ATS rules (§6).
6. **Write `sample.js`** with placeholders (§8).
7. **Register it** (§9).
8. **Walk the checklist** below.

### Checklist

- [ ] `render(data)` returns a complete fragment and adds no side effects.
- [ ] Every editable text has a `data-field` with a path the app can resolve.
- [ ] Clicking the name, a heading, an entry field and a contact item jumps to
      the right control.
- [ ] No field is printed with `https://` in the visible text.
- [ ] An empty entry prints nothing, and an empty section prints no heading.
- [ ] A section with no entries prints no heading.
- [ ] `@page` and `--page-margin` agree.
- [ ] Headings do not end a page; entries do not split across pages.
- [ ] One column, real text, no images of text, no brand logos.
- [ ] The sample has no real person's details and shows every section.
- [ ] The template is registered in `templates/index.js`.
