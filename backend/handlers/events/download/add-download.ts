import { IpcMainInvokeEvent } from "electron";

import { AddDownloadData } from "@/@types";
import DownloadItem from "../../../utils/download/item";
import { downloadQueue } from "../../../utils/download/queue";
import { registerEvent } from "../utils";

const addDownload = (
  event: IpcMainInvokeEvent,
  downloadData: AddDownloadData
) => {
  const downloadItem = new DownloadItem(downloadData);
  downloadQueue.addToQueue(downloadItem);

  const sendProgress = () => {
    if (downloadItem.status !== "downloading") {
      clearInterval(downloadItem.progressIntervalId);
    } else {
      const return_data = downloadItem.getReturnData();

      console.log(JSON.stringify(return_data, null, 2));

      event.sender.send("download:progress", return_data);
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
