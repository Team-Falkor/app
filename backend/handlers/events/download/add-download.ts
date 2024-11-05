import { IpcMainInvokeEvent } from "electron";

import { AddDownloadData } from "@/@types";
import DownloadItem from "../../../utils/download/item";
import { downloadQueue } from "../../../utils/download/queue";
import { registerEvent } from "../utils";

const addDownload = (
  _event: IpcMainInvokeEvent,
  downloadData: AddDownloadData
) => {
  const downloadItem = new DownloadItem(downloadData);
  downloadQueue.addToQueue(downloadItem);

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
