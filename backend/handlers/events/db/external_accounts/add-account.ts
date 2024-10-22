import { ExternalNewAccountInput } from "@/@types/accounts";
import { accountsDB } from "../../../../sql";
import { registerEvent } from "../../utils/registerEvent";

const addExternalAccount = async (
  _event: Electron.IpcMainInvokeEvent,
  input: ExternalNewAccountInput
) => {
  try {
    await accountsDB.addAccount(input);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

registerEvent("external-accounts:add", addExternalAccount);
