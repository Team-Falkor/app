import { registerEvent } from "../utils/registerEvent";

const request = async (
  _event: Electron.IpcMainInvokeEvent,
  url: string,
  options?: RequestInit
) => {
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return { data, success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
};

registerEvent("request", request);
