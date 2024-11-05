import { AddDownloadData, DownloadData, DownloadStatus } from "@/@types";
import { ITorrentGameData } from "@/@types/torrent";
import { createWriteStream, WriteStream } from "node:fs";
import path from "node:path";
import { win } from "../../main";
import { constants } from "../constants";
import { settings } from "../settings/settings";
import download_events from "./events";

class DownloadItem {
  id: string;
  url: string;
  filename: string;
  filePath: string;
  fileExtension: string;
  status: DownloadStatus;
  progress: number = 0;
  totalSize: number = 0;
  downloadSpeed: number = 0;
  timeRemaining: number | "completed" = 0;
  error: string = "";
  progressIntervalId?: ReturnType<typeof setInterval>;
  private fileStream?: WriteStream;

  game_data: ITorrentGameData;

  constructor(data: AddDownloadData) {
    const { file_path, game_data, url, file_name, id, file_extension } = data;
    this.id = id;
    this.url = url;
    this.filename = file_name;
    this.status = "pending";
    this.fileExtension = file_extension ?? this.getFileExtension(url);
    this.filePath = file_path ?? this.getDownloadPath();
    this.game_data = game_data;
  }

  private getFileExtension(url: string): string {
    return url?.split(".")?.pop() ?? "rar";
  }

  private getDownloadPath(): string {
    return settings?.get("downloadsPath") ?? constants.downloadsPath;
  }

  public get fullPath(): string {
    return path.join(this.filePath, `${this.filename}.${this.fileExtension}`);
  }

  public updateProgress(progress: number): void {
    this.progress = progress;
  }

  public updateStatus(status: DownloadStatus): void {
    this.status = status;
  }

  public updateTimeRemaining(timeRemaining: number | "completed"): void {
    this.timeRemaining = timeRemaining;
  }

  public updateTotalSize(totalSize: number): void {
    this.totalSize = totalSize;
  }

  public updateDownloadSpeed(speed: number): void {
    this.downloadSpeed = speed;
  }

  public setError(error: string): void {
    this.error = error;
  }

  public createFileStream(): WriteStream | undefined {
    try {
      this.fileStream = createWriteStream(this.fullPath);
      return this.fileStream;
    } catch (error) {
      console.error(
        `Failed to create file stream for ${this.fullPath}:`,
        error
      );
      this.setError("Failed to create file stream.");
      return undefined;
    }
  }

  public closeFileStream(): void {
    this.fileStream?.close();
  }

  public isCompleted(): boolean {
    return this.status === "completed";
  }

  public getReturnData(): DownloadData {
    return {
      filename: this.filename,
      game_data: this.game_data,
      path: this.filePath,
      status: this.status,
      url: this.url,
      id: this.id,
      progress: this.progress,
      totalSize: this.totalSize,
      downloadSpeed: this.downloadSpeed,
      timeRemaining: this.timeRemaining,
    };
  }

  public sendProgress(): void {
    if (this.status !== "downloading") {
      clearInterval(this.progressIntervalId);
      return;
    }

    const progressData = this.getReturnData();
    win?.webContents?.send(download_events.progress, progressData);
  }
}

export default DownloadItem;
