import { create } from "zustand";
import type { CharterStatus } from "../types/charter";

interface UIState {
  // Sidebar
  sidebarOpen: boolean;
  toggleSidebar: () => void;

  // Charter filters
  charterStatusFilter: CharterStatus | "All";
  setCharterStatusFilter: (status: CharterStatus | "All") => void;

  charterSearch: string;
  setCharterSearch: (search: string) => void;

  // Modals
  createCharterOpen: boolean;
  setCreateCharterOpen: (open: boolean) => void;

  editCharterId: number | null;
  setEditCharterId: (id: number | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

  charterStatusFilter: "All",
  setCharterStatusFilter: (status) => set({ charterStatusFilter: status }),

  charterSearch: "",
  setCharterSearch: (search) => set({ charterSearch: search }),

  createCharterOpen: false,
  setCreateCharterOpen: (open) => set({ createCharterOpen: open }),

  editCharterId: null,
  setEditCharterId: (id) => set({ editCharterId: id }),
}));
