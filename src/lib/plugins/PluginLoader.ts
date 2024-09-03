import { BaseDirectory, exists, readDir } from "@tauri-apps/plugin-fs";

let instance: PluginLoader | null = null;

interface Plugin {
  new (): any;
  // Add any common methods or properties your plugins are expected to have
}

class PluginLoader {
  private pluginPath: string = "plugins";
  private plugins: Plugin[] = [];

  private initialized = false;

  constructor() {
    if (instance) {
      return instance;
    }
    instance = this;
  }

  async load(): Promise<void> {
    try {
      // Get the list of plugin directories
      const pluginFolders = await readDir(this.pluginPath, {
        baseDir: BaseDirectory.AppData,
      });

      // Load plugins in parallel
      const loadPromises = pluginFolders.map(async (folder) => {
        if (!folder.name) return;

        const pluginFilePath = `${this.pluginPath}/${folder.name}/index.js`;
        const fileExists = await exists(pluginFilePath, {
          baseDir: BaseDirectory.AppData,
        });

        if (fileExists) {
          try {
            const pluginModule = await import(pluginFilePath);
            const { default: PluginClass } = pluginModule as {
              default: Plugin;
            };

            // Instantiate and store the plugin
            this.plugins.push(new PluginClass());
          } catch (importError) {
            console.error(
              `Failed to load plugin from ${pluginFilePath}:`,
              importError
            );
          }
        }
      });

      await Promise.all(loadPromises);
    } catch (error) {
      console.error("Failed to load plugins:", error);
      throw new Error("PluginLoader: An error occurred while loading plugins.");
    }
  }
}
