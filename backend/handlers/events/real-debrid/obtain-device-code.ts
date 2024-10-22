import { getRealDebridAuthInstance } from "../../../utils/realdebrid/auth";
import { registerEvent } from "../utils/registerEvent";

const realDebridAuth = getRealDebridAuthInstance();

const obtainRealDebridDeviceCode = async (
  _event: Electron.IpcMainInvokeEvent
) => {
  try {
    const deviceCodeData = await realDebridAuth.obtainDeviceCode();
    return deviceCodeData;
  } catch (error) {
    console.error("Error obtaining device code:", error);
    return { success: false, error: (error as Error).message };
  }
};

// Register the event
registerEvent("real-debrid:obtain-device-code", obtainRealDebridDeviceCode);
