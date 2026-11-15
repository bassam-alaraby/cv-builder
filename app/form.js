// The editor form. It is generated from the schema, so a new field is one line
// in schema.js and it shows up here, in the sample and in the import check.

import { CONTACT_TYPES, sectionDef } from './schema.js';
import { sectionList } from './model.js';

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

function button(label, action, attrs = {}) {
  return h('button', { type: 'button', class: 'mini', 'data-action': action, ...attrs }, label);
}

function fieldControl(path, field, value, autofocus) {
  if (field.type === 'textarea' || field.type === 'lines') {
    const area = h('textarea', {
      rows: field.type === 'lines' ? 4 : 5,
      'data-field': path,
      ...(autofocus ? { 'data-autofocus': 'true' } : {}),
    });
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
      ...(autofocus ? { 'data-autofocus': 'true' } : {}),
    });
    end.value = value?.end ?? '';
    return h(
      'label',
      { class: 'fld' },
      h('span', { class: 'fld-label', text: field.label }),
      h('div', { class: 'dates' }, start, h('span', { class: 'dash', text: '–' }), end),
    );
  }
  const input = h('input', {
    type: 'text',
    'data-field': path,
    ...(autofocus ? { 'data-autofocus': 'true' } : {}),
  });
  input.value = value ?? '';
  return h('label', { class: 'fld' }, h('span', { class: 'fld-label', text: field.label }), input);
}

function contactItem(doc, rowIndex, itemIndex, item) {
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

function contactRow(doc, rowIndex, row) {
  return h(
    'div',
    { class: 'crow' },
    h(
      'div',
      { class: 'crow-head' },
      h('span', { class: 'crow-title', text: `Row ${rowIndex + 1}` }),
      button('Remove row', 'row-remove', { 'data-row': rowIndex }),
    ),
    ...row.items.map((item, itemIndex) => contactItem(doc, rowIndex, itemIndex, item)),
    button('+ Add item', 'item-add', { 'data-row': rowIndex }),
  );
}

function profileBlock(doc) {
  const name = h('input', { type: 'text', 'data-field': 'profile.name', placeholder: 'First Last' });
  name.value = doc.profile.name ?? '';
  const headline = h('input', { type: 'text', 'data-field': 'profile.headline', placeholder: 'e.g. Computer Science Student' });
  headline.value = doc.profile.headline ?? '';
  return h(
    'div',
    { class: 'block' },
    h('h2', { class: 'block-title', text: 'Your details' }),
    h('label', { class: 'fld' }, h('span', { class: 'fld-label', text: 'Full name' }), name),
    h('label', { class: 'fld' }, h('span', { class: 'fld-label', text: 'Headline' }), headline),
    h('h3', { class: 'block-sub', text: 'Contact rows' }),
    ...doc.profile.contacts.rows.map((row, rowIndex) => contactRow(doc, rowIndex, row)),
    button('+ Add contact row', 'row-add'),
  );
}

function entryBlock(key, type, index, entry, autofocus) {
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
    ...def.fields.map((field) => fieldControl(`${path}.${field.key}`, field, entry[field.key], autofocus && field === def.fields[0])),
  );
}

function sectionBlock(key, type, section) {
  const def = sectionDef(type);
  const heading = h('input', { class: 'sec-name', type: 'text', 'data-field': `sections.${key}.heading` });
  heading.value = section.heading ?? def.heading;
  const visible = h('input', { type: 'checkbox', 'data-visible': key });
  visible.checked = section.visible !== false;

  const body = [];
  if (def.shape === 'text') {
    body.push(fieldControl(`sections.${key}.body`, def.fields[0], section.body));
  } else {
    body.push(...section.entries.map((entry, index) => entryBlock(key, type, index, entry)));
    body.push(button(`+ Add ${def.heading.toLowerCase()}`, 'entry-add', { 'data-section': key }));
  }

  const custom = /^custom\[(\d+)\]$/.exec(key);
  if (custom) {
    body.push(button('Remove this section', 'custom-remove', { 'data-index': custom[1] }));
  }

  return h(
    'section',
    { class: 'block' },
    h(
      'div',
      { class: 'block-head' },
      heading,
      h('label', { class: 'toggle' }, visible, h('span', { text: 'Show in CV' })),
    ),
    ...body,
  );
}

export function buildForm(root, doc) {
  const blocks = [profileBlock(doc)];
  for (const { key, type, section } of sectionList(doc)) {
    blocks.push(sectionBlock(key, type, section));
  }
  blocks.push(
    h(
      'div',
      { class: 'block' },
      h('h2', { class: 'block-title', text: 'Other sections' }),
      h('p', { class: 'hint', text: 'Awards, publications, references — anything the standard sections do not cover.' }),
      button('+ Add custom section', 'custom-add'),
    ),
  );
  root.replaceChildren(...blocks);
}

export function focusAutofocus(root) {
  const target = root.querySelector('[data-autofocus]');
  if (target) {
    target.focus();
    target.scrollIntoView({ block: 'center' });
  }
}
