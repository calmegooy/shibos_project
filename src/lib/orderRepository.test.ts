import assert from 'node:assert/strict';
import { test } from 'node:test';
import { buildCreateOrderParams, createDineInOrder, mapCreatedOrder, markCashPaymentPaid, uploadCustomerProof, updateOrderStatus, updateQrisStatus } from './orderRepository.ts';
import type { SupabaseClient } from '@supabase/supabase-js';

const cartItem = {
  cartItemId: 'cart-1',
  item: { id: 'susu-original', name: 'Susu Original', category: 'minuman' as const, price: 10000, description: 'Susu', image: '' },
  quantity: 2,
  modifier: { temperature: 'Dingin' as const, sugar: 'Normal' as const, toppings: ['Oreo'] },
  notes: 'Kurangi es',
  unitPrice: 13000,
};

test('order RPC payload sends item identifiers and modifiers but never trusts client prices', () => {
  const params = buildCreateOrderParams({
    tableNumber: '08', customerName: 'Nia', kitchenNotes: 'Pisahkan sedotan', paymentMethod: 'qris',
    cartItems: [cartItem], requestId: 'req-1', accessToken: 'a'.repeat(64),
  });
  assert.equal(params.p_table_number, '08');
  assert.equal(params.p_items[0].menu_item_id, 'susu-original');
  assert.equal(params.p_items[0].quantity, 2);
  assert.deepEqual(params.p_items[0].modifier?.toppings, ['Oreo']);
  assert.equal('price' in params.p_items[0], false);
  assert.equal('unit_price' in params.p_items[0], false);
});

test('created order uses database order number, total, and item price snapshots', () => {
  const order = mapCreatedOrder({
    id: 'order-uuid', order_number: '#SB-2026-000001', subtotal: 26000, total: 26000,
    payment_status: 'menunggu_verifikasi',
    items: [{ menu_item_id: 'susu-original', item_name: 'Susu Segar Original', category: 'Special Susu', quantity: 2, unit_price: 13000, subtotal: 26000, modifier: { temperature: 'Dingin', sugar: 'Normal', toppings: ['Oreo'] }, notes: 'Kurangi es' }],
  }, { tableNumber: '08', customerName: 'Nia', kitchenNotes: 'Pisahkan sedotan', paymentMethod: 'qris', cartItems: [cartItem], accessToken: 'a'.repeat(64) });
  assert.equal(order.orderId, '#SB-2026-000001');
  assert.equal(order.databaseId, 'order-uuid');
  assert.equal(order.total, 26000);
  assert.equal(order.items[0].unitPrice, 13000);
  assert.equal(order.items[0].item.name, 'Susu Segar Original');
});

test('order RPC errors propagate so the caller cannot report a successful order', async () => {
  let calledWith: Record<string, unknown> | undefined;
  const client = {
    rpc: async (_name: string, params: Record<string, unknown>) => {
      calledWith = params;
      return { data: null, error: new Error('network failure after request') };
    },
  } as unknown as SupabaseClient;
  await assert.rejects(createDineInOrder(client, {
    tableNumber: '08', customerName: '', kitchenNotes: '', paymentMethod: 'qris',
    cartItems: [cartItem], requestId: '11111111-1111-4111-8111-111111111111', accessToken: 'a'.repeat(64),
  }), /network failure/);
  assert.equal(calledWith?.p_request_id, '11111111-1111-4111-8111-111111111111');
});

test('proof upload stores to a private order-scoped path then submits it through the token RPC', async () => {
  const calls: Array<{ name: string; args: unknown }> = [];
  const client = {
    storage: { from: (bucket: string) => ({ upload: async (path: string) => {
      calls.push({ name: 'upload', args: { bucket, path } });
      return { error: null };
    } }) },
    rpc: async (name: string, args: unknown) => {
      calls.push({ name, args });
      return { data: null, error: null };
    },
  } as unknown as SupabaseClient;
  const file = new File(['image'], 'proof.png', { type: 'image/png' });
  const path = await uploadCustomerProof(client, {
    orderId: '#SB-2026-000001', databaseId: '11111111-1111-4111-8111-111111111111',
    accessToken: 'b'.repeat(64), tableNumber: '08', items: [], subtotal: 1, tax: 0,
    discount: 0, total: 1, paymentMethod: 'qris', isPaid: false, status: 'menunggu', createdAt: '',
  }, file);
  assert.match(path, /^11111111-1111-4111-8111-111111111111\/[0-9a-f-]{36}\.png$/);
  assert.equal(calls[0].name, 'upload');
  assert.equal(calls[1].name, 'submit_transfer_proof');
  assert.equal((calls[1].args as { p_customer_access_token: string }).p_customer_access_token, 'b'.repeat(64));
});

test('proof upload failure does not call the proof-linking RPC', async () => {
  let rpcCalled = false;
  const client = {
    storage: { from: () => ({ upload: async () => ({ error: new Error('storage unavailable') }) }) },
    rpc: async () => { rpcCalled = true; return { data: null, error: null }; },
  } as unknown as SupabaseClient;
  const file = new File(['image'], 'proof.jpg', { type: 'image/jpeg' });
  await assert.rejects(uploadCustomerProof(client, {
    orderId: '#SB-2026-000001', databaseId: '11111111-1111-4111-8111-111111111111',
    accessToken: 'b'.repeat(64), tableNumber: '08', items: [], subtotal: 1, tax: 0,
    discount: 0, total: 1, paymentMethod: 'qris', isPaid: false, status: 'menunggu', createdAt: '',
  }, file), /storage unavailable/);
  assert.equal(rpcCalled, false);
});

test('admin status changes use guarded persistence RPCs rather than local-only updates', async () => {
  const calls: Array<{ name: string; args: Record<string, unknown> }> = [];
  const client = { rpc: async (name: string, args: Record<string, unknown>) => {
    calls.push({ name, args });
    return { data: null, error: null };
  } } as unknown as SupabaseClient;
  await updateOrderStatus(client, 'order-uuid', 'dibatalkan', 'Pelanggan meminta batal');
  await updateQrisStatus(client, {
    id: 'payment-uuid', databaseOrderId: 'order-uuid', orderId: '#SB-2026-000001',
    customerName: 'Nia', tableNumber: 'Meja 08', amount: 10000, createdAt: '',
    status: 'menunggu_verifikasi', rrn: '', issuer: '', terminalId: '',
  }, 'terverifikasi');
  assert.deepEqual(calls.map((call) => call.name), ['admin_set_order_status', 'admin_update_qris']);
  assert.equal(calls[0].args.p_reason, 'Pelanggan meminta batal');
  assert.equal(calls[1].args.p_status, 'terverifikasi');
});

test('cash receipt confirmation uses its distinct admin RPC', async () => {
  let called: { name: string; args: Record<string, unknown> } | undefined;
  const client = { rpc: async (name: string, args: Record<string, unknown>) => {
    called = { name, args };
    return { data: null, error: null };
  } } as unknown as SupabaseClient;
  await markCashPaymentPaid(client, 'order-cash-id');
  assert.equal(called?.name, 'admin_mark_cash_paid');
  assert.equal(called?.args.p_order_id, 'order-cash-id');
});
