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

export const useDownloadStore = create<QueueStoreState>((set, get) => ({
  queue: [],
  downloads: [],
  maxConcurrentDownloads: 1,

  // Fetch the queue from the backend
  fetchQueue: async () => {
    try {
      const response = await window.ipcRenderer.invoke("queue:getQueueItems");
      if (response.success) {
        set({ queue: response.data });
      } else {
        console.error("Failed to fetch queue:", response.error);
      }
    } catch (error) {
      console.error("Error fetching queue:", error);
    }
  },

  // Fetch active downloads from the backend
  fetchDownloads: async () => {
    try {
      const response = await window.ipcRenderer.invoke("queue:getDownloads");
      if (response.success) {
        set({ downloads: response.data });
      } else {
        console.error("Failed to fetch downloads:", response.error);
      }
    } catch (error) {
      console.error("Error fetching downloads:", error);
    }
  },

  // Add an item to the queue
  addToQueue: async (item: QueueData) => {
    try {
      const response = await window.ipcRenderer.invoke("queue:add", item);
      if (response.success) {
        get().fetchQueue(); // Refresh the queue
      } else {
        console.error("Failed to add to queue:", response.error);
      }
    } catch (error) {
      console.error("Error adding to queue:", error);
    }
  },

  // Remove an item from the queue
  removeFromQueue: async (id: string) => {
    try {
      const response = await window.ipcRenderer.invoke("queue:remove", id);
      if (response.success) {
        get().fetchQueue(); // Refresh the queue
      } else {
        console.error("Failed to remove from queue:", response.error);
      }
    } catch (error) {
      console.error("Error removing from queue:", error);
    }
  },

  // Pause a download
  pauseDownload: async (id: string) => {
    try {
      const response = await window.ipcRenderer.invoke("queue:pause", id);
      if (response.success) {
        get().fetchDownloads(); // Refresh downloads
      } else {
        console.error("Failed to pause download:", response.error);
      }
    } catch (error) {
      console.error("Error pausing download:", error);
    }
  },

  // Resume a download
  resumeDownload: async (id: string) => {
    try {
      const response = await window.ipcRenderer.invoke("queue:resume", id);
      if (response.success) {
        get().fetchDownloads(); // Refresh downloads
      } else {
        console.error("Failed to resume download:", response.error);
      }
    } catch (error) {
      console.error("Error resuming download:", error);
    }
  },

  // Stop a download
  stopDownload: async (id: string) => {
    try {
      const response = await window.ipcRenderer.invoke("queue:stop", id);
      if (response.success) {
        get().fetchDownloads(); // Refresh downloads
      } else {
        console.error("Failed to stop download:", response.error);
      }
    } catch (error) {
      console.error("Error stopping download:", error);
    }
  },

  // Update maximum concurrent downloads
  updateMaxConcurrentDownloads: async (max: number) => {
    try {
      set({ maxConcurrentDownloads: max });
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
}));
