import { PluginSetupJSON } from "@/@types";
import { create } from "zustand";

interface PluginsState {
  plugins: Map<string, PluginSetupJSON>;
  needsUpdate: Map<string, PluginSetupJSON>;

  hasDoneFirstCheck: boolean;
  setHasDoneFirstCheck: () => void;

  setPlugins: (plugins: Array<PluginSetupJSON>) => void;
  setNeedsUpdate: (needsUpdate: Array<PluginSetupJSON>) => void;
  removeNeedsUpdate: (pluginId: string) => void;
  checkForUpdates: (pluginId?: string) => Promise<Array<PluginSetupJSON>>;
}

export const usePluginsStore = create<PluginsState>((set) => ({
  plugins: new Map(),
  needsUpdate: new Map(),

  hasDoneFirstCheck: false,
  setHasDoneFirstCheck: () => set({ hasDoneFirstCheck: true }),

  setPlugins: (plugins) => {
    const pluginMap = new Map(plugins.map((plugin) => [plugin.id, plugin]));
    set({ plugins: pluginMap });
  },

  removeNeedsUpdate: (pluginId) => {
    set((state) => {
      state.needsUpdate.delete(pluginId);
      return state;
    });
  },

  setNeedsUpdate: (needsUpdate) => {
    const needsUpdateMap = new Map(
      needsUpdate.map((plugin) => [plugin.id, plugin])
    );
    set({ needsUpdate: needsUpdateMap });
  },

  checkForUpdates: async (pluginId) => {
    console.log("Checking for updates...");
    try {
      // Invoke the event to check for plugin updates
      const updatedPlugins = await window.ipcRenderer.invoke(
        "plugins:check-for-updates",
        pluginId
      );

      if (Array.isArray(updatedPlugins)) {
        set(() => ({
          needsUpdate: new Map(
            updatedPlugins.map((plugin) => [plugin.id, plugin])
          ),
        }));
        return updatedPlugins;
      } else {
        console.warn(
          "No updates available or an error occurred during the check."
        );
        return [];
      }
    } catch (error) {
      console.error("Error checking for updates:", error);
      return [];
    }
  },
}));
