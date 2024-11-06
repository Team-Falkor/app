import { IpcMainInvokeEvent } from "electron";

import { AddDownloadData } from "@/@types";
import DownloadItem from "../../../utils/download/item";
import { downloadQueue } from "../../../utils/download/queue";
import { registerEvent } from "../utils";

const addDownload = (
  _event: IpcMainInvokeEvent,
  downloadData: AddDownloadData
) => {
  try {
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
  } catch (error) {
    return {
      message: "Error adding download",
      error: true,
      data: null,
    };
  }
};

registerEvent("download:add", addDownload);
