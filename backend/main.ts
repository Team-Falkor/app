import { app, BrowserWindow, net, protocol } from "electron";
import path from "node:path";
import url from "node:url";
import window from "./utils/window";

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
    if (window?.window) {
      if (window?.window?.isMinimized()) window?.window?.restore();
      window?.window?.focus();
    }

    window?.window?.webContents?.send(
      "app:deep-link",
      commandLine?.pop()?.slice(0)
    );
  });

  app.whenReady().then(async () => {
    window?.createWindow();
    protocol.handle("local", (request) => {
      const filePath = request.url.slice("local:".length);
      return net.fetch(url.pathToFileURL(decodeURI(filePath)).toString());
    });

    await import("./handlers/events");

    while (!window?.window) {
      await new Promise((resolve) => setTimeout(resolve, 600));
    }

    window?.window?.webContents?.once("did-finish-load", () => {
      setTimeout(() => {
        window?.window?.webContents?.send("app:backend-loaded");
      }, 1000);
    });
  });
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform === "darwin") return;
  app.quit();
  window.destroy;
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length <= 0) return;
  window.createWindow();
});
