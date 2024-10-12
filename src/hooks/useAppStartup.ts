import { useEffect, useState } from "react";

export const useAppStartup = () => {
  const [hasLoaded, setHasLoaded] = useState(false);

  const scrollToggle = (style: "hidden" | "auto") => {
    document.body.style.overflow = style;
  };

  useEffect(() => {
    scrollToggle("hidden");
    window.ipcRenderer.on("app:backend-loaded", () => {
      setHasLoaded(true);
      scrollToggle("auto");
    });

    return () => {
      scrollToggle("auto");
      window.ipcRenderer.removeAllListeners("app:backend-loaded");
    };
  }, []);

  return {
    hasLoaded,
  };
};
