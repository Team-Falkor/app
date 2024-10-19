import { PluginId } from "@/@types";
import { PluginHandler } from "../../../handlers/plugins/plugin";
import { registerEvent } from "../utils/registerEvent";

const pluginHandler = new PluginHandler();

type getPluginResponse =
  | {
      message: string;
      success: boolean;
    }
  | {
      data: any;
      success: true;
    };

const getPlugin = async (
  _event: Electron.IpcMainInvokeEvent,
  pluginId: PluginId
): Promise<getPluginResponse> => {
  try {
    const plugin = await pluginHandler.get(pluginId);

    if (!plugin) {
      return {
        message: `no plugin found! with id: ${pluginId}`,
        success: false,
      };
    }

    return {
      data: plugin,
      success: true,
    };
  } catch (error) {
    console.error(error);

    return {
      message: (error as Error).message,
      success: false,
    };
  }
};

registerEvent("plugins:get", getPlugin);
