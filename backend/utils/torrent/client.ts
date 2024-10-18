import webTorrent, { Torrent } from "webtorrent";

export const client = new webTorrent();

export const torrents: Map<string, Torrent> = new Map();
