import test from 'node:test';
import assert from 'node:assert/strict';

import { validateDocument } from '../app/schema.js';
import {
  moveContactItem,
  moveContactItemToNextRow,
  moveEntry,
  sectionList,
  toTemplateData,
} from '../app/model.js';
import { sample } from '../templates/classic/sample.js';

test('the shipped sample is a valid document', () => {
  const result = validateDocument(sample);
  assert.deepEqual(result.errors, []);
  assert.equal(result.ok, true);
});

test('the sample shows every section, all switched on', () => {
  const sections = toTemplateData(sample).sections;
  const types = sections.map((section) => section.type);
  assert.deepEqual(types, [
    'summary',
    'education',
    'experience',
    'projects',
    'skills',
    'courses',
    'languages',
  ]);
  assert.ok(sections.every((section) => section.visible !== false));
});

test('a broken file is rejected with a readable reason', () => {
  const result = validateDocument({ version: 9 });
  assert.equal(result.ok, false);
  assert.match(result.errors.join(' '), /version/i);
});

test('hidden sections are not handed to the template', () => {
  const doc = structuredClone(sample);
  doc.sections.experience.visible = false;
  const types = toTemplateData(doc).sections.map((section) => section.type);
  assert.ok(!types.includes('experience'));
});

test('entries move up and down inside their section', () => {
  const doc = structuredClone(sample);
  const before = doc.sections.projects.entries[0].name;
  moveEntry(doc, 'projects', 0, 1);
  assert.equal(doc.sections.projects.entries[1].name, before);
  moveEntry(doc, 'projects', 1, -1);
  assert.equal(doc.sections.projects.entries[0].name, before);
});

test('contact items move inside a row and across rows', () => {
  const doc = structuredClone(sample);
  const phone = doc.profile.contacts.rows[0].items[0].value;
  moveContactItem(doc, 0, 0, 1);
  assert.equal(doc.profile.contacts.rows[0].items[1].value, phone);
  assert.equal(doc.profile.contacts.rows[0].items[0].value, 'first.last@example.com');

  moveContactItemToNextRow(doc, 0, 0);
  assert.equal(doc.profile.contacts.rows[1].items.at(-1).value, 'first.last@example.com');
});

test('sections keep their canonical order', () => {
  const keys = sectionList(sample).map((section) => section.key);
  assert.deepEqual(keys, [
    'summary',
    'education',
    'experience',
    'projects',
    'skills',
    'courses',
    'languages',
  ]);
});
