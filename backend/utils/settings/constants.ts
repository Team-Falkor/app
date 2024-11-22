import { SettingsConfig } from "@/@types";
import { constants } from "..";

export const defaultSettings: SettingsConfig = {
  theme: "system",
  language: "en",
  downloadsPath: constants.downloadsPath,
  autoCheckForUpdates: true,
  checkForUpdatesOnStartup: true,
  checkForPluginUpdatesOnStartup: true,
  useAccountsForDownloads: false,
  titleBarStyle: "icons",
  launchOnStartup: false,
  closeToTray: false,
  maxDownloadSpeed: -1,
  maxUploadSpeed: -1,
};
