import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

const migrationPath = new URL('../supabase/migrations/202611120001_initial_ordering.sql', import.meta.url);
const migration = () => readFile(migrationPath, 'utf8');

test('migration creates constrained core tables and immutable order snapshots', async () => {
  const sql = await migration();
  for (const table of ['admin_users', 'menu_items', 'orders', 'order_items', 'payments']) {
    assert.match(sql, new RegExp(`create table if not exists public\\.${table}\\b`, 'i'), `${table} table`);
  }
  for (const column of ['is_customer_visible', 'item_name', 'unit_price', 'verified_by', 'verified_at']) {
    assert.match(sql, new RegExp(`\\b${column}\\b`, 'i'), `${column} column`);
  }
  assert.match(sql, /check\s*\(\s*price\s*>\s*0/i);
});

test('RLS separates public catalog reads from private orders and admin writes', async () => {
  const sql = await migration();
  for (const table of ['admin_users', 'menu_items', 'orders', 'order_items', 'payments']) {
    assert.match(sql, new RegExp(`alter table public\\.${table} enable row level security`, 'i'), `${table} RLS`);
  }
  assert.match(sql, /is_customer_visible\s+and\s+is_available/i);
  assert.match(sql, /is_admin\(\)/i);
  assert.match(sql, /create policy[^;]+on public\.orders[^;]+using\s*\(\s*public\.is_admin\(\)\s*\)/is);
  assert.match(sql, /revoke\s+all\s+on\s+public\.admin_users,\s*public\.menu_items,\s*public\.orders,\s*public\.order_items,\s*public\.payments\s+from\s+anon/i);
});

test('anonymous order RPC derives prices and snapshots catalog data server-side', async () => {
  const sql = await migration();
  assert.match(sql, /function public\.create_dine_in_order\s*\(/i);
  assert.match(sql, /security definer[\s\S]*set search_path\s*=\s*public/i);
  assert.match(sql, /select \* into v_menu from public\.menu_items[\s\S]*is_available and is_customer_visible/i);
  assert.match(sql, /v_menu\.price/i);
  assert.match(sql, /insert into public\.order_items[\s\S]*item_name[\s\S]*unit_price/i);
  assert.match(sql, /grant execute on function public\.create_dine_in_order/i);
});

test('transfer proofs use a private storage bucket with admin-only reads', async () => {
  const sql = await migration();
  assert.match(sql, /insert into storage\.buckets[\s\S]*'transfer-proofs'[\s\S]*false/i);
  assert.match(sql, /create policy[^;]+on storage\.objects[^;]+public\.is_admin\(\)/is);
});

test('customer order reads and proof submissions require the per-order access token', async () => {
  const sql = await migration();
  assert.match(sql, /customer_access_token_hash\s+text\s+not null/i);
  assert.match(sql, /function public\.get_customer_order\(p_order_id uuid, p_customer_access_token text\)/i);
  assert.match(sql, /function public\.submit_transfer_proof\(p_order_id uuid, p_customer_access_token text, p_object_path text\)/i);
  assert.match(sql, /v_existing\.customer_access_token_hash\s*<>\s*encode\(digest\(p_customer_access_token, 'sha256'\), 'hex'\)/i);
});

test('admin payment and order status updates are allowlist-checked security-definer RPCs', async () => {
  const sql = await migration();
  assert.match(sql, /function public\.admin_set_order_status[\s\S]*if not public\.is_admin\(\)/i);
  assert.match(sql, /function public\.admin_update_qris[\s\S]*if not public\.is_admin\(\)/i);
  assert.match(sql, /grant execute on function public\.admin_update_qris[\s\S]*to authenticated/i);
});

test('cash orders remain unpaid until an authorized cashier confirms receipt', async () => {
  const sql = await migration();
  assert.match(sql, /'menunggu_tunai'/i);
  assert.match(sql, /function public\.admin_mark_cash_paid[\s\S]*if not public\.is_admin\(\)/i);
  assert.match(sql, /p_payment_method\s*=\s*'cash'[\s\S]*'menunggu_tunai'/i);
});
