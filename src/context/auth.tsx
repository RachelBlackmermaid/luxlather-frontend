// src/context/auth.tsx
import { createContext, useContext, useEffect, useState } from "react";
import api from "../lib/api";
import type { User } from "../types/product";
import useCartStore from "../store/useCartStore";

type AuthCtx = {
  user: User | null;
  loading: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  signup: (args: { email: string; password: string; name?: string; username?: string }) => Promise<void>;
  logout: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | undefined>(undefined);

const LOGOUT_BROADCAST_KEY = "auth:logout";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Bootstrap current session
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { data } = await api.get<User>("/auth/me");
        if (alive) setUser(data);
      } catch {
        // not logged in
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // Cross-tab logout listener
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === LOGOUT_BROADCAST_KEY && e.storageArea === localStorage) {
        useCartStore.getState().clearCart();
        setUser(null);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const login = async (identifier: string, password: string) => {
    const looksLikeEmail = /\S+@\S+\.\S+/.test(identifier);
    const payload = looksLikeEmail ? { email: identifier, password } : { username: identifier, password };
    const { data } = await api.post("/auth/login", payload);

    if (data?.user) {
      setUser(data.user);
    } else if (data?.token) {
      const me = await api.get<User>("/auth/me").catch(() => null);
      if (me?.data) setUser(me.data);
      // optionally persist token if your api expects it in headers from localStorage
    }
  };

  const signup = async (args: { email: string; password: string; name?: string; username?: string }) => {
    const { data } = await api.post("/auth/signup", args);
    if (data?.user) setUser(data.user);
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // ignore network/API errors on logout
    } finally {
      // local cleanup always
      localStorage.removeItem("token");
      setUser(null);
      useCartStore.getState().clearCart();
      // notify other tabs
      localStorage.setItem(LOGOUT_BROADCAST_KEY, Date.now().toString());
    }
  };

  return <Ctx.Provider value={{ user, loading, login, signup, logout }}>{children}</Ctx.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
};
