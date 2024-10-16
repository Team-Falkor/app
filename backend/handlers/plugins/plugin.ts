import { PluginId } from "@/@types";
import { constants } from "backend/utils";
import fs from "node:fs";
import { join } from "node:path";

export class PluginHandler {
  /**
   * Path to the plugins folder
   */
  private path = constants.pluginsPath;

  /**
   * Installs a plugin from a given url
   *
   * @param url The url to the manifest.json
   * @returns true if the install was successful, false otherwise
   */
  public async install(url: string) {
    try {
      const data = await fetch(url);

      const json = await data.json();

      // Write file to path + <name>.json
      const file_path = join(this.path, `${json.id}.json`);

      await fs.promises.writeFile(file_path, JSON.stringify(data, null, 2));

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  /**
   * Deletes a plugin based on its id
   *
   * @param pluginId The id of the plugin to delete
   * @returns true if the delete was successful, false otherwise
   */
  public async delete(pluginId: PluginId) {
    try {
      await fs.promises.unlink(join(this.path, `${pluginId}.json`));

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  public async disable(pluginId: PluginId) {
    try {
      const file_path = join(this.path, `${pluginId}.json`);
      if (!fs.existsSync(file_path)) return false;

      // add .disabled to the file name
      await fs.promises.rename(
        file_path,
        join(this.path, `${pluginId}.disabled`)
      );
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
