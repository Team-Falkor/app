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
    });

    // Load settings from JSON file or defaults
    this.settingsCache = this.jsonFileEditor.read() || defaultSettings;
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
