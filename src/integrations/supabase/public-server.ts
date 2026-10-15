import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

/**
 * Public Supabase client for SSR/server functions that are intentionally allowed
 * by RLS. The publishable key is safe for client-side use; never put a service
 * role key in this module or in VITE_* variables.
 */
export function createPublicServerClient() {
  const url =
    import.meta.env.VITE_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    process.env.VITE_SUPABASE_URL;
  const key =
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    throw new Error(
      "The store database has not been configured. Set the public Supabase URL and publishable key before building the site.",
    );
  }

  return createClient<Database>(url, key, {
    auth: {
      storage: undefined,
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
