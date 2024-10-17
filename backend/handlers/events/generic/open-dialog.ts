import { dialog } from "electron";
import { registerEvent } from "../utils/registerEvent";

const openDialog = async (
  _event: Electron.IpcMainInvokeEvent,
  options: Electron.OpenDialogOptions
) => {
  return await dialog.showOpenDialog(options);
};

registerEvent("generic:open-dialog", openDialog);
