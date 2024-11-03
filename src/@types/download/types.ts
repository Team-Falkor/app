import { ITorrentGameData } from "../torrent";

export interface DownloadData {
  id: string;
  url: string;
  filename: string;
  game_data: ITorrentGameData;
  path?: string;
  downloadSpeed: number;
  progress: number;
  totalSize?: number;
  status: DownloadStatus;
  timeRemaining?: number | "completed";
}

export type DownloadStatus =
  | "pending"
  | "downloading"
  | "completed"
  | "error"
  | "paused"
  | "stopped";

export interface AddDownloadData {
  id: string;
  url: string;
  game_data: ITorrentGameData;
  file_path?: string;
  file_extension?: string;
  file_name: string;
}
