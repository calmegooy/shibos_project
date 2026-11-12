import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mapCustomerMenuItem, mapAdminMenuItem } from './menuRepository.ts';

const row = {
  id: 'menu-1', code: 'SHB-M01', name: 'Susu Segar', category: 'Special Susu' as const, price: 10000,
  description: 'Susu segar', image_url: 'https://example.test/susu.jpg', is_available: true,
  is_customer_visible: true, is_popular: true, is_bestseller: false, badge: 'Favorit',
  updated_at: '2026-11-12T10:00:00Z',
};

test('customer menu mapping preserves live fields and maps drink category', () => {
  assert.deepEqual(mapCustomerMenuItem(row), {
    id: 'menu-1', name: 'Susu Segar', category: 'minuman', price: 10000,
    description: 'Susu segar', image: 'https://example.test/susu.jpg', badge: 'Favorit',
    isPopular: true, isBestseller: false,
  });
});

test('admin menu mapping retains database identity, availability, and visibility', () => {
  assert.deepEqual(mapAdminMenuItem(row), {
    id: 'menu-1', code: 'SHB-M01', name: 'Susu Segar', category: 'Special Susu', price: 10000,
    description: 'Susu segar', image: 'https://example.test/susu.jpg', isAvailable: true,
    isCustomerVisible: true, isPopular: true, isBestseller: false, badge: 'Favorit', updatedAt: '2026-11-12T10:00:00Z',
  });
});

test('food and snack database categories map to customer-facing sections', () => {
  assert.equal(mapCustomerMenuItem({ ...row, category: 'Food' }).category, 'makanan');
  assert.equal(mapCustomerMenuItem({ ...row, category: 'Snack' }).category, 'snack');
});
