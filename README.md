# Shiboss

Shiboss is a dine-in ordering experience and operations dashboard for Kedai Susu Segar Shi Boss. Astro builds the page shell; the existing customer and admin application remains one client-hydrated React app so its shared context and interactions stay together.

## Requirements

- Node.js `>=22.23.4`
- npm `>=9.6.5`

## Local development

```sh
npm install
npm run dev
```

The Astro dev server listens on port `3000`. Set `DISABLE_HMR=true` in environments where hot module replacement and file watching should be disabled.

## Build and serve

```sh
npm run build
npm start
```

Astro writes the static site to `dist/`. The existing Express server serves that directory, listens on `PORT` (default `3000`), and exposes `/healthz` for the deployment health check.

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
