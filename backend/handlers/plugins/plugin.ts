import { PluginId, PluginSetupJSON, PluginSetupJSONDisabled } from "@/@types";
import fs from "node:fs";
import { join } from "node:path";
import { constants } from "../../utils";

export class PluginHandler {
  private hasInitialized = false;

  /**
   * Path to the plugins folder
   */
  private path = constants.pluginsPath;

  /**
   * Ensures that the plugin folder exists
   */
  private async init() {
    if (this.hasInitialized) return;

    try {
      // Check and create plugins folder if it doesn't exist
      const doesFolderExist = fs.existsSync(this.path);
      if (!doesFolderExist)
        await fs.promises.mkdir(this.path, { recursive: true });

      this.hasInitialized = true;
    } catch (error) {
      console.error(`Error initializing plugin directory: ${error}`);
      throw new Error("Initialization failed");
    }
  }

  /**
   * Installs a plugin from a given URL
   *
   * @param url The URL to the setup.json
   * @returns true if the install was successful, false otherwise
   */
  public async install(url: string): Promise<boolean> {
    try {
      await this.init();

      const response = await fetch(url);
      const json = await response.json();

      // Validate plugin structure (ensure json has 'id' field)
      if (!json.id) {
        throw new Error("Invalid plugin format: 'id' field is missing");
      }

      const filePath = join(this.path, `${json.id}.json`);

      // Write the JSON data to the file
      await fs.promises.writeFile(
        filePath,
        JSON.stringify(json, null, 2),
        "utf-8"
      );

      return true;
    } catch (error) {
      console.error(`Failed to install plugin from URL (${url}): ${error}`);
      return false;
    }
  }

  /**
   * Deletes a plugin by its ID
   *
   * @param pluginId The ID of the plugin to delete
   * @returns true if the delete was successful, false otherwise
   */
  public async delete(pluginId: PluginId): Promise<boolean> {
    try {
      await this.init();

      const filePath = join(this.path, `${pluginId}.json`);
      await fs.promises.unlink(filePath);

      return true;
    } catch (error) {
      console.error(`Failed to delete plugin with ID (${pluginId}): ${error}`);
      return false;
    }
  }

  /**
   * Disables a plugin by renaming its file to .disabled
   *
   * @param pluginId The ID of the plugin to disable
   * @returns true if the disable was successful, false otherwise
   */
  public async disable(pluginId: PluginId): Promise<boolean> {
    try {
      await this.init();

      const filePath = join(this.path, `${pluginId}.json`);
      if (!fs.existsSync(filePath)) return false;

      await fs.promises.rename(
        filePath,
        join(this.path, `${pluginId}.disabled`)
      );
      return true;
    } catch (error) {
      console.error(`Failed to disable plugin with ID (${pluginId}): ${error}`);
      return false;
    }
  }

  /**
   * Enables a plugin by renaming its file back to .json
   *
   * @param pluginId The ID of the plugin to enable
   * @returns true if the enable was successful, false otherwise
   */
  public async enable(pluginId: PluginId): Promise<boolean> {
    try {
      await this.init();

      const filePath = join(this.path, `${pluginId}.disabled`);
      if (!fs.existsSync(filePath)) return false;

      await fs.promises.rename(filePath, join(this.path, `${pluginId}.json`));
      return true;
    } catch (error) {
      console.error(`Failed to enable plugin with ID (${pluginId}): ${error}`);
      return false;
    }
  }

  /**
   * Fetches the JSON content of a plugin by its ID
   *
   * @param pluginId The ID of the plugin
   * @returns The JSON data of the plugin, or null if not found
   */
  public async get(pluginId: PluginId): Promise<PluginSetupJSON | null> {
    try {
      await this.init();

      const filePath = join(this.path, `${pluginId}.json`);
      if (!fs.existsSync(filePath)) return null;

      const data = await fs.promises.readFile(filePath, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      console.error(`Failed to fetch plugin with ID (${pluginId}): ${error}`);
      return null;
    }
  }

  public async list(
    wantDisabled: boolean = false
  ): Promise<Array<PluginSetupJSONDisabled>> {
    try {
      await this.init();

      const plugins: Array<PluginSetupJSONDisabled> = [];

      const files = await fs.promises.readdir(this.path);
      for await (const file of files) {
        const filePath = join(this.path, file);
        if (file.endsWith(".json")) {
          const data = await fs.promises.readFile(filePath, "utf-8");

          plugins.push({
            disabled: false,
            ...JSON.parse(data),
          });
        }
        if (file.endsWith(".disabled") && wantDisabled) {
          const data = await fs.promises.readFile(filePath, "utf-8");

          plugins.push({
            disabled: true,
            ...JSON.parse(data),
          });
        }
      }

      return plugins;
    } catch (error) {
      console.error(`Failed to list plugins: ${error}`);
      return [];
    }
  }
}

const pluginHandler = new PluginHandler();

export default pluginHandler;
