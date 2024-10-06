import { useLanguageContext } from "@/contexts/I18N";
import SettingTitle from "../title";
import SettingsContainer from "./container";

const MiscellaneousSettings = () => {
  const { t } = useLanguageContext();

  return (
    <div>
      <SettingTitle>{t("Settings.titles.miscellaneous")}</SettingTitle>

      <SettingsContainer>{/* SHOW BG ON SIDEBAR */}</SettingsContainer>
    </div>
  );
};

export default MiscellaneousSettings;
