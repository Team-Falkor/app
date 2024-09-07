import { ItemDownload, NonDefaultSource } from "@/@types";
import { ITADPrice } from "@/lib/api/itad/types";
import DefaultDownloadCard from "./cards/default";
import ITADDownloadCard from "./cards/itad";

interface DownloadDialogPopoverProps {
  sources: ItemDownload[];
}

const DownloadDialogSources = (props: DownloadDialogPopoverProps) => {
  const { sources } = props;

  if (!sources?.length) return null;

  console.log(sources);

  return sources.map((item) => {
    console.log(item.name === "itad");
    if (item.name === "itad") {
      // Narrowing item.sources to ITADPrice[]
      return (item.sources as ITADPrice[]).map((source) => {
        return source.deals.map((deal) => <ITADDownloadCard {...deal} />);
      });
    } else {
      // Narrowing item.sources to NonDefaultSource[]
      return (item.sources as NonDefaultSource[]).map((source) => (
        <DefaultDownloadCard {...source} />
      ));
    }
  });
};

export default DownloadDialogSources;
