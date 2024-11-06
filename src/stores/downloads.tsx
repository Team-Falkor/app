import { AddDownloadData, DownloadData } from "@/@types";
import { ITorrent, ITorrentGameData } from "@/@types/torrent";
import { invoke, isDownload, isTorrent } from "@/lib";
import { toast } from "sonner";
import { create } from "zustand";

interface DownloadState {
  downloading: Map<string, ITorrent | DownloadData>;
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
  downloading: new Map(),
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

        state.torrents.set(torrentId, newTorrent);
        state.downloading.set(torrentId, newTorrent);
        state.loading = false;
        return state;
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
        state.downloading.delete(infoHash);
        state.loading = false;

        return state;
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

      set((state) => {
        const download = state.downloading.get(infoHash);
        if (!download) return state;
        download.status = "paused";
        state.downloading.set(infoHash, download);
        state.loading = false;
        return state;
      });
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

      set((state) => {
        const download = state.downloading.get(infoHash);
        if (!download) return state;
        download.status = "downloading";
        state.loading = false;

        return state;
      });
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
      set((state) => {
        state.downloading = new Map([...state.downloading, ...torrents]);
        state.loading = false;
        return state;
      });
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

      if (download?.error) {
        toast.error(download.message);
        return;
      }

      set((state) => {
        state.downloading.set(downloadData.id, download);
        state.downloads.set(downloadData.id, download);
        state.loading = false;
        return state;
      });
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

      set((state) => {
        const download = state.downloading.get(id);
        if (!download) return state;
        download.status = "paused";
        state.downloading.set(id, download);
        state.loading = false;
        return state;
      });
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

      set((state) => {
        const download = state.downloading.get(id);
        if (!download) return state;
        download.status = "downloading";
        state.downloading.set(id, download);
        state.loading = false;
        return state;
      });
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

      set((state) => {
        state.downloading.delete(id);
        state.downloads.delete(id);
        state.loading = false;
        return state;
      });
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
      const downloads =
        (await invoke<Array<DownloadData>>("download:get-downloads")) ?? [];
      const torrents =
        (await invoke<Array<ITorrent>>("torrent:get-torrents")) ?? [];

      set((state) => {
        torrents?.forEach((t) => {
          state.torrents.set(t.infoHash, t);
        });

        downloads?.forEach((d) => {
          state.downloads.set(d.id, d);
        });

        [...downloads, ...torrents].forEach((d) => {
          if (isDownload(d)) state.downloading.set(d.id, d);
          if (isTorrent(d)) state.downloading.set(d.infoHash, d);
        });

        state.loading = false;
        return state;
      });
    } catch (error) {
      set({ error: String(error), loading: false });
      console.error("Failed to fetch downloads:", error);
    }
  },

  getQueue: () => {
    return Array.from(get().downloading.values()).filter((item) => {
      if (isDownload(item)) return item.status !== "downloading";
      if (isTorrent(item)) return item.status !== "downloading";
      return false;
    });
  },
}));
