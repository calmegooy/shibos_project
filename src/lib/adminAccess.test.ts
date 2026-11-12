import assert from 'node:assert/strict';
import { test } from 'node:test';
import { resolveAdminAccess } from './adminAccess.ts';

test('admin access remains pending until the Supabase session check completes', () => {
  assert.deepEqual(resolveAdminAccess(true, null, false), { status: 'loading' });
});

test('no Supabase session requires the login route', () => {
  assert.deepEqual(resolveAdminAccess(false, null, false), { status: 'unauthenticated', redirect: '/admin/login' });
});

test('authenticated session without an admin authorization row is denied', () => {
  assert.deepEqual(resolveAdminAccess(false, 'user-1', false), { status: 'denied' });
});

test('authorized admin session may access the dashboard', () => {
  assert.deepEqual(resolveAdminAccess(false, 'user-1', true), { status: 'authorized' });
});
