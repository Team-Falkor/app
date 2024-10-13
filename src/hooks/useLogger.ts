import { Log } from "@/@types";
import { useLoggerStore } from "@/stores/logger";
import { useEffect } from "react";

export const useLogger = () => {
  const { logs, loading, error, fetchLogs, clear, deleteLog, log, getLog } =
    useLoggerStore();

  const addLog = async (logEntry: Log) => {
    try {
      await log(logEntry);
    } catch (error) {
      console.error("Failed to add log:", error);
      return false;
    }
  };

  const retrieveLogs = async () => {
    try {
      await fetchLogs();
    } catch (error) {
      console.error("Failed to fetch logs:", error);
      return false;
    }
  };

  const removeLogs = async () => {
    try {
      await clear();
    } catch (error) {
      console.error("Failed to clear logs:", error);
      return false;
    }
  };

  const removeLogById = async (id: number) => {
    try {
      await deleteLog(id);
    } catch (error) {
      console.error("Failed to delete log:", error);
      return false;
    }
  };

  const retrieveLogById = async (id: number) => {
    try {
      return await getLog(id);
    } catch (error) {
      console.error("Failed to get log:", error);
      return null;
    }
  };

  useEffect(() => {
    if (!fetchLogs) return;

    fetchLogs();
  }, [fetchLogs]);

  return {
    logs,
    loading,
    error,
    addLog,
    retrieveLogs,
    removeLogs,
    removeLogById,
    retrieveLogById,
  };
};
