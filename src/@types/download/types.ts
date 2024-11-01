import { ITorrentGameData } from "../torrent";

export interface DownloadData {
  id: string;
  url: string;
  filename: string;
  game_data: ITorrentGameData;
  filePath?: string;
}

export type DownloadStatus =
  | "pending"
  | "downloading"
  | "completed"
  | "error"
  | "paused"
  | "stopped";
