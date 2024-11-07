import { AppInfo, LinkItemType } from "@/@types";
import { invoke } from "@/lib";
import { useQuery } from "@tanstack/react-query";
import { ReactElement } from "react";
import { FaDiscord, FaGithub } from "react-icons/fa6";
import { SiKofi } from "react-icons/si";
import SettingsLinkGroup from "./linkGroup";

const LINKS: Array<LinkItemType> = [
  {
    icon: <FaDiscord />,
    title: "join_the_discord",
    url: "https://discord.gg/team-falkor",
  },
  {
    icon: <FaGithub />,
    title: "star_us_on_github",
    url: "https://github.com/team-falkor/falkor",
  },
];

const LINKS_RIGHT: Array<LinkItemType> = [
  {
    icon: <SiKofi />,
    title: "Support me on Ko-fi",
    url: "https://ko-fi.com/prostarz",
  },
];

const SettingsSidebar = ({
  settingsTabs,
}: {
  settingsTabs: ReactElement[];
}) => {
  const { data, isPending, isError } = useQuery({
    queryKey: ["settings", "version"],
    queryFn: async () => {
      const response = await invoke<AppInfo>("generic:get-app-info");
      return response;
    },
  });

  return (
    <div className="flex flex-col h-auto md:h-screen w-full md:w-80 bg-background">
      <div className="p-4">
        <h1 className="text-lg md:text-xl font-bold">Settings</h1>
      </div>
      <nav className="flex-1 space-y-2 md:space-y-3">{settingsTabs}</nav>
      <div className="flex flex-col gap-2 p-3 px-4 mt-auto">
        {!isPending && !isError && (
          <div className="flex flex-col">
            <h1 className="text-lg font-bold capitalize">{data?.app_name}</h1>
            <span className="text-sm text-muted-foreground">
              Version: {data?.app_version}
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
