import { settings } from "../../../utils/settings/settings";
import { registerEvent } from "../utils/registerEvent";

const reloadSettings = (_event: Electron.IpcMainInvokeEvent) => {
  try {
    return settings.reload();
  } catch (error) {
    console.error(error);
    return null;
  }
};

registerEvent("settings:reload", reloadSettings);
