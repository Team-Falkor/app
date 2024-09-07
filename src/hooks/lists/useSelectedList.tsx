import { List, ListGame } from "@/@types";
import { useCallback, useEffect, useState } from "react";
import { useListsDatabase } from "./useListsDatabase";

/**
 * A hook to select a list by its ID and get its games.
 *
 * @param initialListId The ID of the list to select initially, or null to select no list.
 * @returns An object with the following properties:
 *   - lists: An array of all available lists, initially empty.
 *   - selectedList: The currently selected list, or null if no list is selected.
 *   - gamesInSelectedList: An array of games in the currently selected list, initially empty.
 *   - selectList: A function to select a new list by its ID, which takes a number as an argument and returns void.
 */
const useSelectedList = (
  initialListId: number | null = null
): {
  lists: List[];
  selectedList: List | null;
  gamesInSelectedList: ListGame[];
  selectList: (listId: number) => void;
} => {
  const {
    lists, // All available lists
    games, // Games in the selected list
    fetchLists, // Fetch all lists
    fetchGamesInList, // Fetch games for a selected list
  } = useListsDatabase();

  const [selectedListId, setSelectedListId] = useState<number | null>(
    initialListId
  );
  const [selectedList, setSelectedList] = useState<List | null>(null);
  const [gamesInSelectedList, setGamesInSelectedList] = useState<ListGame[]>(
    []
  );

  // Effect to fetch all lists when the hook initializes
  useEffect(() => {
    fetchLists();
  }, [fetchLists]);

  // Effect to update the selected list whenever the listId changes
  useEffect(() => {
    if (selectedListId !== null) {
      const list = lists.find((list) => list.id === selectedListId);
      setSelectedList(list || null);
      if (list) {
        fetchGamesInList(selectedListId);
      }
    }
  }, [selectedListId, lists, fetchGamesInList]);

  // Effect to update the games state when the games change
  useEffect(() => {
    if (selectedListId !== null) {
      setGamesInSelectedList(games);
    }
  }, [games, selectedListId]);

  // Function to select a new list by its ID
  const selectList = useCallback((listId: number) => {
    setSelectedListId(listId);
  }, []);

  return {
    lists, // All available lists
    selectedList, // Currently selected list
    gamesInSelectedList, // Games in the currently selected list
    selectList, // Function to select a list
  };
};

export { useSelectedList };
