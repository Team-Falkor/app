import { useCallback, useState } from "react";

// Define the ChartData type with a speed property
export type ChartData = {
  speed: number;
};

// Custom hook to track the download speed history
export const useDownloadSpeedHistory = () => {
  const [speedHistory, setSpeedHistory] = useState<ChartData[]>([]);
  const [peakSpeed, setPeakSpeed] = useState<number>(0); // State to store the peak speed

  const updateSpeedHistory = useCallback((newSpeed: number) => {
    setSpeedHistory((prev) => {
      const updatedHistory = [...prev, { speed: newSpeed }];
      // Keep only the last 20 speeds
      if (updatedHistory.length > 20) {
        updatedHistory.shift(); // Remove the oldest item
      }

      return updatedHistory;
    });

    setPeakSpeed((prevPeak) => (newSpeed > prevPeak ? newSpeed : prevPeak));
  }, []);

  return { speedHistory, updateSpeedHistory, peakSpeed };
};
