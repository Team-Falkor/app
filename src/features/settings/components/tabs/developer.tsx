import { useLanguageContext } from "@/contexts/I18N";
import SettingTitle from "../title";
import SettingsContainer from "./container";

const DeveloperSettings = () => {
  const { t } = useLanguageContext();

  return (
    <div>
      <SettingTitle>{t("Settings.titles.developer")}</SettingTitle>

      <SettingsContainer>{/* SHOW BG ON SIDEBAR */}</SettingsContainer>
    </div>
  );
};

export default DeveloperSettings;
