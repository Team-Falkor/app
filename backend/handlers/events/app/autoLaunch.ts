import { AutoLaunchOptions } from "@/@types";
import AutoLaunch from "auto-launch";
import { app } from "electron";
import { registerEvent } from "../utils/registerEvent";

const autoLaunch = async (
  _event: Electron.IpcMainInvokeEvent,
  { enabled, isHidden }: AutoLaunchOptions
) => {
  try {
    if (!app.isPackaged) {
      console.log("[AutoLaunch] App is not packaged");
      return false;
    }

    const autoLauncher = new AutoLaunch({ name: app.getName(), isHidden });

    if (!enabled) {
      autoLauncher.disable();
      return true;
    }
    autoLauncher.enable();
    return true;
  } catch (error) {
    console.error(error);
  }
};

registerEvent("app:auto-launch", autoLaunch);
