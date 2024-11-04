import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLanguageContext } from "@/contexts/I18N";
import { Plus } from "lucide-react";
import { useState } from "react";
import SettingTitle from "../../title";
import SettingsContainer from "../container";
import AddPluginModal from "./addPluginModal";
import PluginDisplay from "./display";
import PluginsSort from "./sort";

export type SortBy = "alphabetic-asc" | "alphabetic-desc";

const PluginSettings = () => {
  const { t } = useLanguageContext();
  const [open, setOpen] = useState(false);

  const [showRows, setShowRows] = useState(true);
  const [sortBy, setSortBy] = useState<SortBy>("alphabetic-asc");
  const [showEnabledOnly, setShowEnabledOnly] = useState(false);

  return (
    <div>
      <SettingTitle>{t("Settings.titles.plugins")}</SettingTitle>

      <SettingsContainer>
        <div className="flex justify-between">
          <div className="flex w-full gap-2">
            <div className="w-1/2">
              <Input
                placeholder={t("what_plugin_are_you_looking_for")}
                type="text"
              />
            </div>

            <div className="flex gap-2">
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger>
                  <Tooltip>
                    <TooltipTrigger>
                      <Button variant={"ghost"} size={"icon"}>
                        <Plus />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{t("add_local_plugin")}</TooltipContent>
                  </Tooltip>
                </DialogTrigger>
                <AddPluginModal setOpen={setOpen} open={open} />
              </Dialog>
            </div>
          </div>
          <PluginsSort
            showRows={showRows}
            setShowRows={setShowRows}
            sortBy={sortBy}
            setSortBy={setSortBy}
            setShowEnabledOnly={setShowEnabledOnly}
            showEnabledOnly={showEnabledOnly}
          />
        </div>

        <PluginDisplay
          showRows={showRows}
          setShowRows={setShowRows}
          sortBy={sortBy}
          showEnabledOnly={showEnabledOnly}
        />
      </SettingsContainer>
    </div>
  );
};

export default PluginSettings;
