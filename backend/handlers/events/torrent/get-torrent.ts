import { ITorrent } from "@/@types/torrent";
import type { IpcMainInvokeEvent } from "electron";
import { client, torrents } from "../../../utils";
import { registerEvent } from "../utils";

// Event handler for getting a specific torrent
const getTorrent = (
  _event: IpcMainInvokeEvent,
  torrentId: string
): ITorrent | null => {
  try {
    const torrent = client.get(torrentId);

    if (torrent) {
      // Find the corresponding igdb_id from the torrents map
      const igdb_id = [...torrents.entries()].find(
        ([, storedTorrent]) => storedTorrent.infoHash === torrent.infoHash
      )?.[1]; // .[0] to get the igdb_id from the key-value pair

      const return_data: ITorrent = {
        infoHash: torrent.infoHash,
        name: torrent.name,
        progress: torrent.progress,
        downloadSpeed: torrent.downloadSpeed,
        uploadSpeed: torrent.uploadSpeed,
        numPeers: torrent.numPeers,
        path: torrent.path,
        paused: torrent.paused,
        timeRemaining: torrent.timeRemaining,
        totalSize: torrent.length,
        game_data: igdb_id?.game_data,
      };

      return return_data;
    }

    return null;
  } catch (error) {
    console.error("Error getting torrent:", error);
    return null;
  }
};

// Register the event handler
registerEvent("torrent:get-torrent", getTorrent);
