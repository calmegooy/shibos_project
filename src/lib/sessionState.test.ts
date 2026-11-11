import assert from 'node:assert/strict';
import test from 'node:test';
import { clearSessionState, readSessionState, writeSessionState } from './sessionState.ts';

class MemoryStorage {
  private values = new Map<string, string>();
  failWrites = false;
  getItem(key: string) { return this.values.get(key) ?? null; }
  setItem(key: string, value: string) { if (this.failWrites) throw new Error('storage unavailable'); this.values.set(key, value); }
  removeItem(key: string) { this.values.delete(key); }
  setRaw(value: string) { this.values.set('shiboss:app-state', value); }
}

test('session state safely handles absent, malformed, and unsupported snapshots', () => {
  const storage = new MemoryStorage();
  assert.equal(readSessionState(storage), null);
  storage.setRaw('{bad json');
  assert.equal(readSessionState(storage), null);
  storage.setRaw(JSON.stringify({ version: 99, customer: { cartItems: [] } }));
  assert.equal(readSessionState(storage), null);
});

test('session state merges customer and admin updates independently', () => {
  const storage = new MemoryStorage();
  writeSessionState(storage, { customer: { tableNumber: '12' } });
  writeSessionState(storage, { admin: { currentScreen: 'orders' } });
  assert.deepEqual(readSessionState(storage), {
    version: 1,
    customer: { tableNumber: '12' },
    admin: { currentScreen: 'orders' },
  });
  clearSessionState(storage);
  assert.equal(readSessionState(storage), null);
});

test('session state storage failures do not break in-memory app workflows', () => {
  const storage = new MemoryStorage();
  storage.failWrites = true;
  assert.doesNotThrow(() => writeSessionState(storage, { customer: { tableNumber: '12' } }));
  assert.equal(readSessionState(storage), null);
});
