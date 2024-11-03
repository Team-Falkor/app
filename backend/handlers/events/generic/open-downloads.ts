import { shell } from "electron";
import { constants } from "../../../utils";
import { registerEvent } from "../utils/registerEvent";

const openDownloads = async (_event: Electron.IpcMainInvokeEvent) => {
  const path = constants.downloadsPath;
  return await shell.openPath(path);
};

registerEvent("generic:open-downloads", openDownloads);
