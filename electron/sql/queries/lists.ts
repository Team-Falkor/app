import { List, ListGame } from "@/@types";
import { knex } from "../knex";

class ListsDatabase {
  private initialized = false;

  async init(): Promise<void> {
    if (this.initialized) return;

    // Ensure tables are created only once
    try {
      await knex.schema.hasTable("lists").then(async (exists) => {
        if (exists) return;
        await knex.schema.createTable("lists", (table) => {
          table.increments("id").primary();
          table.string("name").notNullable().unique();
          table.string("description");
        });
      });

      await knex.schema.hasTable("games").then(async (exists) => {
        if (exists) return;

        await knex.schema.createTable("games", (table) => {
          table.increments("id").primary();
          table.integer("game_id").notNullable().unique();
          table.string("title").notNullable();
          table.string("description");
          table.string("image");
          table.string("release_date");
          table.string("genre");
        });
      });

      await knex.schema.hasTable("list_games").then(async (exists) => {
        if (exists) return;
        await knex.schema.createTable("list_games", (table) => {
          table.integer("list_id").unsigned().notNullable();
          table.integer("game_id").unsigned().notNullable();
          table.primary(["list_id", "game_id"]);
          table
            .foreign("list_id")
            .references("id")
            .inTable("lists")
            .onDelete("CASCADE");
          table
            .foreign("game_id")
            .references("game_id")
            .inTable("games")
            .onDelete("CASCADE");
        });
      });
    } catch (error) {
      console.error("Error creating tables:", error);
      throw error;
    }

    this.initialized = true;
  }

  // Create a new list
  async createList(name: string, description?: string): Promise<void> {
    await this.init();
    try {
      await knex("lists").insert({ name, description: description || null });
    } catch (error) {
      console.error(`Error creating list: ${error}`);
      throw error;
    }
  }

  // Add a game to the games table and link it to a specific list
  async addGameToList(list_id: number, game: ListGame): Promise<void> {
    await this.init();

    try {
      // Insert the game if it doesn't already exist
      await knex("games")
        .insert({
          game_id: game.game_id,
          title: game.title,
          description: game.description || null,
          image: game.image || null,
          release_date: game.release_date || null,
          genre: game.genre || null,
        })
        .onConflict("game_id")
        .ignore(); // Ignore if the game already exists

      // Link the game to the list
      await knex("list_games").insert({ list_id, game_id: game.game_id });
    } catch (error) {
      console.error(`Error adding game to list: ${error}`);
      throw error;
    }
  }

  // Get all games in a specific list
  async getGamesInList(listId: number): Promise<ListGame[]> {
    await this.init();

    try {
      return knex("games as g")
        .join("list_games as lg", "g.game_id", "lg.game_id")
        .where("lg.list_id", listId)
        .select("g.*");
    } catch (error) {
      console.error(`Error getting games in list: ${error}`);
      throw error;
    }
  }

  // Get all lists
  async getAllLists(): Promise<List[]> {
    await this.init();

    try {
      return knex("lists").select("*");
    } catch (error) {
      console.error(`Error getting all lists: ${error}`);
      throw error;
    }
  }

  // Remove a game from a specific list
  async removeGameFromList(list_id: number, game_id: number): Promise<void> {
    await this.init();

    try {
      await knex("list_games").where({ list_id, game_id }).del();
    } catch (error) {
      console.error(`Error removing game from list: ${error}`);
      throw error;
    }
  }

  // Delete a list and all its games (removes the links, not the games themselves)
  async deleteList(list_id: number): Promise<void> {
    await this.init();

    try {
      // Delete the list
      await knex("lists").where({ id: list_id }).del();

      // Remove all links between the list and games
      await knex("list_games").where({ list_id }).del();
    } catch (error) {
      console.error(`Error deleting list: ${error}`);
      throw error;
    }
  }

  // Optionally, you could add a method to delete a game entirely
  async deleteGame(game_id: number): Promise<void> {
    await this.init();

    try {
      // Delete the game
      await knex("games").where({ game_id }).del();

      // Remove all links to the game
      await knex("list_games").where({ game_id }).del();
    } catch (error) {
      console.error(`Error deleting game: ${error}`);
      throw error;
    }
  }
}

const listsDB = new ListsDatabase();

export { listsDB };
