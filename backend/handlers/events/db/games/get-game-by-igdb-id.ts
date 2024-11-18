import { gamesDB } from "../../../../sql";
import { registerEvent } from "../../utils/registerEvent";

const getGameByIgdbId = async (
  _event: Electron.IpcMainInvokeEvent,
  gameId: string
) => {
  try {
    const game = await gamesDB.getGameByIGDBId(gameId);

    return game;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

registerEvent("games:get-game-by-igdb-id", getGameByIgdbId);
