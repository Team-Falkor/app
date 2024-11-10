import { NewLibraryGame } from "@/@types/library/types";
import { gamesDB } from "../../../../sql";
import { registerEvent } from "../../utils/registerEvent";

const addGameToGames = async (
  _event: Electron.IpcMainInvokeEvent,
  game: NewLibraryGame
) => {
  try {
    return await gamesDB.addGame(game);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

registerEvent("games:add-game", addGameToGames);
