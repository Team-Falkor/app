import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useLanguageContext } from "@/contexts/I18N";
import { useSettings } from "@/hooks";
import { SettingsSection } from "../../section";
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
        <SettingsSection title="update_settings">
          <div className="flex items-center space-x-4">
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
            <Label
              htmlFor="check-for-plugin-updates-on-startup"
              className="text-lg"
            >
              {t("settings.settings.check-for-plugin-updates-on-startup")}
            </Label>
          </div>

          <div className="flex items-center space-x-4">
            <Switch
              id="check-for-app-updates-on-startup"
              checked={settings.checkForUpdatesOnStartup}
              onCheckedChange={() =>
                updateSetting(
                  "checkForUpdatesOnStartup",
                  !settings.checkForUpdatesOnStartup
                )
              }
            />
            <Label
              htmlFor="check-for-app-updates-on-startup"
              className="text-lg"
            >
              {t("settings.settings.check-for-app-updates-on-startup")}
            </Label>
          </div>
        </SettingsSection>

        <SettingsSection title="change_language">
          <div className="w-56">
            <LanguageDropdown />
          </div>
        </SettingsSection>
      </SettingsContainer>
    </div>
  );
};

export default GeneralSetting;
