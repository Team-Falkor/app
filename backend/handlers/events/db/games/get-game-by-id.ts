import { gamesDB } from "../../../../sql";
import { registerEvent } from "../../utils/registerEvent";

const getGameById = async (
  _event: Electron.IpcMainInvokeEvent,
  gameId: string
) => {
  try {
    return await gamesDB.getGameById(gameId);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

registerEvent("games:get-game-by-id", getGameById);
