import { create } from "zustand";
import type { AppUserDto } from "../types/user";

interface AuthState {
  user: AppUserDto | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: AppUserDto, token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  setAuth: (user, token) => {
    localStorage.setItem("ip_token", token);
    set({ user, token, isAuthenticated: true });
  },

  clearAuth: () => {
    localStorage.removeItem("ip_token");
    set({ user: null, token: null, isAuthenticated: false });
  },
}));
