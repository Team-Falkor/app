import { Button } from "@/components/ui/button";
import { useLanguageContext } from "@/contexts/I18N";
import { SettingsSection } from "../section";
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
      <SettingTitle>{t("settings.titles.miscellaneous")}</SettingTitle>

      <SettingsContainer>
        <SettingsSection>
          <Button
            variant={"secondary"}
            onClick={handleResetCache}
            className="w-1/3"
          >
            {t("settings.settings.reset-igdb-cache")}
          </Button>
        </SettingsSection>
      </SettingsContainer>
    </div>
  );
};

export default MiscellaneousSettings;
