import { useQuery } from "@tanstack/react-query";
import { listPublishedProducts } from "@/lib/storefront.functions";
import { products as staticProducts, type Product } from "@/data/products";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

/**
 * Returns published, admin-managed products for the production storefront.
 * Static sample products are development-only so demo catalogue entries
 * cannot be mistaken for real inventory. Subscribes to product / variant
 * changes so newly added or edited items appear live without a hard refresh.
 */
export function useStorefrontProducts(): Product[] {
  const { data, refetch } = useQuery({
    queryKey: ["storefront-products"],
    queryFn: () => listPublishedProducts(),
    staleTime: 30_000,
  });

  useEffect(() => {
    const ch = supabase
      .channel(`storefront-products-${Math.random().toString(36).slice(2)}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "products" }, () => refetch())
      .on("postgres_changes", { event: "*", schema: "public", table: "product_variants" }, () => refetch())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [refetch]);

  if (import.meta.env.DEV && (!data || data.length === 0)) return staticProducts;
  return data ?? [];
}

export function useProductBySlug(slug: string): Product | undefined {
  const list = useStorefrontProducts();
  return list.find((p) => p.slug === slug);
}

export function useProductsByCategory(slug: string): Product[] {
  const list = useStorefrontProducts();
  if (slug === "budget") return list.filter((p) => p.price < 500);
  if (slug === "mid-range") return list.filter((p) => p.price >= 500 && p.price < 1500);
  if (slug === "premium") return list.filter((p) => p.price >= 1500);
  return list.filter((p) => p.category === slug);
}