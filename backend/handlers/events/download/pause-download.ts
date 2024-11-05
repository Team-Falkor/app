import { IpcMainInvokeEvent } from "electron";

import { downloadQueue } from "../../../utils/download/queue";
import { registerEvent } from "../utils";

const pauseDownload = async (_event: IpcMainInvokeEvent, id: string) => {
  try {
    const downloadItem = await downloadQueue.pause(id);
    if (!downloadItem) {
      return {
        message: "Error pausing download",
        error: true,
        data: null,
      };
    }

    return {
      message: "Download paused",
      error: false,
      data: {
        id: downloadItem.id,
        status: downloadItem.status,
        game_data: downloadItem.game_data,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      message: "Error pausing download",
      error: true,
      data: null,
    };
  }
};

registerEvent("download:pause", pauseDownload);
