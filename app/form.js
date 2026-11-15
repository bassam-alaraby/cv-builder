// The editor form. It is generated from the schema, so a new field is one line
// in schema.js and it shows up here, in the sample and in the import check.
//
// The form is an index of the CV rather than a wall of fields: one row per
// section, each carrying its own fill state, one section open at a time.

import { CONTACT_TYPES, sectionDef } from './schema.js';
import { sectionList } from './model.js';
import { icon } from './icons.js';

export function h(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (value === null || value === undefined || value === false) continue;
    if (key === 'class') node.className = value;
    else if (key === 'text') node.textContent = value;
    else if (key === 'value') node.value = value;
    else if (key.startsWith('on')) node.addEventListener(key.slice(2).toLowerCase(), value);
    else node.setAttribute(key, value === true ? '' : value);
  }
  for (const child of children.flat()) {
    if (child === null || child === undefined || child === false) continue;
    node.append(child.nodeType ? child : document.createTextNode(String(child)));
  }
  return node;
}

const CONTACT_LABELS = {
  phone: 'Phone',
  email: 'Email',
  website: 'Website',
  github: 'GitHub',
  linkedin: 'LinkedIn',
  location: 'Location',
  x: 'X',
  other: 'Other link',
};

const PROFILE_KEY = 'profile';

function button(label, action, attrs = {}) {
  return h('button', { type: 'button', class: 'mini', 'data-action': action, ...attrs }, label);
}

function iconNode(name) {
  const holder = document.createElement('span');
  holder.innerHTML = icon(name);
  return holder.firstElementChild;
}

// "profile", "education", "custom[0]" -> a DOM-id safe slug.
function slug(key) {
  return key.replace(/[^a-z0-9]+/gi, '-');
}

// A field counts as filled when it holds something. A date range is filled by
// its start: a blank end means "ongoing", which is a finished date, not a gap.
function filled(value) {
  if (value === null || value === undefined) return false;
  if (typeof value === 'object') return String(value.start ?? '').trim() !== '';
  return String(value).trim() !== '';
}

function profileState(doc) {
  let total = 2;
  let done = Number(filled(doc.profile.name)) + Number(filled(doc.profile.headline));
  for (const row of doc.profile.contacts.rows) {
    for (const item of row.items) {
      total += 1;
      if (filled(item.value)) done += 1;
    }
  }
  return { total, done };
}

function sectionState(type, section) {
  const def = sectionDef(type);
  if (def.shape === 'text') {
    return { total: 1, done: Number(filled(section.body)) };
  }
  let total = 0;
  let done = 0;
  for (const entry of section.entries) {
    for (const field of def.fields) {
      total += 1;
      if (filled(entry[field.key])) done += 1;
    }
  }
  return { total, done };
}

// The state of every row, in the order the rows are drawn.
export function stateOf(doc) {
  const rows = new Map();
  rows.set(PROFILE_KEY, { key: PROFILE_KEY, state: profileState(doc), hidden: false });
  for (const { key, type, section } of sectionList(doc)) {
    rows.set(key, { key, state: sectionState(type, section), hidden: section.visible === false });
  }
  return rows;
}

// The chip says what is there, never what is wrong: a section that is missing
// an optional field is partly filled, not wrong.
function chip(key, state, hidden) {
  const node = h('span', { class: 'state', 'data-chip': key });
  if (hidden) {
    node.classList.add('is-hidden');
    node.textContent = 'Hidden';
  } else if (state.total === 0 || state.done === 0) {
    node.classList.add('is-empty');
    node.textContent = 'Empty';
  } else if (state.done === state.total) {
    node.classList.add('is-complete');
    node.append(iconNode('check'));
    node.append(h('span', { text: 'Complete' }));
  } else {
    node.classList.add('is-partial');
    node.textContent = `${state.done} of ${state.total} filled`;
  }
  return node;
}

function fieldControl(path, field, value) {
  if (field.type === 'textarea' || field.type === 'lines') {
    const area = h('textarea', { rows: field.type === 'lines' ? 4 : 5, 'data-field': path });
    area.value = value ?? '';
    return h('label', { class: 'fld' }, h('span', { class: 'fld-label', text: field.label }), area);
  }
  if (field.type === 'daterange') {
    const start = h('input', { type: 'text', 'data-field': `${path}.start`, placeholder: 'e.g. 2024' });
    start.value = value?.start ?? '';
    const end = h('input', {
      type: 'text',
      'data-field': `${path}.end`,
      placeholder: 'blank = ongoing',
    });
    end.value = value?.end ?? '';
    return h(
      'label',
      { class: 'fld' },
      h('span', { class: 'fld-label', text: field.label }),
      h('div', { class: 'dates' }, start, h('span', { class: 'dash', text: '–' }), end),
    );
  }
  const input = h('input', { type: 'text', 'data-field': path });
  input.value = value ?? '';
  return h('label', { class: 'fld' }, h('span', { class: 'fld-label', text: field.label }), input);
}

