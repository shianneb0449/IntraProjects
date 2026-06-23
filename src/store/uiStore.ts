import { create } from "zustand";
interface UIState {
  sidebarOpen: boolean; toggleSidebar: () => void;
  charterSearch: string; setCharterSearch: (s: string) => void;
  createCharterOpen: boolean; setCreateCharterOpen: (o: boolean) => void;
}
export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true, toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  charterSearch: "", setCharterSearch: (s) => set({ charterSearch: s }),
  createCharterOpen: false, setCreateCharterOpen: (o) => set({ createCharterOpen: o }),
}));
