import { shell } from "electron";
import { LauncherExtra } from "../../../@types";
import { registerEvent } from "../utils/registerEvent";

const playGame = async (
  _event: Electron.IpcMainInvokeEvent,
  game_path: string,
  _extra?: LauncherExtra
) => {
  try {
    // TODO: Launch and track process
    console.log("Launching game: ", game_path);
    await shell.openPath(game_path);

    return true;
  } catch (error) {
    console.error(error);

    return false;
  }
};

registerEvent("launcher:play-game", playGame);
