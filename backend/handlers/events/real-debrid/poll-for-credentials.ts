import { getRealDebridAuthInstance } from "../../../utils/realdebrid/auth";
import { registerEvent } from "../utils/registerEvent";

const realDebridAuth = getRealDebridAuthInstance();

const pollForRealDebridCredentials = async (
  _event: Electron.IpcMainInvokeEvent,
  deviceCode: string,
  interval: number,
  expiresIn: number
) => {
  try {
    const credentials = await realDebridAuth.pollForCredentials(
      deviceCode,
      interval,
      expiresIn
    );
    return credentials;
  } catch (error) {
    console.error("Error polling for credentials:", error);
    return { success: false, error: (error as Error).message };
  }
};

// Register the event
registerEvent("real-debrid:poll-credentials", pollForRealDebridCredentials);
