import { client } from "../../../utils";
import { registerEvent } from "../utils";

// Event handler for pausing a torrent
const pauseTorrent = (event: Electron.IpcMainInvokeEvent, infoHash: string) => {
  const torrent = client.get(infoHash);
  if (torrent) {
    torrent.pause();
    console.log(`paused torrent: ${torrent.name}`);

    event.sender.send("torrent:paused", {
      infoHash: torrent.infoHash,
      name: torrent.name,
    });
  } else {
    console.error(`Torrent with infoHash ${infoHash} not found`);
  }
};

registerEvent("torrent:pause-torrent", pauseTorrent);
