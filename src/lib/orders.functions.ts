import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createPublicServerClient } from "@/integrations/supabase/public-server";

const ItemSchema = z.object({
  product_id: z.string().uuid().nullable().optional(),
  product_name: z.string().min(1).max(300),
  product_slug: z.string().min(1).max(300),
  image: z.string().max(2000).optional().nullable(),
  size: z.string().min(1).max(40),
  color: z.string().max(80).optional().nullable(),
  qty: z.number().int().min(1).max(99),
  // Kept for wire compatibility with the cart, but never trusted for charging.
  price: z.number().min(0).max(1_000_000),
});

const CreateOrderSchema = z.object({
  customer_name: z.string().min(2).max(120),
  customer_email: z.string().email().max(200),
  customer_phone: z.string().min(5).max(20),
  shipping_address: z.object({
    line1: z.string().min(1).max(200),
    city: z.string().min(1).max(100),
    state: z.string().max(100).optional().default(""),
    pincode: z.string().min(3).max(10),
    country: z.string().max(60).default("India"),
  }),
  items: z.array(ItemSchema).min(1).max(50),
  coupon_code: z.string().max(40).optional().nullable(),
  payment_method: z.enum(["cod", "razorpay"]).default("cod"),
  user_id: z.string().uuid().nullable().optional(),
});

export const createOrder = createServerFn({ method: "POST" })
  .inputValidator((input) => CreateOrderSchema.parse(input))
  .handler(async ({ data }) => {
    const supabasePublic = createPublicServerClient();

    // Checkout is performed transactionally by Postgres. The database reloads
    // the current product price, checks the selected variant's stock, reserves
    // inventory, calculates discounts/tax/shipping and creates the order+items.
    // Browser-provided prices, images, names and totals are not authoritative.
    const items = data.items.map((item) => ({
      product_id: item.product_id ?? null,
      product_slug: item.product_slug,
      qty: item.qty,
      size: item.size,
      color: item.color ?? null,
    }));

    const { data: result, error } = await (supabasePublic as any).rpc(
      "create_guest_order",
      {
        p_customer_name: data.customer_name.trim(),
        p_customer_email: data.customer_email.trim().toLowerCase(),
        p_customer_phone: data.customer_phone.trim(),
        p_shipping_address: data.shipping_address,
        p_items: items,
        p_coupon_code: data.coupon_code?.trim() ? data.coupon_code.trim().toUpperCase() : null,
        p_payment_method: data.payment_method,
      },
    );

    if (error) {
      console.error("[IHS checkout]", error.message);
      throw new Error(error.message || "Unable to place your order. Please check stock and try again.");
    }
    if (!result || typeof result.order_number !== "string" || typeof result.id !== "string") {
      throw new Error("The order was not confirmed by the store database. Please do not retry payment until you contact support.");
    }

    return {
      order_number: result.order_number as string,
      id: result.id as string,
      total: Number(result.total ?? 0),
    };
  });

const TrackSchema = z.object({
  order_number: z.string().min(1).max(40),
  email: z.string().email().max(200),
});

export const trackOrder = createServerFn({ method: "POST" })
  .inputValidator((input) => TrackSchema.parse(input))
  .handler(async ({ data }) => {
    const supabasePublic = createPublicServerClient();
    const { data: order, error } = await (supabasePublic as any).rpc(
      "lookup_guest_order",
      {
        p_order_number: data.order_number.trim().toUpperCase(),
        p_customer_email: data.email.trim().toLowerCase(),
      },
    );

    if (error || !order) {
      throw new Error("No order found with that order number and email.");
    }

    return order;
  });
