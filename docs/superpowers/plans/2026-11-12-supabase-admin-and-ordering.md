# Supabase Admin and Ordering Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace Shiboss prototype-only admin access and mock menu/order flows with secured Supabase Auth and Supabase-backed data.

**Architecture:** Astro keeps static routes and React islands. A browser Supabase client uses only the project URL and publishable key. SQL migrations create menu/order/payment/authz tables and RLS; an admin-user mapping grants access. Existing UI contexts become adapters to Supabase, while local demo fixtures are used only for migration seed/tests, not silently shown as production data.

**Tech Stack:** Astro, React, TypeScript, Supabase JS, Supabase PostgreSQL, Supabase Storage, Node test runner (`tsx`).

**Spec:** `docs/superpowers/specs/2026-11-12-supabase-admin-and-ordering-design.md`

## Global Constraints

- Node.js `>=22.23.4` and npm `>=9.6.5`.
- Never expose or use a Supabase service-role key in browser code.
- `sessionStorage` data must not confer admin authorization.
- Preserve customer order/payment/admin business workflows and tab history behavior.
- Keep mock data truthfully identified until the live data source is active.
- Do not remove functional image previews, SOPs, or normal input examples.
- The Supabase owner must apply migrations and provision the first authorized user; no service-role credential is available to this implementation.

## Review Focus

- Missing/invalid environment configuration must fail closed for admin and show a useful setup error — test in the Supabase client/auth task.
- Unauthenticated users and authenticated non-admins must never see admin screens — test in auth guard task.
- Anonymous clients must not read private orders or change admin/payment fields — verify SQL policy/RPC contracts in migration task and provide live SQL checks.
- Duplicate order submission or menu changes must not corrupt saved item/price snapshots — test order persistence task.
- Storage upload failures and oversized/invalid proof images must not falsely mark payment as verified — test payment workflow task.

---

### Task 1: Remove prototype-only UI

**Files:** customer/admin layouts and headers, login screen, admin simulation views/context, admin route list/page, route/server regression tests.

**Interfaces:** Preserve product workflows; remove only explicitly prototype/test-only navigation and state-manipulation affordances. Keep operational SOPs and functional previews.

- [x] Add failing tests asserting the customer preview banner, admin prototype toolbar, demo credential fillers, simulation controls, and `/admin/states` route are absent.
- [x] Run the focused tests and confirm failures point to the visible prototype artifacts.
- [x] Remove those artifacts and remove the state-showcase screen from route/navigation types and files.
- [x] Keep the data-source disclaimer until Supabase data is wired; ensure it disappears only after live data is used.
- [x] Run the focused and full test suite.

### Task 2: Supabase client and authorization model

**Files:** package manifest/lockfile, `.env.example`, ignored `.env.local`, Supabase client/auth modules, admin provider/island/login, tests.

**Interfaces:** Export one configured browser client and typed helpers for session state, sign-in, sign-out, and admin authorization lookup.

- [x] Add tests for auth-route decisions: loading, no session, authorized admin, and signed-in non-admin.
- [x] Verify the tests fail before adding the client/auth helpers.
- [x] Add `@supabase/supabase-js`; configure URL and publishable key using `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`.
- [x] Replace demo auth and persisted `isAuthenticated` with Supabase Auth session restoration and an `admin_users` authorization check.
- [x] Make `/admin` show a loading state while auth is checked, then dashboard only for authorized admins; redirect no-session users to `/admin/login`; deny signed-in non-admin users.
- [x] Replace hard-coded credentials with real email/password login and logout.
- [x] Run auth tests, lint, and build.

### Task 3: Database schema, policies, and seed

**Files:** `supabase/migrations/`, seed/export scripts, SQL contract tests, setup documentation.

