import test from 'node:test';
import assert from 'node:assert/strict';

import {
  contactText,
  deriveLink,
  formatRange,
  stripScheme,
  toLines,
} from '../app/helpers.js';

test('formatRange spells out an open ended range', () => {
  assert.equal(formatRange({ start: '2024', end: '' }), '2024 – Present');
  assert.equal(formatRange({ start: '2024', end: '2026' }), '2024 – 2026');
  assert.equal(formatRange({ start: '', end: '' }), '');
  assert.equal(formatRange({ start: '', end: '2026' }), '2026');
});

test('deriveLink builds the link for each contact type', () => {
  assert.equal(deriveLink('email', 'a@b.com'), 'mailto:a@b.com');
  assert.equal(deriveLink('phone', '+1 555 0100'), 'tel:+15550100');
  assert.equal(deriveLink('github', 'bassam'), 'https://github.com/bassam');
  assert.equal(deriveLink('linkedin', 'bassam'), 'https://linkedin.com/in/bassam');
  assert.equal(deriveLink('website', 'example.com'), 'https://example.com');
  assert.equal(deriveLink('location', 'City'), '');
});

test('an explicit url overrides the derived link', () => {
  assert.equal(deriveLink('website', 'x', 'https://other.com'), 'https://other.com');
  assert.equal(deriveLink('email', 'a@b.com', 'c@d.com'), 'mailto:c@d.com');
});

test('printed contact text never carries a scheme', () => {
  assert.equal(contactText('github', 'bassam'), 'github.com/bassam');
  assert.equal(contactText('github', 'github.com/bassam'), 'github.com/bassam');
  assert.equal(contactText('website', 'https://example.com'), 'example.com');
  assert.equal(contactText('email', 'a@b.com'), 'a@b.com');
  assert.equal(contactText('phone', '+1 555 0100'), '+1 555 0100');
});

test('stripScheme leaves plain text alone', () => {
  assert.equal(stripScheme('https://example.com'), 'example.com');
  assert.equal(stripScheme('http://example.com'), 'example.com');
  assert.equal(stripScheme('example.com'), 'example.com');
});

test('toLines keeps one bullet per line and drops the blanks', () => {
  assert.deepEqual(toLines('one\n\n two \n'), ['one', 'two']);
  assert.deepEqual(toLines(''), []);
});
