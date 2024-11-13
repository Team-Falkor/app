import { settings } from "../../../utils/settings/settings";
import window from "../../../utils/window";
import { registerEvent } from "../utils/registerEvent";

const close = async (_event: Electron.IpcMainInvokeEvent) => {
  try {
    if (!window?.window) return;
    const closeToTray = settings.get("closeToTray");

    if (closeToTray) {
      window?.window?.hide();
      return;
    }
    window?.window?.close();
  } catch (error) {
    console.error(error);
    return false;
  }
};

registerEvent("app:close", close);
