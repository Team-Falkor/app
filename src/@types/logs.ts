export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: number;
}

export type LogLevel = "error" | "warn" | "info" | "debug" | "trace";
