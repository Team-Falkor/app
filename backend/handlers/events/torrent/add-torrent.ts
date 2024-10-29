import { ITorrentGameData } from "@/@types/torrent";
import type { IpcMainInvokeEvent } from "electron";
import { Torrent } from "webtorrent";
import {
  client,
  combineTorrentData,
  constants,
  torrents,
} from "../../../utils";
import { registerEvent } from "../utils";

const { downloadsPath } = constants;

// Constants for event names
const TORRENT_PROGRESS_EVENT = "torrent:progress";
const TORRENT_DONE_EVENT = "torrent:done";

const THROTTLE_INTERVAL = 1000; // Send progress updates every second
let lastUpdateTime: number | null = null;

// Handle torrent progress updates
const handleTorrentProgress = (
  event: IpcMainInvokeEvent,
  game_data: ITorrentGameData,
  torrent: Torrent
) => {
  const now = Date.now();

  if (!lastUpdateTime || now - lastUpdateTime < THROTTLE_INTERVAL) return;

  torrents.set(game_data.id, combineTorrentData(torrent, game_data));

  event.sender.send(TORRENT_PROGRESS_EVENT, {
    infoHash: torrent.infoHash,
    name: torrent.name,
    progress: torrent.progress,
    numPeers: torrent.numPeers,
    downloadSpeed: torrent.downloadSpeed,
    uploadSpeed: torrent.uploadSpeed,
    totalSize: torrent.length,
    timeRemaining: torrent.timeRemaining,
    game_data,
  });

  lastUpdateTime = now;
};

// Handle torrent completion
const handleTorrentCompletion = (
  event: Electron.IpcMainInvokeEvent,
  game_data: ITorrentGameData,
  torrent: Torrent
) => {
  torrents.delete(game_data.id);

  event.sender.send(TORRENT_DONE_EVENT, {
    infoHash: torrent.infoHash,
    name: torrent.name,
    game_data,
  });

  console.log(`Torrent download complete: ${torrent.name}`);
};

// Event handler for adding a torrent
const addTorrent = async (
  event: Electron.IpcMainInvokeEvent,
  torrentId: string,
  game_data: ITorrentGameData
) => {
  try {
    const torrent = client.add(
      torrentId,
      { path: downloadsPath },
      (torrent) => {
        console.log(`Added torrent: ${torrent.name}`);

        torrents.set(game_data.id, combineTorrentData(torrent, game_data));

        torrent.on("metadata", () => {
          event.sender.send("torrent:metadata", {
            infoHash: torrent.infoHash,
            name: torrent.name,
            progress: torrent.progress,
            numPeers: torrent.numPeers,
            downloadSpeed: torrent.downloadSpeed,
            uploadSpeed: torrent.uploadSpeed,
            totalSize: torrent.length,
            timeRemaining: torrent.timeRemaining,
            game_data,
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

        torrent.once("ready", () => {
          event.sender.send("torrent:ready", {
            infoHash: torrent.infoHash,
            name: torrent.name,
            game_data,
          });
        });

        torrent.on("download", () =>
          handleTorrentProgress(event, game_data, torrent)
        );

        torrent.once("done", () =>
          handleTorrentCompletion(event, game_data, torrent)
        );
      }
    );

    return {
      infoHash: torrent.infoHash,
      name: torrent.name,
      progress: torrent.progress,
      numPeers: torrent.numPeers,
      downloadSpeed: torrent.downloadSpeed,
      uploadSpeed: torrent.uploadSpeed,
      totalSize: torrent.length,
      timeRemaining: torrent.timeRemaining,
      game_data,
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
