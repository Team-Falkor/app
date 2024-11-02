import { invoke } from "@/lib";
import { useState } from "react";

export const UseDownloadAction = (id?: string, isTorrent: boolean = false) => {
  const [status, setStatus] = useState<"paused" | "started" | "deleted" | null>(
    null
  );

  const pauseDownload = async () => {
    if (!id) return null;

    // Determine the appropriate action based on whether it's a torrent or download
    const data = isTorrent
      ? await invoke<any, string>("torrent:pause-torrent", id)
      : await invoke<any, string>("download:pause-download", id);

    if (data.error) return;

    setStatus("paused");
    return data;
  };

  const startDownload = async () => {
    if (!id) return null;

    const data = isTorrent
      ? await invoke<any, string>("torrent:start-torrent", id)
      : await invoke<any, string>("download:start-download", id);

    if (data.error) return;

    setStatus("started");
    return data;
  };

  const stopDownload = async () => {
    if (!id) return null;

    const data = isTorrent
      ? await invoke<any, string>("torrent:delete-torrent", id)
      : await invoke<any, string>("download:delete-download", id);

    if (data.error) return;

    setStatus("deleted");
    return data;
  };

  return {
    pauseDownload,
    startDownload,
    stopDownload,
    status,
  };
};
