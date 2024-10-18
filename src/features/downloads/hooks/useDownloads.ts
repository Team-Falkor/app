import { useDownloadStore } from "@/stores/downloads";

const UseDownloads = () => {
  const {
    addDownload,
    clearQueue,
    downloading,
    error,
    fetchDownloads,
    getTorrent,
    getTorrents,
    pauseDownload,
    loading,
    queue,
    removeDownload,
  } = useDownloadStore();

  return {
    addDownload,
    clearQueue,
    downloading,
    error,
    fetchDownloads,
    getTorrent,
    getTorrents,
    pauseDownload,
    loading,
    queue,
    removeDownload,
  };
};

export default UseDownloads;
