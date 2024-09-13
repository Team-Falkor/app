import { useListsStore } from "@/stores/lists";

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
  } = useListsStore();

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
