import window from "../../../utils/window";
import { registerEvent } from "../utils/registerEvent";

const minimize = async (_event: Electron.IpcMainInvokeEvent) => {
  try {
    if (!window?.window) return;
    window?.window?.minimize();
  } catch (error) {
    console.error(error);
    return false;
  }
};

registerEvent("app:minimize", minimize);
