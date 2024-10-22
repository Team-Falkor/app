import PluginCard from "@/components/cards/pluginCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import UsePlugins from "@/hooks/usePlugins";
import { cn } from "@/lib";
import { useQuery } from "@tanstack/react-query";
import { SortBy } from ".";

interface Props {
  showRows: boolean;
  setShowRows: (showRows: boolean) => void;

  sortBy: SortBy;
}

const PluginDisplay = ({ showRows }: Props) => {
  const { getPlugins } = UsePlugins();

  const { data, isPending, error } = useQuery({
    queryKey: ["plugins", "all"],
    queryFn: async () => {
      const plugins = await getPlugins(true);

      return plugins?.data;
    },
  });

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
        {data?.map((plugin: any) => (
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
