import { createFileRoute } from "@tanstack/react-router";
import { listPublishedProducts } from "@/lib/storefront.functions";

const BASE_URL = "https://indianhandicraftstandards.com";

function csv(value: unknown): string {
  const text = String(value ?? "");
  return '"' + text.replace(/"/g, '""') + '"';
}

function absoluteUrl(value: string): string {
  try {
    return new URL(value, BASE_URL).toString();
  } catch {
    return "";
  }
}

export const Route = createFileRoute("/meta-product-feed.csv")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const products = await listPublishedProducts();
          const rows = [
            ["id", "title", "description", "availability", "condition", "price", "link", "image_link", "brand", "product_type"],
            ...products
              .filter((p) => p.name && p.slug && p.images?.[0] && absoluteUrl(p.images[0]))
              .map((p) => [
                p.id,
                String(p.name).slice(0, 150),
                String(p.description || p.name).slice(0, 4500),
                p.trackInventory === false || Number(p.stock) > 0 ? "in stock" : "out of stock",
                "new",
                Number(p.price).toFixed(2) + " INR",
                BASE_URL + "/product/" + encodeURIComponent(p.slug),
                absoluteUrl(p.images[0]),
                "Indian Handicraft Standards",
                String(p.category || "clothing").replace(/-/g, " "),
              ]),
          ];
          const body = rows.map((row) => row.map(csv).join(",")).join("\r\n") + "\r\n";
          return new Response(body, {
            status: 200,
            headers: {
              "Content-Type": "text/csv; charset=utf-8",
              "Cache-Control": "public, max-age=900",
              "X-Content-Type-Options": "nosniff",
            },
          });
        } catch (error) {
          console.error("[Meta product feed] Could not load published products", error);
          return new Response("Product feed temporarily unavailable", {
            status: 503,
            headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
          });
        }
      },
    },
  },
});
