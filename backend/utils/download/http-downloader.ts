import fs from "fs";
import https from "https";
import { logger } from "../../handlers/logging";
import { win } from "../../main";
import download_events from "./events";
import item from "./item";

class HttpDownloader {
  item: item;
  private request?: ReturnType<typeof https.get>;
  private isPaused: boolean = false;
  private downloadedSize: number = 0;
  private speedInterval?: NodeJS.Timeout;
  private previousDownloadedSize: number = 0;
  private fileStream?: fs.WriteStream;

  constructor(item: item) {
    this.item = item;
  }

  public async download(): Promise<void> {
    if (this.item.status === "completed") return;

    this.item.updateStatus("downloading");
    this.previousDownloadedSize = this.downloadedSize; // Initialize downloaded size

    return new Promise<void>((resolve, reject) => {
      const options = {
        headers:
          this.downloadedSize > 0
            ? { Range: `bytes=${this.downloadedSize}-` }
            : undefined,
      };

      this.request = https.get(this.item.url, options, (response) => {
        if (![200, 206].includes(response.statusCode!)) {
          this.handleError(
            reject,
            `Failed to download: ${response.statusMessage}`
          );
          return;
        }

        const isPartialContent = response.statusCode === 206;
        const totalSize =
          Number(response.headers["content-length"]) +
          (isPartialContent ? this.downloadedSize : 0);
        this.item.totalSize = totalSize;

        this.fileStream = fs.createWriteStream(this.item.fullPath, {
          flags: isPartialContent ? "a" : "w",
        });

        response.pipe(this.fileStream);

        // Start tracking download speed and progress
        this.startSpeedTracking(totalSize);
        response.on("data", (chunk) =>
          this.trackProgress(chunk.length, totalSize)
        );

        response.on("end", () => {
          this.fileStream?.close();
          this.finishDownload(resolve);
        });

        this.fileStream.on("error", (error) =>
          this.handleError(reject, error.message)
        );
        this.request!.on("error", (error) =>
          this.handleError(reject, error.message)
        );
      });
    });
  }

  private startSpeedTracking(totalSize: number) {
    this.previousDownloadedSize = this.downloadedSize;

    this.speedInterval = setInterval(() => {
      const bytesDownloaded = this.downloadedSize - this.previousDownloadedSize;
      this.item.updateDownloadSpeed(bytesDownloaded);

      const remainingBytes = totalSize - this.downloadedSize;
      const timeRemainingMs =
        bytesDownloaded > 0
          ? (remainingBytes / bytesDownloaded) * 1000
          : Infinity;
      this.item.updateTimeRemaining(timeRemainingMs);

      this.previousDownloadedSize = this.downloadedSize;
    }, 1000);
  }

  private trackProgress(chunkSize: number, totalSize: number) {
    this.downloadedSize += chunkSize;
    const progress = (this.downloadedSize / totalSize) * 100;
    this.item.updateProgress(progress);
    this.item.sendProgress();
  }

  private finishDownload(resolve: () => void) {
    this.item.updateStatus("completed");
    this.clearSpeedTracking();
    this.handleComplete();
    resolve();
  }

  private handleError(reject: (reason?: any) => void, message: string) {
    this.item.setError(message);
    this.item.updateStatus("error");
    this.stop();

    logger.log({
      id: Math.floor(Date.now() / 1000),
      message: `Failed to download ${this.item.url}: ${message}`,
      timestamp: new Date().toISOString(),
      type: "error",
    });

    win?.webContents?.send(download_events.error, {
      error: message,
      id: this.item.id,
      game_data: this.item.game_data,
      status: "error",
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
    this.fileStream?.close();
    this.item.updateStatus("stopped");
    this.clearSpeedTracking();
    win?.webContents?.send(download_events.stopped, this.item.getReturnData());
  }

  public pause() {
    if (!this.request || this.isPaused) return;
    this.isPaused = true;
    this.item.updateStatus("paused");
    this.stop();
    win?.webContents?.send(download_events.paused, this.item.getReturnData());
  }

  public async resume() {
    if (!this.isPaused) return;
    this.isPaused = false;
    this.item.updateStatus("downloading");
    await this.download();
    win?.webContents?.send(download_events.paused, this.item.getReturnData());
  }

  private handleComplete() {
    this.item.updateStatus("completed");
    this.clearSpeedTracking();
    win?.webContents?.send(download_events.complete, this.item.getReturnData());
  }
}

export default HttpDownloader;
