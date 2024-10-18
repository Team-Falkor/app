import type { IpcMainInvokeEvent } from "electron";
import { Torrent } from "webtorrent";
import { client, constants, torrents } from "../../../utils";
import { registerEvent } from "../utils";

const { downloadsPath } = constants;

// Constants for event names
const TORRENT_PROGRESS_EVENT = "torrent:progress";
const TORRENT_DONE_EVENT = "torrent:done";

// Function to handle torrent progress updates
const handleTorrentProgress = (
  event: IpcMainInvokeEvent,
  igdb_id: string,
  torrent: Torrent
) => {
  torrents.set(igdb_id, torrent);

  event.sender.send(TORRENT_PROGRESS_EVENT, {
    igdb_id,
    infoHash: torrent.infoHash,
    name: torrent.name,
    progress: torrent.progress,
    numPeers: torrent.numPeers,
    downloadSpeed: torrent.downloadSpeed,
    uploadSpeed: torrent.uploadSpeed,
  });
};

// Function to handle torrent completion
const handleTorrentCompletion = (
  event: Electron.IpcMainInvokeEvent,
  igdb_id: string,
  torrent: Torrent
) => {
  torrents.delete(igdb_id);

  event.sender.send(TORRENT_DONE_EVENT, {
    igdb_id,
    infoHash: torrent.infoHash,
    name: torrent.name,
  });

  console.log(`Torrent download complete: ${torrent.name}`);
};

// Event handler for adding a torrent
const addTorrent = async (
  event: Electron.IpcMainInvokeEvent,
  torrentId: string,
  igdb_id: string
) => {
  try {
    client.add(torrentId, { path: downloadsPath }, (torrent) => {
      console.log(`Added torrent: ${torrent.name}`);

      torrents.set(igdb_id, torrent);

      // Listen for torrent progress updates
      torrent.on("download", () =>
        handleTorrentProgress(event, igdb_id, torrent)
      );

      // Listen for torrent completion
      torrent.on("done", () =>
        handleTorrentCompletion(event, igdb_id, torrent)
      );
    });
  } catch (error) {
    console.error(`Failed to add torrent: ${torrentId}`, error);
    event.sender.send("torrent:error", {
      message: `Error adding torrent: ${torrentId}`,
      error: (error as Error).message,
    });
  }
};

// Register the event handler
registerEvent("torrent:add-torrent", addTorrent);
