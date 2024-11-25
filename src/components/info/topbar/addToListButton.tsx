import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";

interface AddToListButtonProps {
  onClick: () => void;
}

export const AddToListButton = ({ onClick }: AddToListButtonProps) => (
  <Button variant={"secondary"} onClick={onClick} className="gap-2">
    <Bookmark size={15} className="fill-current" />
    Add to list
  </Button>
);
