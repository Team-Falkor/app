import { useCallback, useEffect, useState } from "react";

type UsePlayGameHook = {
  gameRunning: boolean;
  playGame: () => Promise<void>;
};

export const usePlayGame = (game_path: string): UsePlayGameHook => {
  const [gameRunning, setGameRunning] = useState<boolean>(false);

  // Function to launch the game
  const playGame = useCallback(async () => {
    // try {
    //   console.log("Starting game: ", game_path);
    //   const command = Command.create("play-game", game_path);
    //   // Listen for the game closing event
    //   command.on("close", (data) => {
    //     console.log(`Game closed with code: ${data.code}`);
    //     setGameRunning(false);
    //   });
    //   // Start the game process
    //   await command.spawn();
    //   // Update state when game starts
    //   setGameRunning(true);
    // } catch (error) {
    //   console.error("Failed to start game:", "\n", error);
    //   setGameRunning(false);
    // }
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
