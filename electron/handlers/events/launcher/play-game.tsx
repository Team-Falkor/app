import { shell } from "electron";
import { registerEvent } from "../utils/registerEvent";

const playGame = (
  _event: Electron.IpcMainInvokeEvent,
  game_path: string,
  _extra?: {
    args?: string;
    command?: string;
  }
) => {
  try {
    shell.openExternal(game_path);

    return true;
  } catch (error) {
    console.error(error);

    return false;
  }
};

registerEvent("launcher:play-game", playGame);
