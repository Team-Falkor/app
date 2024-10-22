export interface RealDebridTorrentInfo {
  id: string;
  filename: string;
  original_filename: string;
  hash: string;
  bytes: number;
  original_bytes: number;
  host: string;
  split: number;
  progress: number;
  status: string;
  added: string;
  files: Array<{
    id: number;
    path: string;
    bytes: number;
    selected: number;
  }>;
  links: string[];
  ended?: string;
  speed?: number;
  seeders?: number;
}

export interface RealDebridUnrestrictFileFolder {
  id: string;
  filename: string;
  mimeType: string;
  filesize: number;
  link: string;
  host: string;
  chunks: number;
  crc: number;
  download: string;
  streamable: number;
  type?: string;
  alternative?: Array<{
    id: string;
    filename: string;
    download: string;
    type: string;
  }>;
}

export interface RealDebridUnrestrictCheck {
  host: string;
  link: string;
  filename: string;
  filesize: number;
  supported: number;
}

export interface RealDebridTorrent {
  id: string;
  filename: string;
  hash: string; // SHA1 Hash of the torrent
  bytes: number; // Size of selected files only
  host: string; // Host main domain
  split: number; // Split size of links
  progress: number; // Possible values: 0 to 100
  status: string; // Current status of the torrent: magnet_error, magnet_conversion, waiting_files_selection, queued, downloading, downloaded, error, virus, compressing, uploading, dead
  added: string; // jsonDate
  links: string[]; // Host URL
  ended?: string; // Only present when finished, jsonDate
  speed?: number; // Only present in "downloading", "compressing", "uploading" status
  seeders?: number; // Only present in "downloading", "magnet_conversion" status
}

export interface RealDebridUser {
  id: number;
  username: string;
  email: string;
  points: number; // Fidelity points
  locale: string; // User language
  avatar: string; // URL
  type: string; // "premium" or "free"
  premium: number; // seconds left as a Premium user
  expiration: string; // jsonDate
}
