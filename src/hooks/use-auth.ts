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

const initialState: AuthState = {
  loading: true,
  user: null,
  session: null,
  isAdmin: false,
  error: null,
};

const AUTH_TIMEOUT_MS = 10000;

function withTimeout<T>(promise: Promise<T>, message: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(message)), AUTH_TIMEOUT_MS);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}

export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>(initialState);

  useEffect(() => {
    let mounted = true;
    let subscription: { unsubscribe: () => void } | undefined;
    // Every auth event gets a sequence number. Only the newest check may update
    // state, so a slow response cannot overwrite a newer login/logout result.
    let version = 0;

    async function checkRole(userId: string): Promise<boolean> {
      try {
        const result = await withTimeout(
          supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", userId)
            .eq("role", "admin")
            .maybeSingle(),
          "Admin permission check timed out. Please retry your connection.",
        );
        if (result.error) {
          console.error("[Auth] Admin role lookup failed:", result.error.message);
          throw new Error("Could not verify admin permissions. Check the Supabase user_roles table and its read policies.");
        }
        return !!result.data;
      } catch (error) {
        console.error("[Auth] Admin role lookup failed:", error);
        throw error instanceof Error
          ? error
          : new Error("Could not connect to the authentication database. Please retry.");
      }
    }

    async function applySession(session: Session | null, requestVersion: number) {
      if (!mounted || requestVersion !== version) return;
      if (!session) {
        setState({ loading: false, user: null, session: null, isAdmin: false, error: null });
        return;
      }

      setState({
        loading: true,
        user: session.user,
        session,
        isAdmin: false,
        error: null,
      });

      try {
        const isAdmin = await checkRole(session.user.id);
        if (mounted && requestVersion === version) {
          setState({ loading: false, user: session.user, session, isAdmin, error: null });
        }
      } catch (error) {
        if (mounted && requestVersion === version) {
          setState({
            loading: false,
            user: session.user,
            session,
            isAdmin: false,
            error: error instanceof Error ? error.message : "Could not verify admin access. Please retry.",
          });
        }
      }
    }

    async function bootstrap() {
      const bootstrapVersion = version;
      try {
        const auth = supabase.auth;
        const listener = auth.onAuthStateChange((event, session) => {
          if (!mounted || event === "INITIAL_SESSION") return;
          const eventVersion = ++version;
          // Defer Supabase calls until the auth callback has returned. This
          // avoids locking the Supabase auth client while its event is emitted.
          setTimeout(() => {
            void applySession(session, eventVersion);
          }, 0);
        });
        subscription = listener.data.subscription;

        const { data, error } = await withTimeout(
          auth.getSession(),
          "Authentication check timed out. Please retry your connection.",
        );
        if (error) throw error;
        // If a login/logout event happened while getSession was pending, that
        // newer event owns the state and must not be overwritten by this result.
        if (mounted && bootstrapVersion === version) {
          await applySession(data.session, bootstrapVersion);
        }
      } catch (error) {
        console.error("[Auth] Authentication initialization failed:", error);
        if (mounted && bootstrapVersion === version) {
          setState({
            loading: false,
            user: null,
            session: null,
            isAdmin: false,
            error: error instanceof Error
              ? error.message
              : "Admin authentication could not start. Verify the Supabase URL and publishable key in the deployed build.",
          });
        }
      }
    }

    void bootstrap();
    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  return state;
}
