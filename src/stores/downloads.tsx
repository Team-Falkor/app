import { create } from "zustand";

interface DownloadState {
  queue: any[];
  downloading: any[];
  error: string | null;
  loading: boolean;
  addDownload: (torrentId: string) => void;
  removeDownload: (infoHash: string) => void;
  clearQueue: () => void;
  fetchDownloads: () => void;
  pauseDownload: (infoHash: string) => void;
}

export const useDownloadStore = create<DownloadState>((set, get) => ({
  queue: [],
  downloading: [],
  error: null,
  loading: false,

  addDownload: async (torrentId: string) => {
    try {
      set({ loading: true });
      const torrent = await window.ipcRenderer.invoke(
        "torrent:add-torrent",
        torrentId
      );
      set((state) => ({
        queue: [...state.queue, torrent],
        downloading: [...state.downloading, torrent],
        loading: false,
      }));
    } catch (error) {
      set({ error: String(error), loading: false });
      console.error("Failed to add torrent:", error);
    }
  },

  removeDownload: async (infoHash: string) => {
    try {
      set({ loading: true });
      await window.ipcRenderer.invoke("torrent:delete-torrent", infoHash);
      set((state) => ({
        queue: state.queue.filter((t) => t.infoHash !== infoHash),
        downloading: state.downloading.filter((t) => t.infoHash !== infoHash),
        loading: false,
      }));
    } catch (error) {
      set({ error: String(error), loading: false });
      console.error("Failed to delete torrent:", error);
    }
  },

  clearQueue: () => set({ queue: [], downloading: [] }),

  fetchDownloads: async () => {
    set({ loading: true });
    try {
      set({ loading: false });
    } catch (error) {
      set({ loading: false, error: String(error) });
    }
  },

  pauseDownload: async (infoHash: string) => {
    try {
      set({ loading: true });
      await window.ipcRenderer.invoke("torrent:pause-torrent", infoHash);
      set((state) => ({
        downloading: state.downloading.map((t) =>
          t.infoHash === infoHash ? { ...t, paused: true } : t
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error: String(error), loading: false });
      console.error("Failed to pause torrent:", error);
    }
  },
}));