function contactItem(rowIndex, itemIndex, item) {
  const base = `profile.contacts.rows[${rowIndex}].items[${itemIndex}]`;
  const select = h('select', { 'data-field': `${base}.type` });
  for (const type of CONTACT_TYPES) {
    const option = h('option', { value: type, text: CONTACT_LABELS[type] });
    if (item.type === type) option.selected = true;
    select.append(option);
  }
  const value = h('input', { type: 'text', 'data-field': `${base}.value`, placeholder: 'value' });
  value.value = item.value ?? '';
  const url = h('input', { type: 'text', 'data-field': `${base}.url`, placeholder: 'link (optional)' });
  url.value = item.url ?? '';
  return h(
    'div',
    { class: 'citem' },
    select,
    value,
    url,
    h(
      'span',
      { class: 'citem-actions' },
      button('↑', 'item-up', { 'data-row': rowIndex, 'data-index': itemIndex, title: 'Move up' }),
      button('↓', 'item-down', { 'data-row': rowIndex, 'data-index': itemIndex, title: 'Move down' }),
      button('→', 'item-row', { 'data-row': rowIndex, 'data-index': itemIndex, title: 'Move to next row' }),
      button('✕', 'item-remove', { 'data-row': rowIndex, 'data-index': itemIndex, title: 'Remove' }),
    ),
  );
}

function contactRow(rowIndex, row) {
  return h(
    'div',
    { class: 'crow' },
    h(
      'div',
      { class: 'crow-head' },
      h('span', { class: 'crow-title', text: `Row ${rowIndex + 1}` }),
      button('Remove row', 'row-remove', { 'data-row': rowIndex }),
    ),
    ...row.items.map((item, itemIndex) => contactItem(rowIndex, itemIndex, item)),
    button('+ Add item', 'item-add', { 'data-row': rowIndex }),
  );
}

function profileBody(doc) {
  const name = h('input', { type: 'text', 'data-field': 'profile.name', placeholder: 'First Last' });
  name.value = doc.profile.name ?? '';
  const headline = h('input', {
    type: 'text',
    'data-field': 'profile.headline',
    placeholder: 'e.g. Computer Science Student',
  });
  headline.value = doc.profile.headline ?? '';
  return [
    h(
      'label',
      { class: 'fld' },
      h('span', { class: 'fld-label', text: 'Full name' }),
      name,
    ),
    h(
      'label',
      { class: 'fld' },
      h('span', { class: 'fld-label', text: 'Headline' }),
      headline,
    ),
    h('h3', { class: 'block-sub', text: 'Contact rows' }),
    ...doc.profile.contacts.rows.map((row, rowIndex) => contactRow(rowIndex, row)),
    button('+ Add contact row', 'row-add'),
  ];
}

function entryBlock(key, type, index, entry) {
  const def = sectionDef(type);
  const path = `sections.${key}.entries[${index}]`;
  return h(
    'div',
    { class: 'entry' },
    h(
      'div',
      { class: 'entry-head' },
      h('span', { class: 'entry-title', text: `Entry ${index + 1}` }),
      button('↑', 'entry-up', { 'data-section': key, 'data-index': index, title: 'Move up' }),
      button('↓', 'entry-down', { 'data-section': key, 'data-index': index, title: 'Move down' }),
      button('Remove', 'entry-remove', { 'data-section': key, 'data-index': index }),
    ),
    ...def.fields.map((field) => fieldControl(`${path}.${field.key}`, field, entry[field.key])),
  );
}

// The section's own name and its switch in the CV live in the body: a closed
// row shows the name as text.
function sectionMeta(key, section, def) {
  const heading = h('input', { class: 'sec-heading', type: 'text', 'data-field': `sections.${key}.heading` });
  heading.value = section.heading ?? def.heading;
  const visible = h('input', { type: 'checkbox', 'data-visible': key });
  visible.checked = section.visible !== false;
  return h(
    'div',
    { class: 'sec-meta' },
    h(
      'label',
      { class: 'fld' },
      h('span', { class: 'fld-label', text: 'Section name' }),
      heading,
    ),
    h('label', { class: 'toggle' }, visible, h('span', { text: 'Show in CV' })),
  );
}

