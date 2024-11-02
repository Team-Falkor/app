import { AppInfo } from "@/@types";
import { app } from "electron";
import { getOS } from "../../../utils";
import { registerEvent } from "../utils/registerEvent";

const getAppInfo = (_event: Electron.IpcMainInvokeEvent): AppInfo => {
  const app_info = {
    app_version: app.getVersion(),
    electron_version: process.versions.electron,
    app_name: app.getName(),
    app_path: app.getAppPath(),
    user_data_path: app.getPath("userData"),
    os: getOS(),
  };

  return app_info;
};

registerEvent("generic:get-app-info", getAppInfo);
