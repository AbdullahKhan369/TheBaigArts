-- ============================================================
-- THE BAIGARTS — Supabase Schema
-- Run this entire file once in Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- ============================================================

-- EXTENSIONS
create extension if not exists "pgcrypto";

-- ============================================
-- PAINTINGS TABLE
-- ============================================
create table if not exists paintings (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  price numeric(10,2) not null check (price >= 0),
  currency text not null default 'PKR',
  image_urls text[] not null default '{}',
  status text not null default 'available' check (status in ('available', 'sold')),
  dimensions text,
  medium text,
  category text,
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_paintings_status on paintings(status);
create index if not exists idx_paintings_featured on paintings(is_featured);
create index if not exists idx_paintings_slug on paintings(slug);

-- ============================================
-- ORDERS TABLE
-- ============================================
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  painting_id uuid references paintings(id) on delete set null,
  painting_title_snapshot text not null,
  painting_price_snapshot numeric(10,2) not null,

  customer_name text not null,
  customer_phone text not null,

  house_number text,
  street text,
  area text not null,
  city text not null,
  province text not null,
  postal_code text,
  landmark text,
  notes text,

  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'rejected', 'completed', 'cancelled')),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_orders_status on orders(status);
create index if not exists idx_orders_painting on orders(painting_id);

-- ============================================
-- ORDER NUMBER SEQUENCE + AUTO-GENERATION
-- ============================================
create sequence if not exists order_number_seq start 1000;

create or replace function generate_order_number()
returns trigger as $$
begin
  new.order_number := 'BG-' || nextval('order_number_seq');
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_order_number on orders;
create trigger set_order_number
  before insert on orders
  for each row
  when (new.order_number is null)
  execute function generate_order_number();

-- ============================================
-- updated_at AUTO-UPDATE TRIGGER (shared)
-- ============================================
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at := now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists paintings_updated_at on paintings;
create trigger paintings_updated_at
  before update on paintings
  for each row
  execute function set_updated_at();

drop trigger if exists orders_updated_at on orders;
create trigger orders_updated_at
  before update on orders
  for each row
  execute function set_updated_at();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
alter table paintings enable row level security;
alter table orders enable row level security;

-- PAINTINGS: anyone can read
drop policy if exists "Public can view paintings" on paintings;
create policy "Public can view paintings"
  on paintings for select
  to anon, authenticated
  using (true);

-- PAINTINGS: only authenticated (admin) can write
drop policy if exists "Admin can insert paintings" on paintings;
create policy "Admin can insert paintings"
  on paintings for insert
  to authenticated
  with check (true);

drop policy if exists "Admin can update paintings" on paintings;
create policy "Admin can update paintings"
  on paintings for update
  to authenticated
  using (true);

drop policy if exists "Admin can delete paintings" on paintings;
create policy "Admin can delete paintings"
  on paintings for delete
  to authenticated
  using (true);

-- ORDERS: only authenticated (admin) can read/update/delete
drop policy if exists "Admin can view orders" on orders;
create policy "Admin can view orders"
  on orders for select
  to authenticated
  using (true);

drop policy if exists "Admin can update orders" on orders;
create policy "Admin can update orders"
  on orders for update
  to authenticated
  using (true);

drop policy if exists "Admin can delete orders" on orders;
create policy "Admin can delete orders"
  on orders for delete
  to authenticated
  using (true);

-- NOTE: there is intentionally NO direct anon INSERT policy on orders.
-- Removing any leftover policy from a previous version of this schema:
drop policy if exists "Public can create orders" on orders;
-- Public order creation goes through the create_public_order() function below
-- instead of a raw table insert. Reason: Supabase/PostgREST's `.insert().select()`
-- pattern requires a SELECT RLS policy to return the inserted row, and giving
-- anon SELECT on orders would let the public read every customer's order history.
-- A SECURITY DEFINER function sidesteps this cleanly, and — as a bonus — it also
-- re-checks the painting's real price/title/status on the server instead of
-- trusting whatever the client sent, and rejects the order if the painting was
-- sold in the meantime (real race-condition protection).

-- ============================================
-- PUBLIC ORDER CREATION FUNCTION
-- ============================================
create or replace function create_public_order(
  p_painting_id uuid,
  p_customer_name text,
  p_customer_phone text,
  p_house_number text,
  p_street text,
  p_area text,
  p_city text,
  p_province text,
  p_postal_code text,
  p_landmark text,
  p_notes text
)
returns orders
language plpgsql
security definer
set search_path = public
as $$
declare
  v_painting paintings;
  v_order orders;
begin
  select * into v_painting from paintings where id = p_painting_id;

  if v_painting is null then
    raise exception 'Painting not found';
  end if;

  if v_painting.status = 'sold' then
    raise exception 'This painting has already been sold';
  end if;

  if coalesce(trim(p_customer_name), '') = '' then
    raise exception 'Customer name is required';
  end if;

  if coalesce(trim(p_customer_phone), '') = '' then
    raise exception 'Customer phone is required';
  end if;

  if coalesce(trim(p_area), '') = '' or coalesce(trim(p_city), '') = '' or coalesce(trim(p_province), '') = '' then
    raise exception 'Area, city, and province are required';
  end if;

  insert into orders (
    painting_id, painting_title_snapshot, painting_price_snapshot,
    customer_name, customer_phone, house_number, street, area, city,
    province, postal_code, landmark, notes
  ) values (
    v_painting.id, v_painting.title, v_painting.price,
    p_customer_name, p_customer_phone, p_house_number, p_street, p_area, p_city,
    p_province, p_postal_code, p_landmark, p_notes
  )
  returning * into v_order;

  return v_order;
end;
$$;

revoke all on function create_public_order from public;
grant execute on function create_public_order to anon, authenticated;

-- ============================================
-- STORAGE BUCKET POLICIES
-- Create the 'paintings' bucket first via Dashboard → Storage → New Bucket
-- (name: paintings, Public bucket: ON), then run the policies below.
-- ============================================
drop policy if exists "Public can view painting images" on storage.objects;
create policy "Public can view painting images"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'paintings');

drop policy if exists "Admin can upload painting images" on storage.objects;
create policy "Admin can upload painting images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'paintings');

drop policy if exists "Admin can update painting images" on storage.objects;
create policy "Admin can update painting images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'paintings');

drop policy if exists "Admin can delete painting images" on storage.objects;
create policy "Admin can delete painting images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'paintings');

-- ============================================
-- DONE.
-- Next: Dashboard → Authentication → Users → Add User (create your admin login manually)
-- ============================================
