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

    torrent.pause();
    console.log(`Paused torrent: ${torrent.name}`);

    // Find corresponding igdb_id
    const findTorrent = [...torrents.entries()].find(
      ([, storedTorrent]) => storedTorrent.infoHash === torrent.infoHash
    )?.[1];

    return {
      message: `Paused torrent: ${torrent.name}`,
      error: false,
      data: {
        infoHash: torrent.infoHash,
        name: torrent.name,
        game_data: findTorrent?.game_data,
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
