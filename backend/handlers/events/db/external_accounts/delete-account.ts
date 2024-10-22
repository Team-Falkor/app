import { accountsDB } from "../../../../sql";
import { registerEvent } from "../../utils/registerEvent";

const deleteExternalAccount = async (
  _event: Electron.IpcMainInvokeEvent,
  identifier: string,
  type?: string
) => {
  try {
    await accountsDB.deleteAccount(identifier, type);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

registerEvent("external-accounts:delete", deleteExternalAccount);
