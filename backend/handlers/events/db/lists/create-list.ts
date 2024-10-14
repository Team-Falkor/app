import { listsDB } from "../../../../sql/queries";
import { registerEvent } from "../../utils/registerEvent";

const createList = async (
  _event: Electron.IpcMainInvokeEvent,
  name: string,
  description?: string
) => {
  try {
    return await listsDB.createList(name, description);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

registerEvent("lists:create-list", createList);
