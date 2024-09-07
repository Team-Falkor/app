import { DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import { useListsDatabase, useSelectedList } from "@/hooks";
import { IGDBReturnDataType } from "@/lib/api/igdb/types";
import { PropsWithChildren, useCallback } from "react";

interface CollectionDropdownItemProps extends PropsWithChildren {
  list_id: number;
  game: IGDBReturnDataType;
}

const ListsDropdownItem = ({
  children,
  list_id,
  game,
}: CollectionDropdownItemProps) => {
  const { addGameToList, removeGameFromList, games } = useListsDatabase();
  const { selectedList } = useSelectedList(list_id);

  const handleSelect = useCallback(async () => {
    console.log(games);
    if (games.some((g) => g.gameId === game.id)) {
      console.log("Removing game from list");
      await removeGameFromList(list_id, game.id);
    } else {
      console.log("Adding game to list");
      await addGameToList(list_id, {
        gameId: game.id,
        title: game.name,
        image: game.cover.url,
        description: game?.storyline ?? game?.summary ?? null,
        release_date: game?.first_release_date?.toString() ?? null,
        genre: game?.genres[0].name ?? null,
      });
    }
  }, []);

  return (
    <DropdownMenuCheckboxItem
      checked={games.some((g) => g.gameId === game.id)}
      onSelect={handleSelect}
    >
      <span className="truncate">
        {selectedList ? selectedList?.name : children ? children : game.name}
      </span>
    </DropdownMenuCheckboxItem>
  );
};

export default ListsDropdownItem;
