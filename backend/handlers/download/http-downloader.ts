import fs from "fs";
import https from "https";
import { sanitizeFilename } from "../..//utils";
import window from "../../utils/window";
import download_events from "./events";
import { DownloadItem as item } from "./item";

class HttpDownloader {
  item: item;
  private request?: ReturnType<typeof https.get>;
  private isPaused: boolean = false;
  private downloadedSize: number = 0;
  private speedInterval?: NodeJS.Timeout;
  private progressInterval?: NodeJS.Timeout;
  private previousDownloadedSize: number = 0;
  private previousProgress: number = 0;
  private fileStream?: fs.WriteStream;

  constructor(item: item) {
    this.item = item;
  }

  public async download(): Promise<void> {
    if (this.item.status === "completed") return;
    console.log(`[Download]: ${this.item.id} Starting download...`);

    this.item.updateStatus("downloading");
    this.previousDownloadedSize = this.downloadedSize;

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

        // Ensure content-length is available and valid
        const contentLengthHeader = response.headers["content-length"];
        if (!contentLengthHeader) {
          this.handleError(reject, "Missing content-length header.");
          return;
        }

        const contentLength = Number(contentLengthHeader);
        if (isNaN(contentLength) || contentLength <= 0) {
          this.handleError(reject, "Invalid content-length value.");
          return;
        }

        const isPartialContent = response.statusCode === 206;
        const totalSize =
          contentLength + (isPartialContent ? this.downloadedSize : 0);
        this.item.totalSize = totalSize;

        console.log(
          `[Download]: Total size: ${totalSize}, Downloaded: ${this.downloadedSize}`
        );

        const sanitizedPath = this.getSanitizedFilePath();
        this.fileStream = fs.createWriteStream(sanitizedPath, {
          flags: isPartialContent ? "a" : "w",
        });

        response.pipe(this.fileStream);

        // Start tracking download speed and progress
        this.startSpeedTracking(totalSize);
        this.startProgressTracking(totalSize);

        response.on("data", (chunk) => {
          this.downloadedSize += chunk.length;
        });

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
    return `${this.item.filePath}/${sanitizedFilename}.${this.item.fileExtension}`;
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

  private startProgressTracking(totalSize: number) {
    this.progressInterval = setInterval(() => {
      // Calculate progress
      let progress = (this.downloadedSize / totalSize) * 100;

      // Ensure progress is between 0 and 100
      progress = Math.min(Math.max(progress, 0), 100);

      // Only emit progress if there's a significant change
      if (Math.abs(progress - this.previousProgress) >= 1) {
        this.previousProgress = progress;

        // Round progress to 2 decimal places for accuracy
        const roundedProgress = Math.round(progress * 100) / 100;

        console.log(
          `[Progress]: ${this.item.id} - ${roundedProgress}% (${this.downloadedSize}/${totalSize})`
        );

        this.item.updateProgress(roundedProgress);
        this.item.sendProgress();
      }
    }, 1000);
  }

  private finishDownload(resolve: () => void) {
    this.item.updateStatus("completed");
    this.clearTracking();
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

  private clearTracking() {
    if (this.speedInterval) {
      clearInterval(this.speedInterval);
      this.speedInterval = undefined;
    }
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = undefined;
    }
  }

  public stop() {
    this.request?.destroy();
    this.fileStream?.close();
    this.item.updateStatus("stopped");
    this.clearTracking();
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
    this.clearTracking();
    window.emitToFrontend(download_events.complete, {
      ...this.item.getReturnData(),
      status: "completed",
    });
  }
}

export { HttpDownloader };
