import { ExternalAccount } from "@/@types/accounts";
import { accountsDB } from "../../../../sql";
import { registerEvent } from "../../utils/registerEvent";

const getExternalAccounts = async (
  _event: Electron.IpcMainInvokeEvent,
  type?: string
): Promise<Array<ExternalAccount>> => {
  try {
    return await accountsDB.getAccounts(type);
  } catch (error) {
    console.error(error);
    return [];
  }
};

registerEvent("external-accounts:get-all", getExternalAccounts);
