import { getOS } from "../../../utils";
import { registerEvent } from "../utils/registerEvent";

const getOSEvent = (_event: Electron.IpcMainInvokeEvent) => {
  return getOS();
};

registerEvent("generic:get-os", getOSEvent);
