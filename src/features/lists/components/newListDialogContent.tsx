import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLists } from "@/hooks";
import { Dispatch, SetStateAction, useRef } from "react";
import { toast } from "sonner";

interface NewListDialogContentProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const NewListDialogContent = ({ open, setOpen }: NewListDialogContentProps) => {
  const { createList, loading } = useLists(); // Using Zustand's `useLists` hook
  const ref = useRef<HTMLInputElement>(null);

  const onSubmit = async () => {
    if (!open) return;
    const name = ref.current?.value.trim();

    if (!name) {
      toast.error("List name cannot be empty", {
        description: "Please provide a valid name.",
      });
      return;
    }

    try {
      await createList(name);
      setOpen(false);
      toast.success("List created successfully!");
    } catch (error) {
      console.error(error);
      toast.error("There was an error creating the list", {
        description: "Please try again",
      });
    }
  };

  return (
    <DialogContent className="max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Create New List</DialogTitle>
        <DialogDescription>
          Fill in the information below to create a new list.
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-3 py-2">
        <Label htmlFor="collectionName">Name</Label>
        <Input
          ref={ref}
          id="listName"
          placeholder="Enter list name"
          type="text"
          className="w-full"
          minLength={1}
          maxLength={64}
          autoComplete={"off"}
          disabled={loading} // Disable input while loading
        />
      </div>

      <DialogFooter>
        <DialogClose asChild>
          <Button variant={"destructive"} disabled={loading}>
            Cancel
          </Button>
        </DialogClose>
        <Button variant={"secondary"} onClick={onSubmit} disabled={loading}>
          {loading ? "Creating..." : "Create"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default NewListDialogContent;
