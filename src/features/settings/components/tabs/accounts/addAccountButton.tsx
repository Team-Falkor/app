import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import RealDebridDialogContent from "@/features/realDebrid/components/realDebridDialogContent";
import { useState } from "react";

const AddAccountButton = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={true}>
        <Button variant="secondary">Add Account</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuLabel>Choose an account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => setIsDialogOpen(true)}>
          Real Debrid
        </DropdownMenuItem>
      </DropdownMenuContent>

      {/* Dialog triggers on state change */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <RealDebridDialogContent
          setOpen={setIsDialogOpen}
          open={isDialogOpen}
        />
      </Dialog>
    </DropdownMenu>
  );
};

export default AddAccountButton;
