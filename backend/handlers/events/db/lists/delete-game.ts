import { listsDB } from "../../../../sql/queries";
import { registerEvent } from "../../utils/registerEvent";

const deleteGame = async (
  _event: Electron.IpcMainInvokeEvent,
  gameId: number
) => {
  try {
    return await listsDB.deleteGame(gameId);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

registerEvent("lists:delete-game", deleteGame);
