import { getOS } from "../../../utils";
import { registerEvent } from "../utils/registerEvent";

const openDialog = (_event: Electron.IpcMainInvokeEvent) => {
  return getOS();
};

registerEvent("generic:get-os", openDialog);
