import { settings } from "../../../utils/settings/settings";
import { registerEvent } from "../utils/registerEvent";

const resetToDefaultSettings = (_event: Electron.IpcMainInvokeEvent) => {
  try {
    return settings.resetToDefaults();
  } catch (error) {
    console.error(error);
    return null;
  }
};

registerEvent("settings:reset-to-default", resetToDefaultSettings);
