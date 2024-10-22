import { ExternalNewAccountInput } from "@/@types/accounts";
import { accountsDB } from "../../../sql";
import { getRealDebridAuthInstance } from "../../../utils/realdebrid/auth";
import { registerEvent } from "../utils/registerEvent";

const realDebridAuth = getRealDebridAuthInstance();

const obtainRealDebridAccessToken = async (
  _event: Electron.IpcMainInvokeEvent,
  deviceCode: string,
  accountData: ExternalNewAccountInput
) => {
  try {
    const tokenData = await realDebridAuth.obtainAccessToken(deviceCode);

    accountData.access_token = tokenData.access_token;
    accountData.refresh_token = tokenData.refresh_token;
    accountData.expires_at = new Date(
      Date.now() + Number(tokenData.expires_in) * 1000
    );

    // Store the account in the DB
    await accountsDB.addAccount(accountData);

    return { success: true, tokenData };
  } catch (error) {
    console.error("Error obtaining access token:", error);
    return { success: false, error: (error as Error).message };
  }
};

// Register the event
registerEvent("real-debrid:obtain-access-token", obtainRealDebridAccessToken);
