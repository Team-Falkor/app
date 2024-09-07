import { List, ListGame } from "@/@types";
import { listsDB } from "@/lib/sql/lists";
import { useCallback, useEffect, useState } from "react";

/**
 * A hook to interact with the local database of lists and games
 *
 * @returns An object with the following properties:
 *   - lists: An array of all available lists, initially empty
 *   - games: An array of games in the selected list, initially empty
 *   - loading: A boolean indicating whether a asynchronous action is in progress
 *   - error: A string indicating an error message, initially null
 *   - fetchLists: A function to fetch all lists, returning void
 *   - fetchGamesInList: A function to fetch all games in a specific list, returning void
 *   - createList: A function to create a new list, returning void
 *   - addGameToList: A function to add a game to a list, returning void
 *   - removeGameFromList: A function to remove a game from a list, returning void
 *   - deleteList: A function to delete a list, returning void
 *   - deleteGame: A function to delete a game entirely from all lists, returning void
 */
const useListsDatabase = (): {
  lists: List[];
  games: ListGame[];
  loading: boolean;
  error: string | null;
  fetchLists: () => Promise<void>;
  fetchGamesInList: (listId: number) => Promise<ListGame[]>;
  createList: (name: string, description?: string) => Promise<void>;
  addGameToList: (listId: number, game: ListGame) => Promise<void>;
  removeGameFromList: (listId: number, gameId: number) => Promise<void>;
  deleteList: (listId: number) => Promise<void>;
  deleteGame: (gameId: number) => Promise<void>;
} => {
  const [lists, setLists] = useState<List[]>([]);
  const [games, setGames] = useState<ListGame[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all lists
  const fetchLists = useCallback(async () => {
    setLoading(true);
    try {
      const listsData = await listsDB.getAllLists();
      setLists(listsData);
    } catch (err) {
      setError("Failed to fetch lists");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch games in a specific list
  const fetchGamesInList = useCallback(async (listId: number) => {
    setLoading(true);
    try {
      const gamesData = await listsDB.getGamesInList(listId);
      setGames(gamesData);

      return gamesData;
    } catch (err) {
      setError("Failed to fetch games");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new list
  const createList = useCallback(
    async (name: string, description?: string) => {
      setLoading(true);
      try {
        await listsDB.createList(name, description);
        await fetchLists(); // Refresh lists after creation

        console.log("List created successfully");
      } catch (err) {
        setError("Failed to create a new list");
      } finally {
        setLoading(false);
      }
    },
    [fetchLists]
  );

  // Add a game to a list
  const addGameToList = useCallback(
    async (listId: number, game: ListGame) => {
      setLoading(true);
      try {
        await listsDB.addGameToList(listId, game);
        await fetchGamesInList(listId); // Refresh games after adding

        console.log("Game added to list successfully");
      } catch (err) {
        setError("Failed to add game to list");
      } finally {
        setLoading(false);
      }
    },
    [fetchGamesInList]
  );

  // Remove a game from a specific list
  const removeGameFromList = useCallback(
    async (listId: number, gameId: number) => {
      setLoading(true);
      try {
        await listsDB.removeGameFromList(listId, gameId);
        await fetchGamesInList(listId); // Refresh games after removal

        console.log("Game removed from list successfully");
      } catch (err) {
        setError("Failed to remove game from list");
      } finally {
        setLoading(false);
      }
    },
    [fetchGamesInList]
  );

  // Delete a list
  const deleteList = useCallback(
    async (listId: number) => {
      setLoading(true);
      try {
        await listsDB.deleteList(listId);
        await fetchLists(); // Refresh lists after deletion
      } catch (err) {
        setError("Failed to delete list");
      } finally {
        setLoading(false);
      }
    },
    [fetchLists]
  );

  // Optionally delete a game entirely from all lists
  const deleteGame = useCallback(
    async (gameId: number) => {
      setLoading(true);
      try {
        await listsDB.deleteGame(gameId);
        await fetchLists(); // Refresh lists after deletion
      } catch (err) {
        setError("Failed to delete game");
      } finally {
        setLoading(false);
      }
    },
    [fetchLists]
  );

  useEffect(() => {
    listsDB.init();
  }, []);

  return {
    lists,
    games,
    loading,
    error,
    fetchLists,
    fetchGamesInList,
    createList,
    addGameToList,
    removeGameFromList,
    deleteList,
    deleteGame,
  };
};

export { useListsDatabase };
