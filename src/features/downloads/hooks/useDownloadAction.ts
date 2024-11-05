import { DownloadStatus } from "@/@types";
import { ITorrentGameData } from "@/@types/torrent";
import { invoke } from "@/lib";
import { useState } from "react";
import { toast } from "sonner";
import UseDownloads from "./useDownloads";

interface DownloadPauseReturn {
  message: string;
  error: boolean;
  data: {
    id: string;
    status: DownloadStatus;
    game_data: ITorrentGameData;
  };
}

export const UseDownloadAction = (id?: string, isTorrent: boolean = false) => {
  const { fetchDownloads } = UseDownloads();
  const [status, setStatus] = useState<DownloadStatus | null>(null);

  const pauseDownload = async () => {
    if (!id) return null;

    const data = isTorrent
      ? await invoke<DownloadPauseReturn, string>("torrent:pause-torrent", id)
      : await invoke<DownloadPauseReturn, string>("download:pause", id);

    if (!data) return;
    if (data.error) {
      toast.error(data.message);
      return;
    }

    setStatus("paused");
    fetchDownloads();
    return data;
  };

  const startDownload = async () => {
    if (!id) return null;

    const data = isTorrent
      ? await invoke<DownloadPauseReturn, string>("torrent:start-torrent", id)
      : await invoke<DownloadPauseReturn, string>("download:start", id);

    if (!data) return;
    if (data.error) {
      toast.error(data.message);
      return;
    }

    setStatus("downloading");
    fetchDownloads();
    return data;
  };

  const stopDownload = async () => {
    if (!id) return null;

    const data = isTorrent
      ? await invoke<DownloadPauseReturn, string>("torrent:delete-torrent", id)
      : await invoke<DownloadPauseReturn, string>("download:stop", id);

    if (!data) return;
    if (data.error) {
      toast.error(data.message);
      return;
    }

    setStatus("stopped");
    fetchDownloads();
    return data;
  };

  return {
    pauseDownload,
    startDownload,
    stopDownload,
    status,
  };
};
