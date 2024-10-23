import type { IpcMainInvokeEvent } from "electron";
import { client, torrents } from "../../../utils";
import { registerEvent } from "../utils";

// Event handler for getting a specific torrent
const getTorrent = (_event: IpcMainInvokeEvent, torrentId: string) => {
  try {
    const torrent = client.get(torrentId);

    if (torrent) {
      // Find the corresponding igdb_id from the torrents map
      const igdb_id = [...torrents.entries()].find(
        ([, storedTorrent]) => storedTorrent.infoHash === torrent.infoHash
      )?.[0]; // .[0] to get the igdb_id from the key-value pair

      return {
        igdb_id,
        infoHash: torrent.infoHash,
        name: torrent.name,
        progress: torrent.progress,
        downloadSpeed: torrent.downloadSpeed,
        uploadSpeed: torrent.uploadSpeed,
        numPeers: torrent.numPeers,
        path: torrent.path,
        paused: torrent.paused,
        timeRemaining: torrent.timeRemaining,
      };
    }
  } catch (error) {
    console.error("Error getting torrent:", error);
    return null;
  }
};

// Register the event handler
registerEvent("torrent:get-torrent", getTorrent);
