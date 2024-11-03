import { SettingsConfig } from "@/@types";
import { settings } from "../../../utils/settings/settings";
import { registerEvent } from "../utils/registerEvent";

const updateSetting = (
  _event: Electron.IpcMainInvokeEvent,
  key: keyof SettingsConfig,
  value: SettingsConfig[keyof SettingsConfig]
) => {
  try {
    settings.update(key, value);
    return true;
  } catch (error) {
    console.error(error);
    return null;
  }
};

registerEvent("settings:update", updateSetting);
