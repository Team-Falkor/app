import { IpcMainInvokeEvent } from "electron";

import { downloadQueue } from "../../../utils/download/queue";
import { registerEvent } from "../utils";

const stopDownload = async (_event: IpcMainInvokeEvent, id: string) => {
  try {
    const downloadItem = await downloadQueue.stop(id);
    if (!downloadItem)
      return {
        message: "Error stopping download",
        error: true,
        data: null,
      };

    if (downloadItem.progressIntervalId)
      clearInterval(downloadItem.progressIntervalId);

    return {
      message: "Download stopped",
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
      message: "Error stopping download",
      error: true,
      data: null,
    };
  }
};

registerEvent("download:stop", stopDownload);
