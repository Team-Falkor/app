import { Provider } from "@/@types";
import DownloadDialogCommand from "@/components/info/downloadDialog/command";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronsUpDown } from "lucide-react";

interface DownloadDialogPopoverProps {
  providers: Provider[];
  selectedProvider: Provider;
  setSelectedProvider: React.Dispatch<React.SetStateAction<Provider>>;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const DownloadDialogPopover = ({
  isOpen,
  providers,
  selectedProvider,
  setIsOpen,
  setSelectedProvider,
}: DownloadDialogPopoverProps) => {
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild={true}>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
          className="justify-between w-full"
          key={selectedProvider.value}
        >
          <span className="capitalize">{selectedProvider.label}</span>
          <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[465px] p-0">
        <DownloadDialogCommand
          selectedProvider={selectedProvider}
          setSelectedProvider={setSelectedProvider}
          providers={providers}
          setIsOpen={setIsOpen}
        />
      </PopoverContent>
    </Popover>
  );
};

export default DownloadDialogPopover;
