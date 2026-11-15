---
name: CV Builder
description: A free, open source CV builder that edits an ATS-friendly resume and prints it from the browser.
colors:
  ground: "#f1f2f4"
  panel: "#ffffff"
  ink: "#14181f"
  muted: "#6b7280"
  hairline: "#e3e5e8"
  accent: "#1c4ed8"
  accent-wash: "#eef3ff"
  danger: "#b42318"
  note-bg: "#fffbeb"
  note-line: "#fde68a"
  note-ink: "#78350f"
  footer-ink: "#5f6673"
  entry-bg: "#fcfcfd"
  highlight: "#fff4c2"
  scrim: "rgba(15, 18, 24, 0.35)"
typography:
  body:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.5
  title:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: "15px"
    fontWeight: 600
    lineHeight: 1.5
  label:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.5
  chip:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: "12.8px"
    fontWeight: 500
    lineHeight: 1.5
  brand-mark:
    fontFamily: "Georgia, 'Times New Roman', serif"
    fontSize: "21.6px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0.02em"
  dialog-title:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: "16px"
    fontWeight: 600
    lineHeight: 1.5
  document:
    fontFamily: "'CMU Serif', 'Latin Modern Roman', Georgia, 'Times New Roman', serif"
    fontSize: "10pt"
    fontWeight: 400
    lineHeight: 1.25
rounded:
  sm: "6px"
  md: "7px"
  lg: "8px"
  panel: "10px"
  dialog: "12px"
  pill: "99px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.panel}"
    rounded: "{rounded.lg}"
    padding: "6px 11px"
  button-default:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "6px 11px"
  section-row:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
    height: "44px"
  state-chip-complete:
    backgroundColor: "{colors.accent-wash}"
    textColor: "{colors.accent}"
    rounded: "{rounded.pill}"
    padding: "1px 8px"
  input:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "6px 7px"
---

# Design System: CV Builder

## Overview

**Creative North Star: "The Workbench and the Sheet"**

The interface is a workbench and the CV is the sheet of paper lying on it. The
workbench is quiet, neutral and grey, built from hairline rules and white
panels, and it has exactly one job: to stay out of the way of the white page on
the right, which is the only object in the product that anyone actually cares
about. Nothing in the chrome competes with the document, and nothing in the
document borrows from the chrome.

The result is deliberately unglamorous. This is a tool a stranger opens once,
fills in, and prints; the design's success is that they never have to think
about it. Every element is either an affordance they already recognise (a
labelled field, a button, a select) or a piece of state made legible (which
sections are filled, how many pages the CV runs to). There is one accent, and
it means "this is the live thing you are working on".

The document itself is a different world on purpose: Computer Modern Serif, the
LaTeX résumé voice, because that is what an ATS-friendly academic CV looks
like. The app's system-UI chrome and the template's serif page are two separate
type systems with a hard border between them, and that border is the point:
chrome is chrome, the CV is the CV.

**Key Characteristics:**
- Neutral grey workbench, one white sheet, one blue accent.
- Flat at rest: 1px hairlines and tonal panels, no shadows except under the sheet.
- System-UI for the app, Computer Modern Serif for the document, never mixed.
- State is always legible: a fill chip on every section, a page count by the toolbar.
- Every control is a browser-native control, restyled; no custom widget vocabulary.

## Colors

A near-neutral grey scale carrying one saturated blue, plus a warm amber used
only for the print-dialog instructions. Colour does three jobs and nothing else:
it grounds the workbench, it marks the live/active element, and it flags danger.

### Primary

