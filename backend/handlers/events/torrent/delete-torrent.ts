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
    return;
  }

  client.remove(torrent);

  console.log(`deleted torrent: ${torrent.name}`);
  event.sender.send("torrent:deleted", {
    infoHash: torrent.infoHash,
    name: torrent.name,
  });
  return;
};

registerEvent("torrent:delete-torrent", deleteTorrent);
