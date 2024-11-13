import { app, BrowserWindow, net, protocol } from "electron";
import path from "node:path";
import url, { fileURLToPath } from "node:url";
import window from "./utils/window";

export const __dirname = path.dirname(fileURLToPath(import.meta.url));
export let win: BrowserWindow | null = window.window;

// DEEP LINKING
const deepLinkName = "falkor";
if (process.defaultApp) {
  if (process.argv.length <= 2) {
    app.setAsDefaultProtocolClient(deepLinkName, process.execPath, [
      path.resolve(process.argv[1]),
    ]);
  }
} else {
  app.setAsDefaultProtocolClient(deepLinkName);
}

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on("second-instance", (_event, commandLine, _workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (win) {
      if (win.isMinimized()) win.restore();
      win.focus();
    }

    win?.webContents.send("app:deep-link", commandLine?.pop()?.slice(0));
  });

  app.whenReady().then(async () => {
    win = window.createWindow();
    protocol.handle("local", (request) => {
      const filePath = request.url.slice("local:".length);
      return net.fetch(url.pathToFileURL(decodeURI(filePath)).toString());
    });

    await import("./handlers/events");

    while (!win) {
      await new Promise((resolve) => setTimeout(resolve, 600));
    }

    win.webContents.once("did-finish-load", () => {
      setTimeout(() => {
        win?.webContents.send("app:backend-loaded");
      }, 1000);
    });
  });
}

process.env.APP_ROOT = path.join(__dirname, "..");

export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform === "darwin") return;
  app.quit();
  win = null;
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length <= 0) return;
  win = window.createWindow();
});
