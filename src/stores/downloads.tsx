import { AddDownloadData, DownloadData } from "@/@types";
import { ITorrent, ITorrentGameData } from "@/@types/torrent";
import { toast } from "sonner";
import { create } from "zustand";

// Type guards
export const isTorrent = (item: ITorrent | DownloadData): item is ITorrent => {
  return (item as ITorrent).infoHash !== undefined;
};

export const isDownload = (
  item: ITorrent | DownloadData
): item is DownloadData => {
  return (item as DownloadData).url !== undefined;
};

interface DownloadState {
  downloading: Array<ITorrent | DownloadData>;
  torrents: Map<string, ITorrent>;
  downloads: Map<string, DownloadData>;
  error: string | null;
  loading: boolean;

  // Torrent methods
  addTorrent: (torrentId: string, game_data: ITorrentGameData) => void;
  removeTorrent: (infoHash: string) => void;
  pauseTorrent: (infoHash: string) => void;
  resumeTorrent: (infoHash: string) => void;
  getTorrent: (torrentId: string) => Promise<ITorrent | null>;
  getTorrents: () => void;

  // Direct download methods
  addDownload: (downloadData: AddDownloadData) => void;
  pauseDownload: (id: string) => void;
  resumeDownload: (id: string) => void;
  stopDownload: (id: string) => void;
  getDownload: (id: string) => Promise<DownloadData | null>;

  // Fetch all downloads
  fetchDownloads: () => void;

  // Queue management
  getQueue: () => Array<ITorrent | DownloadData>;
}

