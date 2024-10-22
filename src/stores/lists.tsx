import { List, ListGame } from "@/@types";
import { create } from "zustand";

const listsDB = (name: string, ...args: any[]) =>
  window?.ipcRenderer.invoke(`lists:${name}`, ...args);

type ListId = number;

interface ListsState {
  lists: List[];
  gamesInList: Record<ListId, ListGame[]>; // Store games for each list by listId
  loading: boolean;
  error: string | null;
  hasDoneFirstFetch: boolean;
  fetchLists: () => Promise<Array<List>>;
  createList: (name: string, description?: string) => Promise<void>;
  addGameToList: (listId: ListId, game: ListGame) => Promise<void>;
  removeGameFromList: (listId: ListId, gameId: number) => Promise<void>;
  fetchGamesInList: (listId: ListId) => Promise<Array<ListGame>>;
  deleteList: (listId: ListId) => Promise<void>;
  setHasDoneFirstFetch: () => void;
}

// Zustand store to handle lists and games globally
export const useListsStore = create<ListsState>((set) => ({
  lists: [],
  gamesInList: {},
  loading: false,
  error: null,
  hasDoneFirstFetch: false,

  setHasDoneFirstFetch: () => {
    set({ hasDoneFirstFetch: true });
  },

  fetchLists: async () => {
    set({ loading: true, error: null });
    try {
      const fetchedLists = await listsDB("get-all-lists");
      set({ lists: fetchedLists });

      return fetchedLists;
    } catch {
      set({ error: "Failed to load lists" });

      return [];
    } finally {
      set({ loading: false });
    }
  },

  createList: async (name: string, description?: string) => {
    set({ loading: true, error: null });
    try {
      await listsDB("create-list", name, description);
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
      await listsDB("add-game-to-list", listId, game);
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
      await listsDB("remove-game-from-list", listId, gameId);
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
      const games = await listsDB("get-games-in-list", listId);
      set((state) => ({
        gamesInList: {
          ...state.gamesInList,
          [listId]: games,
        },
      }));

      return games;
    } catch {
      set({ error: "Failed to load games" });
      return [];
    } finally {
      set({ loading: false });
    }
  },

  deleteList: async (listId: number) => {
    set({ loading: true, error: null });
    try {
      await listsDB("delete-list", listId);
      await useListsStore.getState().fetchLists(); // Refresh lists after deleting a list
    } catch {
      set({ error: "Failed to delete list" });
    } finally {
      set({ loading: false });
    }
  },
}));
