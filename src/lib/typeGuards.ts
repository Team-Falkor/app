import { DownloadData } from "@/@types";
import { ITorrent } from "@/@types/torrent";

export const isTorrent = (item: ITorrent | DownloadData): item is ITorrent => {
  return (item as ITorrent).infoHash !== undefined;
};

export const isDownload = (
  item: ITorrent | DownloadData
): item is DownloadData => {
  return (item as DownloadData).url !== undefined;
};
