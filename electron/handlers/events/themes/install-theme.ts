import { themes } from "electron/handlers/themes";
import { registerEvent } from "../utils/registerEvent";

const installTheme = async (
  _event: Electron.IpcMainInvokeEvent,
  url: string
): Promise<{
  message: string;
  success: boolean;
}> => {
  try {
    return await themes.install(url);
  } catch (error) {
    console.error(error);

    return {
      message: (error as Error).message,
      success: false,
    };
  }
};

registerEvent("themes:install", installTheme);
