import { logger } from "../../../handlers/logging";
import { registerEvent } from "../utils/registerEvent";

const deleteALog = async (_event: Electron.IpcMainInvokeEvent, id: number) => {
  try {
    return await logger.deleteALog(id);
  } catch (error) {
    console.error(error);
    return false;
  }
};

registerEvent("logger:delete", deleteALog);
