import { useLanguageContext } from "@/contexts/I18N";
import SettingTitle from "../title";
import SettingsContainer from "./container";

const AccountSettings = () => {
  const { t } = useLanguageContext();

  return (
    <div>
      <SettingTitle>{t("Settings.titles.accounts")}</SettingTitle>

      <SettingsContainer>{/* SHOW BG ON SIDEBAR */}</SettingsContainer>
    </div>
  );
};

export default AccountSettings;
