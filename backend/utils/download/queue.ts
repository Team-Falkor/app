import { logger } from "../../handlers/logging";
import HttpDownloader from "./http-downloader";
import DownloadItem from "./item";

class DownloadQueue {
  private queue: Map<string, DownloadItem> = new Map();
  private activeDownloads: Map<string, HttpDownloader> = new Map();
  private maxConcurrentDownloads: number;

  constructor(maxConcurrentDownloads: number = 1) {
    this.maxConcurrentDownloads = maxConcurrentDownloads;
  }

  public addToQueue(downloadItem: DownloadItem) {
    this.queue.set(downloadItem.id, downloadItem);
    this.processQueue();
  }

  private async processQueue() {
    while (
      this.activeDownloads.size < this.maxConcurrentDownloads &&
      this.queue.size > 0
    ) {
      const downloadItem = this.queue.values().next().value;
      if (!downloadItem) return;

      const downloader = new HttpDownloader(downloadItem);
      this.activeDownloads.set(downloadItem.id, downloader);

      try {
        await downloader.download();
      } catch (error) {
        console.error(`Failed to download ${downloadItem.url}: ${error}`);
        logger.log({
          id: Math.floor(Date.now() / 1000),
          message: `Failed to download ${downloadItem.url}: ${error}`,
          timestamp: new Date().toISOString(),
          type: "error",
        });
      }

      this.activeDownloads.delete(downloadItem.id);

      this.processQueue();
    }
  }

  public stopAll() {
    this.activeDownloads.forEach((downloader) => downloader.stop());
    this.activeDownloads = new Map();
    this.queue = new Map();
    this.processQueue();
  }

  public async pause(id: string) {
    try {
      const downloader = this.activeDownloads.get(id);
      if (!downloader) return null;
      downloader.pause();
      await this.processQueue();
      return downloader.item;
    } catch (error) {
      console.error(error);
      logger.log({
        id: Math.floor(Date.now() / 1000),
        message: `Failed to pause download with id ${id}`,
        timestamp: new Date().toISOString(),
        type: "error",
      });
      return null;
    }
  }

  public async resume(id: string) {
    try {
      const downloader = this.activeDownloads.get(id);
      if (!downloader) return null;
      downloader.resume();
      await this.processQueue();
      return downloader.item;
    } catch (error) {
      console.error(error);
      logger.log({
        id: Math.floor(Date.now() / 1000),
        message: `Failed to resume download with id ${id}`,
        timestamp: new Date().toISOString(),
        type: "error",
      });
      return null;
    }
  }

  public async stop(id: string) {
    try {
      const downloader = this.activeDownloads.get(id);
      if (!downloader) return null;
      downloader.stop();
      await this.processQueue();
      return downloader.item;
    } catch (error) {
      console.error(error);
      logger.log({
        id: Math.floor(Date.now() / 1000),
        message: `Failed to stop download with id ${id}`,
        timestamp: new Date().toISOString(),
        type: "error",
      });
      return null;
    }
  }

  public async getDownloads() {
    return Array.from(this.activeDownloads.values()).map((d) => d.item);
  }
}

const downloadQueue = new DownloadQueue();
export { downloadQueue };
