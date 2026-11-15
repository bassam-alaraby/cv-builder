import test from 'node:test';
import assert from 'node:assert/strict';

import { getPath, setPath } from '../app/paths.js';

const document = {
  profile: {
    name: 'First Last',
    contacts: { rows: [{ items: [{ type: 'email', value: 'a@b.com' }] }] },
  },
  sections: {
    education: {
      heading: 'Education',
      entries: [{ institution: 'University Name' }],
    },
    custom: [{ heading: 'Awards', entries: [{ title: 'Award' }] }],
  },
};

test('getPath walks objects and arrays', () => {
  assert.equal(getPath(document, 'profile.name'), 'First Last');
  assert.equal(getPath(document, 'profile.contacts.rows[0].items[0].value'), 'a@b.com');
  assert.equal(getPath(document, 'sections.education.entries[0].institution'), 'University Name');
  assert.equal(getPath(document, 'sections.custom[0].entries[0].title'), 'Award');
});

test('getPath returns undefined for a path that does not exist', () => {
  assert.equal(getPath(document, 'sections.projects.entries[0].name'), undefined);
});

test('setPath writes through the same paths', () => {
  const target = structuredClone(document);
  setPath(target, 'profile.name', 'Second Person');
  setPath(target, 'profile.contacts.rows[0].items[0].value', 'x@y.com');
  setPath(target, 'sections.custom[0].entries[0].title', 'Prize');
  setPath(target, 'sections.education.entries[1].institution', 'Second University');

  assert.equal(getPath(target, 'profile.name'), 'Second Person');
  assert.equal(getPath(target, 'profile.contacts.rows[0].items[0].value'), 'x@y.com');
  assert.equal(getPath(target, 'sections.custom[0].entries[0].title'), 'Prize');
  assert.equal(getPath(target, 'sections.education.entries[1].institution'), 'Second University');
});
