import ListCard from "@/components/cards/listCard";
import { useLists } from "@/features/lists/hooks/useLists";
import { useQuery } from "@tanstack/react-query";

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

  if (isPending) return <div>Loading...</div>;
  if (isError) return <div>Error: {isError}</div>;

  return listId && data && data.length > 0 ? (
    <div className="flex flex-wrap gap-4">
      {data?.length ? (
        data.map((game) => <ListCard key={game.game_id} {...game} />)
      ) : (
        <div className="text-lg font-bold text-center">
          No games in this list
        </div>
      )}
    </div>
  ) : null;
};

export default ActiveLibraryList;
