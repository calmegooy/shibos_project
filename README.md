# Shiboss

Shiboss is a dine-in ordering experience and operations dashboard for Kedai Susu Segar Shi Boss. Astro owns the page routes, shared layouts, and navigation. Existing interactive customer and admin screens run as focused React islands, with screen modules loaded per route.

## Requirements

- Node.js `>=22.23.4`
- npm `>=9.6.5`

## Local development

```sh
npm install
npm run dev
```

The Astro dev server listens on port `3000`. This folder is a static local preview: the customer catalog and 91-item admin menu use bundled data, admin pages open without login, and the app never connects to Supabase. Orders, QRIS transactions, and menu edits are not persisted. Do not deploy this preview copy. Set `DISABLE_HMR=true` in environments where hot module replacement and file watching should be disabled.

## Build and serve

```sh
npm run build
npm start
```

Astro writes the static site to `dist/`. The existing Express server serves that directory, listens on `PORT` (default `3000`), and exposes `/healthz` for the deployment health check.

Customer routes: `/`, `/menu`, `/cart`, `/checkout`, `/payment`, `/order`.

Admin routes: `/admin`, `/admin/menu`, `/admin/orders`, `/admin/qris`, `/admin/login`.

Customer cart and in-progress order UI state use `sessionStorage`; this is not backend or cross-device persistence. Admin access is verified with Supabase Auth and the `admin_users` allowlist; session storage does not grant authorization. The static customer catalog is a preview data source, not live inventory.

See [Supabase setup](docs/supabase-setup.md) for environment configuration, migration/seed application, and first-admin provisioning.

For Astro's local static preview instead of Express:

```sh
npm run preview
```

## Checks

```sh
npm run lint
npm test
```

`npm run clean` removes generated `dist/` and `.astro/` output only; it preserves application source and the Express server.
