import { useDownloadStore } from "@/stores/downloads";

const UseDownloads = () => {
  const {
    addDownload,
    downloading,
    error,
    fetchDownloads,
    getTorrent,
    getTorrents,
    pauseDownload,
    loading,
    removeDownload,
    getQueue,
  } = useDownloadStore();

  return {
    addDownload,
    downloading,
    error,
    fetchDownloads,
    getTorrent,
    getTorrents,
    pauseDownload,
    loading,
    removeDownload,
    getQueue,
  };
};

export default UseDownloads;
