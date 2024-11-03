import { ITorrent } from "@/@types/torrent";
import type { IpcMainInvokeEvent } from "electron";
import { client, torrents } from "../../../utils";
import { registerEvent } from "../utils";

// Event handler for getting the list of torrents
const getTorrents = (_event: IpcMainInvokeEvent): Array<ITorrent> => {
  const activeTorrents = client.torrents.map((torrent) => {
    // Find the corresponding igdb_id from the torrents map
    const findTorrent = [...torrents.entries()].find(
      ([, storedTorrent]) => storedTorrent.infoHash === torrent.infoHash
    )?.[1];

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
      status: torrent.done
        ? "completed"
        : torrent.paused
          ? "paused"
          : "downloading",
      game_data: findTorrent?.game_data,
    };

    return return_data;
  });

  return activeTorrents;
};

// Register the event handler
registerEvent("torrent:get-torrents", getTorrents);
