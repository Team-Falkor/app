import PluginCard from "@/components/cards/pluginCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import UsePlugins from "@/hooks/usePlugins";
import { cn } from "@/lib";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { SortBy } from ".";

interface Props {
  showRows: boolean;
  setShowRows: (showRows: boolean) => void;

  sortBy: SortBy;
  showEnabledOnly: boolean;
}

const PluginDisplay = ({ showRows, sortBy, showEnabledOnly }: Props) => {
  const { getPlugins } = UsePlugins();

  const { data, isPending, error } = useQuery({
    queryKey: ["plugins", "all"],
    queryFn: async () => {
      const plugins = await getPlugins(true);

      return plugins?.data;
    },
  });

  const sortedPlugins = useMemo(() => {
    if (showEnabledOnly) {
      const plugins = data?.filter((plugin) => !plugin.disabled);
      if (sortBy === "alphabetic-asc") {
        return plugins?.sort((a, b) => a.name.localeCompare(b.name));
      } else if (sortBy === "alphabetic-desc") {
        return plugins?.sort((a, b) => b.name.localeCompare(a.name));
      }
      return plugins;
    }

    if (sortBy === "alphabetic-asc") {
      return data?.sort((a, b) => a.name.localeCompare(b.name));
    }
    if (sortBy === "alphabetic-desc") {
      return data?.sort((a, b) => b.name.localeCompare(a.name));
    }

    return data;
  }, [data, showEnabledOnly, sortBy]);

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
          },
        ])}
      >
        {!!sortedPlugins?.length &&
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
            />
          ))}
      </div>
    </ScrollArea>
  );
};

export default PluginDisplay;
