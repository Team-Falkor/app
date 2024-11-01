import HttpDownloader from "./http-downloader";
import DownloadItem from "./item";

class DownloadQueue {
  private queue: DownloadItem[] = [];
  private activeDownloads: HttpDownloader[] = [];
  private maxConcurrentDownloads: number;

  constructor(maxConcurrentDownloads: number = 1) {
    this.maxConcurrentDownloads = maxConcurrentDownloads;
  }

  public addToQueue(downloadItem: DownloadItem) {
    this.queue.push(downloadItem);
    this.processQueue();
  }

  private async processQueue() {
    while (
      this.activeDownloads.length < this.maxConcurrentDownloads &&
      this.queue.length > 0
    ) {
      const downloadItem = this.queue.shift();
      if (!downloadItem) return;

      const downloader = new HttpDownloader(downloadItem);
      this.activeDownloads.push(downloader);

      try {
        await downloader.download();
      } catch (error) {
        console.error(`Failed to download ${downloadItem.url}: ${error}`);
      }

      this.activeDownloads = this.activeDownloads.filter(
        (d) => d !== downloader
      );
      this.processQueue();
    }
  }

  public stopAll() {
    this.activeDownloads.forEach((downloader) => downloader.stop());
    this.activeDownloads = [];
  }

  public async pause(id: string) {
    try {
      const downloader = this.activeDownloads.find((d) => d.item.id === id);
      if (!downloader) return null;
      downloader.pause();
      await this.processQueue();
      return downloader.item;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  public async resume(id: string) {
    try {
      const downloader = this.activeDownloads.find((d) => d.item.id === id);
      if (!downloader) return null;
      downloader.resume();
      await this.processQueue();
      return downloader.item;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  public async stop(id: string) {
    try {
      const downloader = this.activeDownloads.find((d) => d.item.id === id);
      if (!downloader) return null;
      downloader.stop();
      await this.processQueue();
      return downloader.item;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}

const downloadQueue = new DownloadQueue();
export { downloadQueue };
