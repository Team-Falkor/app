import { ItemDownload, PluginSearchResponse } from "@/@types";
import { ITADPrice } from "@/lib/api/itad/types";
import DefaultDownloadCard from "./cards/default";
import ITADDownloadCard from "./cards/itad";

interface DownloadDialogPopoverProps {
  sources: ItemDownload[];
  igdb_id: number;
}

const DownloadDialogSources = (props: DownloadDialogPopoverProps) => {
  const { sources } = props;

  if (!sources?.length) return null;

  return sources?.map((item) => {
    if (item.name === "itad") {
      // Narrowing item.sources to ITADPrice[]
      return (item.sources as ITADPrice[]).map((source) => {
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
          multiple-choice={item["multiple-choice"]}
          pluginId={item.id}
          key={source.name}
          igdb_id={props.igdb_id}
        />
      ));
    }
  });
};

export default DownloadDialogSources;
