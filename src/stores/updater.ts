import { invoke } from "@/lib";
import type { UpdateInfo } from "electron-updater";
import { create } from "zustand";

interface UpdaterState {
  updateAvailable: boolean;
  updateInfo?: UpdateInfo;
  progress?: number;
  checkForUpdates: () => void;
  installUpdate: () => void;
  setUpdateAvailable: (updateAvailable: boolean) => void;
  setUpdateInfo: (updateInfo: UpdateInfo) => void;
}

export const useUpdaterStore = create<UpdaterState>((set) => ({
  updateAvailable: false,
  progress: 0,
  updateInfo: undefined,

  setUpdateInfo: (updateInfo: UpdateInfo) => {
    set(() => ({ updateInfo }));
  },

  checkForUpdates: async () => {
    const check = await invoke<
      {
        success: boolean;
        data?: boolean | null;
        error?: string;
      },
      never
    >("updater:check-for-update");
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
  setUpdateAvailable: (updateAvailable: boolean) => {
    set(() => ({ updateAvailable }));
  },
}));
