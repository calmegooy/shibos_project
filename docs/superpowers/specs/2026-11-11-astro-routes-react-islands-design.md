# Astro Routes with Focused React Islands

## Intent

Move Shiboss from one full-app React island toward Astro-owned customer/admin routes and layouts, keeping React only for UI that requires client-side interaction. Preserve the current customer ordering and admin operations flows while making each major screen directly addressable by URL.

## Goals

- Astro owns the document, route selection, shared page chrome, and navigation links.
- Customer screens have direct URLs: `/`, `/menu`, `/cart`, `/checkout`, `/payment`, and `/order`.
- Admin screens have direct URLs: `/admin`, `/admin/menu`, `/admin/orders`, `/admin/qris`, and `/admin/states`.
- Back/forward navigation and direct page loads select the matching screen.
- Keep existing React interaction components and providers where they remain the smallest reliable unit; do not rewrite transaction or management logic wholesale.
- Preserve customer/admin demo state while navigating between Astro pages in the same browser tab.
- Preserve Express static serving, `/healthz`, and production output at `dist/`.

## Non-goals

- Replace React on interaction-heavy forms and admin management screens with custom vanilla JavaScript.
- Add a backend, authentication service, database, or cross-device persistence.
- Change order/payment business rules, page content, or visual design beyond what route integration requires.
- Treat demo state as durable beyond the current browser tab.

## Approaches

1. **Astro routes and layouts with focused React islands (selected).** Astro owns URLs and static structure. React islands handle stateful customer/admin controls. A tab-scoped state bridge preserves existing context data across document navigations. This uses Astro meaningfully while containing behavior risk.
2. **One React island with Astro as a document shell.** Lowest risk, but it does not deliver Astro-owned navigation/pages or meaningfully reduce React; this is the current architecture and is not the requested destination.
3. **Rewrite all interactive screens in Astro and browser JavaScript.** Rejected because it duplicates ordering/admin logic and carries a much larger regression risk.

## Architecture and constraints

- Use Astro file-based routes and shared `.astro` layouts for common customer/admin document structure.
- Convert in-app navigation to real same-origin links; active navigation derives from the current URL.
- Keep business operations in existing React contexts/components where needed. Do not place React Context providers around separate Astro islands and assume context can cross island boundaries.
- Transfer serializable customer/admin demo state through a versioned `sessionStorage` envelope so route navigation and same-tab refresh do not discard in-progress workflows. Scope state to the current tab; do not add backend persistence. Tolerate absent, malformed, or stale snapshots by falling back to current defaults.
- Do not persist ephemeral UI state such as open modals, temporary toast messages, or loading flags, except selected admin order needed to continue the existing dashboard-to-order-detail action.
- Route guards/fallbacks must not silently route an unknown admin/customer URL to an unrelated screen.
- Keep Tailwind v4, React 19, Astro, and Express integrations compatible with the current lockfile/runtime requirements.

## Acceptance criteria

- Every listed customer/admin URL renders its corresponding screen on direct navigation and refresh.
- Astro-generated route links update the URL and browser back/forward returns to the expected screen.
- Customer cart, table/customer details, active order/payment state, and admin demo data needed by current flows survive same-tab route transitions.
- Existing menu → cart → checkout → payment → order flow and admin menu/order/QRIS flows remain functional.
- Browser back/forward synchronizes restored customer screen state to the URL, including when Chrome restores a page from its back-forward cache.
- Refreshing a route restores same-tab demo state; closing the tab ends that session state. No server/database persistence is implied.
- React remains limited to genuinely interactive surfaces; Astro owns page shells/navigation and static content.
- `npm run build`, `npm run lint`, `npm test`, Express `/`/route smoke checks, and `/healthz` pass.

## Explicit tradeoff

Using `sessionStorage` means a same-tab refresh will now restore demo state, whereas the previous single in-memory React app could reset on refresh. This is chosen to make the new page-based navigation behave consistently and remains tab-scoped; it is not durable application storage.
