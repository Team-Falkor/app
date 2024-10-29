import type { IpcMainInvokeEvent } from "electron";
import { client } from "../../../utils";
import { registerEvent } from "../utils";

// Event handler for pausing a torrent
const throttleDownload = async (_event: IpcMainInvokeEvent, rate: number) => {
  try {
    client.throttleDownload(rate);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

registerEvent("torrent:throttle-download", throttleDownload);
