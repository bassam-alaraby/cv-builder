import test from 'node:test';
import assert from 'node:assert/strict';

import { firstEntryFieldPath, sectionKeyForPath, stateOf } from '../app/form.js';
import { sample } from '../templates/classic/sample.js';

test('every row of the form knows what it holds', () => {
  const rows = stateOf(sample);

  assert.equal(rows.get('profile').state.done, rows.get('profile').state.total);
  assert.equal(rows.get('summary').state.done, 1);
  assert.equal(rows.get('education').state.done, 4);
  assert.equal(rows.get('experience').state.done, 5);
  assert.equal(rows.get('courses').state.done, 4);
});

test('an open ended date counts as filled', () => {
  const rows = stateOf(sample);
  // Education ends with a blank end date, which means "ongoing".
  assert.equal(rows.get('education').state.done, rows.get('education').state.total);
});

test('a blank field is counted, not judged', () => {
  const rows = stateOf(sample);
  // The second project has no URL.
  assert.equal(rows.get('projects').state.total, 10);
  assert.equal(rows.get('projects').state.done, 9);
});

test('a section that is hidden says so', () => {
  const doc = structuredClone(sample);
  doc.sections.skills.visible = false;
  assert.equal(stateOf(doc).get('skills').hidden, true);
});

test('a field path names the row that owns it', () => {
  assert.equal(sectionKeyForPath('profile.name'), 'profile');
  assert.equal(sectionKeyForPath('sections.education.entries[0].institution'), 'education');
  assert.equal(sectionKeyForPath('sections.custom[0].bullets'), 'custom[0]');
});

test('a new entry puts the cursor in its first field', () => {
  assert.equal(firstEntryFieldPath('experience', 0), 'sections.experience.entries[0].role');
  assert.equal(firstEntryFieldPath('custom[0]', 2), 'sections.custom[0].entries[2].title');
});
