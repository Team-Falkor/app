import { app, BrowserWindow, Menu, nativeImage, screen, Tray } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { settings } from "../utils/settings/settings";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

process.env.APP_ROOT = path.join(__dirname, "..");

const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;

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
        devTools: !app.isPackaged,
      },
      autoHideMenuBar: false,
      minWidth: 1000,
      minHeight: 600,
      frame,
      width: Math.min(width * 0.8, 1000),
      height: Math.min(height * 0.8, 600),
      resizable: true,
    });

    const loadURL =
      VITE_DEV_SERVER_URL || `file://${path.join(RENDERER_DIST, "index.html")}`;
    win.loadURL(loadURL);

    if (app.isPackaged) {
      win.setMenu(null);
    }

    if (!this?.tray) this.createTray();

    this.window = win;
    return win;
  }

  createTray() {
    const tray = new Tray(
      nativeImage.createFromPath(path.join(process.env.VITE_PUBLIC, "icon.png"))
    );
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

  destroy() {
    this.window?.destroy();
    this.window = null;
    this.tray?.destroy();
    this.tray = null;
  }
}

const window = new Window();

export default window;
