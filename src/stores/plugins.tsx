import { PluginSetupJSON } from "@/@types";
import { create } from "zustand";

interface PluginsState {
  plugins: Array<PluginSetupJSON>;
  setPlugins: (plugins: Array<PluginSetupJSON>) => void;
}

export const usePluginsStore = create<PluginsState>((set) => ({
  plugins: [],
  setPlugins: (plugins) => set({ plugins }),
}));
