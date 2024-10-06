import { Button } from "@/components/ui/button";
import { DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import { IGDBReturnDataType } from "@/lib/api/igdb/types";
import { TrashIcon } from "lucide-react";
import { PropsWithChildren, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { useLists } from "../hooks/useLists";

interface CollectionDropdownItemProps extends PropsWithChildren {
  list_id: number;
  game: IGDBReturnDataType;
}

const ListsDropdownItem = ({
  children,
  list_id,
  game,
}: CollectionDropdownItemProps) => {
  const {
    addGameToList,
    fetchGamesInList,
    gamesInList,
    loading,
    removeGameFromList,
  } = useLists();

  useEffect(() => {
    fetchGamesInList(list_id);
  }, [list_id, fetchGamesInList]);

  const handleSelect = useCallback(async () => {
    const games = gamesInList[list_id] || [];
    const gameExists = games.some((g) => g.game_id === game.id);

    if (gameExists) {
      await removeGameFromList(list_id, game.id);
      console.log("Removing game from list");
      toast.success("Game removed from list");
    } else {
      console.log("Adding game to list");
      await addGameToList(list_id, {
        game_id: game.id,
        title: game.name,
        image: game.cover.url,
        description: game?.storyline ?? game?.summary ?? null,
        release_date: game?.first_release_date?.toString() ?? null,
        genre: game?.genres[0].name ?? null,
      });

      await fetchGamesInList(list_id);

      toast.success("Game added to list");
    }
  }, [gamesInList, list_id, game, addGameToList]);

  const games = gamesInList[list_id] || [];

  return (
    <div className="flex flex-row gap-1 justify-between items-center">
      <div className="flex-1">
        <DropdownMenuCheckboxItem
          checked={games.some((g) => g.game_id === game.id)}
          onSelect={handleSelect}
          disabled={loading} // Disable while loading to prevent multiple clicks
        >
          <span className="truncate">{children || game.name}</span>
        </DropdownMenuCheckboxItem>
      </div>

      {/* TODO: hook up button to delete list */}
      <div className="flex pr-1">
        <Button size={"icon"} variant={"ghost"} className="size-5">
          <TrashIcon className="size-5" />
        </Button>
      </div>
    </div>
  );
};

export default ListsDropdownItem;
