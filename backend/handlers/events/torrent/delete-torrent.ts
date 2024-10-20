import type { IpcMainInvokeEvent } from "electron";
import { client, torrents } from "../../../utils";
import { registerEvent } from "../utils";

// Event handler for deleting a torrent
const deleteTorrent = async (event: IpcMainInvokeEvent, infoHash: string) => {
  const torrent = await client.get(infoHash);
  if (!torrent) {
    console.error(`Torrent with infoHash ${infoHash} not found`);
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

  // Find the corresponding igdb_id from the torrents map
  const igdb_id = [...torrents.entries()].find(
    ([, storedTorrent]) => storedTorrent.infoHash === torrent.infoHash
  )?.[0]; // .[0] to get the igdb_id from the key-value pair

  // Remove torrent
  client.remove(torrent);
  if (igdb_id) torrents.delete(igdb_id); // Remove from the torrents map as well

  console.log(`Deleted torrent: ${torrent.name}`);

  return {
    message: "Torrent deleted",
    error: false,
    data: {
      igdb_id,
      infoHash: torrent.infoHash,
      name: torrent.name,
    },
  };
};

registerEvent("torrent:delete-torrent", deleteTorrent);
