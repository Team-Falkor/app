import { IpcMainInvokeEvent } from "electron";

import { downloadQueue } from "../../../utils/download/queue";
import { registerEvent } from "../utils";

const stopDownload = async (_event: IpcMainInvokeEvent) => {
  try {
    const downloadItems = await downloadQueue.getDownloads();

    const return_data = downloadItems.map((downloadItem) => {
      return {
        id: downloadItem.id,
        url: downloadItem.url,
        filename: downloadItem.filename,
        status: downloadItem.status,
        progress: downloadItem.progress,
        error: downloadItem.error,
        game_data: downloadItem.game_data,
        filePath: downloadItem.filePath,
        fullPath: downloadItem.fullPath,
      };
    });

    return return_data;
  } catch (error) {
    console.error(error);
    return {
      message: "Error retrieving downloads",
      error: true,
      data: null,
    };
  }
};

registerEvent("download:get-downloads", stopDownload);
