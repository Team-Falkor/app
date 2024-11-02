import { IpcMainInvokeEvent } from "electron";

import { DownloadData } from "@/@types";
import DownloadItem from "../../../utils/download/item";
import { downloadQueue } from "../../../utils/download/queue";
import { registerEvent } from "../utils";

const addDownload = (event: IpcMainInvokeEvent, downloadData: DownloadData) => {
  const downloadItem = new DownloadItem(downloadData);
  downloadQueue.addToQueue(downloadItem);

  const sendProgress = () => {
    if (downloadItem.status !== "downloading") {
      clearInterval(downloadItem.progressIntervalId);
    } else {
      event.sender.send("download:progress", {
        url: downloadItem.url,
        progress: downloadItem.progress,
        game_data: downloadItem.game_data,
      });
    }
  };

  downloadItem.progressIntervalId = setInterval(sendProgress, 1000);

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
