import { useLanguageContext } from "@/contexts/I18N";
import AccountsTable from "@/features/accounts/components/table";
import SettingTitle from "../../title";
import SettingsContainer from "../container";
import AddAccountButton from "./addAccountButton";

const AccountSettings = () => {
  const { t } = useLanguageContext();

  return (
    <div>
      <SettingTitle>{t("Settings.titles.accounts")}</SettingTitle>

      <SettingsContainer>
        <div className="flex gap-2">
          <AddAccountButton />
        </div>

        <AccountsTable />
      </SettingsContainer>
    </div>
  );
};

export default AccountSettings;
