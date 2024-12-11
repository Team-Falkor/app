import fs from "fs";
import https from "https";
import window from "../../utils/window";
import { sanitizeFilename } from "../utils";
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

        const sanitizedPath = this.getSanitizedFilePath();
        this.fileStream = fs.createWriteStream(sanitizedPath, {
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

  private getSanitizedFilePath(): string {
    const sanitizedFilename = sanitizeFilename(this.item.filename);
    return `${this.item.filePath}/${sanitizedFilename}`;
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

    window.emitToFrontend(download_events.error, {
      error: message,
      id: this.item.id,
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
    window.emitToFrontend(download_events.stopped, {
      ...this.item.getReturnData(),
      status: "stopped",
    });
  }

  public pause() {
    if (!this.request || this.isPaused) return;
    this.isPaused = true;
    this.item.updateStatus("paused");
    this.stop();
    window.emitToFrontend(download_events.paused, {
      ...this.item.getReturnData(),
      status: "paused",
    });
  }

  public async resume() {
    if (!this.isPaused) return;
    this.isPaused = false;
    this.item.updateStatus("downloading");
    await this.download();
    window.emitToFrontend(download_events.paused, {
      ...this.item.getReturnData(),
      status: "downloading",
    });
  }

  private handleComplete() {
    this.item.updateStatus("completed");
    this.clearSpeedTracking();
    window.emitToFrontend(download_events.complete, {
      ...this.item.getReturnData(),
      status: "completed",
    });
  }
}

export default HttpDownloader;
