import { BaseProvider } from "@falkor/sdk";
import { BaseDirectory, exists, mkdir, readDir } from "@tauri-apps/plugin-fs";
import { fetch } from "@tauri-apps/plugin-http";

let instance: PluginLoader | null = null;

export class PluginLoader {
  private pluginPath: string = "plugins";
  private plugins: BaseProvider[] = [];

  private initialized = false;

  constructor() {
    if (instance) return instance;
    instance = this;
  }

  reinitialize(): void {
    this.initialized = false;
    this.plugins = [];

    this.load();
  }

  async load(): Promise<void> {
    if (this.initialized) return;

    try {
      // Get the list of plugin directories
      await mkdir(this.pluginPath, {
        baseDir: BaseDirectory.AppData,
        recursive: true,
      });

      const pluginFolders = await readDir(this.pluginPath, {
        baseDir: BaseDirectory.AppData,
      });

      if (!pluginFolders) return;

      // Load plugins in parallel
      const loadPromises = pluginFolders.map(async (folder) => {
        if (!folder.name) return;

        const pluginFilePath = `${this.pluginPath}/${folder.name}/index.js`;
        const fileExists = await exists(pluginFilePath, {
          baseDir: BaseDirectory.AppData,
        });

        if (fileExists) {
          try {
            /* @vite-ignore */
            const pluginModule = await import(pluginFilePath);
            const { default: PluginClass } = pluginModule as {
              default: new (fetchApi: typeof fetch) => BaseProvider;
            };

            // Instantiate and store the plugin with `fetch` passed to the constructor
            const pluginInstance = new PluginClass(fetch);
            if (pluginInstance instanceof BaseProvider) {
              this.plugins.push(pluginInstance);
            } else {
              console.warn(
                `Loaded plugin from ${pluginFilePath} does not extend BaseProvider.`
              );
            }
          } catch (importError) {
            console.error(
              `Failed to load plugin from ${pluginFilePath}:`,
              importError
            );
          }
        }
      });

      await Promise.all(loadPromises);

      this.initialized = true;
    } catch (error) {
      console.error("Failed to load plugins:", error);
      throw new Error("PluginLoader: An error occurred while loading plugins.");
    }
  }

  // Additional methods to interact with the loaded plugins
  getPlugins(): BaseProvider[] {
    return this.plugins;
  }

  getPluginByName(name: string): BaseProvider | undefined {
    return this.plugins.find((plugin) => plugin.constructor.name === name);
  }
}
