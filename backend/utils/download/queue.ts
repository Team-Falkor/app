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

  public addToQueue(downloadItem: DownloadItem): void {
    if (downloadItem.status !== "completed") {
      this.queue.set(downloadItem.id, downloadItem);
      this.processQueue();
    }
  }

  private async processQueue(): Promise<void> {
    if (
      this.activeDownloads.size >= this.maxConcurrentDownloads ||
      this.queue.size === 0
    ) {
      return;
    }

    const downloadItem = this.queue.values().next().value;
    if (!downloadItem) return;

    const downloader = new HttpDownloader(downloadItem);
    this.activeDownloads.set(downloadItem.id, downloader);

    try {
      await downloader.download();
    } catch (error) {
      this.logError(`Failed to download ${downloadItem.url}`, error);
    } finally {
      this.activeDownloads.delete(downloadItem.id);
      this.queue.delete(downloadItem.id);
      this.processQueue();
    }
  }

  public stopAll(): void {
    this.activeDownloads.forEach((downloader) => downloader.stop());
    this.activeDownloads.clear();
    this.queue.clear();
  }

  public async pause(id: string): Promise<DownloadItem | null> {
    const downloader = this.activeDownloads.get(id);
    if (!downloader) return null;

    try {
      downloader.pause();
      await this.processQueue();
      return downloader.item;
    } catch (error) {
      this.logError(`Failed to pause download with id ${id}`, error);
      return null;
    }
  }

  public async resume(id: string): Promise<DownloadItem | null> {
    const downloader = this.activeDownloads.get(id);
    if (!downloader) return null;

    try {
      await downloader.resume();
      await this.processQueue();
      return downloader.item;
    } catch (error) {
      this.logError(`Failed to resume download with id ${id}`, error);
      return null;
    }
  }

  public async stop(id: string): Promise<DownloadItem | null> {
    const downloader = this.activeDownloads.get(id);
    if (!downloader) return null;

    try {
      downloader.stop();
      this.activeDownloads.delete(id);
      this.queue.delete(id);
      return downloader.item;
    } catch (error) {
      this.logError(`Failed to stop download with id ${id}`, error);
      return null;
    }
  }

  public async getDownloads(): Promise<DownloadItem[]> {
    return Array.from(this.activeDownloads.values()).map((d) => d.item);
  }

  private logError(message: string, error: unknown): void {
    console.error(`${message}:`, error);
    logger.log({
      id: this.getCurrentTimestamp(),
      message: `${message}: ${error}`,
      timestamp: new Date().toISOString(),
      type: "error",
    });
  }

  private getCurrentTimestamp(): number {
    return Math.floor(Date.now() / 1000);
  }
}

const downloadQueue = new DownloadQueue();
export { downloadQueue };
