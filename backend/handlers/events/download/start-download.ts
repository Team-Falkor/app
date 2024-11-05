import { IpcMainInvokeEvent } from "electron";
import { downloadQueue } from "../../../utils/download/queue";
import { registerEvent } from "../utils";

const resumeDownload = async (_event: IpcMainInvokeEvent, id: string) => {
  const downloadItem = await downloadQueue.resume(id);

  if (!downloadItem) {
    return {
      message: "Error resuming download",
      error: true,
      data: null,
    };
  }

  if (downloadItem.status !== "paused") {
    return {
      message: "Download is not paused",
      error: true,
      data: null,
    };
  }

  return {
    message: "Download resumed",
    error: false,
    data: {
      id: downloadItem.id,
      status: downloadItem.status,
      game_data: downloadItem.game_data,
    },
  };
};

registerEvent("download:start", resumeDownload);
