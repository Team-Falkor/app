import { InfoItadProps, ItemDownload, SourceProvider } from "@/@types";
import { ITorrentGameData } from "@/@types/torrent";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useLanguageContext } from "@/contexts/I18N";
import UsePlugins from "@/hooks/usePlugins";
import { cn, formatName } from "@/lib";
import { Website } from "@/lib/api/igdb/types";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import SourceShowcase from "./soruces";

interface DownloadDialogProps extends InfoItadProps {
  title: string;
  slug?: string;
  isReleased: boolean;
  websites: Website[];
  game_data: ITorrentGameData;
}

const Sources = ({
  isReleased,
  itadData,
  itadPending,
  title,
  slug,
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

  return (
    <div className="flex flex-col w-full gap-1">
      <h1 className="text-sm font-medium text-secondary-foreground">Sources</h1>

      <div className="flex flex-col gap-2">
        <Carousel
          opts={{
            skipSnaps: true,
            dragFree: true,
          }}
        >
          <CarouselContent>
            {providers.map((provider, i) => (
              <CarouselItem className="relative basis-auto" key={i}>
                <Button
                  variant="secondary"
                  className={cn("rounded-full bg-background m-0.5 min-w-16", {
                    "ring-2 ring-purple-400":
                      selectedProvider.value === provider.value,
                  })}
                  key={provider.value}
                  onClick={() => setSelectedProvider(provider)}
                >
                  {provider.label}
                </Button>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <Carousel
          opts={{
            skipSnaps: true,
            dragFree: true,
          }}
          className="mt-2"
        >
          <CarouselContent>
            <SourceShowcase game_data={game_data} sources={filteredSources} />
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
};

export default Sources;
