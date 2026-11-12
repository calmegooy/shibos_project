create extension if not exists pgcrypto;

create sequence if not exists public.shiboss_order_number_seq;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('Kasir Utama', 'Manajer Outlet', 'Barista / Dapur')),
  created_at timestamptz not null default now()
);

create table if not exists public.menu_items (
  id text primary key check (length(id) between 1 and 80),
  code text not null unique check (length(code) between 1 and 32),
  name text not null check (length(name) between 1 and 160),
  category text not null check (category in ('Special Susu', 'Milkshake', 'Minuman Lainnya', 'Food', 'Snack', 'Tambahan', 'Varian Telur')),
  price integer not null check (price > 0),
  description text not null default '',
  image_url text not null default '',
  is_available boolean not null default true,
  is_customer_visible boolean not null default false,
  is_popular boolean not null default false,
  is_bestseller boolean not null default false,
  badge text,
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null unique,
  customer_access_token_hash text not null,
  order_number text not null unique default ('#SB-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('public.shiboss_order_number_seq')::text, 6, '0')),
  table_number text not null check (table_number ~ '^[0-9]{1,3}$'),
  customer_name text not null default '' check (length(customer_name) <= 120),
  subtotal integer not null check (subtotal >= 0),
  tax integer not null default 0 check (tax >= 0),
  discount integer not null default 0 check (discount >= 0),
  total integer not null check (total >= 0),
  payment_method text not null check (payment_method in ('qris', 'cash')),
  payment_status text not null check (payment_status in ('menunggu_verifikasi', 'terverifikasi', 'ditolak', 'menunggu_tunai', 'tunai_lunas')),
  order_status text not null default 'menunggu' check (order_status in ('menunggu', 'dikonfirmasi', 'diracik', 'selesai', 'dibatalkan')),
  kitchen_notes text not null default '' check (length(kitchen_notes) <= 1000),
  transfer_proof_path text,
  cancellation_reason text,
  verified_by uuid references auth.users(id),
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  check (total = subtotal + tax - discount)
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  menu_item_id text references public.menu_items(id) on delete set null,
  item_name text not null,
  category text not null,
  quantity integer not null check (quantity between 1 and 20),
  unit_price integer not null check (unit_price > 0),
  subtotal integer not null check (subtotal = quantity * unit_price),
  modifier jsonb not null default '{}'::jsonb,
  notes text not null default '' check (length(notes) <= 500)
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null unique references public.orders(id) on delete cascade,
  amount integer not null check (amount >= 0),
  status text not null check (status in ('menunggu_verifikasi', 'terverifikasi', 'ditolak', 'menunggu_tunai', 'tunai_lunas')),
  rrn text,
  issuer text,
  terminal_id text,
  verified_by uuid references auth.users(id),
  verified_at timestamptz,
  rejection_reason text,
  transfer_proof_path text,
  created_at timestamptz not null default now()
);

create index if not exists orders_created_at_idx on public.orders (created_at desc);
create index if not exists orders_status_idx on public.orders (order_status, payment_status);
create index if not exists order_items_order_id_idx on public.order_items (order_id);
create index if not exists payments_status_created_at_idx on public.payments (status, created_at desc);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admin_users where user_id = (select auth.uid()));
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

alter table public.admin_users enable row level security;
alter table public.menu_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.payments enable row level security;

create policy "admin users can read own authorization" on public.admin_users
  for select to authenticated using (user_id = (select auth.uid()));

create policy "public can read available customer menu" on public.menu_items
  for select to anon, authenticated using (is_customer_visible and is_available);
create policy "admins can read full menu" on public.menu_items
  for select to authenticated using (public.is_admin());
create policy "admins can insert menu" on public.menu_items
  for insert to authenticated with check (public.is_admin());
create policy "admins can update menu" on public.menu_items
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins can delete menu" on public.menu_items
  for delete to authenticated using (public.is_admin());

create policy "admins can read orders" on public.orders
  for select to authenticated using (public.is_admin());
create policy "admins can update orders" on public.orders
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins can read order items" on public.order_items
  for select to authenticated using (public.is_admin());
create policy "admins can read payments" on public.payments
  for select to authenticated using (public.is_admin());
create policy "admins can update payments" on public.payments
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

revoke all on public.admin_users, public.menu_items, public.orders, public.order_items, public.payments from anon, authenticated;
grant select on public.admin_users to authenticated;
grant select on public.orders, public.order_items, public.payments to authenticated;
grant update (order_status, cancellation_reason, payment_status, verified_by, verified_at, transfer_proof_path) on public.orders to authenticated;
grant update (status, rrn, issuer, terminal_id, verified_by, verified_at, rejection_reason, transfer_proof_path) on public.payments to authenticated;
grant select, insert, update, delete on public.menu_items to authenticated;
grant select on public.menu_items to anon;

