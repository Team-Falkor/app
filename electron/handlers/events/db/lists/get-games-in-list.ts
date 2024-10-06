import { listsDB } from "../../../../sql/";
import { registerEvent } from "../../utils/registerEvent";

const getGamesInList = async (
  _event: Electron.IpcMainInvokeEvent,
  listId: number
) => {
  try {
    return await listsDB.getGamesInList(listId);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

registerEvent("get-games-in-list", getGamesInList);
