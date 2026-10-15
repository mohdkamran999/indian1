-- IHS guest checkout without a Supabase service-role key.
-- Public execution is limited to a transactional checkout RPC and a narrowly scoped
-- order lookup requiring BOTH the order number and the customer's email address.
-- All products, prices, variant stock and discounts are verified server-side.

create or replace function public.create_guest_order(
  p_customer_name text,
  p_customer_email text,
  p_customer_phone text,
  p_shipping_address jsonb,
  p_items jsonb,
  p_coupon_code text default null,
  p_payment_method text default 'cod'
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order public.orders%rowtype;
  v_product public.products%rowtype;
  v_variant public.product_variants%rowtype;
  v_coupon public.coupons%rowtype;
  v_item jsonb;
  v_product_id uuid;
  v_slug text;
  v_size text;
  v_color text;
  v_qty integer;
  v_variant_count integer;
  v_subtotal numeric(10,2) := 0;
  v_shipping numeric(10,2) := 0;
  v_gst numeric(10,2) := 0;
  v_discount numeric(10,2) := 0;
  v_total numeric(10,2) := 0;
  v_coupon_code text := null;
begin
  if length(btrim(coalesce(p_customer_name, ''))) not between 2 and 120 then
    raise exception 'Please enter a valid customer name';
  end if;
  if length(btrim(coalesce(p_customer_email, ''))) > 200
     or btrim(coalesce(p_customer_email, '')) !~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$' then
    raise exception 'Please enter a valid email address';
  end if;
  if length(btrim(coalesce(p_customer_phone, ''))) not between 5 and 20 then
    raise exception 'Please enter a valid phone number';
  end if;
  if jsonb_typeof(p_shipping_address) <> 'object' then
    raise exception 'A shipping address is required';
  end if;
  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) not between 1 and 50 then
    raise exception 'The cart must contain between 1 and 50 line items';
  end if;
  if coalesce(p_payment_method, 'cod') not in ('cod', 'razorpay') then
    raise exception 'Unsupported payment method';
  end if;

  -- Validate each item and reserve real stock while holding row locks. Client-provided
  -- names, images, prices and totals are deliberately ignored.
  for v_item in select value from jsonb_array_elements(p_items)
  loop
    v_product_id := nullif(v_item->>'product_id', '')::uuid;
    v_slug := left(btrim(coalesce(v_item->>'product_slug', '')), 300);
    v_size := left(btrim(coalesce(v_item->>'size', '')), 40);
    v_color := nullif(left(btrim(coalesce(v_item->>'color', '')), 80), '');
    v_qty := (v_item->>'qty')::integer;

    if v_qty is null or v_qty < 1 or v_qty > 99 then
      raise exception 'Invalid item quantity';
    end if;
    if v_product_id is null and v_slug = '' then
      raise exception 'A product identifier is required';
    end if;

    if v_product_id is not null then
      select * into v_product
      from public.products
      where id = v_product_id and is_published = true
      for update;
    else
      select * into v_product
      from public.products
      where slug = v_slug and is_published = true
      for update;
    end if;

    if not found then
      raise exception 'A product in your cart is no longer available';
    end if;

    if v_size = '' or (
      coalesce(array_length(v_product.sizes, 1), 0) > 0
      and not (v_size = any(v_product.sizes))
    ) then
      raise exception 'The selected size is not available for %', v_product.name;
    end if;

    if v_color is not null
      and coalesce(array_length(v_product.colors, 1), 0) > 0
      and not (v_color = any(v_product.colors)) then
      raise exception 'The selected colour is not available for %', v_product.name;
    end if;

    if coalesce(v_product.track_inventory, true) then
      select count(*) into v_variant_count
      from public.product_variants
      where product_id = v_product.id;

      if v_variant_count > 0 then
        select * into v_variant
        from public.product_variants
        where product_id = v_product.id
          and size = v_size
          and coalesce(color, '') = coalesce(v_color, '')
        for update;

        if not found or v_variant.stock < v_qty then
          raise exception 'The selected size/colour is out of stock for %', v_product.name;
        end if;

        update public.product_variants
        set stock = stock - v_qty
        where id = v_variant.id;
      else
        if coalesce(v_product.stock, 0) < v_qty then
          raise exception 'Not enough stock for %', v_product.name;
        end if;
        update public.products
        set stock = stock - v_qty
        where id = v_product.id;
      end if;
    end if;

    v_subtotal := v_subtotal + (v_product.price * v_qty);
  end loop;

  v_shipping := case when v_subtotal = 0 or v_subtotal > 999 then 0 else 79 end;
  v_gst := round(v_subtotal * 0.05);

  if nullif(btrim(coalesce(p_coupon_code, '')), '') is not null then
    select * into v_coupon
    from public.coupons
    where code = upper(btrim(p_coupon_code))
      and is_active = true
      and (expires_at is null or expires_at > now())
      and v_subtotal >= min_order
    limit 1;

    if found then
      v_coupon_code := v_coupon.code;
      if v_coupon.discount_type = 'percent' then
        v_discount := round(v_subtotal * v_coupon.discount_value / 100);
      else
        v_discount := least(v_subtotal, v_coupon.discount_value);
      end if;
    end if;
  end if;

  v_discount := least(v_subtotal + v_gst + v_shipping, greatest(0, v_discount));
  v_total := greatest(0, v_subtotal + v_gst + v_shipping - v_discount);

  insert into public.orders (
    user_id, customer_email, customer_name, customer_phone, shipping_address,
    subtotal, gst, shipping, discount, total, coupon_code,
    status, payment_status, payment_method
  ) values (
    null, lower(btrim(p_customer_email)), btrim(p_customer_name), btrim(p_customer_phone),
    p_shipping_address, v_subtotal, v_gst, v_shipping, v_discount, v_total, v_coupon_code,
    'pending', 'unpaid', coalesce(p_payment_method, 'cod')
  )
  returning * into v_order;

  for v_item in select value from jsonb_array_elements(p_items)
  loop
    v_product_id := nullif(v_item->>'product_id', '')::uuid;
    v_slug := left(btrim(coalesce(v_item->>'product_slug', '')), 300);
    v_size := left(btrim(coalesce(v_item->>'size', '')), 40);
    v_color := nullif(left(btrim(coalesce(v_item->>'color', '')), 80), '');
    v_qty := (v_item->>'qty')::integer;

    if v_product_id is not null then
      select * into v_product from public.products where id = v_product_id;
    else
      select * into v_product from public.products where slug = v_slug;
    end if;

    insert into public.order_items (
      order_id, product_id, product_name, product_slug, image, size, color, qty, price
    ) values (
      v_order.id, v_product.id, v_product.name, v_product.slug,
      v_product.images[1], v_size, v_color, v_qty, v_product.price
    );
  end loop;

  return jsonb_build_object(
    'id', v_order.id,
    'order_number', v_order.order_number,
    'total', v_order.total
  );
