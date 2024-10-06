import { useLanguageContext } from "@/contexts/I18N";
import SettingTitle from "../title";
import SettingsContainer from "./container";

const TorrentSettings = () => {
  const { t } = useLanguageContext();

  return (
    <div>
      <SettingTitle>{t("Settings.titles.torrent")}</SettingTitle>

      <SettingsContainer>{/* SHOW BG ON SIDEBAR */}</SettingsContainer>
    </div>
  );
};

export default TorrentSettings;
