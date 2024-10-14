import { Log } from "@/@types";
import { logger } from "../../../handlers/logging";
import { registerEvent } from "../utils/registerEvent";

const getLog = async (
  _event: Electron.IpcMainInvokeEvent,
  id: number
): Promise<Log | undefined> => {
  try {
    return await logger.getLogById(id);
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

registerEvent("logger:get", getLog);
