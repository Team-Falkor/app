import {
  LibraryGame,
  LibraryGameUpdate,
  NewLibraryGame,
} from "@/@types/library/types";
import { invoke } from "@/lib";
import { create } from "zustand";

// Define the invoke function wrapper with appropriate type arguments for each database action.
const gamesDB = <T, A = any>(name: string, ...args: A[]) =>
  invoke<T>(`games:${name}`, ...args);

interface GamesState {
  games: Record<string, LibraryGame>;
  loading: boolean;
  error: string | null;
  fetchGames: () => Promise<void>;
  addGame: (game: NewLibraryGame) => Promise<void>;
  getGameById: (gameId: string) => Promise<LibraryGame | null>;
  getGameByIGDBId: (gameId: string) => Promise<LibraryGame | null>;
  updateGame: (gameId: string, updates: LibraryGameUpdate) => Promise<void>;
  deleteGame: (gameId: string) => Promise<void>;
}

export const useGamesStore = create<GamesState>((set, _get) => ({
  games: {},
  loading: false,
  error: null,

  fetchGames: async () => {
    set({ loading: true, error: null });
    try {
      const games = await gamesDB<LibraryGame[]>("get-all-games");
      if (!games) return;

      const gamesMap = games.reduce<Record<string, LibraryGame>>(
        (acc, game) => {
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
      const newGame = await gamesDB<LibraryGame, NewLibraryGame>(
        "add-game",
        game
      );

      if (!newGame) return;

      set((state) => ({
        games: { ...state.games, [newGame.game_id]: newGame },
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
      const game = await gamesDB<LibraryGame | null, string>(
        "get-game-by-id",
        gameId
      );
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

  getGameByIGDBId: async (gameId) => {
    set({ loading: true, error: null });
    try {
      const game = await gamesDB<LibraryGame | null, string>(
        "get-game-by-igdb-id",
        gameId
      );

      console.log({ game });

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
      await gamesDB<void, any>("update-game", gameId, updates);
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
      await gamesDB<void, string>("delete-game", gameId);

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
