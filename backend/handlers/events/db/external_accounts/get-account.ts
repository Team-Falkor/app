import { accountsDB } from "../../../../sql";
import { registerEvent } from "../../utils/registerEvent";

const getExternalAccounts = async (
  _event: Electron.IpcMainInvokeEvent,
  identifier: string,
  type?: string
) => {
  try {
    return await accountsDB.getAccount(identifier, type);
  } catch (error) {
    console.error(error);
    return {};
  }
};

registerEvent("external-accounts:get", getExternalAccounts);
