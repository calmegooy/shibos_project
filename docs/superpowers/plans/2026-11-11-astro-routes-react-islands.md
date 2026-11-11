# Astro Routes and Focused React Islands Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move Shiboss to Astro-owned customer/admin routes and layouts while retaining React for existing interactive business flows.

**Architecture:** Astro file-based routes own URL selection, shared document/layout markup, and navigation. React route islands mount the existing screens and their providers; versioned, tab-scoped session state carries demo data across document navigations. Express serves generated Astro route files and keeps `/healthz`.

**Tech Stack:** Astro 7, `@astrojs/react`, React 19, Tailwind CSS 4, Express 4, TypeScript 7, Node test runner through `tsx`.

**Spec:** `docs/superpowers/specs/2026-11-11-astro-routes-react-islands-design.md`

## Global Constraints

- Require Node.js `>=22.23.4` and npm `>=9.6.5`.
- Preserve existing order/payment/admin business rules and customer/admin demo workflows.
- Do not assume React Context crosses independently hydrated Astro islands.
- Keep demo state tab-scoped; do not add backend/database persistence.
- Keep Express `/healthz`, port behavior, and Astro output under `dist/`.
- Cleanup must remove generated output only; never delete source files.

## Review Focus

- Direct loads and refreshes at every route must select the expected screen, not default to home/dashboard.
- Browser back/forward and links must preserve the correct active route and not duplicate history entries.
- Malformed, absent, or old session snapshots must fall back safely without crashing React hydration.
- Customer and admin data must survive same-tab route transitions, while ephemeral dialogs/loading state must not be restored stale.
- Express must serve nested static route files and keep unknown routes from returning the home page as if valid.

---

### Task 1: Centralize route contracts and test URL mapping

**Files:**
- Create: `src/lib/routes.ts`
- Test: `src/lib/routes.test.ts`
- Modify: `package.json`

**Interfaces:**
- Produces `customerPathForView(view: ViewType): string`, `adminPathForScreen(screen: AdminScreen): string`, `routeFromPath(pathname: string): { area: 'customer' | 'admin'; view?: ViewType; screen?: AdminScreen } | null`.

- [x] **Step 1: Write failing tests** for every customer/admin route, trailing slash normalization, `/admin/login`, and unknown paths returning `null`.
- [x] **Step 2: Run `npm test`** and confirm the tests fail because the route helpers were missing.
- [x] **Step 3: Implement the route mapping** in `src/lib/routes.ts`, with one canonical path per screen and no implicit unknown-route fallback.
- [x] **Step 4: Run `npm test`** and confirm the route mapping tests pass.

### Task 2: Add tab-scoped navigation state snapshots

**Files:**
- Create: `src/lib/sessionState.ts`
- Test: `src/lib/sessionState.test.ts`
- Modify: `src/context/OrderContext.tsx`
- Modify: `src/context/AdminContext.tsx`

**Interfaces:**
- Produces versioned `readSessionState(storage)`, `writeSessionState(storage, patch)`, and `clearSessionState(storage)` helpers. Context providers restore/save only serializable workflow data; React callbacks and temporary UI state are excluded.

- [x] **Step 1: Write failing tests** for missing data, valid snapshots, malformed JSON, unsupported versions, and merging customer/admin portions without clobbering the other portion.
- [x] **Step 2: Run `npm test`** and confirm the expected missing-helper failures.
- [x] **Step 3: Implement safe versioned serialization** with injected `Storage`-like input so it can be tested without a browser.
- [x] **Step 4: Update providers** to restore durable-for-tab data after hydration and save relevant data when it changes; do not persist modal, toast, or loading state.
- [x] **Step 5: Run `npm test` and `npm run lint`** and confirm both pass.

### Task 3: Create Astro customer/admin layouts and route pages

**Files:**
- Create: `src/layouts/CustomerLayout.astro`, `src/layouts/AdminLayout.astro`
- Create: `src/components/astro/CustomerNavigation.astro`, `src/components/astro/AdminNavigation.astro`
- Create: customer pages for `/`, `/menu`, `/cart`, `/checkout`, `/payment`, `/order`
- Create: admin pages for `/admin`, `/admin/menu`, `/admin/orders`, `/admin/qris`, `/admin/states`, `/admin/login`
- Modify: `src/pages/index.astro`
- Create: focused route island entry components under `src/islands/`

