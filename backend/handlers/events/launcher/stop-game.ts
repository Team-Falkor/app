import { gamesLaunched } from "../../launcher/games_launched";
import { registerEvent } from "../utils/registerEvent";

const stopGame = async (
  _event: Electron.IpcMainInvokeEvent,
  game_id: string
) => {
  try {
    const launcher = gamesLaunched.get(game_id);

    if (!launcher) {
      console.log("Game not launched");
      return true;
    }

    launcher.stopGame();

    return true;
  } catch (error) {
    console.error("Failed to launch game:", error);
    return false;
  }
};

registerEvent("launcher:stop-game", stopGame);
