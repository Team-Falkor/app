import { ITorrentGameData } from "@/@types/torrent";
import WebTorrent, { Torrent } from "webtorrent";
import { logger } from "../../handlers/logging";

export const client = new WebTorrent();

export type TorrentWithGameData = Torrent & { game_data: ITorrentGameData };

export const combineTorrentData = (
  torrent: Torrent,
  game_data: ITorrentGameData
) => {
  return { ...torrent, game_data } as TorrentWithGameData;
};

client.on("error", (error) => {
  console.error("WebTorrent error:", error);
  logger.log("error", `WebTorrent error: ${(error as Error).message}`);
});

export const torrents: Map<number, TorrentWithGameData> = new Map();
