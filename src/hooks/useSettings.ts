import { useSettingsStore } from "@/stores/settings";
import { useEffect } from "react";

export const useSettings = () => {
  const store = useSettingsStore();

  useEffect(() => {
    if (store.hasDoneFirstFetch) return;

    store.fetchSettings();
    store.setHasDoneFirstFetch();
  }, [store]);

  return {
    settings: store.settings,
    loading: store.loading,
    error: store.error,
    fetchSettings: store.fetchSettings,
    updateSetting: store.updateSetting,
    resetSettings: store.resetSettings,
    reloadSettings: store.reloadSettings,
  };
};
