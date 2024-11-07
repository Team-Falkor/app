import { useUpdaterStore } from "@/stores/updater";
import { useSettings } from "./useSettings";
import { useEffect } from "react";

export const useUpdater = () => {
  const { updateAvailable, checkForUpdates, installUpdate } = useUpdaterStore();
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
  };
};
