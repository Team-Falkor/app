import updater from "../../../handlers/updater";
import { registerEvent } from "../utils";

const checkForUpdate = async (_event: Electron.IpcMainInvokeEvent) => {
  console.log("Checking for update...");
  try {
    const check = await updater.checkForUpdates();

    return { success: true, data: check };
  } catch (error) {
    console.error("Error checking for updates:", error);
    return { success: false, error };
  }
};

// Register the event handler
registerEvent("updater:check-for-update", checkForUpdate);
