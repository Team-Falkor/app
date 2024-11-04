import { AddDownloadData, DownloadData, DownloadStatus } from "@/@types";
import { ITorrentGameData } from "@/@types/torrent";
import { createWriteStream } from "node:fs";
import path from "node:path";
import { constants } from "../constants";

class DownloadItem {
  id: string;
  url: string;
  filename: string;
  filePath: string;
  fileExtension: string;
  status: DownloadStatus;
  progress: number;
  totalSize: number;
  downloadSpeed?: number;
  timeRemaining?: number | "completed";
  error: string;
  progressIntervalId?: ReturnType<typeof setInterval>;
  private fileStream?: ReturnType<typeof createWriteStream>;

  game_data: ITorrentGameData;

  constructor(data: AddDownloadData) {
    const { file_path, game_data, url, file_name, id, file_extension } = data;
    this.id = id;
    this.url = url;
    this.filename = file_name;
    this.status = "pending";
    this.progress = 0;
    this.totalSize = 0;
    this.downloadSpeed = 0;
    this.timeRemaining = 0;
    this.error = "";
    this.fileExtension = file_extension ?? url?.split(".")?.pop() ?? "rar";
    this.filePath = file_path ?? constants.downloadsPath;
    this.game_data = game_data;
  }

  public get fullPath(): string {
    const fileName_withExtension = `${this.filename}.${this.fileExtension}`;
    return path.join(this.filePath, fileName_withExtension);
  }

  public setProgress(progress: number) {
    this.progress = progress;
  }

  public setStatus(status: DownloadStatus) {
    this.status = status;
  }

  public setTimeRemaining(timeRemaining: number | "completed") {
    this.timeRemaining = timeRemaining;
  }

  public setTotalSize(totalSize: number) {
    this.totalSize = totalSize;
  }

  public setDownloadSpeed(speed: number) {
    this.downloadSpeed = speed;
  }

  public setError(error: string) {
    this.error = error;
  }

  public createFileStream() {
    this.fileStream = createWriteStream(this.fullPath);
    return this.fileStream;
  }

  public closeFileStream() {
    this.fileStream?.close();
  }

  public isCompleted(): boolean {
    return this.status === "completed";
  }

  public getReturnData = (): DownloadData => ({
    filename: this.filename,
    game_data: this.game_data,
    path: this.filePath,
    status: this.status,
    url: this.url,
    id: this.id,
    progress: this.progress,
    totalSize: this.totalSize,
    downloadSpeed: this.downloadSpeed ?? 0,
    timeRemaining: this.timeRemaining ?? 0,
  });
}

export default DownloadItem;
