import { listsDB } from "../../../../sql/queries";
import { registerEvent } from "../../utils/registerEvent";

const removeGameFromList = async (
  _event: Electron.IpcMainInvokeEvent,
  listId: number,
  gameId: number
) => {
  try {
    return await listsDB.removeGameFromList(listId, gameId);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

registerEvent("lists:remove-game-from-list", removeGameFromList);
