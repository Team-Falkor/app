import { create } from "zustand";

type OS = {
  platform: "windows" | "macos" | "linux" | "unknown";
  setPlatform: (platform: "windows" | "macos" | "linux" | "unknown") => void;
};

export const useOS = create<OS>((set) => ({
  platform: "unknown",
  setPlatform: (platform) => set({ platform }),
}));
