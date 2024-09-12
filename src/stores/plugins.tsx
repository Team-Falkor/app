import { PluginLoader } from "@/lib";
import { BaseProvider } from "@team-falkor/sdk";
import { create } from "zustand";

type PluginsState = {
  plugins: BaseProvider[];
  pluginLoader: PluginLoader;
  loadPlugins: () => Promise<void>;
  startPlugins: () => void;
  stopPlugins: () => void;
  reinitializePlugins: () => void;
  getPluginByName: (name: string) => BaseProvider | undefined;
  invokeOnAllPlugins: <T, P>(
    methodName: keyof BaseProvider,
    params: P
  ) => Promise<Array<T>>;
};

export const usePluginsStore = create<PluginsState>((set, get) => ({
  plugins: [],
  pluginLoader: new PluginLoader(),

  // Load plugins
  loadPlugins: async () => {
    const { pluginLoader } = get();
    try {
      await pluginLoader.load();
      set({ plugins: pluginLoader.getPlugins() });
    } catch (error) {
      console.error("Failed to load plugins:", error);
    }
  },

  // Start all loaded plugins
  startPlugins: () => {
    const { pluginLoader } = get();
    pluginLoader.startAllPlugins();
  },

  // Stop all plugins
  stopPlugins: () => {
    const { pluginLoader } = get();
    pluginLoader.stopAllPlugins();
  },

  // Reinitialize plugins (reload)
  reinitializePlugins: () => {
    const { pluginLoader } = get();
    pluginLoader.reinitialize();
    set({ plugins: pluginLoader.getPlugins() });
  },

  // Get plugin by name
  getPluginByName: (name: string): BaseProvider | undefined => {
    const { pluginLoader } = get();
    return pluginLoader.getPluginByName(name);
  },

  // Invoke a method on all plugins
  invokeOnAllPlugins: async <T, P>(
    methodName: keyof BaseProvider,
    params: P
  ): Promise<Array<T>> => {
    const { plugins } = get();
    const results = await Promise.all(
      plugins.map(async (plugin) => {
        try {
          const method = plugin[methodName] as (params: P) => Promise<T[]>;
          if (typeof method === "function") {
            return await method(params);
          }
          return [];
        } catch (error) {
          console.error(
            `Error in plugin ${plugin.metadata.name} for ${methodName}:`,
            error
          );
          return [];
        }
      })
    );

    return results.filter((result) => result.length > 0)?.flat();
  },
}));
