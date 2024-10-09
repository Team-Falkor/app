import { useCallback, useEffect, useState } from "react";

type UsePlayGameHook = {
  gameRunning: boolean;
  playGame: () => Promise<void>;
};

export const usePlayGame = (game_path: string): UsePlayGameHook => {
  const [gameRunning, setGameRunning] = useState<boolean>(false);

  // Function to launch the game
  const playGame = useCallback(async () => {
    try {
      console.log("Starting game: ", game_path);
      await window.ipcRenderer.invoke("launcher:play-game", game_path);
    } catch (error) {
      console.error(error);
    }
  }, [game_path]);

  // Cleanup effect in case component unmounts
  useEffect(() => {
    return () => {
      setGameRunning(false); // Reset state on unmount
    };
  }, []);

  return {
    gameRunning,
    playGame,
  };
};
