import { AutoLaunchOptions } from "@/@types";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useLanguageContext } from "@/contexts/I18N";
import { useSettings } from "@/hooks";
import { invoke } from "@/lib";
import { toast } from "sonner";
import { SettingsSection } from "../../section";
import SettingTitle from "../../title";
import SettingsContainer from "../container";
import LanguageDropdown from "./settings/language";
import TitleBarDropdown from "./settings/title-bar";

const GeneralSetting = () => {
  const { t } = useLanguageContext();
  const { settings, updateSetting } = useSettings();

  return (
    <div>
      <SettingTitle>{t("settings.titles.general")}</SettingTitle>

      <SettingsContainer>
        <SettingsSection title="update_settings">
          <div className="flex items-center gap-4">
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

          <div className="flex items-center gap-4">
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
            <Label htmlFor="check-for-app-updates-on-startup">
              {t("settings.settings.check-for-app-updates-on-startup")}
            </Label>
          </div>
        </SettingsSection>

        <SettingsSection title="app-settings">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-4">
              <Switch
                id="launch-on-startup"
                checked={
                  settings?.launchOnStartup === "minimized" ||
                  settings?.launchOnStartup === true
                }
                onCheckedChange={async () => {
                  const autoLaunch = await invoke<boolean, AutoLaunchOptions>(
                    "app:auto-launch",
                    {
                      enabled: !settings.launchOnStartup,
                      isHidden: settings.launchOnStartup === "minimized",
                    }
                  );

                  if (!autoLaunch) {
                    toast.error("Failed to configure auto launch");
                    return;
                  }

                  await updateSetting(
                    "launchOnStartup",
                    settings?.launchOnStartup ? false : true
                  );
                }}
              />
              <Label htmlFor="launch-on-startup">
                {t("settings.settings.launch-on-startup")}
              </Label>
            </div>
            <div className="flex items-center gap-4 ml-4">
              <Switch
                disabled={!settings?.launchOnStartup}
                id="launch-on-startup-minimized"
                checked={settings.launchOnStartup === "minimized"}
                onCheckedChange={async (checked) => {
                  const autoLaunch = await invoke<boolean, AutoLaunchOptions>(
                    "app:auto-launch",
                    {
                      enabled: true,
                      isHidden: checked ? true : false,
                    }
                  );

                  if (!autoLaunch) {
                    toast.error("Failed to configure auto launch");
                    return;
                  }

                  await updateSetting(
                    "launchOnStartup",
                    settings?.launchOnStartup ? "minimized" : true
                  );
                }}
              />
              <Label htmlFor="launch-on-startup-minimized">
                {t("settings.settings.launch-on-startup-minimized")}
              </Label>
            </div>
          </div>

          {/* close to tray instead of closing app */}
          <div className="flex items-center gap-4">
            <Switch
              id="close-to-tray"
              checked={settings.closeToTray}
              onCheckedChange={() =>
                updateSetting("closeToTray", !settings.closeToTray)
              }
            />
            <Label htmlFor="close-to-tray">
              {t("settings.settings.close-to-tray")}
            </Label>
          </div>
        </SettingsSection>

        <SettingsSection
          title="change-title-bar-style"
          description="change_title_bar_style_description"
        >
          <div className="w-64">
            <TitleBarDropdown />
          </div>
        </SettingsSection>

        <SettingsSection title="change_language">
          <div className="w-64">
            <LanguageDropdown />
          </div>
        </SettingsSection>
      </SettingsContainer>
    </div>
  );
};

export default GeneralSetting;
