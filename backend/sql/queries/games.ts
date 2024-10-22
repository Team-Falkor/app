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
          });
        }
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
  async addGame(game: {
    name: string;
    path: string;
    id: string;
    icon?: string;
    args?: string;
    command?: string;
  }): Promise<void> {
    await this.init();
    if (!this.initialized) throw new Error("Database not initialized");

    await db("library_games").insert({
      game_name: game.name,
      game_path: game.path,
      game_id: game.id,
      game_icon: game.icon || null,
      game_args: game.args || null,
      game_command: game.command || null,
    });
  }

  /**
   * Gets a game from the library by ID.
   *
   * @param {string} gameId - The ID of the game to retrieve.
   *
   * @returns {Promise<Object>} - The retrieved game.
   */
  async getGameById(gameId: string): Promise<any> {
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
  async getAllGames(): Promise<any[]> {
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
  async updateGame(
    gameId: string,
    updates: {
      name?: string;
      path?: string;
      icon?: string;
      args?: string;
      command?: string;
    }
  ): Promise<void> {
    await this.init();
    if (!this.initialized) throw new Error("Database not initialized");

    const currentGame = await this.getGameById(gameId);
    if (!currentGame) throw new Error("Game not found");

    await db("library_games")
      .where({ game_id: gameId })
      .update({
        game_name: updates.name || currentGame.game_name,
        game_path: updates.path || currentGame.game_path,
        game_icon: updates.icon || currentGame.game_icon,
        game_args: updates.args || currentGame.game_args,
        game_command: updates.command || currentGame.game_command,
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
    if (!this.initialized) throw new Error("Database not initialized");

    await db("library_games").where({ game_id: gameId }).del();
  }
}

const gamesDB = new GamesDatabase();

export { gamesDB };
