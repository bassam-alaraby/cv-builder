# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Anyone who lands on the project's GitHub Pages site and wants to produce a CV: job
seekers making a résumé to apply with, and friends and open-source contributors
who found the site and want to use it or help build it. The audience is general
and non-professional — not a design or recruiting audience — and arrives
without an account, often on a shared or work machine, and often in a hurry.

They are not asking for a career tool with advice, tracking or analytics. They
want a clean document, a PDF, and the confidence that the PDF is the thing they
just saw on screen.

## Product Purpose

Let anyone produce a clean, ATS-friendly CV as a PDF in the browser, in a couple
of minutes, without giving anything to a server. The editor and the finished
page are the same object: the preview *is* the document that prints, so there is
never a gap between what was approved on screen and what lands in the PDF.

Success means the user leaves with a PDF whose text is real, selectable, and
parseable by an applicant tracking system, and never had to make an account.

## Positioning

The document renders in the browser from the same code path that prints it, so
the on-screen page is the printed page. There is no account, no server and no
upload, so the CV never leaves the device; and the whole tool is MIT-licensed
source that anyone can fork, self-host or read to see exactly what happens to
their data. A hosted resume builder cannot truthfully copy that combination of
exact-preview, local-only and free.

## Operating Context

- The user is at a laptop, usually mid-task: they open the site, fill the form,
  watch an A4 page update as they type, then print.
- The finish line is a browser print dialog: the destination must be set to
  *Save as PDF*, margins *Default* (the template sets them), scale *100%*, and
  headers and footers *off*. The app opens a dialog with these steps before
  printing, because getting them wrong silently produces a broken PDF.
- The file lands in the browser's downloads folder, named after the name in the CV.
- The CV lives only in that browser's localStorage. Clearing browsing data
  deletes it, so JSON export is the only backup and the UI says so.
- The site is GitHub Pages, served from the repository root; every path is
  relative, so it also runs from any sub-path and can be forked and self-hosted.
- On a phone the editor and the preview are separate tabs; tapping a word in the
  preview switches to the tab that edits it.

## Capabilities and Constraints

- The editor form is generated from a schema (`app/schema.js`): profile, contact
  rows, experience, education, skills, and user-added custom sections.
- A live A4 preview renders the selected template's output from the same
  document, with a page-count estimate, fit/75%/100% zoom and a focus mode.
- Clicking any word in the preview jumps to the field that writes it.
- Print / Save as PDF opens a print-settings dialog first, which can be silenced
  once known and re-opened from the footer's Print settings control.
- Autosave to localStorage on every change; JSON export and import with schema
  validation; reset to the shipped sample CV.
- Templates are JavaScript modules governed by a written contract
  (`docs/TEMPLATE-CONTRACT.md`); *Classic* is the only one shipped.
- The PDF comes from the browser's print dialog, not a PDF library (ADR 0002).
- No build step, no bundler and no npm dependencies (ADR 0001). The repository
  is the deployable.
- Fonts are vendored (Computer Modern Serif, SIL OFL) so the CV renders
  identically offline, on screen and in print.
- Undecided: whether a second template, a landing page, or a non-English UI are
  ever wanted. Nothing is planned or promised for them.

## Brand Commitments

- Free and open source under the MIT licence, with a public repository that
  welcomes contributions.
- No account and no server: the CV stays on the user's own device and nobody
  else can see it.
- What you see in the preview is the PDF. The preview is never an
  approximation of the document.

## Voice

Plain, direct, no exclamation marks. Short imperative sentences that state the
fact and the consequence ("Headers and footers off — otherwise the page number
and URL print on your CV"). Second person, no marketing adjectives, no
exclamation marks, and never a claim the app cannot back with a visible
mechanism. Buttons name the action they perform.

## Evidence on Hand

- The live site: <https://bassam-alaraby.github.io/cv-builder/>.
- `README.md` (product description and usage), `GLOSSARY.md` (the project's own
  vocabulary), `docs/TEMPLATE-CONTRACT.md`.
- `docs/adr/0001-no-build-plain-es-modules.md`,
  `docs/adr/0002-pdf-by-browser-print.md`,
  `docs/adr/0003-templates-are-modules-with-a-contract.md` — the reasoning
  behind the structural commitments.
- `templates/classic/sample.js` — a real, complete sample CV to design against.
- `assets/fonts/` — vendored OFL fonts, and the licence text beside them.
- Absences: no testimonials, no user numbers, no usage analytics, no pricing, no
  screenshots of the app in the repository, and no claims about employer or ATS
  outcomes. None of these may be invented.

## Product Principles

1. **Nothing leaves the device.** No account, no server, no upload — not as a
   feature to advertise, but as a constraint that shapes every feature.
2. **The preview is the document.** Any gap between the screen and the paper is
   a defect, and the print dialog's settings are part of the product.
3. **The repository is the deployable.** No build step, no dependencies, no
   hidden pipeline: the source a visitor reads is the source that runs.
4. **Honest defaults and honest limits.** Say what the tool does, say what it
   cannot do, and never show a state the app cannot actually produce.
5. **The page is the product's face.** The editor exists in service of the
   document; the Classic template's typography is not the app's to reshape.

## Accessibility & Inclusion

- The produced PDF must stay machine-readable: real selectable text, no
  image-of-text, because an applicant tracking system is what actually reads it.
- The app ships keyboard-focusable controls, labelled panes, a live region for
  status messages and a mobile Edit/Preview tab layout.
- No formal conformance target (e.g. a WCAG level) has been set, and no
  specific user need beyond the above has been confirmed — undecided.
