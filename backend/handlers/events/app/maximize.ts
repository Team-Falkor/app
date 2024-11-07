import { win } from "../../../main";
import { registerEvent } from "../utils/registerEvent";

const maximize = async (_event: Electron.IpcMainInvokeEvent) => {
  try {
    if (!win) return;

    if (win?.isMaximized()) {
      win?.unmaximize();
    } else {
      win?.maximize();
    }
  } catch (error) {
    console.error(error);
    return false;
  }
};

registerEvent("app:maximize", maximize);
