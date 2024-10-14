import { gamesDB } from "../../../../sql/";
import { registerEvent } from "../../utils/registerEvent";

const getAllGames = async (_event: Electron.IpcMainInvokeEvent) => {
  try {
    return await gamesDB.getAllGames();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

registerEvent("games:get-all-games", getAllGames);
