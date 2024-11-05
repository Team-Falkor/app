export interface SettingsConfig {
  theme: "system" | "light" | "dark";
  language: string;
  downloadsPath: string;
  autoUpdate: boolean;
  autoUpdateInterval: number;
  autoCheckForUpdates: boolean;
  checkForUpdatesOnStartup: boolean;
  checkForPluginUpdatesOnStartup: boolean;
  minimizeToTray: boolean;
  useAccountsForDownloads: boolean;
}
