import { create } from "zustand";

const gamesDB = (name: string, ...args: any[]) =>
  window?.ipcRenderer.invoke(`games:${name}`, ...args);

interface GamesState {
  games: Record<string, any>; // Storing games by their id (now string)
  loading: boolean;
  error: string | null;
  fetchGames: () => Promise<void>; // Add fetchGames
  addGame: (game: {
    name: string;
    path: string;
    id: string; // Ensure id is a string
    icon?: string;
    args?: string;
    command?: string;
  }) => Promise<void>;
  getGameById: (gameId: string) => Promise<any>; // gameId is now a string
  updateGame: (
    gameId: string, // Change gameId to string
    updates: {
      name?: string;
      path?: string;
      icon?: string;
      args?: string;
      command?: string;
    }
  ) => Promise<void>;
  deleteGame: (gameId: string) => Promise<void>;
}

// Zustand store for managing games globally
export const useGamesStore = create<GamesState>((set, _get) => ({
  games: {},
  loading: false,
  error: null,

  fetchGames: async () => {
    set({ loading: true, error: null });
    try {
      const games = await gamesDB("get-all-games"); // Assuming getAllGames is a method in gamesDB to fetch all games
      const gamesMap = games.reduce(
        (acc: Record<string, any>, game: { id: string }) => {
          acc[game.id] = game;
          return acc;
        },
        {}
      );
      set({ games: gamesMap });
    } catch (error) {
      console.error(error);
      set({ error: "Failed to fetch games" });
    } finally {
      set({ loading: false });
    }
  },

  addGame: async (game) => {
    set({ loading: true, error: null });
    try {
      await gamesDB("add-game", game);
      // Add the game to the state after inserting it into the database
      set((state) => ({
        games: { ...state.games, [game.id]: game },
      }));
    } catch (error) {
      console.error(error);
      set({ error: "Failed to add game" });
    } finally {
      set({ loading: false });
    }
  },

  getGameById: async (gameId) => {
    set({ loading: true, error: null });
    try {
      const game = await gamesDB("get-game-by-id", gameId);
      if (game) {
        set((state) => ({
          games: { ...state.games, [gameId]: game },
        }));
      }
      return game;
    } catch (error) {
      console.error(error);
      set({ error: "Failed to fetch game" });
      return null;
    } finally {
      set({ loading: false });
    }
  },

  updateGame: async (gameId, updates) => {
    set({ loading: true, error: null });
    try {
      await gamesDB("update-game", gameId, updates);
      // Update the game in the state after successful update
      set((state) => ({
        games: {
          ...state.games,
          [gameId]: { ...state.games[gameId], ...updates },
        },
      }));
    } catch (error) {
      console.error(error);
      set({ error: "Failed to update game" });
    } finally {
      set({ loading: false });
    }
  },

  deleteGame: async (gameId) => {
    set({ loading: true, error: null });
    try {
      await gamesDB("delete-game", gameId);
      // Remove the game from the state after successful deletion
      set((state) => {
        const updatedGames = { ...state.games };
        delete updatedGames[gameId];
        return { games: updatedGames };
      });
    } catch (error) {
      console.error(error);
      set({ error: "Failed to delete game" });
    } finally {
      set({ loading: false });
    }
  },
}));
