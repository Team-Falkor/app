import { InfoItadProps, ItemDownload } from "@/@types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import usePlugins from "@/hooks/plugins/usePlugins";
import { Website } from "@/lib/api/igdb/types";
import { Download, XCircle } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import DownloadDialogPopover from "./popover";
import DownloadDialogSources from "./sources";

interface DownloadDialogProps extends InfoItadProps {
  title: string;
  isReleased: boolean;
  websites: Website[];
}

const baseProviders = [{ value: "itad", label: "IsThereAnyDeal" }];

// Utility function to create a provider object
const createProvider = (value: string, label: string) => ({ value, label });

// Function to initialize the provider list, mapping over baseProviders
const createProviderList = () => {
  return baseProviders.map((provider) =>
    createProvider(provider.value, provider.label)
  );
};

const DownloadDialog = ({
  isReleased,
  itadData,
  itadPending,
}: DownloadDialogProps) => {
  const { loadPlugins, plugins } = usePlugins();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(baseProviders[0]);
  const [providers, setProviders] = useState(createProviderList());
  const [sources, setSources] = useState<ItemDownload[]>([]);

  const updatePluginProviders = useCallback(() => {
    if (plugins?.length) {
      setProviders((prev) => [
        ...prev,
        ...plugins.map((plugin) =>
          createProvider(plugin.metadata.name, plugin.metadata.name)
        ),
      ]);
    }
  }, [plugins]);

  const initializeSources = useCallback(() => {
    if (itadData) {
      setSources([
        {
          name: "itad",
          sources: itadData,
        },
      ]);
      setProviders((_prev) => [
        ...createProviderList(),
        ...plugins.map((plugin) =>
          createProvider(plugin.metadata.name, plugin.metadata.name)
        ),
      ]);
    }
  }, [itadData, plugins]);

  // This useEffect only runs once when the component mounts
  useEffect(() => {
    if (!isReleased) return;
    if (!plugins) return;

    plugins && updatePluginProviders();
  }, [loadPlugins, loadPlugins]); // Removed updatePluginProviders from deps

  // This useEffect ensures that sources are initialized after plugins are loaded
  useEffect(() => {
    if (!itadData && !isReleased) return;
    if (itadPending) return;

    initializeSources();
  }, [itadData, isReleased, itadPending, initializeSources]);

  return (
    <Dialog>
      <DialogTrigger disabled={!isReleased}>
        <Button variant="secondary" disabled={!isReleased}>
          <Download className="mr-2 size-4" />
          {isReleased ? "Download" : "Not Released"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="flex flex-col w-full gap-4">
          <DialogTitle className="text-center">Select your source</DialogTitle>
          <DialogDescription className="w-full mx-auto">
            <DownloadDialogPopover
              providers={providers}
              selectedProvider={selectedProvider}
              setSelectedProvider={setSelectedProvider}
              isOpen={isOpen}
              setIsOpen={setIsOpen}
            />
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="w-full border rounded-md h-72 mt-1">
          <div className="pb-5">
            <div className="sticky top-0 left-0 right-0 mb-3 bg-muted z-10">
              <h4 className="p-3 pb-1 text-sm font-medium leading-none">
                Sources
              </h4>
              <Separator orientation="horizontal" className="mt-2" />
            </div>

            <ul className="flex flex-col gap-4 p-4 py-0 relative z-0">
              {sources?.length ? (
                <DownloadDialogSources sources={sources} />
              ) : (
                <div className="flex flex-row items-center justify-center w-full gap-2">
                  <XCircle className="size-5" />
                  <p className="text-sm text-slate-300">
                    No source providers found
                  </p>
                </div>
              )}
            </ul>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default DownloadDialog;
