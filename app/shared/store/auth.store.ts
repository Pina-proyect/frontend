import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type Role = "creator" | "donor" | "admin";

export interface User {
  id?: string;
  email?: string;
  role?: Role;
}

interface AuthState {
  token?: string;
  refresh?: string;
  user?: User | null;

  // actions
  setTokens: (t: { token?: string; refresh?: string }) => void;
  setUser: (u: User | null) => void;
  setSession: (s: { token: string; refresh: string; user: User }) => void;
  clear: () => void;
}

// Store con persistencia (solo token/refresh/user)
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: undefined,
      refresh: undefined,
      user: null,

      setTokens: ({ token, refresh }) => set({ token, refresh }),
      setUser: (user) => set({ user }),
      setSession: (s) => set(s),
      clear: () => set({ token: undefined, refresh: undefined, user: null }),
    }),
    {
      name: "pina-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ token: s.token, refresh: s.refresh, user: s.user }),
    }
  )
);

// Selectores/utilidades
export const selectIsAuthenticated = (s: AuthState) => !!s.token;
export const selectUser = (s: AuthState) => s.user;

// Para usar desde el http client sin montar un componente
export const getAuthToken = () => useAuthStore.getState().token;
export const getRefreshToken = () => useAuthStore.getState().refresh;
