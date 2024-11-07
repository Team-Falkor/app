import { win } from "../../../main";
import { registerEvent } from "../utils/registerEvent";

const close = async (_event: Electron.IpcMainInvokeEvent) => {
  try {
    if (!win) return;
    win.close();
  } catch (error) {
    console.error(error);
    return false;
  }
};

registerEvent("app:close", close);
