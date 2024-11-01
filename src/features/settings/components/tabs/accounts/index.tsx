import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
        <div className="flex gap-4">
          <AddAccountButton />
          <div className="flex items-center space-x-2">
            <Switch id="use-accounts-for-downloads" />
            <Label htmlFor="use-accounts-for-downloads">
              Use Account(s) to download
            </Label>
          </div>
        </div>

        <AccountsTable />
      </SettingsContainer>
    </div>
  );
};

export default AccountSettings;
