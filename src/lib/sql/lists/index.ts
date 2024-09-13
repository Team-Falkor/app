import { List, ListGame } from "@/@types";
import Database from "@tauri-apps/plugin-sql";
import { db } from "../base";

// Define types for the database responses

class ListsDatabase {
  private lists?: Database;
  private initialized = false;

  async init(): Promise<void> {
    if (this.initialized) return;
    const dbInit = await db.init();

    this.lists = dbInit?.lists;
    if (!this.lists) throw new Error("Failed to initialize database");

    // Create the lists table
    await this.lists.execute(`
      CREATE TABLE IF NOT EXISTS lists (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        description TEXT
      );
    `);

    // Create the games table with additional fields
    await this.lists.execute(`
      CREATE TABLE IF NOT EXISTS games (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        game_id INTEGER NOT NULL UNIQUE,
        title TEXT NOT NULL,
        description TEXT,
        image TEXT,
        release_date TEXT,
        genre TEXT
      );
    `);

    // Create the junction table to link games to lists
    await this.lists.execute(`
      CREATE TABLE IF NOT EXISTS list_games (
        list_id INTEGER,
        game_id INTEGER,
        PRIMARY KEY (list_id, game_id),
        FOREIGN KEY (list_id) REFERENCES lists(id) ON DELETE CASCADE,
        FOREIGN KEY (game_id) REFERENCES games(game_id) ON DELETE CASCADE
      );
    `);

    this.initialized = true;
  }

  // Create a new list
  async createList(name: string, description?: string): Promise<void> {
    await this.init();
    if (!this.lists) throw new Error("Database not initialized");

    const query = `INSERT INTO lists (name, description) VALUES (?, ?)`;
    await this.lists.execute(query, [name, description || null]);
  }

  // Add a game to the games table, and link it to a specific list
  async addGameToList(list_id: number, game: ListGame): Promise<void> {
    await this.init();
    if (!this.lists) throw new Error("Database not initialized");

    // Insert the game if it doesn't already exist in the games table
    const insertGameQuery = `
      INSERT OR IGNORE INTO games (game_id, title, description, image, release_date, genre)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    await this.lists.execute(insertGameQuery, [
      game.game_id,
      game.title,
      game.description || null,
      game.image || null,
      game.release_date || null,
      game.genre || null,
    ]);

    // Link the game to the list in the list_games table
    const linkGameQuery = `INSERT INTO list_games (list_id, game_id) VALUES (?, ?)`;
    await this.lists.execute(linkGameQuery, [list_id, game.game_id]);
  }

  // Get all games in a specific list
  async getGamesInList(listId: number): Promise<ListGame[]> {
    await this.init();
    if (!this.lists) throw new Error("Database not initialized");

    const query = `
      SELECT g.* FROM games g
      INNER JOIN list_games lg ON g.game_id = lg.game_id
      WHERE lg.list_id = ?
    `;
    const games = await this.lists.select<ListGame[]>(query, [listId]);
    return games;
  }

  // Get all lists
  async getAllLists(): Promise<List[]> {
    await this.init();
    if (!this.lists) throw new Error("Database not initialized");

    const query = `SELECT * FROM lists`;
    const lists = await this.lists.select<List[]>(query);
    return lists;
  }

  // Remove a game from a specific list
  async removeGameFromList(list_id: number, game_id: number): Promise<void> {
    await this.init();
    if (!this.lists) throw new Error("Database not initialized");

    const query = `DELETE FROM list_games WHERE list_id = ? AND game_id = ?`;
    await this.lists.execute(query, [list_id, game_id]);
  }

  // Delete a list and all its games (removes the links, not the games themselves)
  async deleteList(list_id: number): Promise<void> {
    await this.init();
    if (!this.lists) throw new Error("Database not initialized");

    const deleteListQuery = `DELETE FROM lists WHERE id = ?`;
    await this.lists.execute(deleteListQuery, [list_id]);

    const deleteLinkQuery = `DELETE FROM list_games WHERE list_id = ?`;
    await this.lists.execute(deleteLinkQuery, [list_id]);
  }

  // Optionally, you could add a method to delete a game entirely
  async deleteGame(game_id: number): Promise<void> {
    await this.init();
    if (!this.lists) throw new Error("Database not initialized");

    const deleteGameQuery = `DELETE FROM games WHERE game_id = ?`;
    await this.lists.execute(deleteGameQuery, [game_id]);

    const deleteLinksQuery = `DELETE FROM list_games WHERE game_id = ?`;
    await this.lists.execute(deleteLinksQuery, [game_id]);
  }
}

const listsDB = new ListsDatabase();

export { listsDB };
