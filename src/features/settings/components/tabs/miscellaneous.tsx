import { Button } from "@/components/ui/button";
import { useLanguageContext } from "@/contexts/I18N";
import SettingTitle from "../title";
import SettingsContainer from "./container";

const MiscellaneousSettings = () => {
  const { t } = useLanguageContext();

  const handleResetCache = async () => {
    console.log("Resetting IGDB cache");
    localStorage.removeItem("igdb_access_token");
    localStorage.removeItem("igdb_token_expiration");

    window.location.reload();
  };

  return (
    <div>
      <SettingTitle>{t("Settings.titles.miscellaneous")}</SettingTitle>

      <SettingsContainer>
        <Button variant={"secondary"} onClick={handleResetCache}>
          Reset IGDB Cache
        </Button>
      </SettingsContainer>
    </div>
  );
};

export default MiscellaneousSettings;
