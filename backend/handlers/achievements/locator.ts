import { Cracker } from "@/@types";
import { app } from "electron";
import { join } from "path";

type PathType =
  | "appData"
  | "documents"
  | "publicDocuments"
  | "localAppData"
  | "programData";

interface FilePath {
  achievement_folder_location: string;
  achievement_file_location: string[];
}

class AchievementFileLocator {
  private static isWindows32 = process.platform === "win32";
  private static user = !this.isWindows32
    ? app.getPath("home").split("/").pop()
    : undefined;

  private static readonly crackerPaths: Readonly<Record<Cracker, FilePath[]>> =
    Object.freeze({
      codex: [
        {
          achievement_folder_location: join(
            this.getSystemPath("publicDocuments"),
            "Steam",
            "CODEX"
          ),
          achievement_file_location: ["<game_store_id>", "achievements.ini"],
        },
        {
          achievement_folder_location: join(
            this.getSystemPath("appData"),
            "Steam",
            "CODEX"
          ),
          achievement_file_location: ["<game_store_id>", "achievements.ini"],
        },
      ],
      rune: [
        {
          achievement_folder_location: join(
            this.getSystemPath("publicDocuments"),
            "Steam",
            "RUNE"
          ),
          achievement_file_location: ["<game_store_id>", "achievements.ini"],
        },
      ],
      onlinefix: [
        {
          achievement_folder_location: join(
            this.getSystemPath("publicDocuments"),
            "OnlineFix"
          ),
          achievement_file_location: [
            "<game_store_id>",
            "Stats",
            "Achievements.ini",
          ],
        },
        {
          achievement_folder_location: join(
            this.getSystemPath("publicDocuments"),
            "OnlineFix"
          ),
          achievement_file_location: ["<game_store_id>", "Achievements.ini"],
        },
      ],
      goldberg: [
        {
          achievement_folder_location: join(
            this.getSystemPath("appData"),
            "Goldberg SteamEmu Saves"
          ),
          achievement_file_location: ["<game_store_id>", "achievements.json"],
        },
        {
          achievement_folder_location: join(
            this.getSystemPath("appData"),
            "GSE Saves"
          ),
          achievement_file_location: ["<game_store_id>", "achievements.json"],
        },
      ],
      rld: [
        {
          achievement_folder_location: join(
            this.getSystemPath("programData"),
            "RLD!"
          ),
          achievement_file_location: ["<game_store_id>", "achievements.ini"],
        },
        {
          achievement_folder_location: join(
            this.getSystemPath("programData"),
            "Steam",
            "Player"
          ),
          achievement_file_location: [
            "<game_store_id>",
            "stats",
            "achievements.ini",
          ],
        },
        {
          achievement_folder_location: join(
            this.getSystemPath("programData"),
            "Steam",
            "RLD!"
          ),
          achievement_file_location: [
            "<game_store_id>",
            "stats",
            "achievements.ini",
          ],
        },
        {
          achievement_folder_location: join(
            this.getSystemPath("programData"),
            "Steam",
            "dodi"
          ),
          achievement_file_location: [
            "<game_store_id>",
            "stats",
            "achievements.ini",
          ],
        },
      ],
      empress: [
        {
          achievement_folder_location: join(
            this.getSystemPath("appData"),
            "EMPRESS",
            "remote"
          ),
          achievement_file_location: ["<game_store_id>", "achievements.json"],
        },
        {
          achievement_folder_location: join(
            this.getSystemPath("publicDocuments"),
            "EMPRESS"
          ),
          achievement_file_location: [
            "<game_store_id>",
            "remote",
            "<game_store_id>",
            "achievements.json",
          ],
        },
      ],
      skidrow: [
        {
          achievement_folder_location: join(
            this.getSystemPath("documents"),
            "SKIDROW"
          ),
          achievement_file_location: [
            "<game_store_id>",
            "SteamEmu",
            "UserStats",
            "achiev.ini",
          ],
        },
        {
          achievement_folder_location: join(
            this.getSystemPath("documents"),
            "Player"
          ),
          achievement_file_location: [
            "<game_store_id>",
            "SteamEmu",
            "UserStats",
            "achiev.ini",
          ],
        },
        {
          achievement_folder_location: join(
            this.getSystemPath("localAppData"),
            "SKIDROW"
          ),
          achievement_file_location: [
            "<game_store_id>",
            "SteamEmu",
            "UserStats",
            "achiev.ini",
          ],
        },
      ],
      creamapi: [
        {
          achievement_folder_location: join(
            this.getSystemPath("appData"),
            "CreamAPI"
          ),
          achievement_file_location: [
            "<game_store_id>",
            "stats",
            "CreamAPI.Achievements.cfg",
          ],
        },
      ],
      smartsteamemu: [
        {
          achievement_folder_location: join(
            this.getSystemPath("appData"),
            "SmartSteamEmu"
          ),
          achievement_file_location: [
            "<game_store_id>",
            "User",
            "Achievements.ini",
          ],
        },
      ],
      _3dm: [],
      flt: [],
      rle: [
        {
          achievement_folder_location: join(
            this.getSystemPath("appData"),
            "RLE"
          ),
          achievement_file_location: ["<game_store_id>", "achievements.ini"],
        },
        {
          achievement_folder_location: join(
            this.getSystemPath("appData"),
            "RLE"
          ),
          achievement_file_location: ["<game_store_id>", "Achievements.ini"],
        },
      ],
      razor1911: [
        {
          achievement_folder_location: join(
            this.getSystemPath("appData"),
            ".1911"
          ),
          achievement_file_location: ["<game_store_id>", "achievement"],
        },
      ],
    });

  private static getSystemPath(type: PathType): string {
    switch (type) {
      case "appData":
        return this.isWindows32
          ? app.getPath("appData")
          : join("drive_c", "users", this.user || "", "AppData", "Roaming");
      case "documents":
        return this.isWindows32
          ? app.getPath("documents")
          : join("drive_c", "users", this.user || "", "Documents");
      case "publicDocuments":
        return this.isWindows32
          ? join("C:", "Users", "Public", "Documents")
          : join("drive_c", "users", "Public", "Documents");
      case "localAppData":
        return this.isWindows32
          ? join(app.getPath("appData"), "..", "Local")
          : join("drive_c", "users", this.user || "", "AppData", "Local");
      case "programData":
        return this.isWindows32
          ? join("C:", "ProgramData")
          : join("drive_c", "ProgramData");
      default:
        throw new Error(`Unknown path type: ${type}`);
    }
  }

  static getCrackerPath(cracker: Cracker): FilePath[] {
    const paths = this.crackerPaths[cracker];
    if (!paths) {
      throw new Error(`Cracker "${cracker}" not implemented`);
    }
    return paths;
  }

  static replacePlaceholders(path: string, gameStoreId: string): string {
    if (!gameStoreId) {
      throw new Error("Invalid gameStoreId provided");
    }
    return path.replace(/<game_store_id>/g, gameStoreId);
  }
}

export default AchievementFileLocator;
