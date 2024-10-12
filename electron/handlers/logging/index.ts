import { Log } from "@/@types";
import fs from "fs";
import { constants } from "../../utils";

class Logger {
  private logsPath = constants.logsPath;

  public log = (log: Log): void => {
    try {
      this.appendLog(log);
    } catch (error) {
      console.error("Failed to log to the log file", error);
    }
  };

  public clear = async (): Promise<boolean> => {
    try {
      await fs.promises.writeFile(this.logsPath, "");
      return true;
    } catch (error) {
      console.error("Failed to clear the log file", error);
      return false;
    }
  };

  public deleteALog = async (id: number): Promise<boolean> => {
    try {
      const oldData = fs.readFileSync(this.logsPath, "utf8");
      const newData = oldData
        .split("\n")
        .filter((log) => JSON.parse(log).id !== id)
        .join("\n");

      await fs.promises.writeFile(this.logsPath, newData);
      return true;
    } catch (error) {
      console.error("Failed to delete a log", error);
      return false;
    }
  };

  public getLogs = async (): Promise<Log[]> => {
    try {
      const data = fs.readFileSync(this.logsPath, "utf8");
      return JSON.parse(data);
    } catch (error) {
      console.error("Failed to get logs", error);
      return [];
    }
  };

  public getLogById = async (id: number): Promise<Log | undefined> => {
    try {
      const logs = await this.getLogs();
      return logs.find((log) => log.id === id);
    } catch (error) {
      console.error("Failed to get log by id", error);
      return undefined;
    }
  };

  private appendLog = async (log: Log): Promise<boolean> => {
    if (!log) {
      console.error("Tried to log a null or undefined log object");
      return false;
    }

    try {
      const oldData = fs.readFileSync(this.logsPath, "utf8");
      const newData = JSON.stringify(log) + "\n";
      await fs.promises.writeFile(this.logsPath, oldData + newData);
      return true;
    } catch (error) {
      console.error("Failed to write to the log file", error);
      return false;
    }
  };
}

const logger = new Logger();

export { logger };
