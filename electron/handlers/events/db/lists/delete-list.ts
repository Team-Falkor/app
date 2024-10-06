import { listsDB } from "../../../../sql/queries";
import { registerEvent } from "../../utils/registerEvent";

const deleteList = async (
  _event: Electron.IpcMainInvokeEvent,
  listId: number
) => {
  try {
    return await listsDB.deleteList(listId);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

registerEvent("delete-list", deleteList);