export const useDownloadStore = create<DownloadState>((set, get) => ({
  downloading: [],
  torrents: new Map(),
  downloads: new Map(),
  error: null,
  loading: false,

  addTorrent: async (torrentId: string, game_data: ITorrentGameData) => {
    set({ loading: true });
    try {
      const torrent = await window.ipcRenderer.invoke(
        "torrent:add-torrent",
        torrentId,
        game_data
      );
      if (!torrent) throw new Error("Failed to add torrent");

      set((state) => {
        const newTorrent = { ...torrent, game_data };
        return {
          downloading: [...state.downloading, newTorrent],
          torrents: state.torrents.set(torrentId, newTorrent),
          loading: false,
        };
      });
      toast.success("Torrent added successfully");
    } catch (error) {
      set({ error: String(error), loading: false });
      toast.error("Failed to add torrent", {
        description: (error as Error).message,
      });
    }
  },

  removeTorrent: async (infoHash: string) => {
    set({ loading: true });
    try {
      await window.ipcRenderer.invoke("torrent:delete-torrent", infoHash);
      set((state) => {
        state.torrents.delete(infoHash);
        return {
          downloading: state.downloading.filter(
            (t) => isTorrent(t) && t.infoHash !== infoHash
          ),
          loading: false,
        };
      });
      toast.success("Torrent deleted successfully");
    } catch (error) {
      set({ error: String(error), loading: false });
      toast.error("Failed to delete torrent", {
        description: (error as Error).message,
      });
    }
  },

  pauseTorrent: async (infoHash: string) => {
    set({ loading: true });
    try {
      const response = await window.ipcRenderer.invoke(
        "torrent:pause-torrent",
        infoHash
      );
      if (!response.success) throw new Error("Failed to pause torrent");

      set((state) => ({
        downloading: state.downloading.map((t) =>
          isTorrent(t) && t.infoHash === infoHash
            ? { ...t, status: "paused" }
            : t
        ),
        loading: false,
      }));
      toast.success("Torrent paused successfully");
    } catch (error) {
      set({ error: String(error), loading: false });
      toast.error("Failed to pause torrent", {
        description: (error as Error).message,
      });
    }
  },

  resumeTorrent: async (infoHash: string) => {
    set({ loading: true });
    try {
      const response = await window.ipcRenderer.invoke(
        "torrent:resume-torrent",
        infoHash
      );
      if (!response.success) throw new Error("Failed to resume torrent");

      set((state) => ({
        downloading: state.downloading.map((t) =>
          isTorrent(t) && t.infoHash === infoHash
            ? { ...t, status: "downloading" }
            : t
        ),
        loading: false,
      }));
      toast.success("Torrent resumed successfully");
    } catch (error) {
      set({ error: String(error), loading: false });
      toast.error("Failed to resume torrent", {
        description: (error as Error).message,
      });
    }
  },

  getTorrent: async (torrentId: string) => {
    return get().torrents.get(torrentId) || null;
  },

  getTorrents: async () => {
    set({ loading: true });
    try {
      const torrents = await window.ipcRenderer.invoke("torrent:get-torrents");
      set((state) => ({
        downloading: [...state.downloading, ...torrents],
        torrents: new Map(torrents.map((t: ITorrent) => [t.infoHash, t])),
        loading: false,
      }));
    } catch (error) {
      set({ error: String(error), loading: false });
      console.error("Failed to fetch torrents:", error);
    }
  },

  addDownload: async (downloadData) => {
    set({ loading: true });
    try {
      const download = await window.ipcRenderer.invoke(
        "download:add",
        downloadData
      );
      set((state) => ({
        downloading: [...state.downloading, { ...downloadData, ...download }],
        downloads: state.downloads.set(downloadData.id, download),
        loading: false,
      }));
      toast.success("Download added successfully");
    } catch (error) {
      set({ error: String(error), loading: false });
      toast.error("Failed to add download", {
        description: (error as Error).message,
      });
    }
  },

  pauseDownload: async (id: string) => {
    set({ loading: true });
    try {
      const response = await window.ipcRenderer.invoke("download:pause", id);
      if (response.error) throw new Error(response.message);

      set((state) => ({
        downloading: state.downloading.map((d) =>
          isDownload(d) && d.id === id ? { ...d, status: "paused" } : d
        ),
        loading: false,
      }));
      toast.success(response.message);
    } catch (error) {
      set({ error: String(error), loading: false });
      toast.error("Failed to pause download", {
        description: (error as Error).message,
      });
    }
  },

  resumeDownload: async (id: string) => {
    set({ loading: true });
    try {
      const response = await window.ipcRenderer.invoke("download:resume", id);
      if (response.error) throw new Error(response.message);

      set((state) => ({
        downloading: state.downloading.map((d) =>
          isDownload(d) && d.id === id ? { ...d, status: "downloading" } : d
        ),
        loading: false,
      }));
      toast.success(response.message);
    } catch (error) {
      set({ error: String(error), loading: false });
      toast.error("Failed to resume download", {
        description: (error as Error).message,
      });
    }
  },

  stopDownload: async (id: string) => {
    set({ loading: true });
    try {
      const response = await window.ipcRenderer.invoke("download:stop", id);
      if (response.error) throw new Error(response.message);

      set((state) => ({
        downloading: state.downloading.filter(
          (d) => !isDownload(d) || d.id !== id
        ),
      }));
      toast.success(response.message);
    } catch (error) {
      set({ error: String(error), loading: false });
      toast.error("Failed to stop download", {
        description: (error as Error).message,
      });
    }
  },

  getDownload: async (id: string) => {
    return get().downloads.get(id) || null;
  },

  fetchDownloads: async () => {
    set({ loading: true });
    try {
      const downloads = await window.ipcRenderer.invoke(
        "download:get-downloads"
      );
      set((state) => ({
        downloading: [...state.downloading, ...downloads],
        downloads: new Map(downloads.map((d: DownloadData) => [d.id, d])),
        loading: false,
      }));
    } catch (error) {
      set({ error: String(error), loading: false });
      console.error("Failed to fetch downloads:", error);
    }
  },

  getQueue: () => {
    return get().downloading.filter((item) => {
      if (isDownload(item)) {
        return item.status === "downloading";
      } else if (isTorrent(item)) {
        return item.status === "downloading";
      }
    });
  },
}));
