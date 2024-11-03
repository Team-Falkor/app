import { SettingsConfig } from "@/@types";
import { defaultSettings } from "../../../utils/settings/constants";
import { settings } from "../../../utils/settings/settings";
import { registerEvent } from "../utils/registerEvent";

// Handler function to return all settings
const getAllSettings = (
  _event: Electron.IpcMainInvokeEvent
): SettingsConfig => {
  try {
    // Use the read method to fetch settings, falling back to defaults if the file is empty or missing
    const currentSettings = settings.read();
    return currentSettings || defaultSettings; // Return defaultSettings if no file exists or it's empty
  } catch (error) {
    console.error("Error fetching all settings:", error);
    // If there's an error, return default settings as a safe fallback
    return defaultSettings;
  }
};

// Register the event with the handler
registerEvent("settings:get-all", getAllSettings);
