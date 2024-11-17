import { useUpdaterStore } from "@/stores/updater";
import { useEffect } from "react";
import { useSettings } from "./useSettings";

export const useUpdater = () => {
  const { updateAvailable, checkForUpdates, installUpdate, progress } =
    useUpdaterStore();
  const { settings } = useSettings();

  useEffect(() => {
    if (settings.autoCheckForUpdates) {
      checkForUpdates();
    }
  }, [checkForUpdates, settings.autoCheckForUpdates]);

  return {
    updateAvailable,
    checkForUpdates,
    installUpdate,
    progress,
  };
};
