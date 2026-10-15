import { createFileRoute } from "@tanstack/react-router";
import { listPublishedProducts } from "@/lib/storefront.functions";

const BASE_URL = "https://indianhandicraftstandards.com";

function xml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function absoluteUrl(value: string): string {
  try {
    return new URL(value, BASE_URL).toString();
  } catch {
    return "";
  }
}

function itemTag(name: string, value: unknown): string {
  return "      <g:" + name + ">" + xml(value) + "</g:" + name + ">";
}

export const Route = createFileRoute("/google-product-feed.xml")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const products = await listPublishedProducts();
          const items = products
            .filter((p) => p.name && p.slug && p.images?.[0] && absoluteUrl(p.images[0]))
            .map((p) => {
              const link = BASE_URL + "/product/" + encodeURIComponent(p.slug);
              const image = absoluteUrl(p.images[0]);
              const available = p.trackInventory === false || Number(p.stock) > 0;
              const category = String(p.category || "clothing").replace(/-/g, " ");
              const description = String(p.description || p.name).slice(0, 4500);
              const lines = [
                "    <item>",
                itemTag("id", p.id),
                itemTag("title", String(p.name).slice(0, 150)),
                itemTag("description", description),
                itemTag("link", link),
                itemTag("image_link", image),
                itemTag("availability", available ? "in_stock" : "out_of_stock"),
                itemTag("price", Number(p.price).toFixed(2) + " INR"),
                itemTag("condition", "new"),
                itemTag("brand", "Indian Handicraft Standards"),
                itemTag("product_type", category),
                itemTag("google_product_category", "Apparel & Accessories > Clothing"),
              ];
              lines.push("    </item>");
              return lines.join("\n");
            });

          const body = [
            '<?xml version="1.0" encoding="UTF-8"?>',
            '<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">',
            "  <channel>",
            "    <title>Indian Handicraft Standards</title>",
            "    <link>" + BASE_URL + "</link>",
            "    <description>Published Lucknowi Chikankari apparel from Indian Handicraft Standards</description>",
            ...items,
            "  </channel>",
            "</rss>",
          ].join("\n");

          return new Response(body, {
            status: 200,
            headers: {
              "Content-Type": "application/xml; charset=utf-8",
              "Cache-Control": "public, max-age=900",
              "X-Content-Type-Options": "nosniff",
            },
          });
        } catch (error) {
          console.error("[Google product feed] Could not load published products", error);
          return new Response("Product feed temporarily unavailable", {
            status: 503,
            headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
          });
        }
      },
    },
  },
});
