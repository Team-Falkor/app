export interface SettingsConfig {
  theme: SettingsTheme;
  language: string;
  downloadsPath: string;
  autoUpdate: boolean;
  autoUpdateInterval: number;
  autoCheckForUpdates: boolean;
  checkForUpdatesOnStartup: boolean;
  checkForPluginUpdatesOnStartup: boolean;
  launchOnStartup: launchOnStartupType;
  minimizeToTray: boolean;
  closeToTray: boolean;
  useAccountsForDownloads: boolean;
  titleBarStyle: SettingsTitleBarStyle;
}

export type SettingsTheme = "system" | "light" | "dark";

export type SettingsTitleBarStyle =
  | "icons"
  | "traffic-lights"
  | "native"
  | "none";

export type launchOnStartupType = true | false | "minimized";
