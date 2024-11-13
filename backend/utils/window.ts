import { app, BrowserWindow, Menu, nativeImage, screen, Tray } from "electron";
import path from "node:path";
import { __dirname, RENDERER_DIST, VITE_DEV_SERVER_URL } from "../main";
import { settings } from "./settings/settings";

class Window {
  window: BrowserWindow | null = null;
  tray: Tray | null = null;
  screenWidth: number = 0;
  screenHeight: number = 0;

  public createWindow() {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;
    this.screenWidth = width;
    this.screenHeight = height;

    const titleBarStyle = settings.get("titleBarStyle");
    const frame = titleBarStyle === "native" || titleBarStyle === "none";

    const win = new BrowserWindow({
      icon: path.join(process.env.VITE_PUBLIC, "icon.png"),
      webPreferences: {
        preload: path.join(__dirname, "preload.mjs"),
      },
      autoHideMenuBar: true,
      minWidth: 1000,
      minHeight: 600,
      frame,
      width: Math.min(width * 0.8, 1000),
      height: Math.min(height * 0.8, 600),
      resizable: true,
    });

    const loadURL =
      VITE_DEV_SERVER_URL || path.join(RENDERER_DIST, "index.html");
    win.loadURL(loadURL);

    if (!this.tray) {
      if (settings.get("closeToTray")) {
        this.createTray();
      }
    }

    this.window = win;
    return win;
  }

  createTray() {
    const trayIconPath = path.join(process.env.VITE_PUBLIC, "icon.png");
    const tray = new Tray(nativeImage.createFromPath(trayIconPath));
    tray.setToolTip("Falkor");

    tray.setContextMenu(this.createContextMenu());

    this.tray = tray;
  }

  private createContextMenu() {
    const contextMenu = Menu.buildFromTemplate([
      {
        type: "normal",
        label: "Open Falkor",
        click: () => {
          if (!this.window) this.createWindow();
          this.window?.show();
        },
      },
      {
        type: "normal",
        label: "Quit Falkor",
        click: () => {
          app.quit();
        },
      },
    ]);

    return contextMenu;
  }
}

const window = new Window();

export default window;
