export interface ITorrent {
  infoHash: string;
  name: string;
  progress: number;
  downloadSpeed: number;
  uploadSpeed: number;
  numPeers: number;
  path: string;
  paused: boolean;
  totalSize: number;
  timeRemaining: number;
  game_data?: ITorrentGameData;
}

export interface ITorrentGameData {
  id: number;
  name: string;
  image_id: string;
  banner_id?: string;
}
