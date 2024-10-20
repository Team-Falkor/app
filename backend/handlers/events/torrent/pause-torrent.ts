import type { IpcMainInvokeEvent } from "electron";
import { client, torrents } from "../../../utils";
import { registerEvent } from "../utils";

// Event handler for pausing a torrent
const pauseTorrent = (_event: IpcMainInvokeEvent, infoHash: string) => {
  const torrent = client.get(infoHash);
  if (torrent) {
    torrent.pause();
    console.log(`Paused torrent: ${torrent.name}`);

    // Find the corresponding igdb_id from the torrents map
    const igdb_id = [...torrents.entries()].find(
      ([, storedTorrent]) => storedTorrent.infoHash === torrent.infoHash
    )?.[0]; // .[0] to get the igdb_id from the key-value pair

    return {
      message: `Paused torrent: ${torrent.name}`,
      error: false,
      data: {
        igdb_id,
        infoHash: torrent.infoHash,
        name: torrent.name,
      },
    };
  } else {
    console.error(`Torrent with infoHash ${infoHash} not found`);
    return {
      message: `Torrent with infoHash ${infoHash} not found`,
      error: true,
      data: {
        infoHash,
      },
    };
  }
};

registerEvent("torrent:pause-torrent", pauseTorrent);
