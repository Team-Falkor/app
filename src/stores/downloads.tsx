import { DownloadData, QueueData } from "@/@types";
import { ITorrent } from "@/@types/torrent";
import { create } from "zustand";

interface QueueStoreState {
  queue: QueueData[];
  downloads: Array<DownloadData | ITorrent>;
  maxConcurrentDownloads: number;
  addToQueue: (item: QueueData) => Promise<void>;
  removeFromQueue: (id: string) => Promise<void>;
  fetchQueue: () => Promise<void>;
  fetchDownloads: () => Promise<void>;
  pauseDownload: (id: string) => Promise<void>;
  resumeDownload: (id: string) => Promise<void>;
  stopDownload: (id: string) => Promise<void>;
  updateMaxConcurrentDownloads: (max: number) => Promise<void>;
}

export const useDownloadStore = create<QueueStoreState>((set, get) => {
  // Helper to safely update state and avoid stale closures
  const safeSetState = <T extends keyof QueueStoreState>(
    key: T,
    value: QueueStoreState[T]
  ) => {
    set((state) => ({
      ...state,
      [key]: value,
    }));
  };

  return {
    queue: [],
    downloads: [],
    maxConcurrentDownloads: 1,

    fetchQueue: async () => {
      try {
        const response = await window.ipcRenderer.invoke("queue:getQueueItems");
        if (response.success) {
          safeSetState("queue", response.data);
        } else {
          console.error("Failed to fetch queue:", response.error);
        }
      } catch (error) {
        console.error("Error fetching queue:", error);
      }
    },

    fetchDownloads: async () => {
      try {
        const response = await window.ipcRenderer.invoke("queue:getDownloads");
        if (response.success) {
          safeSetState("downloads", response.data);
        } else {
          console.error("Failed to fetch downloads:", response.error);
        }
      } catch (error) {
        console.error("Error fetching downloads:", error);
      }
    },

    addToQueue: async (item: QueueData) => {
      try {
        const response = await window.ipcRenderer.invoke("queue:add", item);
        if (response.success) {
          await get().fetchQueue(); // Ensure async completion
        } else {
          console.error("Failed to add to queue:", response.error);
        }
      } catch (error) {
        console.error("Error adding to queue:", error);
      }
    },

    removeFromQueue: async (id: string) => {
      try {
        const response = await window.ipcRenderer.invoke("queue:remove", id);
        if (response.success) {
          await get().fetchQueue(); // Ensure async completion
        } else {
          console.error("Failed to remove from queue:", response.error);
        }
      } catch (error) {
        console.error("Error removing from queue:", error);
      }
    },

    pauseDownload: async (id: string) => {
      try {
        const response = await window.ipcRenderer.invoke("queue:pause", id);
        if (response.success) {
          await get().fetchDownloads();
        } else {
          console.error("Failed to pause download:", response.error);
        }
      } catch (error) {
        console.error("Error pausing download:", error);
      }
    },

    resumeDownload: async (id: string) => {
      try {
        const response = await window.ipcRenderer.invoke("queue:resume", id);
        if (response.success) {
          await get().fetchDownloads();
        } else {
          console.error("Failed to resume download:", response.error);
        }
      } catch (error) {
        console.error("Error resuming download:", error);
      }
    },

    stopDownload: async (id: string) => {
      try {
        const response = await window.ipcRenderer.invoke("queue:stop", id);
        if (response.success) {
          await get().fetchDownloads();
        } else {
          console.error("Failed to stop download:", response.error);
        }
      } catch (error) {
        console.error("Error stopping download:", error);
      }
    },

    updateMaxConcurrentDownloads: async (max: number) => {
      try {
        safeSetState("maxConcurrentDownloads", max);
        const response = await window.ipcRenderer.invoke(
          "queue:updateMaxConcurrentDownloads",
          max
        );
        if (!response.success) {
          console.error(
            "Failed to update max concurrent downloads:",
            response.error
          );
        }
      } catch (error) {
        console.error("Error updating max concurrent downloads:", error);
      }
    },
  };
});
