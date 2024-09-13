import { List, ListGame } from "@/@types";
import { listsDB } from "@/lib/sql/lists";
import { create } from "zustand";

interface ListsState {
  lists: List[];
  gamesInList: Record<number, ListGame[]>; // Store games for each list by listId
  loading: boolean;
  error: string | null;
  fetchLists: () => Promise<void>;
  createList: (name: string, description?: string) => Promise<void>;
  addGameToList: (listId: number, game: ListGame) => Promise<void>;
  removeGameFromList: (listId: number, gameId: number) => Promise<void>;
  fetchGamesInList: (listId: number) => Promise<void>;
  deleteList: (listId: number) => Promise<void>;
}

// Zustand store to handle lists and games globally
export const useListsStore = create<ListsState>((set) => ({
  lists: [],
  gamesInList: {},
  loading: false,
  error: null,

  fetchLists: async () => {
    set({ loading: true, error: null });
    try {
      const fetchedLists = await listsDB.getAllLists();
      set({ lists: fetchedLists });
    } catch {
      set({ error: "Failed to load lists" });
    } finally {
      set({ loading: false });
    }
  },

  createList: async (name: string, description?: string) => {
    set({ loading: true, error: null });
    try {
      await listsDB.createList(name, description);
      await useListsStore.getState().fetchLists(); // Refresh lists after creating a new one
    } catch {
      set({ error: "Failed to create list" });
    } finally {
      set({ loading: false });
    }
  },

  addGameToList: async (listId: number, game: ListGame) => {
    set({ loading: true, error: null });
    try {
      await listsDB.addGameToList(listId, game);
      await useListsStore.getState().fetchGamesInList(listId); // Refresh games after adding a new one
    } catch {
      set({ error: "Failed to add game to list" });
    } finally {
      set({ loading: false });
    }
  },

  removeGameFromList: async (listId: number, gameId: number) => {
    set({ loading: true, error: null });
    try {
      await listsDB.removeGameFromList(listId, gameId);
      await useListsStore.getState().fetchGamesInList(listId); // Refresh games after removing a game
    } catch {
      set({ error: "Failed to remove game from list" });
    } finally {
      set({ loading: false });
    }
  },

  fetchGamesInList: async (listId: number) => {
    set({ loading: true, error: null });
    try {
      const games = await listsDB.getGamesInList(listId);
      set((state) => ({
        gamesInList: {
          ...state.gamesInList,
          [listId]: games,
        },
      }));
    } catch {
      set({ error: "Failed to load games" });
    } finally {
      set({ loading: false });
    }
  },

  deleteList: async (listId: number) => {
    set({ loading: true, error: null });
    try {
      await listsDB.deleteList(listId);
      await useListsStore.getState().fetchLists(); // Refresh lists after deleting a list
    } catch {
      set({ error: "Failed to delete list" });
    } finally {
      set({ loading: false });
    }
  },
}));
