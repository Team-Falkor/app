import { SettingsConfig } from "@/@types";
import { constants } from "..";
import JsonFileEditor from "../json/jsonFileEditor";
import { defaultSettings } from "./constants";

class Settings {
  private jsonFileEditor: JsonFileEditor<SettingsConfig>;
  private settingsCache: SettingsConfig;

  constructor() {
    this.jsonFileEditor = new JsonFileEditor<SettingsConfig>({
      filePath: constants.settingsPath,
      defaultContent: defaultSettings,
      validate: this.validateSettings,
    });

    // Load settings from JSON file or defaults
    this.settingsCache = this.jsonFileEditor.read() || defaultSettings;
  }

  private validateSettings(data: unknown): data is SettingsConfig {
    const isValid =
      typeof data === "object" &&
      data !== null &&
      typeof (data as SettingsConfig).theme === "string" &&
      typeof (data as SettingsConfig).language === "string" &&
      typeof (data as SettingsConfig).downloadsPath === "string" &&
      typeof (data as SettingsConfig).autoCheckForUpdates === "boolean" &&
      typeof (data as SettingsConfig).checkForUpdatesOnStartup === "boolean" &&
      typeof (data as SettingsConfig).checkForPluginUpdatesOnStartup ===
        "boolean" &&
      typeof (data as SettingsConfig).useAccountsForDownloads === "boolean" &&
      typeof (data as SettingsConfig).titleBarStyle === "string" &&
      typeof (data as SettingsConfig).launchOnStartup === "boolean" &&
      typeof (data as SettingsConfig).closeToTray === "boolean";

    return isValid;
  }

  // Get a setting by key
  public get<K extends keyof SettingsConfig>(key: K): SettingsConfig[K] {
    return this.settingsCache[key];
  }

  // Update a setting
  public update<K extends keyof SettingsConfig>(
    key: K,
    value: SettingsConfig[K]
  ): void {
    this.settingsCache[key] = value;
    this.jsonFileEditor.write(this.settingsCache);
  }

  // Reset all settings to defaults
  public resetToDefaults(): SettingsConfig {
    this.settingsCache = { ...defaultSettings };
    this.jsonFileEditor.write(this.settingsCache);
    return this.settingsCache;
  }

  // Optional method to reload settings from the JSON file
  public reload(): SettingsConfig | null {
    const newSettings = this.jsonFileEditor.read();
    if (newSettings) {
      this.settingsCache = newSettings;
    }
    return this.settingsCache;
  }

  public read(): SettingsConfig | null {
    try {
      const settings = this.jsonFileEditor.read();
      if (settings) {
        this.settingsCache = settings;
      }
      return settings;
    } catch (error) {
      console.error("Error reading settings:", error);
      return null;
    }
  }
}

const settings = new Settings();
export { settings };
