import { useListsStore } from "@/stores/lists";
import { useEffect } from "react";

export const useLists = () => {
  const {
    lists,
    gamesInList,
    loading,
    error,
    fetchLists,
    createList,
    addGameToList,
    removeGameFromList,
    fetchGamesInList,
    deleteList,
    hasDoneFirstFetch,
    setHasDoneFirstFetch,
  } = useListsStore();

  useEffect(() => {
    if (hasDoneFirstFetch) return;

    fetchLists();
    setHasDoneFirstFetch();
  }, [fetchLists, hasDoneFirstFetch, setHasDoneFirstFetch]);

  return {
    removeGameFromList,
    lists,
    gamesInList,
    loading,
    error,
    fetchLists,
    createList,
    addGameToList,
    fetchGamesInList,
    deleteList,
  };
};
