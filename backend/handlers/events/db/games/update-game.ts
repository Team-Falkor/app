import { gamesDB } from "../../../../sql";
import { registerEvent } from "../../utils/registerEvent";

const updateGame = async (
  _event: Electron.IpcMainInvokeEvent,
  gameId: string,
  updates: {
    name?: string;
    path?: string;
    icon?: string;
    args?: string;
    command?: string;
  }
) => {
  try {
    return await gamesDB.updateGame(gameId, updates);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

registerEvent("games:update-game", updateGame);
