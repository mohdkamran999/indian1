import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const BASE_URL = "https://indianhandicraftstandards.com";
const csv = (value: unknown) => {
  const text = String(value ?? "");
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};
const money = (value: unknown) => `${Math.max(0, Number(value) || 0).toFixed(2)} INR`;

export const Route = createFileRoute("/meta-catalog.csv")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const { data, error } = await supabaseAdmin
            .from("products")
            .select("id, name, slug, description, price, original_price, images, stock, track_inventory, is_published, color, colors, sizes")
            .eq("is_published", true)
            .order("created_at", { ascending: false });
          if (error) throw error;
          const rows = [
            ["id", "title", "description", "availability", "condition", "price", "sale_price", "link", "image_link", "brand", "google_product_category", "color", "size"].join(","),
            ...(data ?? []).filter((p: any) => Array.isArray(p.images) && p.images[0]).map((p: any) => {
              const price = Number(p.price ?? 0);
              const mrp = Number(p.original_price ?? price);
              const inStock = p.track_inventory === false || Number(p.stock ?? 0) > 0;
              const image = String(p.images[0]).startsWith("http") ? p.images[0] : `${BASE_URL}${p.images[0]}`;
              const colors = Array.isArray(p.colors) ? p.colors : p.color ? [p.color] : [];
              return [p.id, p.name, p.description || p.name, inStock ? "in stock" : "out of stock", "new", money(mrp), mrp > price ? money(price) : "", `${BASE_URL}/product/${p.slug}`, image, "Indian Handicraft Standards", "Apparel & Accessories > Clothing", colors[0] || "", Array.isArray(p.sizes) ? p.sizes.join(" / ") : ""].map(csv).join(",");
            }),
          ];
          return new Response(rows.join("\r\n"), { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": 'inline; filename="ihs-meta-catalog.csv"', "Cache-Control": "public, max-age=900" } });
        } catch (error) {
          console.error("[Meta catalogue feed]", error);
          return new Response("Catalogue feed temporarily unavailable. Check the server-side commerce database configuration.", { status: 503, headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" } });
        }
      },
    },
  },
});