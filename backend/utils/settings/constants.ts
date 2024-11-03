import { SettingsConfig } from "@/@types";
import { constants } from "..";

export const defaultSettings: SettingsConfig = {
  theme: "system",
  language: "en",
  downloadsPath: constants.downloadsPath,
  autoUpdate: true,
  autoUpdateInterval: 1,
  autoCheckForUpdates: true,
  checkForUpdatesOnStartup: true,
  minimizeToTray: true,
  useAccountsForDownloads: false,
};
