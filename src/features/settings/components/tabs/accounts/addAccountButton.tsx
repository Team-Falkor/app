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
import { useAccountServices } from "@/stores/account-services";
import { useState } from "react";

const AddAccountButton = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { realDebrid } = useAccountServices();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary">Add Account</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuLabel>Choose an account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => setIsDialogOpen(true)}
          disabled={!!realDebrid}
        >
          Real Debrid ({realDebrid ? "Connected" : "Not Connected"})
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
