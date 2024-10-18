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
  igdb_id: string;
}

interface DownloadState {
  queue: Torrent[];
  downloading: Torrent[];
  error: string | null;
  loading: boolean;
  addDownload: (torrentId: string, igdb_id: string) => void;
  removeDownload: (infoHash: string) => void;
  clearQueue: () => void;
  fetchDownloads: () => void;
  pauseDownload: (infoHash: string) => void;
  getTorrent: (torrentId: string) => Promise<Torrent | null>;
  getTorrents: () => void;
}

export const useDownloadStore = create<DownloadState>((set) => ({
  queue: [],
  downloading: [],
  error: null,
  loading: false,

  // Add a torrent using ipcRenderer
  addDownload: async (torrentId: string, igdb_id: string) => {
    try {
      set({ loading: true });
      const torrent = await window.ipcRenderer.invoke(
        "torrent:add-torrent",
        torrentId,
        igdb_id // Pass igdb_id as part of the IPC call
      );
      const newTorrent = { ...torrent, igdb_id }; // Ensure igdb_id is part of the Torrent object

      set((state) => ({
        queue: [...state.queue, newTorrent],
        downloading: [...state.downloading, newTorrent],
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
      const torrent: Torrent = await window.ipcRenderer.invoke(
        "torrent:get-torrent",
        torrentId
      );
      if (!torrent) {
        set({
          error: `Torrent with ID ${torrentId} not found`,
          loading: false,
        });
        return null;
      }
      set(() => ({
        loading: false,
      }));

      return torrent;
    } catch (error) {
      set({ error: String(error), loading: false });
      console.error("Failed to get torrent:", error);

      return null;
    }
  },

  // Pause a torrent using ipcRenderer
  pauseDownload: async (infoHash: string) => {
    try {
      set({ loading: true });
      const response = await window.ipcRenderer.invoke(
        "torrent:pause-torrent",
        infoHash
      );
      const { igdb_id } = response.data; // Get igdb_id from the response

      set((state) => ({
        downloading: state.downloading.map((t) =>
          t.infoHash === infoHash ? { ...t, paused: true, igdb_id } : t
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
