import { useDownloadStore } from "@/stores/downloads";
import { useEffect } from "react";

interface UseDownloadsProps {
  fetch: boolean;
  forceFetch: boolean;
}

const UseDownloads = (
  { fetch, forceFetch }: Partial<UseDownloadsProps> = {
    fetch: true,
    forceFetch: false,
  }
) => {
  const {
    addToQueue,
    downloads,
    fetchDownloads,
    fetchQueue,
    maxConcurrentDownloads,
    pauseDownload,
    queue,
    removeFromQueue,
    resumeDownload,
    stopDownload,
    updateMaxConcurrentDownloads,
  } = useDownloadStore();

  useEffect(() => {
    if (!fetch && !forceFetch) return;

    if (queue?.length <= 0 && !forceFetch) {
      fetchQueue();
    }

    if (downloads?.length <= 0 && !forceFetch) {
      fetchDownloads();
    }
  }, [downloads?.length, fetch, fetchDownloads, fetchQueue, forceFetch, queue]);

  return {
    addDownload: addToQueue,
    downloads,
    fetchDownloads,
    fetchQueue,
    maxConcurrentDownloads,
    pauseDownload,
    queue,
    removeFromQueue,
    resumeDownload,
    stopDownload,
    updateMaxConcurrentDownloads,
  };
};

export default UseDownloads;
