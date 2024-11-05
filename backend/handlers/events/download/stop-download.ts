import { IpcMainInvokeEvent } from "electron";

import { downloadQueue } from "../../../utils/download/queue";
import { registerEvent } from "../utils";

const stopDownload = async (_event: IpcMainInvokeEvent, id: string) => {
  const downloadItem = await downloadQueue.stop(id);

  if (!downloadItem) {
    console.error(`No download found with id ${id}`);

    return {
      message: "Error stopping download",
      error: true,
      data: null,
    };
  }

  return {
    message: "Download stopped",
    error: false,
    data: {
      id: downloadItem.id,
      status: downloadItem.status,
      game_data: downloadItem.game_data,
    },
  };
};

registerEvent("download:stop", stopDownload);
