import fs from "fs";
import https from "https";
import { logger } from "../../handlers/logging";
import item from "./item";

class HttpDownloader {
  item: item;
  private request?: ReturnType<typeof https.get>;
  private isPaused: boolean = false;
  private downloadedSize: number = 0;
  private speedInterval?: NodeJS.Timeout;
  private previousDownloadedSize: number = 0;

  constructor(item: item) {
    this.item = item;
  }

  public async download(): Promise<void> {
    this.item.setStatus("downloading");

    return new Promise<void>((resolve, reject) => {
      const options = {
        headers:
          this.downloadedSize > 0
            ? { Range: `bytes=${this.downloadedSize}-` }
            : undefined,
      };

      this.request = https.get(this.item.url, options, (response) => {
        const isPartialContent = response.statusCode === 206;
        const totalSize =
          Number(response.headers["content-length"]) +
          (isPartialContent ? this.downloadedSize : 0);

        this.item.totalSize = totalSize;

        if (![200, 206].includes(response.statusCode!)) {
          const errorMessage = `Failed to download: ${response.statusMessage}`;
          this.handleError(reject, errorMessage);
          return;
        }

        const fileStream = fs.createWriteStream(this.item.fullPath, {
          flags: isPartialContent ? "a" : "w",
        });
        response.pipe(fileStream);

        this.startSpeedTracking(totalSize);

        response.on("data", (chunk) =>
          this.trackProgress(chunk.length, totalSize)
        );
        fileStream.on("finish", () => this.finishDownload(resolve));
        fileStream.on("error", (error) => {
          return this.handleError(reject, error.message);
        });

        this.request!.on("error", (error) =>
          this.handleError(reject, error.message)
        );
      });
    });
  }

  private startSpeedTracking(totalSize: number) {
    this.previousDownloadedSize = this.downloadedSize;

    // Update download speed and time remaining every second
    this.speedInterval = setInterval(() => {
      const bytesDownloaded = this.downloadedSize - this.previousDownloadedSize;
      this.item.downloadSpeed = bytesDownloaded; // in bytes per second

      // Calculate and set time remaining in milliseconds
      const remainingBytes = totalSize - this.downloadedSize;
      const timeRemainingMs =
        bytesDownloaded > 0
          ? (remainingBytes / bytesDownloaded) * 1000 // Convert seconds to milliseconds
          : Infinity; // Avoid division by zero if no progress is made
      this.item.setTimeRemaining(timeRemainingMs); // in milliseconds

      this.previousDownloadedSize = this.downloadedSize;
    }, 1000);
  }

  private trackProgress(chunkSize: number, totalSize: number) {
    this.downloadedSize += chunkSize;
    const progress = (this.downloadedSize / totalSize) * 100;
    this.item.setProgress(progress);
  }

  private finishDownload(resolve: () => void) {
    this.item.setStatus("completed");
    this.item.closeFileStream();
    this.clearSpeedTracking(); // Stop speed tracking
    resolve();
  }

  private handleError(reject: (reason?: any) => void, message: string) {
    this.item.setError(message);
    this.item.setStatus("error");
    this.item.closeFileStream();
    this.clearSpeedTracking(); // Stop speed tracking on error

    logger.log({
      id: Math.floor(Date.now() / 1000),
      message: `Failed to download ${this.item.url}: ${message}`,
      timestamp: new Date().toISOString(),
      type: "error",
    });

    reject(new Error(message));
  }

  private clearSpeedTracking() {
    if (this.speedInterval) {
      clearInterval(this.speedInterval);
      this.speedInterval = undefined;
    }
  }

  public stop() {
    this.request?.destroy();
    this.item.setStatus("stopped");
    this.item.closeFileStream();
    this.clearSpeedTracking();
  }

  public pause() {
    if (this.request) {
      this.isPaused = true;
      this.stop();
      this.clearSpeedTracking();
      this.item.setStatus("paused");
    }
  }

  public async resume() {
    if (this.isPaused) {
      this.isPaused = false;
      await this.download();
      this.startSpeedTracking(this.item.totalSize);
      this.item.setStatus("downloading");
    }
  }
}

export default HttpDownloader;
