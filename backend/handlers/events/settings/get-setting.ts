import { SettingsConfig } from "@/@types";
import { settings } from "../../../utils/settings/settings";
import { registerEvent } from "../utils/registerEvent";

const getSetting = (
  _event: Electron.IpcMainInvokeEvent,
  key: keyof SettingsConfig
) => {
  try {
    return settings.get(key);
  } catch (error) {
    console.error(error);
    return null;
  }
};

registerEvent("settings:get", getSetting);
