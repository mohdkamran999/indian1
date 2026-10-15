-- IHS commerce operations v2.
-- Additive by design: this migration supports a clean new database while never
-- dropping or rewriting existing product, customer, order, or auth records.
-- Private operational tables are accessed through trusted server functions only.

create table if not exists public.catalog_import_jobs (
  id uuid primary key default gen_random_uuid(),
  source text not null default 'csv' check (source in ('csv','xlsx','api')),
  file_name text,
  status text not null default 'queued' check (status in ('queued','validating','ready','processing','completed','completed_with_errors','failed','cancelled')),
  mode text not null default 'upsert' check (mode in ('create_only','update_only','upsert')),
  total_rows integer not null default 0 check (total_rows >= 0),
  valid_rows integer not null default 0 check (valid_rows >= 0),
  processed_rows integer not null default 0 check (processed_rows >= 0),
  failed_rows integer not null default 0 check (failed_rows >= 0),
  summary jsonb not null default '{}'::jsonb,
  created_by uuid references auth.users(id) on delete set null,
  started_at timestamptz,
  finished_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.catalog_import_rows (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.catalog_import_jobs(id) on delete cascade,
  row_number integer not null check (row_number > 0),
  external_id text,
  sku text,
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'pending' check (status in ('pending','valid','created','updated','skipped','failed')),
  errors jsonb not null default '[]'::jsonb,
  product_id uuid references public.products(id) on delete set null,
  created_at timestamptz not null default now(),
  unique(job_id, row_number)
);

create index if not exists catalog_import_jobs_created_at_idx on public.catalog_import_jobs(created_at desc);
create index if not exists catalog_import_rows_job_status_idx on public.catalog_import_rows(job_id, status);
create index if not exists catalog_import_rows_sku_idx on public.catalog_import_rows(sku) where sku is not null;

create table if not exists public.product_media_assets (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  variant_id uuid references public.product_variants(id) on delete set null,
  media_type text not null default 'image' check (media_type in ('image','video','size_chart','embroidery_detail','packaging')),
  public_url text not null,
  alt_text text,
  sort_order integer not null default 0,
  is_primary boolean not null default false,
  channel_eligibility text[] not null default array['website','google','meta']::text[],
  created_at timestamptz not null default now()
);

create index if not exists product_media_assets_product_order_idx on public.product_media_assets(product_id, sort_order);

create table if not exists public.commerce_channel_connections (
  id uuid primary key default gen_random_uuid(),
  channel text not null unique check (channel in ('google_merchant','meta_commerce','whatsapp_business')),
  display_name text not null,
  status text not null default 'not_configured' check (status in ('not_configured','needs_authorization','pending_review','connected','error','paused')),
  external_account_id text,
  external_catalog_id text,
  feed_url text,
  last_sync_at timestamptz,
  last_sync_status text,
  last_error text,
  settings jsonb not null default '{}'::jsonb,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.commerce_channel_sync_runs (
  id uuid primary key default gen_random_uuid(),
  channel text not null check (channel in ('google_merchant','meta_commerce','whatsapp_business')),
  sync_type text not null default 'feed' check (sync_type in ('feed','api','manual')),
  status text not null default 'queued' check (status in ('queued','running','completed','completed_with_errors','failed','cancelled')),
  items_total integer not null default 0 check (items_total >= 0),
  items_success integer not null default 0 check (items_success >= 0),
  items_failed integer not null default 0 check (items_failed >= 0),
  request_summary jsonb not null default '{}'::jsonb,
  result_summary jsonb not null default '{}'::jsonb,
  error_message text,
  started_at timestamptz,
  finished_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists commerce_channel_sync_runs_channel_created_idx on public.commerce_channel_sync_runs(channel, created_at desc);

create table if not exists public.order_fulfillment_events (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  event_type text not null check (event_type in ('packed','label_created','shipped','in_transit','out_for_delivery','delivered','delivery_failed','return_started','returned','cancelled','note')),
  event_time timestamptz not null default now(),
  carrier text,
  tracking_number text,
  tracking_url text,
  location text,
  note text,
  external_event_id text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique(order_id, external_event_id)
);

create index if not exists order_fulfillment_events_order_time_idx on public.order_fulfillment_events(order_id, event_time desc);

-- No public/anon access to operational logs or integration configuration.
-- Trusted server functions use the service-role client and bypass RLS.
alter table public.catalog_import_jobs enable row level security;
alter table public.catalog_import_rows enable row level security;
alter table public.product_media_assets enable row level security;
alter table public.commerce_channel_connections enable row level security;
alter table public.commerce_channel_sync_runs enable row level security;
alter table public.order_fulfillment_events enable row level security;

comment on table public.catalog_import_jobs is 'IHS bulk catalogue import history and validation summary.';
comment on table public.catalog_import_rows is 'Per-row import payload, validation errors and processing outcome.';
comment on table public.product_media_assets is 'Variant-aware product photography and channel eligibility.';
comment on table public.commerce_channel_connections is 'Server-managed Google, Meta and WhatsApp connection metadata; never store access tokens in settings JSON.';
comment on table public.commerce_channel_sync_runs is 'Audit trail for catalogue feed/API synchronization.';
comment on table public.order_fulfillment_events is 'Shipment timeline events and carrier tracking history.';
