# Supabase-backed Shiboss Operations

## Intent

Turn the current prototype ordering and admin screens into a Supabase-backed application, remove prototype-only UI, and make `/admin` use a real authenticated admin session.

## Goals

- Remove visible prototype navigation, demo credential fillers, simulated-state controls, and the UI-state showcase route.
- `/admin` opens the dashboard for an authenticated, explicitly authorized admin; otherwise it redirects to `/admin/login`.
- Supabase Auth owns login/logout/session restoration. Client-side `sessionStorage` must never grant admin access.
- Use Supabase as the source of truth for menu, orders, order items, and payment verification records.
- Preserve the existing ordering, item customization, status, and manual QRIS-verification workflows.
- Keep the customer-facing 25-item catalog selection while allowing admin management of the existing 91-item catalog; store a visibility flag to distinguish items shown to customers.
- Keep credentials limited to the Supabase URL and publishable key in ignored local environment files. Never use a service-role key in browser code.
- Apply Row Level Security. Anonymous customers can read visible/available catalog items and create dine-in orders; only authorized admins can manage menus, inspect/manage orders, and verify payments.
- Keep an accurate data-source notice until the app is reading real Supabase data; never present mock records as live records.

## Non-goals

- Integrate a payment processor or claim that manual QRIS verification is automated.
- Put the Supabase service-role key in the browser or static Express process.
- Make customer cart or transient UI state durable in the database before an order is placed.
- Remove functional image previews, operational instructions, or ordinary input examples merely because they contain words such as “preview” or “example.”

## Architecture and security

- The Astro site remains statically generated and React islands retain interactive workflows.
- A shared Supabase browser client uses `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`.
- An `admin_users` table maps `auth.users.id` to an allowed admin role. Authenticated users must have a matching row; unapproved users are signed out/denied. RLS permits an admin to read only their own authorization row; clients cannot grant themselves roles.
- SQL migrations define the schema, constraints, indexes, RLS policies, and narrowly scoped RPCs needed for safe customer order creation. The project owner applies migrations in Supabase and provisions the first Auth user/admin row.
- Menu data is seeded from the current admin catalog. Existing customer catalog IDs determine initial customer visibility.
- Orders store immutable item/price snapshots so later menu edits do not rewrite past orders. Payment verification state and actor/timestamp are recorded separately from order preparation status.
- Transfer proof images use a private Supabase Storage bucket with narrowly scoped access; do not store data URLs in order rows.
- The current browser-visible publishable key is not a secret; RLS is the actual data security boundary.

## Acceptance criteria

- Customer/admin pages contain no prototype-only navigation, demo credential autofill, or simulation controls; functional preview/operational UI remains.
- The demo state showcase route is removed from public admin navigation/routes.
- Dashboard data is either loaded from Supabase or explicitly identified as unavailable; mock fixtures are not silently presented as live data.
- Direct `/admin` loads a dashboard only after Supabase confirms a valid admin session; no session redirects to login, and an authenticated non-admin is denied.
- Login/logout use Supabase Auth and refresh/back-forward state is restored from the actual Supabase session.
- Customer menu displays the configured customer-visible catalog from Supabase; admin CRUD updates the same records.
- Placing an order persists the order and item snapshots safely; admin status/payment actions persist and appear in customer/admin views.
- Anonymous RLS cannot read private orders or mutate menu/payment status; admin policies allow only authorized operations.
- `npm test`, `npm run lint`, and `npm run build` pass. Live-project validation is reported separately if the owner has not applied migrations/provisioned the first admin.

## Required owner setup

- Provide the project URL and publishable key (already supplied in this conversation); store locally as ignored `.env.local` values.
- Apply the committed SQL migration/seed in Supabase SQL Editor or CLI.
- Create the first user in Supabase Auth and run the documented admin-grant SQL using that user's UUID.
- Configure the production site's Auth redirect URLs before deployment.
