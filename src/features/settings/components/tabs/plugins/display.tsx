import { PluginSetupJSONDisabled } from "@/@types";
import PluginCard from "@/components/cards/pluginCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import UsePlugins from "@/hooks/usePlugins";
import { cn } from "@/lib";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { SortBy } from ".";

interface Props {
  showRows: boolean;
  setShowRows: (showRows: boolean) => void;

  sortBy: SortBy;
  showEnabledOnly: boolean;
  search: string;
}

const PluginDisplay = ({
  showRows,
  sortBy,
  showEnabledOnly,
  search,
}: Props) => {
  const { getPlugins } = UsePlugins();

  const { data, isPending, error } = useQuery({
    queryKey: ["plugins", "all"],
    queryFn: async () => {
      const plugins = await getPlugins(true);

      return plugins?.data;
    },
  });

  const onSearch = useCallback(
    (search: string, toSearch?: PluginSetupJSONDisabled[] | null) => {
      const realData = toSearch ?? data;
      if (!search) return realData;
      return realData?.filter(
        (plugin) =>
          plugin.name.toLowerCase().includes(search.toLowerCase()) ||
          plugin.id.toLowerCase().includes(search.toLowerCase())
      );
    },
    [data]
  );

  const sortedPlugins = useMemo(() => {
    let sorted = data;
    if (showEnabledOnly) {
      sorted = sorted?.filter((plugin) => !plugin.disabled);
    }

    if (sortBy === "alphabetic-asc") {
      sorted = sorted?.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "alphabetic-desc") {
      sorted = sorted?.sort((a, b) => b.name.localeCompare(a.name));
    }

    if (search?.length > 0) {
      sorted = onSearch(search, sorted);
    }
    return sorted;
  }, [data, onSearch, search, showEnabledOnly, sortBy]);

  if (isPending) return <div>Loading...</div>;
  if (error) return <div>Error</div>;

  if (!data) return null;

  return (
    <ScrollArea className="w-full h-[calc(100vh-10rem)] ">
      <div
        className={cn([
          {
            "grid grid-cols-2 gap-4": showRows,
            "grid grid-cols-1 gap-4": !showRows,
            flex: !sortedPlugins?.length,
          },
        ])}
      >
        {sortedPlugins?.length ? (
          sortedPlugins?.map((plugin: any) => (
            <PluginCard
              key={plugin.id}
              id={plugin.id}
              name={plugin.name}
              description={plugin.description}
              version={plugin.version}
              image={plugin.logo}
              banner={plugin.banner}
              installed={true}
              disabled={plugin.disabled}
              author={plugin.author}
            />
          ))
        ) : (
          <div className="w-full flex items-center justify-start py-2">
            <p className="text-left text-lg w-full font-bold">
              {search?.length ? `No results for "${search}"` : "No plugins"}
            </p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default PluginDisplay;
