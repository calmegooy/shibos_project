# Supabase setup and first admin

## Local environment

Copy `.env.example` to `.env.local` and set the Supabase project URL and **publishable** key from Project Settings → API. Both variables are public browser configuration; Row Level Security is the security boundary. Never put a service-role key in this app or its deployment environment.

```env
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<publishable-key>
```

Restart the dev server after changing environment values. Admin sign-in fails closed until these values are present.

## Apply schema and menu seed

Apply `supabase/migrations/202611120001_initial_ordering.sql` using the Supabase CLI (`supabase db push`) or the Supabase SQL Editor. Then run `supabase/seed.sql` once in the SQL Editor. The seed creates the 91-item admin catalog and marks only the current customer-facing 25 IDs visible. It uses `ON CONFLICT DO NOTHING` so re-running it does not overwrite menu edits.

The migration creates RLS-protected tables and a `create_dine_in_order` RPC. Anonymous customers can read only available, customer-visible menu rows and submit orders through the RPC; they cannot read private orders or write menu/payment state. Authorized staff are represented by `admin_users` rows.

## Provision the first admin

1. In Supabase Dashboard → Authentication → Users, create or invite the intended admin email. Set the password directly there; do not commit it or place it in `.env.local`.
2. Copy that user's UUID from the Auth user list.
3. Run this SQL as the project owner in the SQL Editor, replacing the UUID and selecting the least-privileged applicable role:

   ```sql
   insert into public.admin_users (user_id, role)
   values ('<auth-user-uuid>', 'Kasir Utama');
   ```

4. Add the deployed site's origin and `/admin/login` to Supabase Auth's allowed redirect URLs. For local development, allow `http://localhost:3000/**`.
5. Set the same two public environment variables in the hosting platform, rebuild, and verify `/admin` redirects signed-out users to `/admin/login`.

The original password shared in chat is not stored in this repository. Rotate it before use if it remains the active password.

## Current implementation boundary

Admin authentication, customer/admin menu reads, menu CRUD/availability, customer order creation/status lookup, private proof upload, and admin order/payment queries and status RPCs are wired to Supabase. Cash stays unpaid until an authorized cashier explicitly confirms receipt. Dashboard activity history/notifications are not persisted yet. The merchant QR itself is intentionally not fabricated: QR checkout tells customers to obtain the official merchant QR from staff until the owner provides a real QR asset or supported setup. No live project verification has been performed from this workspace.
