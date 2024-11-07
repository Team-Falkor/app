import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useLanguageContext } from "@/contexts/I18N";
import { useSettings } from "@/hooks";
import SettingTitle from "../../title";
import SettingsContainer from "../container";
import LanguageDropdown from "./settings/language";

const GeneralSetting = () => {
  const { t } = useLanguageContext();
  const { settings, updateSetting } = useSettings();

  return (
    <div>
      <SettingTitle>{t("settings.titles.general")}</SettingTitle>

      <SettingsContainer>
        <div className="flex items-center gap-2 mb-2">
          <Switch
            id="check-for-plugin-updates-on-startup"
            checked={settings.checkForPluginUpdatesOnStartup}
            onCheckedChange={() =>
              updateSetting(
                "checkForPluginUpdatesOnStartup",
                !settings.checkForPluginUpdatesOnStartup
              )
            }
          />
          <Label htmlFor="check-for-plugin-updates-on-startup">
            {t("settings.settings.check-for-plugin-updates-on-startup")}
          </Label>
        </div>

        <div className="flex flex-col gap-4 justify-center items-start">
          <h1 className="text-xl">{t("settings.settings.change_language")}</h1>
          <LanguageDropdown />
        </div>
      </SettingsContainer>
    </div>
  );
};

export default GeneralSetting;
