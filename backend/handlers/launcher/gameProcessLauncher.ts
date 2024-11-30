import { ChildProcess, spawn } from "child_process";
import ms from "ms";
import { gamesDB } from "../../sql";
import windoww from "../../utils/window";
import { logger } from "../logging";
import { gamesLaunched } from "./games_launched";

const win = windoww?.window;

class GameProcessLauncher {
  private gamePath: string;
  private gameId: string;

  private gameProcess: ChildProcess | null = null;
  private startDate: Date | null = null;
  private playtime: number = 0;
  private isPlaying: boolean = false;
  private interval: NodeJS.Timeout | null = null;

  private gamesDB = gamesDB;

  constructor(gamePath: string, gameId: string, currentPlaytime: number = 0) {
    this.gamePath = gamePath;
    this.gameId = gameId;
    this.playtime = currentPlaytime;
  }

  // Launch the game process
  public launchGame() {
    console.log("Launching game:", this.gamePath);

    try {
      // Spawn the game process
      this.gameProcess = spawn(this.gamePath, {
        detached: true,
      });
      this.gameProcess.unref();

      this.gameProcess.on("exit", (code, signal) => {
        console.log(`Game exited with code: ${code}, signal: ${signal}`);

        this.trackPlayTime();
        this.cleanup();

        if (this.interval) clearInterval(this.interval);

        this.updatePlaytime();

        // Send a message to the renderer process to update the status
        if (!win) return;
        win?.webContents.send("game:stopped", this.gameId);
      });

      this.startDate = new Date();
      this.isPlaying = true;

      this.interval = setInterval(() => this.trackPlayTime(), ms("1m"));

      if (!win) return;
      win?.webContents.send("game:playing", this.gameId);
    } catch (error) {
      console.error("Error launching game:", error);
      logger.log("error", `Error launching game: ${(error as Error).message}`);
    }
  }

  public trackPlayTime() {
    if (!this.isPlaying) return;
    if (!this.startDate) return;

    const currentDate = new Date();
    const playTime = currentDate.getTime() - this.startDate.getTime();
    this.playtime += playTime;
  }

  public updatePlaytime() {
    if (!this.gameId) return;
    this.gamesDB.updateGame(this.gameId, {
      game_playtime: this.playtime,
      game_last_played: new Date(),
    });
    console.log(`Game playtime: ${ms(this.playtime)}`);
  }

  public cleanup() {
    if (this.gameProcess && !this.gameProcess.killed) {
      this.gameProcess.kill("SIGTERM");
    }
    this.gameProcess = null;
    this.startDate = null;
    this.isPlaying = false;
    this.interval = null;
    gamesLaunched.delete(this.gameId);
  }

  public stopGame() {
    if (this.gameProcess && !this.gameProcess.killed) {
      this.gameProcess.kill("SIGTERM");
    }
  }
}

export default GameProcessLauncher;
