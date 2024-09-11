import { create } from "zustand";

type OS = {
  platform: "windows" | "macos" | "linux" | "unknown";
  setPlatform: (platform: "windows" | "macos" | "linux" | "unknown") => void;
};

export const useOS = create<OS>((set) => ({
  platform: "unknown",
  setPlatform: (platform) => set({ platform }),
}));

type SettingsState<T extends Record<string, any>> = {
  settings: T;
  getSetting: <K extends keyof T>(key: K) => T[K];
  updateSetting: <K extends keyof T>(key: K, value: T[K]) => void;
  initializeSettings: (initialSettings: Partial<T>) => void;
};

export const useSettingsStore = <T extends Record<string, any>>() =>
  create<SettingsState<T>>((set, get) => ({
    settings: {} as T,

    // Get the value of a specific setting
    getSetting: <K extends keyof T>(key: K): T[K] => {
      const { settings } = get();
      return settings[key];
    },

    // Update a specific setting
    updateSetting: <K extends keyof T>(key: K, value: T[K]) => {
      set((state) => ({
        settings: {
          ...state.settings,
          [key]: value,
        },
      }));
    },

    // Initialize settings with a set of defaults or predefined values
    initializeSettings: (initialSettings: Partial<T>) => {
      set((state) => ({
        settings: {
          ...state.settings,
          ...initialSettings,
        },
      }));
    },
  }));
