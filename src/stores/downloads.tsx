import { toast } from "sonner";
import { create } from "zustand";

export interface Torrent {
  infoHash: string;
  name: string;
  progress: number;
  downloadSpeed: number;
  uploadSpeed: number;
  numPeers: number;
  path: string;
  paused: boolean;
  igdb_id: string;
  totalSize: number;
  timeRemaining: number;
}

interface DownloadState {
  downloading: Torrent[];
  error: string | null;
  loading: boolean;
  addDownload: (torrentId: string, igdb_id: string) => void;
  removeDownload: (infoHash: string) => void;
  fetchDownloads: () => void;
  pauseDownload: (infoHash: string) => void;
  getTorrent: (torrentId: string) => Promise<Torrent | null>;
  getTorrents: () => void;
  getQueue: () => Torrent[];
}

export const useDownloadStore = create<DownloadState>((set, get) => ({
  downloading: [],
  error: null,
  loading: false,

  addDownload: async (torrentId: string, igdb_id: string) => {
    set({ loading: true });
    try {
      const torrent = await window.ipcRenderer.invoke(
        "torrent:add-torrent",
        torrentId,
        igdb_id
      );
      set((state) => ({
        downloading: [...state.downloading, { ...torrent, igdb_id }],
        loading: false,
      }));

      if (!torrent) {
        toast.error("Failed to add torrent");
        return;
      }

      toast.success("Torrent added successfully");
    } catch (error) {
      set({ error: String(error), loading: false });
      console.error("Failed to add torrent:", error);

      toast.error("Failed to add torrent", {
        description: (error as Error).message,
      });
    }
  },

  removeDownload: async (infoHash: string) => {
    set({ loading: true });
    try {
      await window.ipcRenderer.invoke("torrent:delete-torrent", infoHash);
      set((state) => ({
        downloading: state.downloading.filter((t) => t.infoHash !== infoHash),
        loading: false,
      }));

      toast.success("Torrent deleted successfully", {
        description: `Deleted ${infoHash}`,
      });
    } catch (error) {
      set({ error: String(error), loading: false });
      console.error("Failed to delete torrent:", error);

      toast.error("Failed to delete torrent", {
        description: (error as Error).message,
      });
    }
  },

  fetchDownloads: async () => {
    set({ loading: true });
    try {
      const torrents = await window.ipcRenderer.invoke("torrent:get-torrents");
      set({ downloading: torrents, loading: false });
    } catch (error) {
      set({ error: String(error), loading: false });
      console.error("Failed to fetch torrents:", error);
    }
  },

  pauseDownload: async (infoHash: string) => {
    set({ loading: true });
    try {
      const response = await window.ipcRenderer.invoke(
        "torrent:pause-torrent",
        infoHash
      );
      set((state) => ({
        downloading: state.downloading.map((t) =>
          t.infoHash === infoHash
            ? { ...t, paused: true, igdb_id: response.data.igdb_id }
            : t
        ),
        loading: false,
      }));

      toast.success("Torrent paused successfully", {
        description: `Paused ${infoHash}`,
      });
    } catch (error) {
      set({ error: String(error), loading: false });
      console.error("Failed to pause torrent:", error);

      toast.error("Failed to pause torrent", {
        description: (error as Error).message,
      });
    }
  },

  getTorrent: async (torrentId: string) => {
    try {
      const torrent = await window.ipcRenderer.invoke(
        "torrent:get-torrent",
        torrentId
      );
      return torrent || null;
    } catch (error) {
      console.error("Failed to get torrent:", error);
      return null;
    }
  },

  getTorrents: async () => {
    set({ loading: true });
    try {
      const torrents = await window.ipcRenderer.invoke("torrent:get-torrents");
      set({ downloading: torrents, loading: false });
    } catch (error) {
      set({ error: String(error), loading: false });
      console.error("Failed to get torrents list:", error);
    }
  },

  getQueue: () => {
    return get().downloading.filter((torrent) => torrent.paused);
  },
}));
