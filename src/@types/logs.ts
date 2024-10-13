export interface Log {
  id: number;
  message: string;
  timestamp: string;
  type: LogType;
}

export type LogType = "error" | "info" | "warn" | "success";
