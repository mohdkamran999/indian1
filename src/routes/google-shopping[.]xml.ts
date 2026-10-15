import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const BASE_URL = "https://indianhandicraftstandards.com";
const xml = (value: unknown) => String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
const money = (value: unknown) => `${Math.max(0, Number(value) || 0).toFixed(2)} INR`;

export const Route = createFileRoute("/google-shopping.xml")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const { data, error } = await supabaseAdmin
            .from("products")
            .select("id, name, slug, description, price, original_price, images, stock, track_inventory, is_published, color, colors, sizes, category:categories(name)")
            .eq("is_published", true)
            .order("created_at", { ascending: false });
          if (error) throw error;

          const items = (data ?? []).filter((p: any) => Array.isArray(p.images) && p.images[0]).map((p: any) => {
            const inStock = p.track_inventory === false || Number(p.stock ?? 0) > 0;
            const price = Number(p.price ?? 0);
            const mrp = Number(p.original_price ?? price);
            const image = String(p.images[0]).startsWith("http") ? p.images[0] : `${BASE_URL}${p.images[0]}`;
            const colors = Array.isArray(p.colors) ? p.colors : p.color ? [p.color] : [];
            return `    <item>
      <g:id>${xml(p.id)}</g:id>
      <g:title>${xml(p.name)}</g:title>
      <g:description>${xml(p.description || p.name)}</g:description>
      <g:link>${xml(`${BASE_URL}/product/${p.slug}`)}</g:link>
      <g:image_link>${xml(image)}</g:image_link>
      <g:availability>${inStock ? "in_stock" : "out_of_stock"}</g:availability>
      <g:condition>new</g:condition>
      <g:price>${money(mrp)}</g:price>
      ${mrp > price ? `<g:sale_price>${money(price)}</g:sale_price>` : ""}
      <g:brand>Indian Handicraft Standards</g:brand>
      <g:google_product_category>Apparel &amp; Accessories &gt; Clothing</g:google_product_category>
      <g:product_type>${xml((p as any).category?.name || "Lucknowi Chikankari")}</g:product_type>
      ${colors[0] ? `<g:color>${xml(colors[0])}</g:color>` : ""}
      ${Array.isArray(p.sizes) ? p.sizes.map((s: string) => `<g:size>${xml(s)}</g:size>`).join("") : ""}
      <g:identifier_exists>no</g:identifier_exists>
    </item>`;
          }).join("\n");
          const body = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0"><channel><title>Indian Handicraft Standards</title><link>${BASE_URL}</link><description>Authentic Lucknowi Chikankari apparel</description>\n${items}\n</channel></rss>`;
          return new Response(body, { headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=900" } });
        } catch (error) {
          console.error("[Google product feed]", error);
          return new Response("Product feed temporarily unavailable. Check the server-side commerce database configuration.", { status: 503, headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" } });
        }
      },
    },
  },
});