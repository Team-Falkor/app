import { LibraryGameUpdate } from "@/@types/library/types";
import { gamesDB } from "../../../../sql";
import { registerEvent } from "../../utils/registerEvent";

const updateGame = async (
  _event: Electron.IpcMainInvokeEvent,
  gameId: string,
  updates: LibraryGameUpdate
) => {
  try {
    return await gamesDB.updateGame(gameId, updates);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

registerEvent("games:update-game", updateGame);
