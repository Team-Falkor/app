import { ItemDownload, PluginSearchResponse } from "@/@types";
import { ITorrentGameData } from "@/@types/torrent";
import { ITADPrice } from "@/lib/api/itad/types";
import DefaultDownloadCard from "./cards/default";
import ITADDownloadCard from "./cards/itad";

interface DownloadDialogPopoverProps {
  sources: ItemDownload[];
  game_data: ITorrentGameData;
  slug?: string;
}

const DownloadDialogSources = (props: DownloadDialogPopoverProps) => {
  const { sources, slug } = props;

  if (!sources?.length) return null;

  return sources?.map((item) => {
    if (item?.id === "itad") {
      // Narrowing item.sources to ITADPrice[]
      return (item?.sources as ITADPrice[])?.map((source) => {
        return source?.deals?.map((deal, i) => (
          <ITADDownloadCard {...deal} key={`deal-${i}`} />
        ));
      });
    } else {
      if (!item?.sources?.length) return null;

      // Narrowing item.sources to NonDefaultSource[]
      return (item?.sources as PluginSearchResponse[])?.map((source) => (
        <DefaultDownloadCard
          {...source}
          multiple_choice={item["multiple_choice"]}
          pluginId={item.id}
          key={source.name}
          game_data={props.game_data}
          slug={slug}
        />
      ));
    }
  });
};

export default DownloadDialogSources;
