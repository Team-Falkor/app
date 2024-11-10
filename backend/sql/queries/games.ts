import {
  LibraryGame,
  LibraryGameUpdate,
  NewLibraryGame,
} from "@/@types/library/types";
import { db } from "../knex";

/**
 * Handles operations on the `library_games` table in the database.
 * The `library_games` table contains all games in the library.
 *
 * @class
 */
class GamesDatabase {
  /**
   * Whether the database has been initialized.
   *
   * @private
   * @type {boolean}
   */
  private initialized: boolean = false;

  /**
   * Initializes the database.
   *
   * @returns {Promise<void>}
   */
  async init(): Promise<void> {
    if (this.initialized) return;

    try {
      // Ensure the "library_games" table exists
      await db.schema.hasTable("library_games").then(async (exists) => {
        if (!exists) {
          await db.schema.createTable("library_games", (table) => {
            table.increments("id").primary();
            table.string("game_name").notNullable().unique();
            table.string("game_path").notNullable().unique();
            table.string("game_id").notNullable().unique();
            table.string("game_icon");
            table.string("game_args");
            table.string("game_command");
            table.integer("game_playtime").defaultTo(0);
          });
        }

        await db.schema
          .hasColumn("library_games", "game_playtime")
          .then(async (exists) => {
            if (!exists) {
              await db.schema.table("library_games", (table) => {
                table.integer("game_playtime").defaultTo(0);
              });
            }
          });
      });

      this.initialized = true;
    } catch (error) {
      console.error("Error initializing database:", error);
    }
  }

  /**
   * Adds a new game to the library.
   *
   * @param {Object} game - The game to add.
   * @param {string} game.name - The name of the game.
   * @param {string} game.path - The path to the game.
   * @param {string} game.id - The ID of the game.
   * @param {string} [game.icon] - The icon of the game.
   * @param {string} [game.args] - The arguments to pass to the game when launching it.
   * @param {string} [game.command] - The command to use when launching the game.
   *
   * @returns {Promise<void>}
   */
  async addGame(game: NewLibraryGame): Promise<LibraryGame> {
    await this.init();
    if (!this.initialized) throw new Error("Database not initialized");

    const newGame = await db("library_games").insert<LibraryGame>({
      game_name: game.game_name,
      game_path: game.game_path,
      game_id: game.game_id,
      game_icon: game.game_icon || null,
      game_args: game.game_args || null,
      game_command: game.game_command || null,
    });

    return newGame;
  }

  /**
   * Gets a game from the library by ID.
   *
   * @param {string} gameId - The ID of the game to retrieve.
   *
   * @returns {Promise<Object>} - The retrieved game.
   */
  async getGameById(gameId: string): Promise<LibraryGame | null> {
    await this.init();
    if (!this.initialized) throw new Error("Database not initialized");

    const game = await db("library_games").where({ game_id: gameId }).first();
    return game;
  }

  /**
   * Gets all games from the library.
   *
   * @returns {Promise<Object[]>} - The retrieved games.
   */
  async getAllGames(): Promise<LibraryGame[]> {
    await this.init();
    if (!this.initialized) throw new Error("Database not initialized");

    const games = await db("library_games").select("*");
    return games;
  }

  /**
   * Updates a game in the library.
   *
   * @param {string} gameId - The ID of the game to update.
   * @param {Object} updates - The updates to make to the game.
   * @param {string} [updates.name] - The new name of the game.
   * @param {string} [updates.path] - The new path of the game.
   * @param {string} [updates.icon] - The new icon of the game.
   * @param {string} [updates.args] - The new arguments to pass to the game when launching it.
   * @param {string} [updates.command] - The new command to use when launching the game.
   *
   * @returns {Promise<void>}
   */
  async updateGame(gameId: string, updates: LibraryGameUpdate): Promise<void> {
    await this.init();
    if (!this.initialized) throw new Error("Database not initialized");

    const currentGame = await this.getGameById(gameId);
    if (!currentGame) throw new Error("Game not found");

    await db("library_games")
      .where({ game_id: gameId })
      .update({
        game_name: updates.game_name || currentGame.game_name,
        game_path: updates.game_path || currentGame.game_path,
        game_icon: updates.game_icon || currentGame.game_icon,
        game_args: updates.game_args || currentGame.game_args,
        game_command: updates.game_command || currentGame.game_command,
      });
  }

  /**
   * Deletes a game from the library.
   *
   * @param {string} gameId - The ID of the game to delete.
   *
   * @returns {Promise<void>}
   */
  async deleteGame(gameId: string): Promise<void> {
    await this.init();

    if (!this.initialized) {
      console.error("Database not initialized");
      throw new Error("Database not initialized");
    }

    // Ensure gameId is defined and log the deletion attempt
    if (!gameId) {
      throw new Error("Game ID is required for deletion");
    }

    console.log(`Attempting to delete game with ID: ${gameId}`);

    try {
      const deletedRows = await db("library_games")
        .where({ game_id: gameId })
        .del();

      if (deletedRows === 0) {
        console.warn(`No game found with ID: ${gameId}`);
      } else {
        console.log(`Game with ID: ${gameId} deleted successfully`);
      }
    } catch (error) {
      console.error("Error deleting game:", error);
      throw error;
    }
  }

  /**
   * Updates the playtime of a game in the library.
   *
   * @param {string} gameId - The ID of the game to update.
   * @param {number} playtime - The new playtime of the game in milliseconds.
   *
   * @returns {Promise<void>}
   */
  async updateGamePlaytime(gameId: string, playtime: number): Promise<void> {
    await this.init();
    if (!this.initialized) throw new Error("Database not initialized");

    return db("library_games")
      .where({ game_id: gameId })
      .update({ game_playtime: playtime });
  }
}

const gamesDB = new GamesDatabase();

export { gamesDB };
