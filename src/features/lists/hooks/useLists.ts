import { useListsStore } from "@/stores/lists";
import { useEffect } from "react";

export const useLists = () => {
  const store = useListsStore();

  useEffect(() => {
    if (store.hasDoneFirstFetch) return;

    store.fetchLists();
    store.setHasDoneFirstFetch();
  }, [store]);

  return {
    lists: store.lists,
    gamesInList: store.gamesInList,
    loading: store.loading,
    error: store.error,
    removeGameFromList: store.removeGameFromList,
    fetchLists: store.fetchLists,
    createList: store.createList,
    addGameToList: store.addGameToList,
    fetchGamesInList: store.fetchGamesInList,
    deleteList: store.deleteList,
  };
};
