import { create } from "zustand";

const gamesDB = (name: string, ...args: any[]) =>
  window?.ipcRenderer.invoke(`games:${name}`, ...args);

interface GamesState {
  games: Record<string, any>;
  loading: boolean;
  error: string | null;
  fetchGames: () => Promise<void>;
  addGame: (game: {
    name: string;
    path: string;
    id: string;
    icon?: string;
    args?: string;
    command?: string;
  }) => Promise<void>;
  getGameById: (gameId: string) => Promise<any>;
  updateGame: (
    gameId: string,
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

export const useGamesStore = create<GamesState>((set, _get) => ({
  games: {},
  loading: false,
  error: null,

  fetchGames: async () => {
    set({ loading: true, error: null });
    try {
      const games = await gamesDB("get-all-games");
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
