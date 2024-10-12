import { logger } from "../../../handlers/logging";
import { registerEvent } from "../utils/registerEvent";

const getAllLogs = async (_event: Electron.IpcMainInvokeEvent) => {
  try {
    return await logger.getLogs();
  } catch (error) {
    console.error(error);
    return false;
  }
};

registerEvent("logger:get-all", getAllLogs);
