import type { IpcMainInvokeEvent } from "electron";
import { client, torrents } from "../../../utils";
import { registerEvent } from "../utils";

// Event handler for pausing a torrent
const pauseTorrent = async (_event: IpcMainInvokeEvent, infoHash: string) => {
  try {
    // Get the torrent by infoHash
    const torrent = await client.get(infoHash);

    if (!torrent) {
      console.error(`Torrent with infoHash ${infoHash} not found`);
      return {
        message: `Torrent not found: ${infoHash}`,
        error: true,
        data: { infoHash },
      };
    }

    // Pause the torrent (synchronous in WebTorrent)
    await torrent.pause();
    console.log(`Paused torrent: ${torrent.name}`);

    // Find corresponding igdb_id
    const igdb_id = [...torrents.entries()].find(
      ([, storedTorrent]) => storedTorrent.infoHash === torrent.infoHash
    )?.[0];

    return {
      message: `Paused torrent: ${torrent.name}`,
      error: false,
      data: {
        igdb_id,
        infoHash: torrent.infoHash,
        name: torrent.name,
      },
    };
  } catch (error) {
    console.error(`Error pausing torrent: ${(error as Error).message}`);
    return {
      message: `Error pausing torrent: ${(error as Error).message}`,
      error: true,
      data: { infoHash },
    };
  }
};

registerEvent("torrent:pause-torrent", pauseTorrent);
