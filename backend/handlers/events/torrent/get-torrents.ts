import type { IpcMainInvokeEvent } from "electron";
import { client, torrents } from "../../../utils";
import { registerEvent } from "../utils";

// Event handler for getting the list of torrents
const getTorrents = (_event: IpcMainInvokeEvent) => {
  const activeTorrents = client.torrents.map((torrent) => {
    // Find the corresponding igdb_id from the torrents map
    const igdb_id = [...torrents.entries()].find(
      ([, storedTorrent]) => storedTorrent.infoHash === torrent.infoHash
    )?.[0];

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
  });

  return activeTorrents;
};

// Register the event handler
registerEvent("torrent:get-torrents", getTorrents);
