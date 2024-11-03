import { shell } from "electron";
import { registerEvent } from "../utils/registerEvent";

const openFolder = async (
  _event: Electron.IpcMainInvokeEvent,
  path: string
) => {
  return await shell.openPath(path);
};

registerEvent("generic:open-folder", openFolder);