- **Workbench Blue** (#1c4ed8): the single accent. It marks the primary action
  (Print / Save as PDF), the open section's name and chevron, the completed-state
  chip, keyboard focus, and the active mobile tab. It is never decorative.

### Neutral

- **Workbench Grey** (#f1f2f4): the page ground behind the panels and around the
  sheet. Everything the app is not sits on this.
- **Sheet White** (#ffffff): every panel, the top bar, inputs, and the A4 sheet
  itself. The sheet gets a shadow; panels do not.
- **Ink** (#14181f): all primary text, and the values a user typed.
- **Muted Ink** (#6b7280): field labels, secondary state, hints, footer, and the
  collapsed row's chip when it is empty or partial.
- **Hairline** (#e3e5e8): every border in the app. 1px, never thicker, never coloured.
- **Accent Wash** (#eef3ff): the completed chip's background only.
- **Entry Tint** (#fcfcfd): the slightly-off-white fill of an entry card nested
  inside a section, so the nesting reads without a second border weight.

### Tertiary

- **Instruction Amber** (#fffbeb ground, #fde68a border, #78350f ink): the print
  settings block inside the print dialog, and only that. It is the one warm
  surface in the product, earned by being the one block that gives instructions
  rather than taking input.
- **Footer Ink** (#5f6673): the footer's text and links, one step darker than
  Muted Ink so 12.8px copy on the grey ground clears the 4.5:1 body floor.
- **Danger Red** (#b42318): destructive text only — Reset. Never a fill.

### Named Rules

**The One Accent Rule.** Workbench Blue marks live or actionable state. If
something is blue, it is either the primary action, the section you are in, or
state you just completed. Nothing is blue for decoration.

**The Sheet Shadow Rule.** Exactly one element in the product casts a shadow:
the A4 sheet (`0 6px 24px rgba(0, 0, 0, 0.12)`). Panels and cards are flat and
separated by hairlines. A shadow on a panel means the panel is pretending to be
paper.

## Typography

**Display Font:** none — the app has no display voice.
**Body Font:** system-ui stack (with -apple-system, Segoe UI, Roboto, Helvetica, Arial)
**Document Font:** 'CMU Serif' (with Latin Modern Roman, Georgia, Times New Roman), vendored in `assets/fonts/`

**Character:** The chrome is the platform's own voice, unornamented, at 14px —
it should read as "browser UI", not as a brand. The document is the opposite: a
classical serif in small caps, the voice of a printed CV. The contrast between
them is what tells the user which pane is the tool and which pane is the output.

### Hierarchy

- **Body** (400, 14px/1.5): every label, hint, button and input in the app.
- **Title** (600, 15px/1.5): section names in the form index and block titles.
- **Label** (400, 12px/1.5): field labels above inputs, muted.
- **Chip** (500, 12.8px/1.5): the section fill state; one step up in weight so it
  reads at a glance without matching the row name.
- **Brand mark** (Georgia serif, 21.6px): the "CV" glyph in the top bar — the one
  serif moment in the chrome, pointing at the document.
- **Document** (400, 10pt/1.25): the CV body; name at 26pt small caps, section
  heads at 12pt small caps with a 1px black rule under them.

### Named Rules

**The Two Voices Rule.** The app is set in system-ui and the CV is set in CMU
Serif. Never introduce a serif into the chrome (the brand mark's Georgia is the
single sanctioned exception) and never set the document in a UI face.

## Layout

A two-pane workbench on one screen: the form column at `minmax(320px, 40%)` and
the preview filling the rest, separated by a 16px gutter on a 16px page pad. The
form column is sticky and scrolls independently (`calc(100vh - 6rem)`); the
preview's sheet sits in its own scroll region. Neither pane scrolls the page.

The form column is a vertical stack of section rows with a 12px rhythm: one row
per section, 44px tall, each carrying the section name and its fill state. One
row is open at a time and its body holds the fields; the closed rows are an
index of the CV. Below the index, always open and always last, sits the "Your
file" card with Export, Import and Reset.

At 980px the panes stack and the app switches to fixed bottom tabs (Edit /
Preview), with only one pane visible; the sheet stops being height-constrained.
At 520px the contact-row grid collapses from four columns to one.

## Elevation & Depth

The system is flat, with one deliberate exception. Panels, section rows, entry
cards and inputs are all flat fills separated by 1px hairlines; there is no
ambient shadow, no blur and no glass anywhere. Depth is carried tonally instead:
white panels on the grey ground, and `#fcfcfd` for cards nested one level
deeper. The single shadow in the product belongs to the A4 sheet, because the
sheet is a physical object lying on the workbench and everything else is not.

### Shadow Vocabulary

- **The sheet** (`box-shadow: 0 6px 24px rgba(0, 0, 0, 0.12)`): the A4 page in the
  preview, and nothing else. Offset and soft, so it reads as paper on a surface.

### Named Rules

**The Flat-By-Default Rule.** A surface is flat unless it is literally paper. If
a new panel needs to look raised, the fix is a hairline or a tonal step, not a
shadow.

### Motion

Motion explains state; it never decorates. Four moves, all under 200ms:

- **Dialog arrival** (180ms, `cubic-bezier(0.16, 1, 0.3, 1)`): a 6px rise and
  0.985 scale with a matching scrim fade. It is the one authored moment, because
  the dialog is the one thing that interrupts the workbench.
- **Section body** (140ms fade): the open row's fields appear without moving, so
  a half-typed word never shifts under the cursor.
- **Chevron** (120ms rotate): already in place from the accordion.
- **Control feedback** (90–120ms): border, fill and colour on buttons and footer
  links, plus a 1px press on `:active`.

`prefers-reduced-motion: reduce` removes the dialog and body animations, all
transitions and the press offset; colour and state changes remain.

## Shapes

Soft and small. Panels and section rows take a 10px radius, buttons and entry
cards 8px, inputs and selects 7px, small icon buttons 6px, the dialog 12px, and
state chips are fully rounded pills. Borders are always exactly 1px and always
Hairline; there are no 2px borders, no left-edge accent stripes, and no clipped
or angled silhouettes anywhere. The only filled-tone shapes are the pill chip
and the solid primary button.

## Components

### Buttons

- **Shape:** softly rounded rectangle (8px), 1px Hairline border.
- **Primary:** Workbench Blue fill, white text, used once per screen on Print /
  Save as PDF. It is the only filled button in the app.
- **Hover / Focus:** default buttons darken their border to `#c9cdd4`; the
  primary holds its fill. Keyboard focus is a 2px Workbench Blue outline, inset
  on the full-width section row.
- **Secondary / Ghost:** the same button with no fill, used for the quiet actions
  (Focus, Export, Import, Got it) and for the row-level `+ Add …` actions.

### Chips

- **Style:** pill (99px radius), 12.8px at weight 500. Completed: Workbench Blue
  text on Accent Wash, with a 13px check glyph. Partial: muted text, no fill
  ("9 of 10 filled"). Empty: muted text, "Empty". Hidden: muted text, "Hidden".
- **State:** the chip is part of the row's own toggle button, so clicking
  anywhere on the row — including the chip — opens or closes the section. It is
  a state readout, never a filter or an action of its own.

### Cards / Containers

- **Corner Style:** 10px for a section row, 8px for an entry card nested inside it.
- **Background:** Sheet White for panels and rows; Entry Tint (#fcfcfd) for entry
  cards; Workbench Grey for the preview's scroll trough.
- **Shadow Strategy:** none — see Elevation & Depth.
- **Border:** 1px Hairline on every card and row.
- **Internal Padding:** 12–14px inside a row's head, 12–14px in a section body,
  9px inside an entry card.

### Inputs / Fields

- **Style:** 1px Hairline border, 7px radius, white fill, inherited 14px type,
  6px × 7px padding. Labels sit above the control at 12px muted, not inside it.
- **Focus:** the browser's own focus ring is left intact; the preview highlights
  the matching word in the sheet instead (`#fff4c2`), so the connection between
  field and document is visible while typing.
- **Error / Disabled:** errors are reported in the status line in Danger Red,
  never by recolouring the field. A hidden section is not disabled — it keeps its
  fields editable and says "Hidden" in its chip.

### Navigation

- **Top bar:** sticky, white, 1px Hairline bottom border. Brand at the left in
  600-weight system-ui with the serif "CV" mark; quiet text buttons at the right
  (How it works, GitHub) at Muted Ink, darkening to Ink on hover with a Workbench
  Grey fill.
- **Mobile:** fixed bottom tab bar at 980px and below, two equal tabs, the
  selected one in Ink with a 2px Workbench Blue inset top rule. The footer's
  bottom padding grows to 4.4rem so its links never sit under the fixed bar.

### Print dialog

The print flow's first step, and the only modal the workbench opens on its own.
"Print / Save as PDF" opens it; it carries the five settings the PDF needs in an
Instruction Amber block, a "Don't show this again" checkbox, Cancel, and the
primary "Continue to print". Continue closes the dialog and hands off to the
browser's print dialog. Once the checkbox is set, the button skips straight to
printing and the footer's **Print settings** control re-opens the dialog. It is
the one place a second filled button appears, because it is the flow's primary
action, not a second action on the same screen.

### Footer

One row on Sheet White above a Hairline: the local-storage note at the left, and
at the right a quiet link group — Print settings, MIT License, Add a template.
Text and links are Footer Ink with a Hairline underline that darkens with them on
hover; links carry a 2px Workbench Blue focus ring.

### Section Row (signature)

The component the editor is built around: a 44px full-width button carrying a
13px chevron (rotated 90° when open, in Workbench Blue), the section name at 600
weight, and its state chip pinned to the right edge. Closed rows are the index
of the CV; the open row's name and chevron turn Workbench Blue and a hairline
appears under the head. Opening is instant and in place — the row toggles
`hidden` and `aria-expanded` on existing nodes rather than rebuilding the form,
so focus, scroll position and a half-typed word survive.

## Do's and Don'ts

### Do:

- **Do** keep exactly one shadow in the product: the A4 sheet's.
- **Do** separate every surface with a 1px Hairline rather than a shadow or a
  heavier border.
- **Do** use Workbench Blue only for live state, the primary action, and
  completion — and keep it under roughly a tenth of any screen.
- **Do** keep the app in system-ui and the CV in CMU Serif, with no crossover.
- **Do** make state readable at rest: a fill chip on every section row, a page
  count beside the toolbar.
- **Do** preserve the browser's native affordances — real buttons, selects,
  checkboxes, focus rings and a `<dialog>` — restyled, never replaced.
- **Do** keep the section row at 44px so the index stays scannable and tappable.

### Don't:

- **Don't** add a second accent colour, a gradient, or gradient text.
- **Don't** put a shadow, blur or glass effect on a panel or card.
- **Don't** add a coloured left or right border stripe to a card, row or callout.
- **Don't** add a kicker or eyebrow label above a heading; the heading carries itself.
- **Don't** rebuild the form to change which section is open — toggle the
  existing nodes in place.
- **Don't** restyle or extend the Classic template to match the app chrome; the
  document is the product and its typography is not the app's to reshape.
- **Don't** introduce a build step, a bundler or an npm dependency to add a
  visual feature.
