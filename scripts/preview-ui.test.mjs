import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('Material Symbols are self-hosted so icon names do not render as text when Google Fonts is unavailable', async () => {
  const [css, layout] = await Promise.all([read('src/index.css'), read('src/layouts/BaseLayout.astro')]);
  assert.match(css, /material-symbols-outlined\.ttf/);
  assert.doesNotMatch(layout, /fonts\.googleapis\.com\/css2\?family=Material\+Symbols/);
});

test('preview mode is explicit, local-only, and visibly labeled', async () => {
  const [adminContext, adminApp, supabase, routes, previewMode] = await Promise.all([
    read('src/context/AdminContext.tsx'), read('src/views/admin/AdminApp.tsx'), read('src/lib/supabase.ts'),
    read('src/islands/AdminRouteIsland.tsx'), read('src/lib/previewMode.ts'),
  ]);
  assert.match(previewMode, /isPreviewMode\s*=\s*true/);
  assert.match(adminContext, /isPreviewMode/);
  assert.match(adminApp, /Mode Pratinjau/);
  assert.match(supabase, /!isPreviewMode/);
  assert.match(routes, /authStatus === 'authorized' && initialScreen === 'login'/);
});
