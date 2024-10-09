import { client, constants } from "../../../utils";
import { registerEvent } from "../utils";

const { downloadsPath } = constants;

// Event handler for adding a torrent

const addTorrent = (event: Electron.IpcMainInvokeEvent, torrentId: string) => {
  client.add(
    torrentId,
    {
      path: downloadsPath,
    },
    (torrent) => {
      console.log(`added torrent: ${torrent.name}`);

      // Handle torrent progress updates
      torrent.on("download", () => {
        event.sender.send("torrent:progress", {
          infoHash: torrent.infoHash,
          name: torrent.name,
          progress: torrent.progress,
          numPeers: torrent.numPeers,
          downlaodSpeed: torrent.downloadSpeed,
          uploadSpeed: torrent.uploadSpeed,
        });
      });

      // Handle when the torrent download is complete
      torrent.on("done", () => {
        event.sender.send("torrent:done", {
          infoHash: torrent.infoHash,
          name: torrent.name,
        });
        console.log(`Torrent download complete: ${torrent.name}`);
      });
    }
  );
};

// Register the event handler
registerEvent("torrent:add-torrent", addTorrent);
