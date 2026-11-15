# CV Builder

The language of CV Builder: what the parts of a CV are called here, and what
each one means. The code and the docs use these words.

## Language

**Document**:
The single CV a person creates and edits. It holds their content and never
their presentation.
_Avoid_: Resume, CV file, entry

**Profile**:
The identity block at the top of a Document: a name, a headline, and the
contact area.
_Avoid_: Header, personal details

**Contact Row**:
One line of the contact area. A person decides how many rows there are and how
many items sit in each.
_Avoid_: Contact line, row of contacts

**Contact Item**:
One way to reach the person inside a Contact Row: a phone number, an email
address, a profile on a platform. It has a kind and a value, never a
hand-picked icon.
_Avoid_: Link, social, contact field

**Section**:
A titled group of Entries in a Document, such as Education or Projects. A
Section can be hidden when the person does not need it.
_Avoid_: Category, group, block

**Section Heading**:
The words that name a Section. The person may rename it freely; the Template
only styles it.
_Avoid_: Section title, header

**Entry**:
One item inside a Section: a degree, a job, a project, a course. Entries of
one Section share a shape, which is what makes them interchangeable.
_Avoid_: Item, record

**Bullet**:
One line of plain text inside an Entry. It carries no formatting of its own.
_Avoid_: Point, list item, line

**Date Range**:
The span of time an Entry covers: a start and an optional end. An absent end
means the thing is ongoing.
_Avoid_: Dates, period, tenure

**Field**:
A single editable value belonging to the Document. Fields are the only things a
person edits.
_Avoid_: Input, property

**Field Path**:
The address of a Field inside the Document. It is how a Template says "this
piece of the preview shows that field", and how a click on the preview finds
the control that edits it.
_Avoid_: Binding, selector, reference

**Template**:
A presentation of the Document: markup and styling, no content. Two Templates
may show the same Document differently. A Template never changes the Document.
_Avoid_: Theme, skin, layout

**Template Contract**:
The written rules a Template must follow: the Document shape it receives, the
hooks its markup must provide, and the rules its styling must respect. It is
what makes a Template reproducible by someone who was not there.
_Avoid_: Guidelines, spec, API

**Sample**:
The placeholder Document a Template ships with — deliberately generic, no real
person's details. It is what a new visitor sees and what Reset returns to.
_Avoid_: Demo, default data, seed

**Preview**:
The live rendering of the Document in the chosen Template, shown beside the
editing controls. The Preview is what gets printed.
_Avoid_: Editor, canvas, output

**Page Estimate**:
An approximation of how many printed pages the Document needs, derived from the
Preview's height. The browser's print dialog is the source of truth.
_Avoid_: Page count, pagination
