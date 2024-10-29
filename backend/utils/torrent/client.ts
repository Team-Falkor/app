import { ITorrentGameData } from "@/@types/torrent";
import WebTorrent, { Torrent } from "webtorrent";

export const client = new WebTorrent();

export type TorrentWithGameData = Torrent & { game_data: ITorrentGameData };

export const combineTorrentData = (
  torrent: Torrent,
  game_data: ITorrentGameData
) => {
  return { ...torrent, game_data } as TorrentWithGameData;
};

export const torrents: Map<number, TorrentWithGameData> = new Map();
