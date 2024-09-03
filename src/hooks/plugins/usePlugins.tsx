import { PluginLoader } from "@/lib";
import { useEffect, useState } from "react";

export const usePlugins = () => {
  const [hasInitialized, setHasInitialized] = useState<boolean>(false);
  const pluginLoader = new PluginLoader();

  useEffect(() => {
    pluginLoader.load().then(() => {
      console.log("test");
      setHasInitialized(true);
    });

    return () => {
      setHasInitialized(false);
    };
  }, []);

  return {
    hasInitialized,
    pluginLoader,
  };
};
