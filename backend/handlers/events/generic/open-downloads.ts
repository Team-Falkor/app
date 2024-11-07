import { shell } from "electron";
import { constants } from "../../../utils";
import { settings } from "../../../utils/settings/settings";
import { registerEvent } from "../utils/registerEvent";

const openDownloads = async (_event: Electron.IpcMainInvokeEvent) => {
  const path = settings.get("downloadsPath") ?? constants.downloadsPath;
  return await shell.openPath(path);
};

registerEvent("generic:open-downloads", openDownloads);
