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
  private playtime: number;
  private isPlaying: boolean = false;
  private interval: NodeJS.Timeout | null = null;

  constructor(gamePath: string, gameId: string, currentPlaytime: number = 0) {
    this.gamePath = gamePath;
    this.gameId = gameId;
    this.playtime = currentPlaytime;
  }

  /**
   * Launches the game and sets up playtime tracking.
   */
  public launchGame(): void {
    console.log("Launching game:", this.gamePath);

    try {
      this.gameProcess = spawn(this.gamePath, { detached: true });
      this.gameProcess.unref();

      this.gameProcess.on("exit", (code, signal) => {
        console.log(`Game exited with code: ${code}, signal: ${signal}`);
        this.onGameExit();
      });

      this.startGameSession();
    } catch (error) {
      console.error("Error launching game:", error);
      logger.log("error", `Error launching game: ${(error as Error).message}`);
    }
  }

  /**
   * Tracks the playtime for the current session.
   */
  private trackPlayTime(): void {
    if (!this.isPlaying || !this.startDate) return;

    const elapsed = Date.now() - this.startDate.getTime();
    this.playtime += elapsed;
    this.startDate = new Date(); // Reset start date for next interval tracking
  }

  /**
   * Updates the database with the game's playtime and last played timestamp.
   */
  private updatePlaytime(): void {
    if (!this.gameId) return;

    gamesDB.updateGame(this.gameId, {
      game_playtime: this.playtime,
      game_last_played: new Date(),
    });

    console.log(`Updated playtime: ${ms(this.playtime)}`);
  }

  /**
   * Handles game exit by cleaning up resources and updating playtime.
   */
  private onGameExit(): void {
    this.trackPlayTime();
    this.updatePlaytime(); // Call updatePlaytime when the game exits
    this.cleanup();

    if (win) {
      win.webContents.send("game:stopped", this.gameId);
    }
  }

  /**
   * Cleans up the game session.
   */
  private cleanup(): void {
    if (this.gameProcess && !this.gameProcess.killed) {
      this.gameProcess.kill("SIGTERM");
    }

    if (this.isPlaying) {
      this.trackPlayTime(); // Ensure playtime is tracked before cleanup
      this.updatePlaytime(); // Ensure database is updated during cleanup
    }

    this.gameProcess = null;
    this.startDate = null;
    this.isPlaying = false;

    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }

    gamesLaunched.delete(this.gameId);
  }

  /**
   * Stops the game process.
   */
  public stopGame(): void {
    if (this.isPlaying) {
      this.cleanup();
    }
  }

  /**
   * Initializes game play session tracking.
   */
  private startGameSession(): void {
    this.startDate = new Date();
    this.isPlaying = true;

    this.interval = setInterval(() => this.trackPlayTime(), ms("1m"));

    if (win) {
      win.webContents.send("game:playing", this.gameId);
    }
  }
}

export default GameProcessLauncher;
