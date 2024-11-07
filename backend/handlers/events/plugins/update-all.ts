import pluginHandler from "../../../handlers/plugins/plugin";
import { registerEvent } from "../utils/registerEvent";

const updateAll = async (_event: Electron.IpcMainInvokeEvent) => {
  try {
    const updated = await pluginHandler.updateAll();

    return updated;
  } catch (error) {
    console.error(`Failed to update all plugins: ${error}`);
    return [];
  }
};

registerEvent("plugins:update-all", updateAll);
