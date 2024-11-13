import window from "../../../utils/window";
import { registerEvent } from "../utils/registerEvent";

const maximize = async (_event: Electron.IpcMainInvokeEvent) => {
  try {
    if (!window?.window) return;

    if (window?.window.isMaximized()) {
      window?.window?.unmaximize();
    } else {
      window?.window?.maximize();
    }
  } catch (error) {
    console.error(error);
    return false;
  }
};

registerEvent("app:maximize", maximize);
