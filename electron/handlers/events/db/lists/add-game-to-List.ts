import { ListGame } from "@/@types";
import { listsDB } from "../../../../sql/";
import { registerEvent } from "../../utils/registerEvent";

const addGameToList = async (
  _event: Electron.IpcMainInvokeEvent,
  listId: number,
  game: ListGame
) => {
  try {
    await listsDB.addGameToList(listId, game);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

registerEvent("addGameToList", addGameToList);
