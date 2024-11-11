import { invoke } from "@/lib";
import { create } from "zustand";

interface UpdaterState {
  updateAvailable: boolean;
  checkForUpdates: () => void;
  installUpdate: () => void;
}

export const useUpdaterStore = create<UpdaterState>((set) => ({
  updateAvailable: false,

  checkForUpdates: async () => {
    const check = await invoke<
      {
        success: boolean;
        data?: boolean | null;
        error?: string;
      },
      never
    >("updater:check-for-update");
    console.log(check);
    if (!check || !check.success) return;
    set(() => ({ updateAvailable: check.data ?? false }));
  },
  installUpdate: () => {
    const install = invoke("updater:install");
    if (!install) return;
    set(() => ({ updateAvailable: false }));
  },
}));
