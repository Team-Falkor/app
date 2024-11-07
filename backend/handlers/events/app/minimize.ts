import { win } from "../../../main";
import { registerEvent } from "../utils/registerEvent";

const minimize = async (_event: Electron.IpcMainInvokeEvent) => {
  try {
    if (!win) return;
    win.minimize();
  } catch (error) {
    console.error(error);
    return false;
  }
};

registerEvent("app:minimize", minimize);
