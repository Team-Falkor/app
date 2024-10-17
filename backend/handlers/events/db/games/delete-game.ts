import { gamesDB } from "../../../../sql";
import { registerEvent } from "../../utils/registerEvent";

const deleteGame = async (
  _event: Electron.IpcMainInvokeEvent,
  gameId: string
) => {
  try {
    return await gamesDB.deleteGame(gameId);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

registerEvent("games:delete-game", deleteGame);
