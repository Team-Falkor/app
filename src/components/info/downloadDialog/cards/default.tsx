import { PluginSearchResponse } from "@/@types";
import { ITorrentGameData } from "@/@types/torrent";
import UseDownloads from "@/features/downloads/hooks/useDownloads";
import { useSettings } from "@/hooks";
import { createSlug, invoke } from "@/lib";
import { useAccountServices } from "@/stores/account-services";
import { DownloadIcon, Gamepad2Icon, UserIcon, Users2Icon } from "lucide-react";

type Props = PluginSearchResponse & {
  multiple_choice?: boolean;
  pluginId?: string;
  game_data: ITorrentGameData;
};

const DefaultDownloadCard = (props: Props) => {
  const { addDownload, addTorrent } = UseDownloads();
  const { realDebrid } = useAccountServices();
  const { settings } = useSettings();

  const handleDownload = async () => {
    // TODO: handle download for ddl

    if (!props.pluginId) return;

    const {
      return: returned_url,
      multiple_choice: multipleChoice,
      pluginId,
      password,
    } = props;

    let url = returned_url;

    if (multipleChoice) {
      const data = await invoke<string[], string>(
        "plugins:use:get-multiple-choice-download",
        pluginId,
        returned_url
      );

      if (!data?.length) return;

      url = data[0];
    }

    if (settings.useAccountsForDownloads && realDebrid) {
      if (props.type !== "ddl") {
        url = await realDebrid.downloadTorrentFromMagnet(url, password);
      } else url = await realDebrid.downloadFromFileHost(url, password);

      addDownload({
        id: createSlug(props.name),
        url,
        game_data: props.game_data,
        file_name: props.game_data.name,
      });
      return;
    }

    if (props.type === "ddl") {
      addDownload({
        id: createSlug(props.name),
        url,
        game_data: props.game_data,
        file_name: props.game_data.name,
      });
      return;
    }

    addTorrent(url, props.game_data);
  };

  if (!props["return"]) return null;

  return (
    <button
      key={props.return}
      className="flex flex-col items-start justify-center w-full gap-2 text-sm cursor-pointer group text-start hover:opacity-60"
      onClick={handleDownload}
    >
      {props.name}

      <div className="flex flex-row items-center justify-start w-full gap-3">
        <div className="flex items-center gap-1 text-xs text-slate-300 capitalize">
          <DownloadIcon className="w-3 h-3 stroke-primary group-hover:stroke-foreground" />
          {(props?.type === "ddl" ? "Direct Download" : props.type) ?? "??"}
        </div>
        <div className="flex items-center gap-1 text-xs text-slate-300 capitalize">
          <UserIcon className="w-3 h-3 stroke-primary group-hover:stroke-foreground" />
          {props.type !== "ddl" ? (props?.uploader ?? "??") : "??"}
        </div>
        <div className="flex items-center gap-1 text-xs text-slate-300 capitalize">
          <Users2Icon className="w-3 h-3 stroke-primary group-hover:stroke-foreground" />
          {props.type !== "ddl" ? (props?.seeds ?? "??") : "??"}
        </div>
        {!!props?.game_version && (
          <div className="flex items-center gap-1 text-xs text-slate-300 capitalize">
            <Gamepad2Icon className="w-3 h-3 stroke-primary group-hover:stroke-foreground" />
            {props.game_version}
          </div>
        )}
      </div>
    </button>
  );
};

export default DefaultDownloadCard;
