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
  status: DownloadStatus;
  progress: number;
  error: string;
  progressIntervalId?: ReturnType<typeof setInterval>;
  private fileStream?: ReturnType<typeof createWriteStream>;

  game_data: ITorrentGameData;

  constructor(data: AddDownloadData) {
    const { file_path, game_data, url, file_name, id } = data;
    this.id = id;
    this.url = url;
    this.filename = file_name;
    this.status = "pending";
    this.progress = 0;
    this.error = "";
    this.filePath = file_path ?? constants.downloadsPath;
    this.game_data = game_data;
  }

  public get fullPath(): string {
    return path.join(this.filePath, this.filename);
  }

  public setProgress(progress: number) {
    this.progress = progress;
  }

  public setStatus(status: DownloadStatus) {
    this.status = status;
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

  public getReturnData = (): DownloadData => ({
    filename: this.filename,
    game_data: this.game_data,
    filePath: this.filePath,
    status: this.status,
    url: this.url,
    id: this.id,
  });
}

export default DownloadItem;
