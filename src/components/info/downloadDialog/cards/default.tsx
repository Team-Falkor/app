import { PluginSearchResponse } from "@/@types";
import { ITorrentGameData } from "@/@types/torrent";
import UseDownloads from "@/features/downloads/hooks/useDownloads";
import { invoke } from "@/lib";
import { useAccountServices } from "@/stores/account-services";
import { DownloadIcon, UserIcon, Users2Icon } from "lucide-react";

type Props = PluginSearchResponse & {
  "multiple-choice"?: boolean;
  pluginId?: string;
  game_data: ITorrentGameData;
};

const DefaultDownloadCard = (props: Props) => {
  const { addDownload } = UseDownloads();
  const { realDebrid } = useAccountServices();

  const handleDownload = async () => {
    // TODO: handle download for ddl

    if (props.type === "ddl") return;
    if (!props.pluginId) return;

    const {
      return: returned_url,
      "multiple-choice": multipleChoice,
      pluginId,
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

    if (!realDebrid) return;

    url = await realDebrid.downloadTorrentFromMagnet(url);

    addDownload({
      id: "test",
      url,
      game_data: props.game_data,
      file_name: props.game_data.name,
    });
  };

  if (props.type === "ddl") return null;

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
          {props?.type ?? "??"}
        </div>
        <div className="flex items-center gap-1 text-xs text-slate-300 capitalize">
          <UserIcon className="w-3 h-3 stroke-primary group-hover:stroke-foreground" />
          {props?.uploader ?? "??"}
        </div>{" "}
        <div className="flex items-center gap-1 text-xs text-slate-300 capitalize">
          <Users2Icon className="w-3 h-3 stroke-primary group-hover:stroke-foreground" />
          {props?.seeds ?? "??"}
        </div>
      </div>
    </button>
  );
};

export default DefaultDownloadCard;
