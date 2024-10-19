import { useState } from "react";

// Define the ChartData type with a speed property
export type ChartData = {
  speed: number;
};

// Custom hook to track the download speed history
export const useDownloadSpeedHistory = () => {
  const [speedHistory, setSpeedHistory] = useState<ChartData[]>([]);
  const [peakSpeed, setPeakSpeed] = useState<number>(0); // State to store the peak speed

  // Function to update the speed history array
  const updateSpeedHistory = (newSpeed: number) => {
    setSpeedHistory((prev) => {
      const updatedHistory = [...prev, { speed: newSpeed }];
      // Keep only the last 20 speeds
      if (updatedHistory.length > 20) {
        updatedHistory.shift(); // Remove the oldest item
      }

      return updatedHistory;
    });

    // Check if the new speed is greater than the current peakSpeed using the previous peak value
    setPeakSpeed((prevPeak) => {
      if (newSpeed > prevPeak) {
        return newSpeed; // Update peakSpeed if the new speed is greater
      }
      return prevPeak; // Keep the current peakSpeed if it's higher
    });
  };

  return { speedHistory, updateSpeedHistory, peakSpeed };
};
