import { listsDB } from "../../../../sql/queries";
import { registerEvent } from "../../utils/registerEvent";

const getAllLists = async (_event: Electron.IpcMainInvokeEvent) => {
  try {
    return await listsDB.getAllLists();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

registerEvent("get-all-lists", getAllLists);
