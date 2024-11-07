import updater from "../../../handlers/updater";
import { registerEvent } from "../utils";

const installUpdate = async (_event: Electron.IpcMainInvokeEvent) => {
  console.log("Installing update...");
  try {
    return await updater.update();
  } catch (error) {
    console.error("Error installing update: ", error);
    return { success: false, error };
  }
};

// Register the event handler
registerEvent("updater:install", installUpdate);
