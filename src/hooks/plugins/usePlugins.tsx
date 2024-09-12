import { usePluginsStore } from "@/stores/plugins";
import { BaseProvider } from "@team-falkor/sdk/dist";
import { useEffect } from "react";

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
  ) => Promise<Array<T>>;
};

const usePlugins = (): UsePluginsResponse => {
  const {
    plugins,
    loadPlugins,
    startPlugins,
    stopPlugins,
    reinitializePlugins,
    getPluginByName,
    invokeOnAllPlugins,
  } = usePluginsStore();

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
