import ListCard from "@/components/cards/listCard";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useQuery } from "@tanstack/react-query";
import { Pen, TrashIcon } from "lucide-react";
import { useLists } from "../../hooks/useLists";

interface ListContainerProps {
  list_id: number;
  list_name: string;
}

const ListContainer = ({ list_id, list_name }: ListContainerProps) => {
  const { fetchGamesInList } = useLists();

  const { isLoading, data, isError } = useQuery({
    queryKey: ["fetchGamesInList", list_id],
    queryFn: async () => await fetchGamesInList(list_id),
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="group/list">
      <div className="flex items-center justify-between transition-all">
        <h3 className="pb-2 font-mono text-lg font-medium leading-6 capitalize truncate">
          {list_name}
        </h3>

        {/* Action Bar */}
        <div className="w-2/6 flex items-center gap-2 justify-end opacity-0 group-hover/list:opacity-100 group-focus-within/list:opacity-100 transition-all">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" className="size-8 p-2">
                <Pen className="size-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit List</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" className="size-8 p-2">
                <TrashIcon className="size-5 text-red-500" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete List</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      {!!data?.length && !isLoading && !isError ? (
        <Carousel>
          <CarouselContent>
            {data?.map((game) => (
              <CarouselItem
                className="md:basis-[12%] basis-1/6 2xl:basis-[13.3%] xl:basis-[18%]"
                key={game.game_id}
              >
                <ListCard {...game} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      ) : (
        <div className="flex items-start justify-start">
          <h3 className="text-center text-lg mt-1">
            No games found in this list.
          </h3>
        </div>
      )}
    </div>
  );
};

export default ListContainer;
