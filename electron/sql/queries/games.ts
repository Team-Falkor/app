import { db } from "../knex";

class GamesDatabase {
  private initialized = false;

  async init(): Promise<void> {
    if (this.initialized) return;

    try {
      // Ensure the "games" table exists
      await db.schema.hasTable("games").then(async (exists) => {
        if (!exists) {
          await db.schema.createTable("games", (table) => {
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

  // Add a new game
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

    await db("games").insert({
      game_name: game.name,
      game_path: game.path,
      game_id: game.id,
      game_icon: game.icon || null,
      game_args: game.args || null,
      game_command: game.command || null,
    });
  }

  // Get a game by ID
  async getGameById(gameId: string): Promise<any> {
    await this.init();
    if (!this.initialized) throw new Error("Database not initialized");

    const game = await db("games").where({ game_id: gameId }).first();
    return game;
  }

  // Get all games
  async getAllGames(): Promise<any[]> {
    await this.init();
    if (!this.initialized) throw new Error("Database not initialized");

    const games = await db("games").select("*");
    return games;
  }

  // Update a game
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

    await db("games")
      .where({ game_id: gameId })
      .update({
        game_name: updates.name || currentGame.game_name,
        game_path: updates.path || currentGame.game_path,
        game_icon: updates.icon || currentGame.game_icon,
        game_args: updates.args || currentGame.game_args,
        game_command: updates.command || currentGame.game_command,
      });
  }

  // Delete a game
  async deleteGame(gameId: string): Promise<void> {
    await this.init();
    if (!this.initialized) throw new Error("Database not initialized");

    await db("games").where({ game_id: gameId }).del();
  }
}

const gamesDB = new GamesDatabase();

export { gamesDB };
