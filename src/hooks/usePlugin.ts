import { PluginSearchResponse, PluginSourcesResponse } from "@/@types";
import { invoke } from "@/lib";
import { useCallback, useEffect, useState } from "react";

const UsePlugin = (pluginId: string) => {
  const [url, setUrl] = useState<string | null>(null);

  const findPlugin = useCallback(async () => {
    try {
      if (!pluginId) return null;

      // TODO: Fix types
      return await invoke<string, any>("plugin:get-plugin", pluginId);
    } catch (error) {
      console.error(error);
      return null;
    }
  }, [pluginId]);

  useEffect(() => {
    (async () => {
      const plugin = await findPlugin();

      setUrl(plugin);
    })();
  }, [findPlugin]);

  const search = async (query: string) => {
    try {
      if (!pluginId) return null;

      return await invoke<PluginSearchResponse, string>(
        "request",
        `${url}/search/${query}`
      );
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const sources = async (body: {
    title: string;
    igdb_id: string;
    genres?: string[];
  }) => {
    try {
      if (!pluginId) return null;

      const options: RequestInit = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      };

      return await invoke<PluginSourcesResponse, any>(
        "request",
        `${url}/sources`,
        options
      );
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  return {
    url,
    search,
    sources,
    findPlugin,
  };
};

export default UsePlugin;
