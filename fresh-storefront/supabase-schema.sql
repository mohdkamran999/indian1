-- IHS Fresh Storefront: run this in Supabase SQL Editor for project uscsoscckihhlmiwzqny.
-- This schema uses authenticated admin access for writes and public read access only for active products.
create extension if not exists pgcrypto;

create table if not exists public.ihs_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'admin' check (role in ('admin','staff')),
  created_at timestamptz not null default now()
);

create table if not exists public.ihs_products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique,
  category text not null check (category in ('Kurtis','Palazzo Sets','Suits & Dupattas','Pants & Bottoms','Other')),
  description text not null default '',
  fabric text not null default '',
  work_type text not null default '',
  colour text not null default '',
  image_url text not null default '',
  gallery_urls text[] not null default '{}',
  price_inr numeric(10,2) not null check (price_inr >= 0),
  mrp_inr numeric(10,2) check (mrp_inr is null or mrp_inr >= price_inr),
  status text not null default 'draft' check (status in ('draft','active','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ihs_product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.ihs_products(id) on delete cascade,
  sku text unique,
  size_label text not null default 'Free size',
  colour text not null default '',
  stock integer not null default 0 check (stock >= 0),
  price_inr numeric(10,2) check (price_inr is null or price_inr >= 0),
  created_at timestamptz not null default now(),
  unique(product_id, size_label, colour)
);

create table if not exists public.ihs_orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null default ('IHS-' || upper(substr(replace(gen_random_uuid()::text,'-',''),1,10))),
  customer_name text not null,
  customer_email text not null default '',
  customer_phone text not null,
  shipping_address jsonb not null default '{}'::jsonb,
  items jsonb not null default '[]'::jsonb,
  subtotal_inr numeric(10,2) not null default 0 check (subtotal_inr >= 0),
  shipping_inr numeric(10,2) not null default 0 check (shipping_inr >= 0),
  total_inr numeric(10,2) not null default 0 check (total_inr >= 0),
  payment_status text not null default 'pending' check (payment_status in ('pending','paid','failed','refunded')),
  order_status text not null default 'new' check (order_status in ('new','confirmed','packed','shipped','delivered','cancelled')),
  tracking_number text not null default '',
  tracking_url text not null default '',
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.ihs_is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.ihs_profiles p where p.id = auth.uid() and p.role in ('admin','staff'));
$$;

alter table public.ihs_profiles enable row level security;
alter table public.ihs_products enable row level security;
alter table public.ihs_product_variants enable row level security;
alter table public.ihs_orders enable row level security;

drop policy if exists "IHS admins read profiles" on public.ihs_profiles;
create policy "IHS admins read profiles" on public.ihs_profiles for select to authenticated using (public.ihs_is_admin());
drop policy if exists "Public can read active products" on public.ihs_products;
create policy "Public can read active products" on public.ihs_products for select to anon, authenticated using (status = 'active' or public.ihs_is_admin());
drop policy if exists "IHS admins manage products" on public.ihs_products;
create policy "IHS admins manage products" on public.ihs_products for all to authenticated using (public.ihs_is_admin()) with check (public.ihs_is_admin());
drop policy if exists "Public can read variants for active products" on public.ihs_product_variants;
create policy "Public can read variants for active products" on public.ihs_product_variants for select to anon, authenticated using (exists (select 1 from public.ihs_products p where p.id = product_id and (p.status = 'active' or public.ihs_is_admin())));
drop policy if exists "IHS admins manage variants" on public.ihs_product_variants;
create policy "IHS admins manage variants" on public.ihs_product_variants for all to authenticated using (public.ihs_is_admin()) with check (public.ihs_is_admin());
drop policy if exists "IHS admins manage orders" on public.ihs_orders;
create policy "IHS admins manage orders" on public.ihs_orders for all to authenticated using (public.ihs_is_admin()) with check (public.ihs_is_admin());

create or replace function public.ihs_touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;
drop trigger if exists ihs_products_touch_updated_at on public.ihs_products;
create trigger ihs_products_touch_updated_at before update on public.ihs_products for each row execute function public.ihs_touch_updated_at();
drop trigger if exists ihs_orders_touch_updated_at on public.ihs_orders;
create trigger ihs_orders_touch_updated_at before update on public.ihs_orders for each row execute function public.ihs_touch_updated_at();

-- After creating your own admin account in Supabase Authentication, run this once with that user's UUID:
-- insert into public.ihs_profiles (id, role) values ('YOUR_AUTH_USER_UUID', 'admin')
-- on conflict (id) do update set role = 'admin';
