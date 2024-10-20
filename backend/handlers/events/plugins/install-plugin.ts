import pluginHandler from "../../../handlers/plugins/plugin";
import { registerEvent } from "../utils/registerEvent";

const installPlugin = async (
  _event: Electron.IpcMainInvokeEvent,
  url: string
): Promise<{
  message: string;
  success: boolean;
}> => {
  try {
    const installed = await pluginHandler.install(url);

    if (!installed) {
      return {
        message: "Failed to install plugin",
        success: false,
      };
    }

    return {
      message: "Plugin installed successfully",
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

registerEvent("plugins:install", installPlugin);
