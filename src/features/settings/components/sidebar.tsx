import { AppInfo, LinkItemType } from "@/@types";
import { Button } from "@/components/ui/button";
import { useLanguageContext } from "@/contexts/I18N";
import { useSettings } from "@/hooks";
import { useUpdater } from "@/hooks/useUpdater";
import { cn, invoke, shouldHideTitleBar } from "@/lib";
import { useQuery } from "@tanstack/react-query";
import { DownloadCloud } from "lucide-react";
import { ReactElement, useEffect } from "react";
import { FaDiscord, FaGithub } from "react-icons/fa6";
import { SiKofi } from "react-icons/si";
import SettingsLinkGroup from "./linkGroup";

const LINKS: Array<LinkItemType> = [
  {
    icon: <FaDiscord />,
    title: "join_the_discord",
    url: "https://falkor.moe/discord",
  },
  {
    icon: <FaGithub />,
    title: "star_us_on_github",
    url: "https://github.com/team-falkor/app",
  },
];

const LINKS_RIGHT: Array<LinkItemType> = [
  {
    icon: <SiKofi />,
    title: "support_me_on_kofi",
    url: "https://ko-fi.com/prostarz",
  },
];

const SettingsSidebar = ({
  settingsTabs,
}: {
  settingsTabs: ReactElement[];
}) => {
  const { updateAvailable, installUpdate } = useUpdater(false);
  const { t } = useLanguageContext();
  const { settings } = useSettings();

  useEffect(() => {
    console.log({ updateAvailable });
  }, [updateAvailable]);

  const { data, isPending, isError } = useQuery({
    queryKey: ["app", "info"],

    queryFn: async () => {
      const response = await invoke<AppInfo>("generic:get-app-info");
      return response;
    },
  });

  return (
    <div
      className={cn(
        "fixed inset-y-0 top-0 flex flex-col w-full md:w-80 bg-background h-[calc(100vh-2rem)]",
        {
          "top-8": !shouldHideTitleBar(settings?.titleBarStyle),
        }
      )}
    >
      <div className="p-4">
        <h1 className="text-lg font-bold md:text-xl">
          {t("sections.settings")}
        </h1>
      </div>
      <nav className="flex-1 space-y-2 md:space-y-3">{settingsTabs}</nav>
      <div className="flex flex-col gap-2 p-3 px-4 mt-auto">
        {!isPending && !isError && (
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-bold capitalize">{t("falkor")}</h1>
              {updateAvailable && (
                <Button
                  variant={"ghost"}
                  size={"icon"}
                  onClick={installUpdate}
                  className="size-7"
                >
                  <DownloadCloud className="size-5" />
                </Button>
              )}
            </div>
            <span className="text-sm text-muted-foreground">
              {t("version")}: {data?.app_version}
            </span>
          </div>
        )}
        <div className="flex justify-between">
          <SettingsLinkGroup links={LINKS} />
          <SettingsLinkGroup links={LINKS_RIGHT} />
        </div>
      </div>
    </div>
  );
};

export default SettingsSidebar;
