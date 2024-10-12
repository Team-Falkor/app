import { themes } from "electron/handlers/themes";
import { registerEvent } from "../utils/registerEvent";

const getTheme = async (_event: Electron.IpcMainInvokeEvent, name: string) => {
  try {
    return await themes.get(name);
  } catch (error) {
    console.error(error);
    return (error as Error).message;
  }
};

registerEvent("themes:get", getTheme);
