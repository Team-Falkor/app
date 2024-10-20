import { invoke } from "@/lib";
import { useState } from "react";

export const UseDownloadAction = (infoHash?: string) => {
  const [status, setStatus] = useState<"paused" | "started" | "deleted" | null>(
    null
  );

  const pauseDownload = async () => {
    if (!infoHash) return null;
    const data = await invoke<any, string>("torrent:pause-torrent", infoHash);

    if (data.error) return;

    setStatus("paused");
    return data;
  };

  const startDownload = async () => {
    if (!infoHash) return null;
    const data = await invoke<any, string>("torrent:start-torrent", infoHash);

    if (data.error) return;

    setStatus("started");
    return data;
  };

  const stopDownload = async () => {
    if (!infoHash) return null;
    const data = await invoke<any, string>("torrent:delete-torrent", infoHash);

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
