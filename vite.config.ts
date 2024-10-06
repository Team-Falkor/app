import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { rmSync } from "node:fs";
import path from "node:path";
import { defineConfig } from "vite";
import { notBundle } from "vite-plugin-electron/plugin";
import electron from "vite-plugin-electron/simple";
import pkg from "./package.json";

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  rmSync("dist-electron", { recursive: true, force: true });

  const isServe = command === "serve";
  const isBuild = command === "build";
  const sourcemap = isServe || !!process.env.VSCODE_DEBUG;

  return {
    build: {
      sourcemap: true,
      rollupOptions: {
        external: ["better-sqlite3"],
      },
    },
    plugins: [
      react(),
      TanStackRouterVite(),
      electron({
        main: {
          // Shortcut of `build.lib.entry`.
          entry: "electron/main.ts",
          vite: {
            build: {
              sourcemap,
              minify: isBuild,
              rollupOptions: {
                external: Object.keys(
                  "dependencies" in pkg ? pkg.dependencies : {}
                ),
              },
            },
            plugins: [isServe && notBundle()],
          },
        },
        preload: {
          // Shortcut of `build.rollupOptions.input`.
          // Preload scripts may contain Web assets, so use the `build.rollupOptions.input` instead `build.lib.entry`.
          input: path.join(__dirname, "electron/preload.ts"),
          vite: {
            build: {
              sourcemap,
              minify: isBuild,
              rollupOptions: {
                external: Object.keys(
                  "dependencies" in pkg ? pkg.dependencies : {}
                ),
              },
            },
            plugins: [isServe && notBundle()],
          },
        },
        // Ployfill the Electron and Node.js API for Renderer process.
        // If you want use Node.js in Renderer process, the `nodeIntegration` needs to be enabled in the Main process.
        // See 👉 https://github.com/electron-vite/vite-plugin-electron-renderer
        renderer:
          process.env.NODE_ENV === "test"
            ? // https://github.com/electron-vite/vite-plugin-electron-renderer/issues/78#issuecomment-2053600808
              undefined
            : {},
      }),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
