import { useGamesStore } from "@/stores/games";
import { useEffect } from "react";

export const useGames = (fetch: boolean = true) => {
  const {
    games,
    loading,
    error,
    addGame,
    getGameById,
    updateGame,
    deleteGame,
    fetchGames,
    getGameByIGDBId,
  } = useGamesStore();

  useEffect(() => {
    if (fetch) fetchGames();
  }, [fetch, fetchGames]);

  return {
    fetchGames,
    games,
    loading,
    error,
    addGame,
    getGameById,
    updateGame,
    deleteGame,
    getGameByIGDBId,
  };
};
