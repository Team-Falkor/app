import { PluginSearchResponse, PluginSourcesResponse } from "@/@types";
import { invoke } from "@/lib";
import { useEffect, useState } from "react";

const UsePlugin = (pluginId: string) => {
  const [url, setUrl] = useState<string | null>(null);

  const findPlugin = async () => {
    try {
      return await invoke<string, string>("plugin:get-url", pluginId);
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  useEffect(() => {
    (async () => {
      const plugin = await findPlugin();

      setUrl(plugin);
    })();
  }, []);

  const search = async (query: string) => {
    try {
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
