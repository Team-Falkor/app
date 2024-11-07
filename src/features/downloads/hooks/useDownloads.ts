import { useDownloadStore } from "@/stores/downloads";

const UseDownloads = () => {
  const {
    addDownload,
    addTorrent,
    downloading,
    downloads,
    error,
    fetchDownloads,
    getDownload,
    getTorrent,
    getTorrents,
    loading,
    pauseDownload,
    pauseTorrent,
    getQueue,
    removeTorrent,
    resumeDownload,
    resumeTorrent,
    stopDownload,
    torrents,
  } = useDownloadStore();

  return {
    addDownload,
    addTorrent,
    downloading,
    downloads,
    error,
    fetchDownloads,
    getDownload,
    getTorrent,
    getTorrents,
    loading,
    pauseDownload,
    pauseTorrent,
    getQueue,
    removeTorrent,
    resumeDownload,
    resumeTorrent,
    stopDownload,
    torrents,
  };
};

export default UseDownloads;