**Interfaces:**
- Layouts accept page title/description and render a slot; Astro navigation uses canonical links; route islands accept the route identifier as a typed prop and mount only the matching existing screen/provider tree.

- [x] **Step 1: Write route-output tests** that assert each Astro page exists in the generated output and contains its route-specific title/screen marker.
- [x] **Step 2: Run the focused tests** and verify they fail before the pages were added.
- [x] **Step 3: Implement shared layouts and route page files** with Astro-owned page structure and route-appropriate React islands; keep existing screen components and shared business logic.
- [x] **Step 4: Run `npm run build`** and verify every listed route is generated under `dist/`.
- [x] **Step 5: Run `npm test` and `npm run lint`** and confirm they pass.

### Task 4: Move customer/admin navigation to Astro URLs

**Files:**
- Modify: `src/components/Navbar.tsx`, `src/components/admin/AdminSidebar.tsx`, `src/components/admin/AdminHeader.tsx`
- Modify: `src/components/astro/CustomerNavigation.astro`, `src/components/astro/AdminNavigation.astro`
- Modify: customer/admin route islands and provider navigation adapters
- Modify: `src/App.tsx`
- Test: route helper and navigation contract tests

**Interfaces:**
- Astro owns static customer/admin navigation links using canonical paths from Task 1. Keep only stateful search/cart-summary/profile actions as focused React controls where required. Existing component navigation calls are adapted to URL changes without changing business handlers.

- [x] **Step 1: Add failing navigation tests** for customer links, admin links, and `setCurrentView`/`setCurrentScreen` mapping to canonical URLs.
- [x] **Step 2: Run `npm test`** and confirm failures exposed the current context-only navigation.
- [x] **Step 3: Convert navigation to real route links** and remove root-level `viewMode`/`currentView` screen selection from `App.tsx` only after route islands mount their own screen.
- [x] **Step 4: Run `npm test` and `npm run lint`** and confirm behavior contracts pass.

### Task 5: Serve Astro routes and verify complete journeys

**Files:**
- Modify: `server.js` only if route serving verification requires a minimal compatibility change
- Modify: `README.md`
- Test: route/session test suite and Express smoke checks

- [x] **Step 1: Verify Express route serving** for `/`, each customer/admin path, static assets, and `/healthz`; unknown URLs must return 404 rather than a misleading app screen.
- [x] **Step 2: Write failing regression tests** for the Express fallback defect, then remove the fallback so unknown paths return 404.
- [x] **Step 3: Update README** with route list, Astro/React boundary, state lifetime, and run commands.
- [x] **Step 4: Run `npm test`, `npm run lint`, `npm run build`, and browser smoke journeys** covering customer menu/cart/checkout/payment/order and admin dashboard/menu/orders/QRIS/navigation.

### Task 6: Final verification and review

**Files:**
- Modify: none unless a verified issue is found

- [ ] **Step 1: Run final checks**: `npm test`, `npm run lint`, `npm run build`, Express route smoke test, and browser journey smoke test.
- [ ] **Step 2: Inspect generated output and source** for accidental duplicate roots, dead legacy route switching, broken direct URLs, or stale docs.
- [ ] **Step 3: Report evidence and limitations**; do not claim backend persistence or features not exercised.

#### Rulings

- Ruling: Keep `selectedOrder` in the session snapshot — the existing dashboard row action selects an order and then navigates to the order-management screen, so navigation must not discard that selection — cost if wrong: a selected order may remain selected for the rest of the tab session.
- Ruling: Sync the customer view from the URL on `pageshow`/`popstate` — browser back-forward cache can restore a screen component whose React state reflects the page it navigated away from — cost if wrong: a browser history event may reset the in-memory selected customer screen to match its URL, which is the intended route contract.
- Ruling: Work in the existing directory because `C:\dev\Shibos_Project` has no Git metadata and the user explicitly requested execution — cost if wrong: source changes have no Git rollback/diff available; verification uses tests and generated outputs.
