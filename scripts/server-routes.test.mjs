import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import net from 'node:net';
import { spawn } from 'node:child_process';
import { after, before, test } from 'node:test';
import { setTimeout as delay } from 'node:timers/promises';

let server;
let baseUrl;

before(async () => {
  execFileSync(process.execPath, ['node_modules/astro/bin/astro.mjs', 'build'], {
    cwd: process.cwd(),
    stdio: 'ignore',
  });
  const probe = net.createServer();
  await new Promise((resolve) => probe.listen(0, '127.0.0.1', resolve));
  const port = probe.address().port;
  await new Promise((resolve) => probe.close(resolve));
  baseUrl = `http://127.0.0.1:${port}`;
  server = spawn(process.execPath, ['server.js'], {
    cwd: process.cwd(),
    env: { PORT: String(port) },
    stdio: 'ignore',
  });

  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      if ((await fetch(`${baseUrl}/healthz`)).ok) return;
    } catch {}
    await delay(100);
  }
  throw new Error('Express server did not start');
});

after(async () => {
  if (!server) return;
  const exited = new Promise((resolve) => server.once('exit', resolve));
  server.kill();
  await Promise.race([exited, delay(2000)]);
});

test('Express serves Astro customer and admin route documents', async () => {
  for (const [route, title] of [
    ['/', 'Pemesanan - Kedai Susu Segar Shi Boss'],
    ['/menu', 'Menu - Kedai Susu Segar Shi Boss'],
    ['/cart', 'Keranjang - Kedai Susu Segar Shi Boss'],
    ['/checkout', 'Checkout - Kedai Susu Segar Shi Boss'],
    ['/payment', 'Pembayaran - Kedai Susu Segar Shi Boss'],
    ['/order', 'Status Pesanan - Kedai Susu Segar Shi Boss'],
    ['/admin', 'Dashboard Admin Shiboss'],
    ['/admin/menu', 'Manajemen Menu - Shiboss'],
    ['/admin/orders', 'Pesanan - Shiboss'],
    ['/admin/qris', 'Verifikasi QRIS - Shiboss'],
    ['/admin/states', 'Showcase State - Shiboss'],
    ['/admin/login', 'Login Admin - Shiboss'],
  ]) {
    const response = await fetch(`${baseUrl}${route}`);
    assert.equal(response.status, 200, `${route} should be served`);
    assert.ok((await response.text()).includes(`<title>${title}</title>`), `${route} should serve its own Astro page`);
  }
});

test('Express keeps the health endpoint and returns 404 for unknown paths', async () => {
  const health = await fetch(`${baseUrl}/healthz`);
  assert.equal(health.status, 200);
  assert.equal(await health.text(), 'OK');
  assert.equal((await fetch(`${baseUrl}/not-a-route`)).status, 404);
});
