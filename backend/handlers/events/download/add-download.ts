import { IpcMainInvokeEvent } from "electron";

import { DownloadData } from "@/@types";
import DownloadItem from "../../../utils/download/item";
import { downloadQueue } from "../../../utils/download/queue";
import { registerEvent } from "../utils";

const addDownload = (event: IpcMainInvokeEvent, downloadData: DownloadData) => {
  const downloadItem = new DownloadItem(downloadData);
  downloadQueue.addToQueue(downloadItem);

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
};

registerEvent("download:add", addDownload);
