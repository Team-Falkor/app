import { PluginLoader } from "@/lib";
import { BaseProvider } from "@falkor/sdk";
import { useCallback, useEffect, useState } from "react";

type UsePluginsResponse = {
  plugins: BaseProvider[];
  loadPlugins: () => Promise<void>;
  startPlugins: () => void;
  stopPlugins: () => void;
  reinitializePlugins: () => void;
  getPluginByName: (name: string) => BaseProvider | undefined;
  invokeOnAllPlugins: <T, P>(
    methodName: keyof BaseProvider,
    params: P
  ) => Promise<Array<T[]>>;
};

const usePlugins = (): UsePluginsResponse => {
  const [pluginLoader] = useState<PluginLoader>(() => new PluginLoader());
  const [plugins, setPlugins] = useState<BaseProvider[]>([]);

  // Load plugins
  const loadPlugins = useCallback(async () => {
    try {
      await pluginLoader.load();
      setPlugins(pluginLoader.getPlugins());
    } catch (error) {
      console.error("Failed to load plugins:", error);
    }
  }, [pluginLoader]);

  // Start all loaded plugins
  const startPlugins = useCallback(() => {
    pluginLoader.startAllPlugins();
  }, [pluginLoader]);

  // Stop all plugins
  const stopPlugins = useCallback(() => {
    pluginLoader.stopAllPlugins();
  }, [pluginLoader]);

  // Reinitialize plugins (reload)
  const reinitializePlugins = useCallback(() => {
    pluginLoader.reinitialize();
    setPlugins(pluginLoader.getPlugins());
  }, [pluginLoader]);

  // Get plugin by name
  const getPluginByName = useCallback(
    (name: string): BaseProvider | undefined => {
      return pluginLoader.getPluginByName(name);
    },
    [pluginLoader]
  );

  // Invoke a method on all plugins
  const invokeOnAllPlugins = useCallback(
    async <T, P>(
      methodName: keyof BaseProvider,
      params: P
    ): Promise<Array<T[]>> => {
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
      return results;
    },
    [plugins]
  );

  // Load plugins when the component mounts
  useEffect(() => {
    loadPlugins();
  }, [loadPlugins]);

  return {
    plugins,
    loadPlugins,
    startPlugins,
    stopPlugins,
    reinitializePlugins,
    getPluginByName,
    invokeOnAllPlugins,
  };
};

export default usePlugins;
