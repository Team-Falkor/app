import { InfoItadProps, ItemDownload, SourceProvider } from "@/@types";
import { ITorrentGameData } from "@/@types/torrent";
import Spinner from "@/components/spinner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLanguageContext } from "@/contexts/I18N";
import UsePlugins from "@/hooks/usePlugins";
import { formatName } from "@/lib";
import { Website } from "@/lib/api/igdb/types";
import { useQuery } from "@tanstack/react-query";
import { Download, XCircle } from "lucide-react";
import { useMemo, useState } from "react";
import DownloadDialogProviders from "./providers";
import DownloadDialogSources from "./sources";

interface DownloadDialogProps extends InfoItadProps {
  title: string;
  isReleased: boolean;
  websites: Website[];
  game_data: ITorrentGameData;
}

const DownloadDialog = ({
  isReleased,
  itadData,
  itadPending,
  title,
  game_data,
}: DownloadDialogProps) => {
  const { t } = useLanguageContext();
  const [selectedProvider, setSelectedProvider] = useState<SourceProvider>({
    value: "all",
    label: "All",
  });

  const { searchAllPlugins, getPlugins } = UsePlugins();

  const itadSources: ItemDownload[] = useMemo(
    () => [{ id: "itad", name: "IsThereAnyDeal", sources: itadData ?? [] }],
    [itadData]
  );

  const {
    data: pluginSources,
    isFetching: pluginLoading,
    refetch,
  } = useQuery<ItemDownload[]>({
    queryKey: ["sources", formatName(title)],
    queryFn: async () => {
      const plugins = await searchAllPlugins(formatName(title));
      return plugins.filter((plugin) => plugin.sources.length > 0);
    },
    enabled: isReleased,
  });

  const allSources = useMemo(
    () => [...itadSources, ...(pluginSources ?? [])],
    [itadSources, pluginSources]
  );

  const providers = useMemo((): Array<SourceProvider> => {
    return [
      {
        value: "all",
        label: "All",
      },
      ...allSources
        .filter((source) => source.sources.length > 0)
        .map((source) => ({
          value: source.id ?? "unknown",
          label: source.name ?? "Unknown",
        }))
        .filter((provider) => provider.value !== "unknown"),
    ];
  }, [allSources]);

  const filteredSources = useMemo((): Array<ItemDownload> => {
    if (selectedProvider.value === "all") return allSources;
    const searchValue = selectedProvider.value.toLowerCase();
    return allSources.filter((source) =>
      source.id?.toLowerCase().includes(searchValue)
    );
  }, [allSources, selectedProvider]);

  const isLoading = itadPending || pluginLoading;

  if (!isReleased) {
    return (
      <Button variant="secondary" disabled>
        <Download className="mr-2 size-4" />
        {t("not_released")}
      </Button>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">
          {isLoading ? (
            <Spinner className="mr-2 size-4" />
          ) : (
            <Download className="mr-2 size-4" />
          )}
          {t("download")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[700px] max-h-[540px] overflow-hidden">
        <DialogHeader className="flex flex-col w-full gap-6">
          <DialogTitle>{t("select_your_source")}</DialogTitle>

          <DownloadDialogProviders
            providers={providers}
            selectedProvider={selectedProvider}
            setSelectedProvider={setSelectedProvider}
          />
        </DialogHeader>
        <div className="h-[300px] flex flex-col">
          <div className="bg-muted z-10">
            <h4 className="p-3 text-sm font-medium leading-none">
              {t("sources")}
            </h4>
          </div>
          <ScrollArea className="w-full border rounded-md flex-1">
            <ul className="flex flex-col gap-4 px-4 py-3 relative z-0">
              {isLoading ? (
                <div className="flex items-center justify-center w-full gap-2">
                  <Spinner />
                </div>
              ) : filteredSources.length > 0 ? (
                <DownloadDialogSources
                  sources={filteredSources}
                  game_data={game_data}
                />
              ) : (
                <div className="flex items-center justify-center w-full gap-2">
                  <XCircle className="size-5" />
                  <p className="text-sm text-slate-300">
                    {t("no_sources_found")}
                  </p>
                </div>
              )}
            </ul>
          </ScrollArea>
        </div>
        <div className="w-full flex justify-end items-center">
          <Button
            variant="secondary"
            onClick={() => {
              refetch();
              getPlugins();
            }}
          >
            {t("refresh_sources")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DownloadDialog;
