import { create } from "zustand";
interface AuthState {
  user: null | { displayName: string; roles: string[] }; token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: any, token: string) => void; clearAuth: () => void;
}
export const useAuthStore = create<AuthState>((set) => ({
  user: null, token: null, isAuthenticated: false,
  setAuth: (user, token) => { localStorage.setItem("ip_token", token); set({ user, token, isAuthenticated: true }); },
  clearAuth: () => { localStorage.removeItem("ip_token"); set({ user: null, token: null, isAuthenticated: false }); },
}));
