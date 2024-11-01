import fs from "fs";
import https from "https";
import item from "./item";

class HttpDownloader {
  item: item;
  private request?: ReturnType<typeof https.get>;
  private isPaused: boolean = false;
  private downloadedSize: number = 0;

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

        if (![200, 206].includes(response.statusCode!)) {
          const errorMessage = `Failed to download: ${response.statusMessage}`;
          this.handleError(reject, errorMessage);
          return;
        }

        const fileStream = fs.createWriteStream(this.item.fullPath, {
          flags: isPartialContent ? "a" : "w",
        });
        response.pipe(fileStream);

        response.on("data", (chunk) =>
          this.trackProgress(chunk.length, totalSize)
        );
        fileStream.on("finish", () => this.finishDownload(resolve));
        fileStream.on("error", (error) =>
          this.handleError(reject, error.message)
        );

        this.request!.on("error", (error) =>
          this.handleError(reject, error.message)
        );
      });
    });
  }

  private trackProgress(chunkSize: number, totalSize: number) {
    this.downloadedSize += chunkSize;
    const progress = (this.downloadedSize / totalSize) * 100;
    this.item.setProgress(progress);
  }

  private finishDownload(resolve: () => void) {
    this.item.setStatus("completed");
    this.item.closeFileStream();
    resolve();
  }

  private handleError(reject: (reason?: any) => void, message: string) {
    this.item.setError(message);
    this.item.setStatus("error");
    this.item.closeFileStream();
    reject(new Error(message));
  }

  public stop() {
    this.request?.destroy();
    this.item.setStatus("stopped");
    this.item.closeFileStream();
  }

  public pause() {
    if (this.request) {
      this.isPaused = true;
      this.stop();
      this.item.setStatus("paused");
    }
  }

  public async resume() {
    if (this.isPaused) {
      this.isPaused = false;
      await this.download();
    }
  }
}

export default HttpDownloader;
