import { create } from "zustand";

interface Torrent {
  infoHash: string;
  name: string;
  progress: number;
  downloadSpeed: number;
  uploadSpeed: number;
  numPeers: number;
  path: string;
  paused: boolean;
}

interface DownloadState {
  queue: Torrent[];
  downloading: Torrent[];
  error: string | null;
  loading: boolean;
  addDownload: (torrentId: string) => void;
  removeDownload: (infoHash: string) => void;
  clearQueue: () => void;
  fetchDownloads: () => void;
  pauseDownload: (infoHash: string) => void;
  getTorrent: (torrentId: string) => void;
  getTorrents: () => void;
}

export const useDownloadStore = create<DownloadState>((set, get) => ({
  queue: [],
  downloading: [],
  error: null,
  loading: false,

  // Add a torrent using ipcRenderer
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

  // Remove a torrent using ipcRenderer
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

  // Clear all downloads
  clearQueue: () => set({ queue: [], downloading: [] }),

  // Fetch the list of all torrents using ipcRenderer
  fetchDownloads: async () => {
    set({ loading: true });
    try {
      const torrents = await window.ipcRenderer.invoke("torrent:get-torrents");
      set({
        queue: torrents,
        downloading: torrents.filter(
          (torrent: Torrent) => torrent.progress < 1
        ),
        loading: false,
      });
    } catch (error) {
      set({ error: String(error), loading: false });
      console.error("Failed to fetch torrents:", error);
    }
  },

  // Fetch details of a single torrent using ipcRenderer
  getTorrent: async (torrentId: string) => {
    set({ loading: true });
    try {
      const torrent = await window.ipcRenderer.invoke(
        "torrent:get-torrent",
        torrentId
      );
      if (torrent) {
        set((state) => ({
          queue: state.queue.map((t) =>
            t.infoHash === torrent.infoHash ? torrent : t
          ),
          loading: false,
        }));
      } else {
        set({
          error: `Torrent with ID ${torrentId} not found`,
          loading: false,
        });
      }
    } catch (error) {
      set({ error: String(error), loading: false });
      console.error("Failed to get torrent:", error);
    }
  },

  // Pause a torrent using ipcRenderer
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

  // Fetch all torrents (can be used to populate the UI with the torrent list)
  getTorrents: async () => {
    set({ loading: true });
    try {
      const torrents = await window.ipcRenderer.invoke("torrent:get-torrents");
      set({
        queue: torrents,
        downloading: torrents.filter(
          (torrent: Torrent) => torrent.progress < 1
        ),
        loading: false,
      });
    } catch (error) {
      set({ error: String(error), loading: false });
      console.error("Failed to get torrents list:", error);
    }
  },
}));
