import { DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useListsDatabase } from "@/hooks";
import { IGDBReturnDataType } from "@/lib/api/igdb/types";
import { PlusIcon } from "lucide-react";
import { useEffect } from "react";
import ListsDropdownItem from "./dropdownItem";

const ListsDropdownContent = (props: IGDBReturnDataType) => {
  const { lists, fetchLists } = useListsDatabase();

  useEffect(() => {
    fetchLists();
  }, []);

  return (
    <DropdownMenuContent className="max-w-sm">
      <DropdownMenuLabel className="w-full truncate">
        Add to List
      </DropdownMenuLabel>

      <DropdownMenuSeparator />

      <div className="overflow-y-auto max-h-24">
        {!lists?.length ? (
          <div className="flex items-center justify-center gap-2 p-2">
            <p className="text-center">No lists found! Create a new one</p>
          </div>
        ) : (
          lists.map((list) => (
            <ListsDropdownItem key={list.id} list_id={list.id} game={props} />
          ))
        )}
      </div>

      <DropdownMenuSeparator />

      <DropdownMenuItem>
        <DialogTrigger>
          <div className="flex items-center gap-1.5">
            <PlusIcon className="size-5 " />
            <p className="text-sm">Create a new collection</p>
          </div>
        </DialogTrigger>
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
};

export default ListsDropdownContent;
