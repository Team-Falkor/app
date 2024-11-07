import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUpdater } from "@/hooks/useUpdater";
import { useEffect, useState } from "react";

const Updater = () => {
  const { updateAvailable, installUpdate } = useUpdater();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!updateAvailable) return;
    setOpen(true);
  }, [updateAvailable]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Available</DialogTitle>
        </DialogHeader>
        <div className="py-1 flex flex-col gap-2">
          <p className="text-sm text-muted-foreground">
            A new version of falkor is available. Would you like to install it
            now?
          </p>
        </div>
        <DialogFooter>
          <DialogClose>
            <Button variant={"destructive"}>Later</Button>
          </DialogClose>
          <Button variant={"secondary"} onClick={installUpdate}>
            Update Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Updater;
