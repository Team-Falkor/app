import { Log } from "@/@types";
import { logger } from "../../../handlers/logging";
import { registerEvent } from "../utils/registerEvent";

const log = (_event: Electron.IpcMainInvokeEvent, log: Log) => {
  try {
    logger.log(log);

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

registerEvent("logger:log", log);
