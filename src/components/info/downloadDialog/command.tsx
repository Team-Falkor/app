import { Provider } from "@/@types";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import React from "react";

interface DownloadDialogCommandProps {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedProvider: Provider;
  setSelectedProvider: React.Dispatch<React.SetStateAction<Provider>>;
  providers: Array<Provider>;
}

const DownloadDialogCommand = ({
  setIsOpen,
  selectedProvider,
  setSelectedProvider,
  providers,
}: DownloadDialogCommandProps) => {
  return (
    <Command>
      <CommandInput placeholder="Search source providers..." />

      <CommandList>
        <CommandEmpty>No source providers found</CommandEmpty>

        <CommandGroup>
          {providers.map((provider) => (
            <CommandItem
              onSelect={() => {
                setSelectedProvider(provider);
                setIsOpen(false);
              }}
              key={provider.value}
            >
              <Check
                className={cn(
                  "mr-2 h-4 w-4",
                  selectedProvider.value !== provider.value &&
                    "text-transparent"
                )}
              />
              {provider.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
};

export default DownloadDialogCommand;
