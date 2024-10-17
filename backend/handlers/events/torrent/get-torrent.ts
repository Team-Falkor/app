import { client } from "../../../utils";
import { registerEvent } from "../utils";

// Event handler for adding a torrent

const getTorrent = (_event: Electron.IpcMainInvokeEvent, torrentId: string) => {
  try {
    const torrent = client.get(torrentId);

    if (torrent) {
      return {
        infoHash: torrent.infoHash,
        name: torrent.name,
        progress: torrent.progress,
        downloadSpeed: torrent.downloadSpeed,
        uploadSpeed: torrent.uploadSpeed,
        numPeers: torrent.numPeers,
        path: torrent.path,
        paused: torrent.paused,
      };
    }
  } catch (error) {
    console.error("Error getting torrent:", error);
    return null;
  }
};

// Register the event handler
registerEvent("torrent:get-torrent", getTorrent);
