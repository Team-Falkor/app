import { useLanguageContext } from "@/contexts/I18N";
import SettingTitle from "../../title";
import SettingsContainer from "../container";
import LanguageDropdown from "./settings/language";

const GeneralSetting = () => {
  const { t } = useLanguageContext();

  return (
    <div>
      <SettingTitle>{t("Settings.titles.general")}</SettingTitle>

      <SettingsContainer>
        <div className="flex flex-col gap-4 justify-center items-start">
          <h1 className="text-xl">{t("Settings.change_local.title")}</h1>
          <LanguageDropdown />
        </div>
      </SettingsContainer>
    </div>
  );
};

export default GeneralSetting;
