import { useLanguageContext } from "@/contexts/I18N";
import SettingTitle from "../../title";
import SettingsContainer from "../container";
import LogDisplay from "./settings/logDisplay";

const DeveloperSettings = () => {
  const { t } = useLanguageContext();

  return (
    <div>
      <SettingTitle>{t("settings.titles.developer")}</SettingTitle>

      <SettingsContainer>
        <div>
          <LogDisplay />
        </div>
      </SettingsContainer>
    </div>
  );
};

export default DeveloperSettings;
