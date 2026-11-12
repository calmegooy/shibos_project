import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { test } from 'node:test';

const readSource = (path) => readFile(new URL(`../src/${path}`, import.meta.url), 'utf8');

test('customer entry points do not show prototype preview banners or admin shortcuts', async () => {
  const [layout, legacyApp] = await Promise.all([
    readSource('layouts/CustomerLayout.astro'),
    readSource('App.tsx'),
  ]);
  for (const source of [layout, legacyApp]) {
    assert.doesNotMatch(source, /Mode Pratinjau|Buka Dashboard Admin Shiboss/);
  }
});

test('admin header and login do not expose prototype navigation or demo credentials', async () => {
  const [header, login] = await Promise.all([
    readSource('components/admin/AdminHeader.tsx'),
    readSource('views/admin/LoginView.tsx'),
  ]);
  assert.doesNotMatch(header, /Navigasi Cepat Prototipe|UI States/);
  assert.doesNotMatch(login, /Kredensial Prototipe Cepat|rian\.kasir@shiboss\.id|dita\.manager@shiboss\.id|shiboss2026/);
});

test('admin operational screens do not expose simulation controls', async () => {
  const screens = await Promise.all([
    readSource('views/admin/MenuManagementView.tsx'),
    readSource('views/admin/OrderManagementView.tsx'),
    readSource('views/admin/QrisVerificationView.tsx'),
  ]);
  for (const source of screens) {
    assert.doesNotMatch(source, /Simulasi Loading|Simulasi Error|Simulasi Pesanan Kosong|Simulasi QRIS Kosong/);
  }
});

test('menu editor image preview does not fake upload progress or failures', async () => {
  const editor = await readSource('views/admin/AddEditMenuModal.tsx');
  assert.doesNotMatch(editor, /handleSimulateUpload|Uji Gagal Upload|simulated image|setInterval\(/);
});

test('customer payment and status views do not show fake payment success or sample orders', async () => {
  const payment = await readSource('views/PaymentView.tsx');
  const status = await readSource('views/OrderStatusView.tsx');
  assert.doesNotMatch(payment, /confirmPayment|ID102008291029|Scannable High-Density QR Canvas|#SB-2025-0891|34000/);
  assert.match(payment, /QRIS merchant belum dikonfigurasi/);
  assert.doesNotMatch(status, /#SB-2025-0891|34000|Lunas via QRIS Meja|Berhasil Lunas/);
  assert.match(status, /Tidak ada pesanan untuk dibayar|Pesanan tidak ditemukan/);
});

test('admin dashboard does not label live views as prototype or hard-code a sample shift date', async () => {
  const dashboard = await readSource('views/admin/DashboardView.tsx');
  assert.doesNotMatch(dashboard, /Data Prototipe Visual|Minggu, 25 Okt 2026/);
});

test('admin state showcase route is removed while payment proof preview remains functional', async () => {
  assert.equal(existsSync(new URL('../src/pages/admin/states.astro', import.meta.url)), false);
  assert.equal(existsSync(new URL('../src/views/admin/StateShowcaseView.tsx', import.meta.url)), false);
  const routes = await readSource('lib/routes.ts');
  const nav = await readSource('components/astro/AdminNavigation.astro');
  const types = await readSource('types/admin.ts');
  assert.doesNotMatch(routes + nav + types, /\/admin\/states|Showcase State|\| 'states'/);
  assert.match(await readSource('views/PaymentView.tsx'), /Pratinjau Bukti Transfer/);
});
