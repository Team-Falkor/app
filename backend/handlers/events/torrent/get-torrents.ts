import { client } from "../../../utils";
import { registerEvent } from "../utils";

// Event handler for getting the list of torrents
const getTorrents = (_event: Electron.IpcMainInvokeEvent) => {
  const torrents = client.torrents.map((torrent) => ({
    infoHash: torrent.infoHash,
    name: torrent.name,
    progress: torrent.progress,
    downloadSpeed: torrent.downloadSpeed,
    uploadSpeed: torrent.uploadSpeed,
    numPeers: torrent.numPeers,
    path: torrent.path,
    paused: torrent.paused,
  }));

  return torrents;
};

// Register the event handler
registerEvent("torrent:get-torrents", getTorrents);
