// history.ts
import { createMemoryHistory } from "@tanstack/react-router";

// Export memory history globally so `goBack` can access it
export const memoryHistory = createMemoryHistory({
  initialEntries: ["/"],
});

// Helper function to go back in history
export const goBack = () => {
  memoryHistory.go(-1);
};
