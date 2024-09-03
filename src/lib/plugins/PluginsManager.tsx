import { BaseDirectory, writeFile } from "@tauri-apps/plugin-fs";
import { fetch } from "@tauri-apps/plugin-http";

export class PluginsManager {
  async install(url: string) {
    try {
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36",
        },
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch: ${res.status}`);
      }

      // write dist folder to appdata
      await writeFile(`/plugins/${url.split("/").pop()}`, Buffer.from(""), {
        baseDir: BaseDirectory.AppData,
      });
    } catch (error) {
      console.error(error);
      throw new Error(`Failed to install plugin: ${error}`);
    }
  }
}
