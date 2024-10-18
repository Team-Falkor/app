import { gamesDB } from "../../../../sql";
import { registerEvent } from "../../utils/registerEvent";

const addGameToGames = async (
  _event: Electron.IpcMainInvokeEvent,
  game: {
    name: string;
    path: string;
    id: string;
    icon?: string;
    args?: string;
    command?: string;
  }
) => {
  try {
    return await gamesDB.addGame(game);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

registerEvent("games:add-game", addGameToGames);
