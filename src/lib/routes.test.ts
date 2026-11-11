import assert from 'node:assert/strict';
import test from 'node:test';
import { adminPathForScreen, customerPathForView, routeFromPath } from './routes.ts';
import type { ViewType } from '../context/OrderContext.tsx';
import type { AdminScreen } from '../types/admin.ts';

test('customer views map to their canonical Astro URLs', () => {
  assert.deepEqual(
    (['beranda', 'menu', 'keranjang', 'checkout', 'pembayaran', 'pesanan'] satisfies ViewType[]).map(customerPathForView),
    ['/', '/menu', '/cart', '/checkout', '/payment', '/order']
  );
});

test('admin screens map to canonical URLs including login', () => {
  assert.deepEqual(
    (['dashboard', 'menu', 'orders', 'qris', 'states', 'login'] satisfies AdminScreen[]).map(adminPathForScreen),
    ['/admin', '/admin/menu', '/admin/orders', '/admin/qris', '/admin/states', '/admin/login']
  );
});

test('route lookup normalizes a trailing slash and rejects unknown URLs', () => {
  assert.deepEqual(routeFromPath('/cart/'), { area: 'customer', view: 'keranjang' });
  assert.deepEqual(routeFromPath('/admin/qris'), { area: 'admin', screen: 'qris' });
  assert.equal(routeFromPath('/not-a-route'), null);
});
