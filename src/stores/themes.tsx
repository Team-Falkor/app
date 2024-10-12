import { create } from "zustand";

interface ThemesState {
  activeTheme: string | null;
  setActiveTheme: (name: string) => void;
}

export const useThemesStore = create<ThemesState>((set) => ({
  activeTheme: null,
  setActiveTheme: (name: string) => {
    localStorage.setItem("activeTheme", name);
    set(() => ({ activeTheme: name }));
  },
}));
