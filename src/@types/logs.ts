export interface Log {
  message: string;
  timestamp: number;
  type: LogType;
}

export type LogType = "error" | "info" | "warn" | "success";
