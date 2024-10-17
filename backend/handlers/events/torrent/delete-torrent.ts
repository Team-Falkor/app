import { client } from "../../../utils";
import { registerEvent } from "../utils";

const deleteTorrent = (
  event: Electron.IpcMainInvokeEvent,
  infoHash: string
) => {
  const torrent = client.get(infoHash);
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

  client.remove(torrent);

  console.log(`deleted torrent: ${torrent.name}`);
  return {
    message: "Torrent deleted",
    error: false,
    data: {
      infoHash: torrent.infoHash,
      name: torrent.name,
    },
  };
};

registerEvent("torrent:delete-torrent", deleteTorrent);