function sectionBody(key, type, section) {
  const def = sectionDef(type);
  const body = [sectionMeta(key, section, def)];
  if (def.shape === 'text') {
    body.push(fieldControl(`sections.${key}.body`, def.fields[0], section.body));
  } else {
    body.push(...section.entries.map((entry, index) => entryBlock(key, type, index, entry)));
    body.push(button(`+ Add ${def.heading.toLowerCase()}`, 'entry-add', { 'data-section': key }));
  }
  if (/^custom\[\d+\]$/.test(key)) {
    body.push(button('Remove this section', 'custom-remove', { 'data-index': /custom\[(\d+)\]/.exec(key)[1] }));
  }
  return body;
}

function sectionCard(key, title, state, hidden, open, bodyNodes) {
  return h(
    'section',
    { class: `sec${open ? ' is-open' : ''}`, 'data-sec': key },
    h(
      'div',
      { class: 'sec-head' },
      h(
        'button',
        {
          type: 'button',
          class: 'sec-toggle',
          'data-action': 'sec-toggle',
          'data-sec': key,
          'aria-expanded': String(open),
          'aria-controls': `sec-body-${slug(key)}`,
        },
        h('span', { class: 'chev', 'aria-hidden': 'true' }, iconNode('chevron')),
        h('span', { class: 'sec-name', text: title }),
        chip(key, state, hidden),
      ),
    ),
    h('div', { class: 'sec-body', id: `sec-body-${slug(key)}`, hidden: !open }, ...bodyNodes),
  );
}

// Opens one row and closes the rest, in place: rebuilding the form would take
// the visitor's focus, scroll position and half typed word with it.
export function openRow(root, key) {
  for (const row of root.querySelectorAll('.sec')) {
    const open = key !== null && row.dataset.sec === key;
    row.classList.toggle('is-open', open);
    const body = row.querySelector('.sec-body');
    if (body) body.hidden = !open;
    const toggle = row.querySelector('.sec-toggle');
    if (toggle) toggle.setAttribute('aria-expanded', String(open));
  }
}

export function buildForm(root, doc, openKey = PROFILE_KEY) {
  const rows = stateOf(doc);
  const blocks = [];

  const profile = rows.get(PROFILE_KEY);
  blocks.push(
    sectionCard(PROFILE_KEY, 'Your details', profile.state, false, openKey === PROFILE_KEY, profileBody(doc)),
  );

  for (const { key, type, section } of sectionList(doc)) {
    const row = rows.get(key);
    blocks.push(
      sectionCard(
        key,
        section.heading || sectionDef(type).heading,
        row.state,
        row.hidden,
        openKey === key,
        sectionBody(key, type, section),
      ),
    );
  }

  blocks.push(
    h(
      'div',
      { class: 'custom-add' },
      button('+ Add custom section', 'custom-add'),
      h('p', {
        class: 'hint',
        text: 'Awards, publications, references — anything the standard sections do not cover.',
      }),
    ),
  );

  root.replaceChildren(...blocks);
}

// The rows follow the document as it is typed, without rebuilding the form:
// the title of a renamed section and the chip of a filled one both update.
export function updateRows(root, doc) {
  for (const [key, { state, hidden }] of stateOf(doc)) {
    const row = root.querySelector(`[data-sec="${CSS.escape(key)}"]`);
    if (!row) continue;
    const node = row.querySelector('.state');
    if (node) node.replaceWith(chip(key, state, hidden));
  }
  for (const { key, type, section } of sectionList(doc)) {
    const title = root.querySelector(`[data-sec="${CSS.escape(key)}"] .sec-name`);
    if (title) title.textContent = section.heading || sectionDef(type).heading;
  }
}

// Which row a field belongs to, so clicking a word in the preview can open it.
export function sectionKeyForPath(path) {
  if (path.startsWith('profile')) return PROFILE_KEY;
  const match = /^sections\.([^.[\]]+(?:\[\d+\])?)/.exec(path);
  return match ? match[1] : null;
}

// The path of the first field of a new entry, so "Add" can put the cursor in it.
export function firstEntryFieldPath(sectionKey, index) {
  const type = /^custom\[\d+\]$/.test(sectionKey) ? 'custom' : sectionKey;
  const field = sectionDef(type).fields[0];
  return field ? `sections.${sectionKey}.entries[${index}].${field.key}` : null;
}
