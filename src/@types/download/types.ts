import { ITorrentGameData } from "../torrent";

export interface DownloadData {
  id: string;
  url: string;
  filename: string;
  game_data: ITorrentGameData;
  filePath?: string;
  status: DownloadStatus;
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
  file_name: string;
}
