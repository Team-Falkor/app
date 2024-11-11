import { shell } from "electron";
import { registerEvent } from "../utils/registerEvent";

const minimize = async (_event: Electron.IpcMainInvokeEvent, url: string) => {
  try {
    return await shell.openExternal(url);
  } catch (error) {
    console.error(error);
    return false;
  }
};

registerEvent("openExternal", minimize);
