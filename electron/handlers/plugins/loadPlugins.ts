import { BaseProvider, PluginContext } from "@team-falkor/sdk";
import * as cheerio from "cheerio";
import * as fs from "fs";
import fuse from "fuse.js";
import * as path from "path";
import { toast } from "sonner";
import { constants } from "../../utils";

// In-memory object to hold loaded plugins
const loadedPlugins: Record<string, BaseProvider> = {};

// Define plugin directory and plugin directory
const pluginDirectory = constants.pluginsPath;

// Define the context api that each plugin will use
const api: PluginContext = {
  cheerio,
  fetch,
  fuse,
  toast,
};

// Load a plugin dynamically using ES module `import()`
const loadPlugin = async (pluginPath: string): Promise<void> => {
  try {
    const pluginModule = await import(path.join(pluginPath, "index.js"));

    // Ensure that the plugin exports a default class that extends BasePlugin
    if (
      pluginModule &&
      pluginModule.default &&
      pluginModule.default.prototype instanceof BaseProvider
    ) {
      const PluginClass = pluginModule.default;

      // Instantiate the plugin and pass the controlled APIs
      const pluginInstance: BaseProvider = new PluginClass(api);
      pluginInstance.initialize(); // Call the init method to initialize the plugin
      loadedPlugins[pluginPath] = pluginInstance; // Store the plugin
    } else {
      throw new Error(`Plugin at ${pluginPath} does not export a valid class.`);
    }
  } catch (error) {
    console.error(`Error loading plugin at ${pluginPath}:`, error);
  }
};

// Function to load all plugins
export async function loadPlugins(): Promise<void> {
  const pluginFolders = await fs.readdirSync(constants.pluginsPath);

  await Promise.all(
    pluginFolders.map(async (folder) => {
      const pluginPath = path.join(pluginDirectory, folder);
      const indexJsPath = path.join(pluginPath, "index.js");

      if (await fs.existsSync(indexJsPath)) {
        await loadPlugin(pluginPath);
      }
    })
  );
}
