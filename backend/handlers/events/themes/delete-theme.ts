import { ThemeResponse } from "../../../@types";
import { themes } from "../../../handlers/themes";
import { registerEvent } from "../utils/registerEvent";

const deleteTheme = async (
  _event: Electron.IpcMainInvokeEvent,
  name: string
): Promise<ThemeResponse> => {
  try {
    return await themes.delete(name);
  } catch (error) {
    console.error(error);

    return {
      message: (error as Error).message,
      success: false,
    };
  }
};

registerEvent("themes:delete", deleteTheme);
