import { useEffect, useState } from "react";

export const useAppStartup = () => {
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    window.ipcRenderer.on("app:loaded", () => {
      setHasLoaded(true);
    });
  }, []);

  return {
    hasLoaded,
  };
};
