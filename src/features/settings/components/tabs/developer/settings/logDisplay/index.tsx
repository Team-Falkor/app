import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useLanguageContext } from "@/contexts/I18N";
import { useState } from "react";
import LogWindow from "./logWindow";

const LogDisplay = () => {
  const [enabled, setEnabled] = useState(false);
  const { t } = useLanguageContext();

  return (
    <div className="flex flex-col gap-4" id="developer-settings">
      <div className="flex items-center space-x-2" id="enable-dev-console">
        <Switch
          id="enable-dev-console"
          onCheckedChange={setEnabled}
          checked={enabled}
        />

        <Label htmlFor="enable-dev-console">
          {t("settings.settings.enable_developer_console")}
        </Label>
      </div>

      <LogWindow enabled={enabled} />
    </div>
  );
};

export default LogDisplay;
