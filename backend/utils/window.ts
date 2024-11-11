import { BrowserWindow, screen } from "electron";
import path from "node:path";
import { RENDERER_DIST, VITE_DEV_SERVER_URL, __dirname } from "../main";
import { settings } from "./settings/settings";

class Window {
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

    return win;
  }
}

const window = new Window();

export default window;
