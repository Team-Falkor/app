import { useEffect, useState } from "react";

interface UseDownloadTimeProps {
  downloadSpeedBytesPerSec: number; // Download speed in bytes per second
  totalSizeBytes: number; // Total size in bytes
}

const useDownloadTime = ({
  downloadSpeedBytesPerSec,
  totalSizeBytes,
}: UseDownloadTimeProps) => {
  const [formattedTime, setFormattedTime] = useState<string | null>(null); // Formatted time

  useEffect(() => {
    if (downloadSpeedBytesPerSec > 0 && totalSizeBytes > 0) {
      // Calculate estimated time in seconds
      const timeInSeconds = totalSizeBytes / downloadSpeedBytesPerSec;
      const formatted = formatElapsedTime(timeInSeconds);
      setFormattedTime(formatted);
    } else {
      setFormattedTime(null); // Invalid data case
    }
  }, [downloadSpeedBytesPerSec, totalSizeBytes]);

  return formattedTime; // Return the formatted time
};

// Helper function to format elapsed time into dd:hh:mm:ss
const formatElapsedTime = (timeInSeconds: number): string => {
  const days = Math.floor(timeInSeconds / (3600 * 24));
  const hours = Math.floor((timeInSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((timeInSeconds % 3600) / 60);
  const seconds = Math.floor(timeInSeconds % 60);

  const parts = [
    days > 0 ? `${days}d` : null,
    hours > 0 ? `${hours}h` : null,
    minutes > 0 ? `${minutes}m` : null,
    `${seconds}s`, // Always show seconds
  ];

  // Filter out null values and join with a colon separator
  return parts.filter(Boolean).join(" ");
};

export default useDownloadTime;
