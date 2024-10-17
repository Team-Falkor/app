import * as fs from "node:fs";
import { Settings } from "../@types";
import { constants } from "../utils";

const { settingsPath } = constants;

class SettingsManager {
  private hasInitialized: boolean = false;
  private settings: Settings | null = null;

  async init() {
    if (this.hasInitialized) return;

    // Check if the settings file exists
    try {
      await fs.promises.access(settingsPath);
      console.log("Settings file exists, loading settings...");

      // Read and parse the existing settings file
      const data = await fs.promises.readFile(settingsPath, "utf8");
      const parsedSettings = JSON.parse(data) as Partial<Settings>;

      // Validate and ensure all fields are present
      this.settings = this.validateAndCompleteSettings(parsedSettings);
    } catch (error) {
      console.log("Settings file does not exist, creating a new one...");

      // Create a default settings object
      this.settings = {
        downloadsPath: constants.downloadsPath, // Use the default downloads path from constants
        theme: "light", // Default theme
        language: "en", // Default language
      };

      // Write the default settings to the file
      await fs.promises.writeFile(
        settingsPath,
        JSON.stringify(this.settings, null, 2),
        "utf8"
      );
      console.log("Default settings file created.");
    }

    this.hasInitialized = true; // Mark as initialized
  }

  getSettings(): Settings | null {
    return this.settings;
  }

  // Additional method to update settings, if needed
  async updateSettings(newSettings: Partial<Settings>) {
    if (!this.settings) return;

    this.settings = { ...this.settings, ...newSettings };

    // Write updated settings back to the file
    await fs.promises.writeFile(
      settingsPath,
      JSON.stringify(this.settings, null, 2),
      "utf8"
    );
    console.log("Settings updated:", this.settings);
  }

  // Method to validate and complete settings
  private validateAndCompleteSettings(
    parsedSettings: Partial<Settings> = {}
  ): Settings {
    return {
      downloadsPath: parsedSettings.downloadsPath ?? constants.downloadsPath,
      theme: parsedSettings.theme ?? "dark",
      language: parsedSettings.language ?? "en",
    };
  }
}

const settingsManager = new SettingsManager();

export { settingsManager };
