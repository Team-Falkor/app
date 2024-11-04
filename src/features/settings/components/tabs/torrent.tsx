import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguageContext } from "@/contexts/I18N";
import { useSettings } from "@/hooks";
import { Folder } from "lucide-react";
import { useEffect, useState } from "react";
import SettingTitle from "../title";
import SettingsContainer from "./container";

const TorrentSettings = () => {
  const { t } = useLanguageContext();
  const { settings, updateSetting } = useSettings();
  const [downloadPath, setDownloadPath] = useState(
    settings?.downloadsPath ?? ""
  );

  useEffect(() => {
    if (settings.downloadsPath) {
      setDownloadPath(settings.downloadsPath);
    }
  }, [settings.downloadsPath]);

  type DialogSelection = { canceled: boolean; filePaths: string[] };

  const openDialog = async () => {
    const selected: DialogSelection = await window.ipcRenderer.invoke(
      "generic:open-dialog",
      {
        properties: ["openDirectory"],
      }
    );

    if (!selected.canceled && selected.filePaths.length > 0) {
      setDownloadPath(selected.filePaths[0]);
    }
  };

  const handleSave = () => {
    if (!downloadPath.trim()) return;
    updateSetting("downloadsPath", downloadPath);
  };

  return (
    <div>
      <SettingTitle>{t("Settings.titles.torrent")}</SettingTitle>

      <SettingsContainer>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <Input
              placeholder={t("Settings.placeholders.downloadPath")}
              type="text"
              value={downloadPath}
              onChange={(e) => setDownloadPath(e.target.value)}
              aria-label="Torrent Downloads Path"
            />

            <Button
              variant="secondary"
              size="icon"
              onClick={openDialog}
              aria-label="Select Folder"
            >
              <Folder />
            </Button>
          </div>

          <Button
            variant="secondary"
            onClick={handleSave}
            disabled={!downloadPath.trim()}
          >
            Save
          </Button>
        </div>
      </SettingsContainer>
    </div>
  );
};

export default TorrentSettings;