**Interfaces:**
- `admin_users(user_id uuid primary key references auth.users(id), role text, created_at timestamptz)`; role is constrained to the current admin roles. Authenticated clients can select only their own row; no client-side role writes.
- `menu_items(id text primary key, code text unique, name text, category text, price integer, description text, image_url text, is_available boolean, is_customer_visible boolean, is_popular boolean, is_bestseller boolean, badge text, updated_at timestamptz)`.
- `orders(id uuid primary key, order_number text unique, table_number text, customer_name text, subtotal integer, tax integer, discount integer, total integer, payment_method text, payment_status text, order_status text, kitchen_notes text, transfer_proof_path text, created_at timestamptz, verified_by uuid, verified_at timestamptz, cancellation_reason text)`.
- `order_items(id uuid primary key, order_id uuid references orders, menu_item_id text, item_name text, category text, quantity integer, unit_price integer, subtotal integer, modifier jsonb, notes text)`; names/prices/categories are immutable snapshots.
- `payments(id uuid primary key, order_id uuid references orders, amount integer, status text, rrn text, issuer text, terminal_id text, verified_by uuid, verified_at timestamptz, rejection_reason text, transfer_proof_path text, created_at timestamptz)`.
- RPC `create_dine_in_order(p_table_number text, p_customer_name text, p_kitchen_notes text, p_payment_method text, p_items jsonb) returns jsonb` validates availability and quantities, calculates totals from `menu_items`, stores snapshots atomically, and is executable by `anon`/`authenticated` only.
- Storage bucket `transfer-proofs` is private; anonymous upload paths are unguessable and restricted to proof submissions, while private reads and admin verification are policy-controlled.

- [x] Add migration contract tests for core tables, public/private RLS, server-priced RPC, and storage policies.
- [x] Verify the contract tests fail before the migration exists.
- [x] Write migration SQL, indexes, grants, `is_admin()` helper, and `create_dine_in_order(...)`; seed all 91 current admin menu items and mark only IDs present in `MENU_ITEMS` as customer-visible.
- [x] Keep order item name/price/modifier data as immutable snapshots.
- [x] Document first-admin provisioning and Supabase Auth redirect setup without requiring the owner to share passwords.
- [x] Run SQL static/contract tests and review privilege boundaries.

### Task 4: Supabase menu integration

**Files:** menu repository, customer/admin providers, customer menu and admin menu views, tests.

**Interfaces:** Add typed repository operations to list visible customer items, list all admin items, create/update/delete items, and update availability.

- [x] Add tests for database row mapping and customer-facing category mapping.
- [x] Verify mapping tests fail before the repository is implemented.
- [x] Load customer/admin menus from Supabase; make admin changes persist and become visible to customers according to the visibility flag.
- [x] Use explicit loading/empty/error states rather than pretending fixture values are live.
- [ ] Add focused CRUD failure and customer load-state tests; run relevant browser checks.

### Task 5: Order and payment persistence

**Files:** order repository, customer/admin contexts/views, storage upload helper, tests.

**Interfaces:** Persist order creation with server-calculated prices and item snapshots; query authorized order histories; update order status and payment verification as authorized admins; upload/read transfer proof through private storage.

- [x] Add tests for order payload mapping and server-returned snapshot mapping.
- [x] Verify the payload tests fail before persistence functions are implemented.
- [x] Wire customer checkout to the safe create-order RPC; clear cart only after persistence succeeds.
- [x] Wire customer order status and admin order/QRIS screens to Supabase records and authorized mutations.
- [x] Replace data-URI proof persistence with private Storage upload and linked object paths.
- [x] Remove prototype-data disclaimer only after operational data is loaded from Supabase; show explicit load/error states.
- [x] Add repository regression tests for RPC failure with request-id reuse, proof upload/link failure, and admin status RPC dispatch.
- [x] Keep cash payment pending until an admin explicitly confirms receipt; keep it out of QRIS review.
- [ ] Run browser journeys for public ordering and authenticated admin flows.

### Task 6: End-to-end verification and owner handoff

**Files:** documentation and tests only as needed.

- [x] Run `npm test`, `npm run lint`, and `npm run build`.
- [ ] Run browser smoke for public ordering plus `/admin` unauthenticated/authenticated flows.
- [ ] Verify static output still serves all Astro routes and `/healthz`; unknown paths remain 404.
- [x] Review SQL RLS/RPC and confirm no privileged secret is shipped to browser bundles.
- [ ] Report local verification separately from live Supabase verification; list exact owner actions still required if migration/admin setup has not been applied.
