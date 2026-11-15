// Document mutations. Everything the user can do to the document is a function
// here, so the app never edits the shape by hand.

import {
  SECTION_ORDER,
  emptyContactItem,
  emptyEntry,
  emptySection,
  sectionDef,
} from './schema.js';
import { contactText, deriveLink } from './helpers.js';

export function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

// "education" or "custom[2]" -> { type, section }.
export function findSection(doc, key) {
  const match = /^custom\[(\d+)\]$/.exec(key);
  if (match) {
    const section = doc.sections.custom[Number(match[1])];
    return section ? { type: 'custom', section } : null;
  }
  const section = doc.sections[key];
  return section ? { type: key, section } : null;
}

// Every section of the document in canonical order.
export function sectionList(doc) {
  const list = SECTION_ORDER.map((type) => ({ key: type, type, section: doc.sections[type] }));
  (doc.sections.custom || []).forEach((section, i) => {
    list.push({ key: `custom[${i}]`, type: 'custom', section });
  });
  return list;
}

export function addEntry(doc, key) {
  const found = findSection(doc, key);
  if (!found) return -1;
  found.section.entries.push(emptyEntry(found.type));
  return found.section.entries.length - 1;
}

export function removeEntry(doc, key, index) {
  const found = findSection(doc, key);
  if (!found) return;
  found.section.entries.splice(index, 1);
}

export function moveEntry(doc, key, index, direction) {
  const found = findSection(doc, key);
  if (!found) return;
  const entries = found.section.entries;
  const target = index + direction;
  if (target < 0 || target >= entries.length) return;
  [entries[index], entries[target]] = [entries[target], entries[index]];
}

export function addCustomSection(doc) {
  doc.sections.custom.push(emptySection('custom'));
  return doc.sections.custom.length - 1;
}

export function removeCustomSection(doc, index) {
  doc.sections.custom.splice(index, 1);
}

export function addContactRow(doc) {
  doc.profile.contacts.rows.push({ items: [] });
  return doc.profile.contacts.rows.length - 1;
}

export function removeContactRow(doc, index) {
  doc.profile.contacts.rows.splice(index, 1);
}

export function addContactItem(doc, rowIndex) {
  const row = doc.profile.contacts.rows[rowIndex];
  if (!row) return;
  row.items.push(emptyContactItem());
}

export function removeContactItem(doc, rowIndex, itemIndex) {
  const row = doc.profile.contacts.rows[rowIndex];
  if (!row) return;
  row.items.splice(itemIndex, 1);
}

export function moveContactItem(doc, rowIndex, itemIndex, direction) {
  const row = doc.profile.contacts.rows[rowIndex];
  if (!row) return;
  const target = itemIndex + direction;
  if (target < 0 || target >= row.items.length) return;
  [row.items[itemIndex], row.items[target]] = [row.items[target], row.items[itemIndex]];
}

// Moves an item to the next row, wrapping around and creating a row if needed.
export function moveContactItemToNextRow(doc, rowIndex, itemIndex) {
  const rows = doc.profile.contacts.rows;
  const row = rows[rowIndex];
  if (!row) return;
  const item = row.items.splice(itemIndex, 1)[0];
  if (!item) return;
  const next = (rowIndex + 1) % rows.length;
  rows[next].items.push(item);
  if (row.items.length === 0 && rows.length > 1) rows.splice(rowIndex, 1);
}

// The document as the template sees it. Indices are never renumbered here, so
// the Field Paths a template builds stay in step with the form.
export function toTemplateData(doc) {
  const profile = {
    name: doc.profile.name,
    headline: doc.profile.headline,
    contacts: {
      rows: doc.profile.contacts.rows.map((row) => ({
        items: row.items.map((item) => ({
          type: item.type,
          text: contactText(item.type, item.value),
          link: deriveLink(item.type, item.value, item.url),
        })),
      })),
    },
  };

  const sections = [];
  for (const { key, type, section } of sectionList(doc)) {
    if (!section.visible) continue;
    const data = { key, type, heading: section.heading };
    if (sectionDef(type).shape === 'text') {
      data.body = section.body;
    } else {
      data.entries = section.entries.map((entry) => ({ ...entry }));
    }
    sections.push(data);
  }

  return { profile, sections };
}
