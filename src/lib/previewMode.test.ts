import assert from 'node:assert/strict';
import { test } from 'node:test';
import { isPreviewMode } from './previewMode.ts';

test('this preview copy stays in static preview mode without environment setup', () => {
  assert.equal(isPreviewMode, true);
});
