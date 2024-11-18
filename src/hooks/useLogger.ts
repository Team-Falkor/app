import { useLoggerStore } from "@/stores/logger";
import { useEffect } from "react";

export const useLogger = () => {
  const { logs, loading, error, fetchLogs, clear, log, getLog } =
    useLoggerStore();

  useEffect(() => {
    if (!fetchLogs) return;

    fetchLogs();
  }, [fetchLogs]);

  return {
    logs,
    loading,
    error,
    addLog: log,
    retrieveLogs: fetchLogs,
    removeLogs: clear,
    getLog,
  };
};
