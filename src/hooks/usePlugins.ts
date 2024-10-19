import { PluginSearchResponse, PluginSetupJSON } from "@/@types";
import { invoke } from "@/lib";
import { usePluginsStore } from "@/stores/plugins";
import { useCallback, useEffect } from "react";

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
    if (!list) return;

    setPlugins(list.data);

    return list;
  }, [setPlugins]);

  const searchAllPlugins = async (
    query: string,
    os: "windows" | "linux" = "windows"
  ) => {
    const responses: Record<string, PluginSearchResponse[]> = {};

    for await (const plugin of plugins) {
      const response = await invoke<PluginSearchResponse[], string>(
        "request",
        `${plugin.api_url}/search/${os}/${query}`
      );
      if (!response) continue;

      responses[plugin.id] = response;
    }

    return responses;
  };

  useEffect(() => {
    getPlugins();
  }, [getPlugins]);

  return {
    plugins,
    getPlugins,
    searchAllPlugins,
  };
};

export default UsePlugins;
