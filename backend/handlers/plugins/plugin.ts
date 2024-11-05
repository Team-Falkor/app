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

      let filePath = join(this.path, `${json.id}.json`);
      const disabledFilePath = join(this.path, `${json.id}.disabled`);

      if (fs.existsSync(disabledFilePath)) {
        filePath = disabledFilePath;
      }

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

  async checkForUpdates(pluginId: PluginId): Promise<boolean> {
    try {
      await this.init();

      const filePath = join(this.path, `${pluginId}.json`);
      if (!fs.existsSync(filePath)) return false;

      const data = await fs.promises.readFile(filePath, "utf-8");
      const json: PluginSetupJSON = JSON.parse(data);

      if (!json.api_url || !json.setup_path) return false;

      const response = await fetch(`${json.api_url}/${json.setup_path}`);
      const latest = await response.json();
      if (latest.version === json.version) return false;

      return true;
    } catch (error) {
      console.error(`Failed to check for updates: ${error}`);
      return false;
    }
  }

  async checkForUpdatesAll(): Promise<Array<PluginSetupJSONDisabled>> {
    try {
      await this.init();

      const plugins: Array<PluginSetupJSONDisabled> = [];

      const files = await fs.promises.readdir(this.path);
      for await (const file of files) {
        const filePath = join(this.path, file);
        if (file.endsWith(".json")) {
          const data = await fs.promises.readFile(filePath, "utf-8");

          const json: PluginSetupJSON = JSON.parse(data);

          if (!json.api_url || !json.setup_path) continue;

          const response = await fetch(`${json.api_url}/${json.setup_path}`);
          const latest = await response.json();
          if (latest.version === json.version) continue;

          plugins.push({
            disabled: false,
            ...json,
          });
        }
        if (file.endsWith(".disabled")) {
          const data = await fs.promises.readFile(filePath, "utf-8");

          const json: PluginSetupJSON = JSON.parse(data);
          if (!json.api_url || !json.setup_path) continue;

          const response = await fetch(`${json.api_url}/${json.setup_path}`);
          const latest = await response.json();
          if (latest.version === json.version) continue;

          plugins.push({
            disabled: true,
            ...json,
          });
        }
      }
      return plugins;
    } catch (error) {
      console.error(`Failed to check for updates: ${error}`);
      return [];
    }
  }

  /**
   * Updates a specific plugin by its ID if a new version is available.
   *
   * @param pluginId The ID of the plugin to update
   * @returns true if the update was successful, false otherwise
   */
  public async update(pluginId: PluginId): Promise<boolean> {
    try {
      await this.init();

      const filePath = join(this.path, `${pluginId}.json`);
      // Check if the plugin file exists
      if (!fs.existsSync(filePath)) return false;

      // Read and parse the existing plugin data
      const data = await fs.promises.readFile(filePath, "utf-8");
      const json: PluginSetupJSON = JSON.parse(data);

      if (!json.api_url || !json.setup_path) return false;

      const url = `${json.api_url}${json.setup_path.startsWith("/") ? json.setup_path : `/${json.setup_path}`}`;

      // Fetch the latest plugin data from the update URL
      const response = await fetch(url);

      const latest = await response.json();

      // Compare versions to determine if an update is necessary
      if (latest.version === json.version) return false;

      // Remove the old plugin file and save the updated data
      await fs.promises.unlink(filePath);
      await fs.promises.writeFile(
        filePath,
        JSON.stringify(latest, null, 2),
        "utf-8"
      );

      return true;
    } catch (error) {
      console.error(`Failed to update plugin with ID (${pluginId}): ${error}`);
      return false;
    }
  }

  /**
   * Updates all plugins if a new version is available.
   * If a plugin is disabled, it will be updated and remain disabled.
   * If a plugin is enabled, it will be updated and remain enabled.
   * @returns An array of JSON objects containing the updated plugins.
   * The objects have the same structure as the original JSON data,
   * but with the added "disabled" field, which is true if the plugin
   * was disabled before the update, and false otherwise.
   */
  async updateAll(): Promise<Array<PluginSetupJSONDisabled>> {
    try {
      await this.init();

      const plugins: Array<PluginSetupJSONDisabled> = [];

      const files = await fs.promises.readdir(this.path);
      for await (const file of files) {
        const filePath = join(this.path, file);

        // Check if the file is a plugin JSON file
        if (file.endsWith(".json")) {
          const data = await fs.promises.readFile(filePath, "utf-8");

          const json: PluginSetupJSON = JSON.parse(data);

          if (!json.api_url || !json.setup_path) continue;

          const response = await fetch(`${json.api_url}/${json.setup_path}`);
          const latest = await response.json();

          // Check if the plugin needs to be updated
          if (latest.version === json.version) continue;

          // Update the plugin
          await fs.promises.unlink(filePath);
          await fs.promises.writeFile(
            filePath,
            JSON.stringify(latest, null, 2),
            "utf-8"
          );

          // Add the plugin to the list of updated plugins
          plugins.push({
            disabled: false,
            ...json,
          });
        }

        // Check if the file is a disabled plugin JSON file
        if (file.endsWith(".disabled")) {
          const data = await fs.promises.readFile(filePath, "utf-8");

          const json: PluginSetupJSON = JSON.parse(data);

          if (!json.api_url || !json.setup_path) continue;

          const response = await fetch(`${json.api_url}/${json.setup_path}`);
          const latest = await response.json();

          // Check if the plugin needs to be updated
          if (latest.version === json.version) continue;

          // Update the plugin
          await fs.promises.unlink(filePath);
          await fs.promises.writeFile(
            filePath,
            JSON.stringify(latest, null, 2),
            "utf-8"
          );

          // Add the plugin to the list of updated plugins
          plugins.push({
            disabled: true,
            ...json,
          });
        }
      }
      return plugins;
    } catch (error) {
      console.error(`Failed to update plugins: ${error}`);
      return [];
    }
  }
}

const pluginHandler = new PluginHandler();

export default pluginHandler;
