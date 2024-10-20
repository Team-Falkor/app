import pluginHandler from "../../../handlers/plugins/plugin";
import { registerEvent } from "../utils/registerEvent";

type getPluginResponse =
  | {
      message: string;
      success: boolean;
    }
  | {
      data: any;
      success: true;
    };

const getPlugin = async (_event: Electron.IpcMainInvokeEvent) => {
  try {
    const plugins = await pluginHandler.list();

    if (!plugins) {
      return {
        message: `no plugins found!`,
        success: false,
      };
    }

    return {
      data: plugins,
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

registerEvent("plugins:list", getPlugin);
