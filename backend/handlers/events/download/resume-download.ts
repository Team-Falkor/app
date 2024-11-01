import { IpcMainInvokeEvent } from "electron";

import { downloadQueue } from "../../../utils/download/queue";
import { registerEvent } from "../utils";

const resumeDownload = async (event: IpcMainInvokeEvent, id: string) => {
  try {
    const downloadItem = await downloadQueue.resume(id);
    if (!downloadItem)
      return {
        message: "Error resuming download",
        error: true,
        data: null,
      };

    downloadItem.progressIntervalId = setInterval(() => {
      if (downloadItem.status !== "downloading") {
        clearInterval(downloadItem.progressIntervalId);
        return;
      }

      event.sender.send("download:progress", {
        url: downloadItem.url,
        progress: downloadItem.progress,
        game_data: downloadItem.game_data,
      });
    }, 1000);

    return {
      message: "Download resumed",
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
      message: "Error resuming download",
      error: true,
      data: null,
    };
  }
};

registerEvent("download:resume", resumeDownload);
