import test from 'node:test';
import assert from 'node:assert/strict';

import { focusModeFor } from '../app/layout.js';

test('focus mode survives on the desktop split layout', () => {
  assert.equal(focusModeFor(true, false), true);
  assert.equal(focusModeFor(false, false), false);
});

test('focus mode is cleared on the mobile tab layout', () => {
  assert.equal(focusModeFor(true, true), false);
  assert.equal(focusModeFor(false, true), false);
});
