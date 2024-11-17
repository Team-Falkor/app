import ListCard from "@/components/cards/listCard";
import { useLists } from "@/features/lists/hooks/useLists";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

interface ActiveLibraryListProps {
  listId: number;
}

const ActiveLibraryList = ({ listId }: ActiveLibraryListProps) => {
  const { fetchGamesInList } = useLists();

  const { data, isPending, isError } = useQuery({
    queryKey: ["library", listId],
    queryFn: async () => {
      return await fetchGamesInList(listId);
    },
  });

  const listCount = useMemo(() => data?.length, [data]);

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-40">
        <p className="text-lg font-semibold text-muted-foreground">
          Loading...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-40">
        <p className="text-lg font-semibold text-error-foreground">
          Something went wrong. Please try again later.
        </p>
      </div>
    );
  }

  return listCount ? (
    <div className="flex flex-wrap gap-4">
      {data.map((game) => (
        <ListCard key={game.game_id} {...game} />
      ))}
    </div>
  ) : (
    <p className="text-lg font-semibold">No games in this list.</p>
  );
};

export default ActiveLibraryList;
