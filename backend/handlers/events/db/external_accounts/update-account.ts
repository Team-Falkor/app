import { ExternalTokenUpdateInput } from "@/@types/accounts";
import { accountsDB } from "../../../../sql";
import { registerEvent } from "../../utils/registerEvent";

const updateExternalAccount = async (
  _event: Electron.IpcMainInvokeEvent,
  identifier: string,
  input: ExternalTokenUpdateInput,
  type?: string
) => {
  try {
    await accountsDB.updateTokens(identifier, input, type);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

registerEvent("external-accounts:update", updateExternalAccount);
