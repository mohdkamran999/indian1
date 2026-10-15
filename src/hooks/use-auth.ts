import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export interface AuthState {
  loading: boolean;
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  error: string | null;
}

const initialState: AuthState = { loading: true, user: null, session: null, isAdmin: false, error: null };

export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>(initialState);

  useEffect(() => {
    let mounted = true;
    let subscription: { unsubscribe: () => void } | undefined;

    async function checkRole(userId: string): Promise<boolean> {
      try {
        const { data, error } = await supabase.from("user_roles").select("role")
          .eq("user_id", userId).eq("role", "admin").maybeSingle();
        if (error) {
          console.error("[Auth] Admin role lookup failed:", error.message);
          if (mounted) setState((s) => ({ ...s, error: "Could not verify admin permissions. Check Supabase and the user_roles table." }));
          return false;
        }
        return !!data;
      } catch (error) {
        console.error("[Auth] Admin role lookup failed:", error);
        if (mounted) setState((s) => ({ ...s, error: "Could not connect to the authentication database. Check Supabase configuration." }));
        return false;
      }
    }

    async function bootstrap() {
      try {
        const auth = supabase.auth;
        const listener = auth.onAuthStateChange((event, session) => {
          if (!mounted) return;
          if (event === "TOKEN_REFRESHED" || event === "USER_UPDATED") {
            setState((s) => s.session?.user.id === session?.user.id
              ? { ...s, session, user: session?.user ?? null }
              : s);
            return;
          }
          if (event === "INITIAL_SESSION") return;
          if (!session) {
            setState({ loading: false, user: null, session: null, isAdmin: false, error: null });
            return;
          }
          setState((s) => {
            const sameUser = s.user?.id === session.user.id;
            return sameUser
              ? { ...s, user: session.user, session }
              : { ...s, loading: true, user: session.user, session, error: null };
          });
          setTimeout(async () => {
            const isAdmin = await checkRole(session.user.id);
            if (mounted) setState((s) => ({ ...s, loading: false, user: session.user, session, isAdmin }));
          }, 0);
        });
        subscription = listener.data.subscription;

        const { data, error } = await auth.getSession();
        if (error) throw error;
        if (!mounted) return;
        const session = data.session;
        if (!session) {
          setState({ loading: false, user: null, session: null, isAdmin: false, error: null });
          return;
        }
        const isAdmin = await checkRole(session.user.id);
        if (mounted) setState((s) => ({ ...s, loading: false, user: session.user, session, isAdmin }));
      } catch (error) {
        console.error("[Auth] Authentication initialization failed:", error);
        if (mounted) setState({
          loading: false, user: null, session: null, isAdmin: false,
          error: "Admin authentication could not start. Verify VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in the Hostinger build environment, then redeploy.",
        });
      }
    }

    void bootstrap();
    return () => { mounted = false; subscription?.unsubscribe(); };
  }, []);

  return state;
}
