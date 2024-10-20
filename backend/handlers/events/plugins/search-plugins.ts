import {
  PluginSearchResponse,
  SearchPlugiData,
  SearchPluginResponse,
} from "@/@types";
import pluginHandler from "../../../handlers/plugins/plugin";
import { getOS } from "../../../utils";
import { registerEvent } from "../utils/registerEvent";

const searchPlugins = async (
  _event: Electron.IpcMainInvokeEvent,
  query: string
): Promise<SearchPluginResponse> => {
  try {
    const os = getOS();
    const plugins = await pluginHandler.list();

    if (!plugins) {
      return {
        message: `no plugins found!`,
        success: false,
      };
    }

    const searchResults = plugins.map(
      async (plugin): Promise<SearchPlugiData> => {
        try {
          const url = `${plugin.api_url}/search/${os}/${query}`;
          const response = await fetch(url);

          if (!response.ok)
            return {
              id: plugin.id,
              name: plugin.name,
              sources: [],
            };

          const json: PluginSearchResponse[] = await response.json();

          return {
            id: plugin.id,
            name: plugin.name,
            sources: json,
          };
        } catch (error) {
          console.error(
            `Error fetching data from plugin ${plugin.id}: ${error}`
          );

          return {
            id: plugin.id,
            name: plugin.name,
            sources: [],
          };
        }
      }
    );

    const results = await Promise.all(searchResults);

    if (!results) {
      return {
        message: `no plugins found!`,
        success: false,
      };
    }

    return { data: results, success: true };
  } catch (error) {
    console.error(error);

    return {
      message: (error as Error).message,
      success: false,
    };
  }
};

registerEvent("plugins:use:search", searchPlugins);