end;
$$;

create or replace function public.lookup_guest_order(
  p_order_number text,
  p_customer_email text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order public.orders%rowtype;
  v_items jsonb;
begin
  if length(btrim(coalesce(p_order_number, ''))) not between 4 and 40
     or length(btrim(coalesce(p_customer_email, ''))) > 200 then
    raise exception 'Enter the order number and email used at checkout';
  end if;

  select * into v_order
  from public.orders
  where upper(order_number) = upper(btrim(p_order_number))
    and lower(customer_email) = lower(btrim(p_customer_email))
  limit 1;

  if not found then
    raise exception 'No order found with that order number and email';
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'product_name', product_name,
    'product_slug', product_slug,
    'image', image,
    'size', size,
    'color', color,
    'qty', qty,
    'price', price
  ) order by created_at), '[]'::jsonb)
  into v_items
  from public.order_items
  where order_id = v_order.id;

  return jsonb_build_object(
    'id', v_order.id,
    'order_number', v_order.order_number,
    'status', v_order.status,
    'payment_status', v_order.payment_status,
    'total', v_order.total,
    'tracking_number', v_order.tracking_number,
    'tracking_url', v_order.tracking_url,
    'created_at', v_order.created_at,
    'customer_name', v_order.customer_name,
    'shipping_address', v_order.shipping_address,
    'items', v_items,
    'shipment', null
  );
end;
$$;

revoke all on function public.create_guest_order(text, text, text, jsonb, jsonb, text, text) from public;
grant execute on function public.create_guest_order(text, text, text, jsonb, jsonb, text, text) to anon, authenticated;
revoke all on function public.lookup_guest_order(text, text) from public;
grant execute on function public.lookup_guest_order(text, text) to anon, authenticated;
