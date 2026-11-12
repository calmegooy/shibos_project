import assert from 'node:assert/strict';
import { test } from 'node:test';
import { getStaticCustomerMenu } from './staticMenu.ts';

test('static customer menu includes the featured products needed on the home page', () => {
  const menu = getStaticCustomerMenu();
  const ids = new Set(menu.map((item) => item.id));

  assert.ok(menu.length > 0);
  assert.ok(ids.has('susu-cokelat'));
  assert.ok(ids.has('susu-original'));
  assert.ok(ids.has('susu-strawberry'));
  assert.ok(menu.every((item) => item.image.length > 0));
});
