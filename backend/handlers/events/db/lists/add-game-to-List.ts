import { ListGame } from "@/@types";
import { listsDB } from "../../../../sql";
import { registerEvent } from "../../utils/registerEvent";

const addGameToList = async (
  _event: Electron.IpcMainInvokeEvent,
  listId: number,
  game: ListGame
) => {
  try {
    return await listsDB.addGameToList(listId, game);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

registerEvent("lists:add-game-to-list", addGameToList);
