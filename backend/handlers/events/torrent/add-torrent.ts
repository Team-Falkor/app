import type { IpcMainInvokeEvent } from "electron";
import { Torrent } from "webtorrent";
import { client, constants, torrents } from "../../../utils";
import { registerEvent } from "../utils";

const { downloadsPath } = constants;

// Constants for event names
const TORRENT_PROGRESS_EVENT = "torrent:progress";
const TORRENT_DONE_EVENT = "torrent:done";

const THROTTLE_INTERVAL = 1000; // Send progress updates every second
let lastUpdateTime: number | null = null;

const handleTorrentProgress = (
  event: IpcMainInvokeEvent,
  igdb_id: string,
  torrent: Torrent
) => {
  const now = Date.now();

  // Only send updates if enough time has passed
  if (!lastUpdateTime || now - lastUpdateTime >= THROTTLE_INTERVAL) {
    torrents.set(igdb_id, torrent);

    event.sender.send(TORRENT_PROGRESS_EVENT, {
      igdb_id,
      infoHash: torrent.infoHash,
      name: torrent.name,
      progress: torrent.progress,
      numPeers: torrent.numPeers,
      downloadSpeed: torrent.downloadSpeed,
      uploadSpeed: torrent.uploadSpeed,
      totalSize: torrent.length,
      timeRemaining: torrent.timeRemaining,
    });

    lastUpdateTime = now; // Update the last time we sent progress
  }
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
    const torrent = client.add(
      torrentId,
      { path: downloadsPath },
      (torrent) => {
        console.log(`Added torrent: ${torrent.name}`);

        torrents.set(igdb_id, torrent);

        torrent.on("metadata", () => {
          event.sender.send("torrent:metadata", {
            igdb_id,
            infoHash: torrent.infoHash,
            name: torrent.name,
            totalSize: torrent.length,
          });
        });

        torrent.on("warning", (message) =>
          event.sender.send("torrent:warning", {
            message,
            infoHash: torrent.infoHash,
          })
        );

        torrent.on("error", (error) =>
          event.sender.send("torrent:error", {
            message: error,
            infoHash: torrent.infoHash,
          })
        );

        torrent.on("ready", () => {
          event.sender.send("torrent:ready", {
            igdb_id,
            infoHash: torrent.infoHash,
            name: torrent.name,
          });
        });

        // Listen for torrent progress updates
        torrent.on("download", () =>
          handleTorrentProgress(event, igdb_id, torrent)
        );

        // Listen for torrent completion
        torrent.on("done", () =>
          handleTorrentCompletion(event, igdb_id, torrent)
        );
      }
    );

    return {
      igdb_id,
      infoHash: torrent.infoHash,
      name: torrent.name,
      progress: torrent.progress,
      numPeers: torrent.numPeers,
      downloadSpeed: torrent.downloadSpeed,
      uploadSpeed: torrent.uploadSpeed,
      timeRemaining: torrent.timeRemaining,
    };
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
