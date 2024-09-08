import * as FalkorSDK from "@falkor/sdk";
import { BaseProvider } from "@falkor/sdk";
import { convertFileSrc } from "@tauri-apps/api/core";
import * as path from "@tauri-apps/api/path";
import { BaseDirectory, mkdir, readDir } from "@tauri-apps/plugin-fs";
import { fetch } from "@tauri-apps/plugin-http";
import { toast } from "sonner";

let instance: PluginLoader | null = null;

export class PluginLoader {
  private pluginPath: string = "plugins";
  private plugins: Map<string, BaseProvider> = new Map();

  initialized = false;

  constructor() {
    if (instance) return instance;
    instance = this;
  }

  reinitialize(): void {
    this.initialized = false;
    this.plugins.clear();

    this.load();
  }

  // Load all plugins from the specified directory
  async load(): Promise<void> {
    this.setupWindow();
    if (this.initialized) return;

    try {
      // Ensure the plugin directory exists
      await mkdir(this.pluginPath, {
        baseDir: BaseDirectory.AppData,
        recursive: true,
      });

      // Read the plugin directories
      const pluginFolders = await readDir(this.pluginPath, {
        baseDir: BaseDirectory.AppData,
      });

      if (!pluginFolders) return;

      // Iterate through each plugin directory
      for (const folder of pluginFolders) {
        if (!folder.name) continue;

        const folders = await readDir(`${this.pluginPath}/${folder.name}`, {
          baseDir: BaseDirectory.AppData,
        });

        if (!folders) continue;

        // Check if the plugin has a manifest file
        const manifestFile = folders?.find(
          (file) => file.name === "plugin.json"
        );

        if (!manifestFile) continue;

        // Load the plugin (index.js)
        const pathing = await path.join(
          await path.appDataDir(),
          this.pluginPath,
          folder.name,
          "index.js"
        );

        const src = convertFileSrc(pathing);

        const plugin = await import(
          /* @vite-ignore */
          src
        );

        if (!this.validatePlugin(plugin)) continue;
        console.log(`Loaded plugin: ${folder.name}`);
        toast.info(`Loaded plugin: ${folder.name}`, {
          description: "Plugin loaded successfully",
        });

        this.plugins.set(folder.name, new plugin.default());
      }

      this.initialized = true;
    } catch (error) {
      console.error("Failed to load plugins:", error);
      toast.error(`Failed to load plugins`, {
        description: `${error}`,
      });
    }
  }

  setupWindow() {
    if (!window?.FalkorSDK) window.FalkorSDK = FalkorSDK;
    if (!window.FalkorFetch) window.FalkorFetch = fetch;
  }

  // Start all plugins
  startAllPlugins(): void {
    this.plugins.forEach((plugin) => {
      if (typeof plugin.initialize === "function") {
        plugin.initialize();
      }
    });
  }

  // Stop all plugins
  stopAllPlugins(): void {
    this.plugins.forEach((plugin) => {
      if (typeof plugin.destroy === "function") {
        plugin.destroy();
      }
    });
  }

  unloadAllPlugins(): void {
    this.stopAllPlugins();
    this.plugins.clear();
    this.initialized = false;
  }

  // Additional methods to interact with the loaded plugins
  getPlugins(): BaseProvider[] {
    return Array.from(this.plugins.values());
  }

  getPluginsNames(): string[] {
    return Array.from(this.plugins.keys());
  }

  getPluginByName(name: string): BaseProvider | undefined {
    if (!this.plugins) return undefined;
    return this.plugins.get(name);
  }

  private validatePlugin(pluginModule: any): boolean {
    const requiredMethods = ["initialize", "destroy", "info", "search"];
    return requiredMethods.every(
      (method) => typeof pluginModule.default.prototype[method] === "function"
    );
  }
}
