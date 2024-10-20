import { PluginSetupJSON, SearchPluginResponse } from "@/@types";
import { invoke } from "@/lib";
import { usePluginsStore } from "@/stores/plugins";
import { useCallback } from "react";

const UsePlugins = () => {
  const { plugins, setPlugins } = usePluginsStore();

  const getPlugins = useCallback(async () => {
    const list = await invoke<
      {
        data: PluginSetupJSON[];
        success: boolean;
        message?: string;
      },
      never
    >("plugins:list");
    if (list?.success) {
      setPlugins(list.data);
    } else {
      console.error(`Failed to load plugins: ${list?.message}`);
    }
    return list;
  }, [setPlugins]);

  const searchAllPlugins = async (query: string) => {
    const searchResults = await invoke<SearchPluginResponse, string>(
      "plugins:use:search",
      query
    );

    if (!searchResults?.success) return [];

    return searchResults.data;
  };

  return {
    plugins,
    getPlugins,
    searchAllPlugins,
  };
};

export default UsePlugins;
