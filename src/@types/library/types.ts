/**
 * Represents a game entry in the `library_games` table.
 */
export interface LibraryGame {
  id: number;
  game_name: string;
  game_path: string;
  game_id: string;
  game_icon?: string;
  game_args?: string;
  game_command?: string;
  game_playtime: number;
}

/**
 * Type for adding a new game.
 */
export type NewLibraryGame = Omit<LibraryGame, "id" | "game_playtime">;

/**
 * Type for updating game fields.
 */
export type LibraryGameUpdate = Partial<Omit<NewLibraryGame, "game_id">>;
