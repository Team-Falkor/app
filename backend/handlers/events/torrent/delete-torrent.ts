import type { IpcMainInvokeEvent } from "electron";
import { logger } from "../../../handlers/logging";
import { client, torrents } from "../../../utils";
import { registerEvent } from "../utils";

// Event handler for deleting a torrent
const deleteTorrent = async (event: IpcMainInvokeEvent, infoHash: string) => {
  const torrent = await client.get(infoHash);
  if (!torrent) {
    console.error(`Torrent with infoHash ${infoHash} not found`);

    logger.log({
      id: Math.floor(Date.now() / 1000),
      message: `Failed to delete torrent with infoHash ${infoHash}`,
      timestamp: new Date().toISOString(),
      type: "error",
    });

    event.sender.send("torrent:delete-error", {
      infoHash,
      error: `Torrent with infoHash ${infoHash} not found`,
    });

    return {
      message: `Torrent with infoHash ${infoHash} not found`,
      error: true,
      data: {
        infoHash,
      },
    };
  }

  const findTorrent = [...torrents.entries()].find(
    ([, storedTorrent]) => storedTorrent.infoHash === torrent.infoHash
  )?.[1];

  // Remove torrent
  client.remove(torrent);
  if (findTorrent) torrents.delete(findTorrent.game_data.id); // Remove from the torrents map as well

  console.log(`Deleted torrent: ${torrent.name}`);

  return {
    message: "Torrent deleted",
    error: false,
    data: {
      infoHash: torrent.infoHash,
      name: torrent.name,
      game_data: findTorrent?.game_data,
    },
  };
};

registerEvent("torrent:delete-torrent", deleteTorrent);
