import type { IpcMainInvokeEvent } from "electron";
import { client, torrents } from "../../../utils";
import { registerEvent } from "../utils";

// Event handler for pausing a torrent
const startTorrent = async (_event: IpcMainInvokeEvent, infoHash: string) => {
  const torrent = await client.get(infoHash);
  if (torrent) {
    torrent.resume();
    console.log(`Paused torrent: ${torrent.name}`);

    const findTorrent = [...torrents.entries()].find(
      ([, storedTorrent]) => storedTorrent.infoHash === torrent.infoHash
    )?.[1];

    return {
      message: `resumed torrent: ${torrent.name}`,
      error: false,
      data: {
        infoHash: torrent.infoHash,
        name: torrent.name,
        game_data: findTorrent?.game_data,
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

registerEvent("torrent:start-torrent", startTorrent);