create or replace function public.create_dine_in_order(
  p_table_number text,
  p_customer_name text,
  p_kitchen_notes text,
  p_payment_method text,
  p_request_id uuid,
  p_customer_access_token text,
  p_items jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order_id uuid := gen_random_uuid();
  v_order_number text;
  v_item jsonb;
  v_menu public.menu_items%rowtype;
  v_quantity integer;
  v_toppings jsonb;
  v_unit_price integer;
  v_subtotal integer := 0;
  v_payment_status text;
  v_item_count integer;
  v_snapshots jsonb := '[]'::jsonb;
  v_existing public.orders%rowtype;
begin
  if p_table_number is null or p_table_number !~ '^[0-9]{1,3}$' then
    raise exception 'Nomor meja tidak valid' using errcode = '22023';
  end if;
  if p_payment_method is null or p_payment_method not in ('qris', 'cash') then
    raise exception 'Metode pembayaran tidak valid' using errcode = '22023';
  end if;
  if p_request_id is null or p_customer_access_token is null or p_customer_access_token !~ '^[0-9a-f]{64}$' then
    raise exception 'Token pesanan tidak valid' using errcode = '22023';
  end if;
  select * into v_existing from public.orders where request_id = p_request_id;
  if found then
    if v_existing.customer_access_token_hash <> encode(digest(p_customer_access_token, 'sha256'), 'hex') then
      raise exception 'Token pesanan tidak sesuai' using errcode = '42501';
    end if;
    return jsonb_build_object(
      'id', v_existing.id,
      'order_number', v_existing.order_number,
      'subtotal', v_existing.subtotal,
      'total', v_existing.total,
      'payment_status', v_existing.payment_status,
      'items', coalesce((select jsonb_agg(jsonb_build_object(
        'menu_item_id', oi.menu_item_id, 'item_name', oi.item_name, 'category', oi.category,
        'quantity', oi.quantity, 'unit_price', oi.unit_price, 'subtotal', oi.subtotal,
        'modifier', oi.modifier, 'notes', oi.notes
      )) from public.order_items oi where oi.order_id = v_existing.id), '[]'::jsonb)
    );
  end if;
  if p_items is null or jsonb_typeof(p_items) <> 'array' then
    raise exception 'Daftar item tidak valid' using errcode = '22023';
  end if;
  v_item_count := jsonb_array_length(p_items);
  if v_item_count < 1 or v_item_count > 30 then
    raise exception 'Jumlah jenis menu tidak valid' using errcode = '22023';
  end if;

  for v_item in select value from jsonb_array_elements(p_items)
  loop
    v_quantity := (v_item->>'quantity')::integer;
    if v_quantity < 1 or v_quantity > 20 then
      raise exception 'Jumlah item tidak valid' using errcode = '22023';
    end if;
    select * into v_menu from public.menu_items
      where id = v_item->>'menu_item_id' and is_available and is_customer_visible;
    if not found then
      raise exception 'Menu tidak tersedia' using errcode = '22023';
    end if;
    v_toppings := coalesce(v_item->'modifier'->'toppings', '[]'::jsonb);
    if jsonb_typeof(v_toppings) <> 'array' or jsonb_array_length(v_toppings) > 5 then
      raise exception 'Tambahan menu tidak valid' using errcode = '22023';
    end if;
    v_unit_price := v_menu.price + (jsonb_array_length(v_toppings) * 3000);
    v_subtotal := v_subtotal + (v_unit_price * v_quantity);
    v_snapshots := v_snapshots || jsonb_build_array(jsonb_build_object(
      'menu_item_id', v_menu.id,
      'item_name', v_menu.name,
      'category', v_menu.category,
      'quantity', v_quantity,
      'unit_price', v_unit_price,
      'subtotal', v_quantity * v_unit_price,
      'modifier', coalesce(v_item->'modifier', '{}'::jsonb),
      'notes', left(coalesce(v_item->>'notes', ''), 500)
    ));
  end loop;

  v_payment_status := case when p_payment_method = 'cash' then 'menunggu_tunai' else 'menunggu_verifikasi' end;
  insert into public.orders (id, request_id, customer_access_token_hash, table_number, customer_name, subtotal, tax, discount, total, payment_method, payment_status, order_status, kitchen_notes)
  values (v_order_id, p_request_id, encode(digest(p_customer_access_token, 'sha256'), 'hex'), p_table_number, coalesce(left(p_customer_name, 120), ''), v_subtotal, 0, 0, v_subtotal, p_payment_method, v_payment_status, 'menunggu', left(coalesce(p_kitchen_notes, ''), 1000))
  returning order_number into v_order_number;

  for v_item in select value from jsonb_array_elements(v_snapshots)
  loop
    insert into public.order_items (order_id, menu_item_id, item_name, category, quantity, unit_price, subtotal, modifier, notes)
    values (v_order_id, v_item->>'menu_item_id', v_item->>'item_name', v_item->>'category', (v_item->>'quantity')::integer, (v_item->>'unit_price')::integer, (v_item->>'subtotal')::integer, v_item->'modifier', v_item->>'notes');
  end loop;

  insert into public.payments (order_id, amount, status)
  values (v_order_id, v_subtotal, v_payment_status);

  return jsonb_build_object(
    'id', v_order_id,
    'order_number', v_order_number,
    'subtotal', v_subtotal,
    'total', v_subtotal,
    'payment_status', v_payment_status,
    'items', v_snapshots
  );
end;
$$;

revoke all on function public.create_dine_in_order(text, text, text, text, uuid, text, jsonb) from public;
grant execute on function public.create_dine_in_order(text, text, text, text, uuid, text, jsonb) to anon, authenticated;

create or replace function public.get_customer_order(p_order_id uuid, p_customer_access_token text)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_order public.orders%rowtype;
begin
  select * into v_order from public.orders where id = p_order_id;
  if not found or p_customer_access_token is null or p_customer_access_token !~ '^[0-9a-f]{64}$'
    or v_order.customer_access_token_hash <> encode(digest(p_customer_access_token, 'sha256'), 'hex') then
    raise exception 'Pesanan tidak ditemukan' using errcode = '42501';
  end if;
  return jsonb_build_object(
    'id', v_order.id,
    'order_number', v_order.order_number,
    'table_number', v_order.table_number,
    'customer_name', v_order.customer_name,
    'subtotal', v_order.subtotal,
    'total', v_order.total,
    'payment_method', v_order.payment_method,
    'payment_status', v_order.payment_status,
    'order_status', v_order.order_status,
    'kitchen_notes', v_order.kitchen_notes,
    'transfer_proof_path', v_order.transfer_proof_path,
    'created_at', v_order.created_at,
    'items', coalesce((select jsonb_agg(jsonb_build_object(
      'menu_item_id', oi.menu_item_id, 'item_name', oi.item_name, 'category', oi.category,
      'quantity', oi.quantity, 'unit_price', oi.unit_price, 'subtotal', oi.subtotal,
      'modifier', oi.modifier, 'notes', oi.notes
    )) from public.order_items oi where oi.order_id = v_order.id), '[]'::jsonb)
  );
end;
$$;
revoke all on function public.get_customer_order(uuid, text) from public;
grant execute on function public.get_customer_order(uuid, text) to anon, authenticated;

create or replace function public.submit_transfer_proof(p_order_id uuid, p_customer_access_token text, p_object_path text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order public.orders%rowtype;
begin
  select * into v_order from public.orders where id = p_order_id;
  if not found or p_customer_access_token is null or p_customer_access_token !~ '^[0-9a-f]{64}$'
    or v_order.customer_access_token_hash <> encode(digest(p_customer_access_token, 'sha256'), 'hex')
    or v_order.payment_method <> 'qris'
    or v_order.payment_status not in ('menunggu_verifikasi', 'ditolak')
    or p_object_path !~ ('^' || p_order_id::text || '/[0-9a-f-]{36}\.(jpg|jpeg|png|webp)$') then
    raise exception 'Bukti pembayaran tidak dapat dikaitkan ke pesanan' using errcode = '42501';
  end if;
  update public.orders set transfer_proof_path = p_object_path, payment_status = 'menunggu_verifikasi' where id = p_order_id;
  update public.payments set transfer_proof_path = p_object_path, status = 'menunggu_verifikasi', rejection_reason = null where order_id = p_order_id;
end;
$$;
revoke all on function public.submit_transfer_proof(uuid, text, text) from public;
grant execute on function public.submit_transfer_proof(uuid, text, text) to anon, authenticated;

create or replace function public.admin_set_order_status(p_order_id uuid, p_status text, p_reason text default null)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Admin diperlukan' using errcode = '42501';
  end if;
  if p_status not in ('menunggu', 'dikonfirmasi', 'diracik', 'selesai', 'dibatalkan')
    or (p_status = 'dibatalkan' and nullif(trim(p_reason), '') is null) then
    raise exception 'Perubahan status tidak valid' using errcode = '22023';
  end if;
  update public.orders
    set order_status = p_status,
        cancellation_reason = case when p_status = 'dibatalkan' then left(trim(p_reason), 500) else cancellation_reason end
    where id = p_order_id;
  if not found then raise exception 'Pesanan tidak ditemukan' using errcode = 'P0002'; end if;
end;
$$;
revoke all on function public.admin_set_order_status(uuid, text, text) from public;
grant execute on function public.admin_set_order_status(uuid, text, text) to authenticated;

create or replace function public.admin_update_qris(
  p_order_id uuid,
  p_status text,
  p_reason text default null,
  p_rrn text default null,
  p_issuer text default null,
  p_terminal_id text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then raise exception 'Admin diperlukan' using errcode = '42501'; end if;
  if p_status not in ('terverifikasi', 'ditolak')
    or (p_status = 'ditolak' and nullif(trim(p_reason), '') is null) then
    raise exception 'Status verifikasi tidak valid' using errcode = '22023';
  end if;
  update public.payments set
    status = p_status,
    rejection_reason = case when p_status = 'ditolak' then left(trim(p_reason), 500) else null end,
    rrn = coalesce(nullif(trim(p_rrn), ''), rrn),
    issuer = coalesce(nullif(trim(p_issuer), ''), issuer),
    terminal_id = coalesce(nullif(trim(p_terminal_id), ''), terminal_id),
    verified_by = auth.uid(),
    verified_at = now()
  where order_id = p_order_id and status in ('menunggu_verifikasi', 'ditolak');
  if not found then raise exception 'Pembayaran tidak ditemukan atau sudah diverifikasi' using errcode = 'P0002'; end if;
  update public.orders set
    payment_status = p_status,
    order_status = case when p_status = 'ditolak' then 'dibatalkan' when order_status = 'menunggu' then 'dikonfirmasi' else order_status end,
    cancellation_reason = case when p_status = 'ditolak' then 'QRIS Ditolak: ' || left(trim(p_reason), 500) else cancellation_reason end,
    verified_by = auth.uid(),
    verified_at = now()
  where id = p_order_id;
end;
$$;
revoke all on function public.admin_update_qris(uuid, text, text, text, text, text) from public;
grant execute on function public.admin_update_qris(uuid, text, text, text, text, text) to authenticated;

create or replace function public.admin_mark_cash_paid(p_order_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then raise exception 'Admin diperlukan' using errcode = '42501'; end if;
  update public.payments set status = 'tunai_lunas', verified_by = auth.uid(), verified_at = now()
  where order_id = p_order_id and status = 'menunggu_tunai'
    and exists (select 1 from public.orders where id = p_order_id and payment_method = 'cash');
  if not found then raise exception 'Pembayaran tunai tidak ditemukan atau sudah diproses' using errcode = 'P0002'; end if;
  update public.orders set payment_status = 'tunai_lunas', verified_by = auth.uid(), verified_at = now()
  where id = p_order_id and payment_method = 'cash';
end;
$$;
revoke all on function public.admin_mark_cash_paid(uuid) from public;
grant execute on function public.admin_mark_cash_paid(uuid) to authenticated;

create or replace function public.can_upload_transfer_proof(object_name text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.orders o
    where o.id::text = split_part(object_name, '/', 1)
      and o.payment_method = 'qris'
      and o.payment_status in ('menunggu_verifikasi', 'ditolak')
      and split_part(object_name, '/', 2) ~* '^[0-9a-f-]{36}\.(jpg|jpeg|png|webp)$'
  );
$$;
revoke all on function public.can_upload_transfer_proof(text) from public;
grant execute on function public.can_upload_transfer_proof(text) to anon, authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('transfer-proofs', 'transfer-proofs', false, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set public = false, file_size_limit = 5242880, allowed_mime_types = excluded.allowed_mime_types;

create policy "customers can upload proof to an order path" on storage.objects
  for insert to anon, authenticated with check (
    bucket_id = 'transfer-proofs'
    and public.can_upload_transfer_proof(name)
  );
create policy "admins can read transfer proofs" on storage.objects
  for select to authenticated using (bucket_id = 'transfer-proofs' and public.is_admin());
create policy "admins can manage transfer proofs" on storage.objects
  for delete to authenticated using (bucket_id = 'transfer-proofs' and public.is_admin());
