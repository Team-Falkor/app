import { PluginSearchResponse, PluginSetupJSON } from "@/@types";
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

  const searchAllPlugins = async (
    query: string,
    os: "windows" | "linux" = "windows"
  ) => {
    const searchResults = plugins.map(async (plugin) => {
      try {
        const response = await invoke<PluginSearchResponse[], string>(
          "request",
          `${plugin.api_url}/search/${os}/${query}`
        );
        return { id: plugin.id, data: response || [] }; // Handle null responses
      } catch (error) {
        // This log could be replaced with more sophisticated error handling
        console.error(`Error fetching data from plugin ${plugin.id}: ${error}`);
        return { id: plugin.id, data: [] };
      }
    });

    const results = await Promise.all(searchResults);
    const responses = results.reduce<Record<string, PluginSearchResponse[]>>(
      (acc, { id, data }) => {
        acc[id] = data;
        return acc;
      },
      {}
    );

    return responses;
  };

  return {
    plugins,
    getPlugins,
    searchAllPlugins,
  };
};

export default UsePlugins;
