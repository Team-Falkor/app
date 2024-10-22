import { ExternalTokenUpdateInput } from "@/@types/accounts";
import { accountsDB } from "../../../sql";
import { getRealDebridAuthInstance } from "../../../utils/realdebrid/auth";
import { registerEvent } from "../utils/registerEvent";

const realDebridAuth = getRealDebridAuthInstance();

const refreshRealDebridAccessToken = async (
  _event: Electron.IpcMainInvokeEvent,
  identifier: string // Email or username to identify the account
) => {
  try {
    const tokenData = await realDebridAuth.refreshAccessToken();

    // Create the input to update the tokens in the DB
    const updateInput: ExternalTokenUpdateInput = {
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      expires_at: new Date(Date.now() + tokenData.expires_in * 1000),
    };

    // Update the account in the database
    await accountsDB.updateTokens(identifier, updateInput);

    return { success: true, tokenData };
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return { success: false, error: (error as Error).message };
  }
};

// Register the event
registerEvent("real-debrid:refresh-access-token", refreshRealDebridAccessToken);
