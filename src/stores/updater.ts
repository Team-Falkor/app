import { invoke } from "@/lib";
import { create } from "zustand";

interface UpdaterState {
  updateAvailable: boolean;
  progress?: number;
  checkForUpdates: () => void;
  installUpdate: () => void;
}

export const useUpdaterStore = create<UpdaterState>((set) => ({
  updateAvailable: false,
  progress: 0,

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

    window.ipcRenderer.on("updater:download-progress", (_, progress) => {
      if (!progress)
        window.ipcRenderer.removeAllListeners("updater:download-progress");
      set(() => ({ progress }));
    });

    set(() => ({ updateAvailable: check.data ?? false }));
  },
  installUpdate: () => {
    const install = invoke("updater:install");
    if (!install) return;

    set(() => ({ updateAvailable: false }));
  },
}));
