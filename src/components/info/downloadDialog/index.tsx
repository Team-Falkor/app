import { InfoItadProps, ItemDownload } from "@/@types";
import Spinner from "@/components/spinner"; // assuming there's a spinner component
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
import { useCallback, useEffect, useMemo, useState } from "react";
import DownloadDialogPopover from "./popover";
import DownloadDialogSources from "./sources";

interface DownloadDialogProps extends InfoItadProps {
  title: string;
  isReleased: boolean;
  websites: Website[];
}

// Centralized provider management
const baseProviders = [{ value: "itad", label: "IsThereAnyDeal" }];

const createProvider = (value: string, label: string) => ({ value, label });

const getProviders = (plugins: any[]) => {
  const pluginProviders = plugins.map((plugin) =>
    createProvider(plugin.metadata.name, plugin.metadata.name)
  );
  return [...baseProviders, ...pluginProviders];
};

const DownloadDialog = ({
  isReleased,
  itadData,
  itadPending,
}: DownloadDialogProps) => {
  const { loadPlugins, plugins } = usePlugins();
  const [isOpen, setIsOpen] = useState(false);
  const [loadingPlugins, setLoadingPlugins] = useState(true); // Track plugin loading
  const [selectedProvider, setSelectedProvider] = useState(baseProviders[0]);
  const [sources, setSources] = useState<ItemDownload[]>([]);

  // Memoized providers to avoid re-calculating on every render
  const providers = useMemo(() => getProviders(plugins), [plugins]);

  // Only update sources if itadData is available
  const initializeSources = useCallback(() => {
    if (!itadData) return;
    setSources([
      {
        name: "itad",
        sources: itadData,
      },
    ]);
  }, [itadData]);

  // Load plugins and set loading state
  useEffect(() => {
    const load = async () => {
      await loadPlugins();
      setLoadingPlugins(false); // Update loading state after plugins load
    };
    load();
  }, [loadPlugins]);

  // Effect for initializing sources when itadData is ready
  useEffect(() => {
    if (itadPending || !isReleased) return;
    initializeSources();
  }, [itadData, isReleased, itadPending, initializeSources]);

  // Show loading indicator for plugins and sources
  const isLoading = loadingPlugins || itadPending;

  // Early return if not released
  if (!isReleased) {
    return (
      <Button variant="secondary" disabled>
        <Download className="mr-2 size-4" />
        Not Released
      </Button>
    );
  }

  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="secondary">
          <Download className="mr-2 size-4" />
          {isLoading ? <Spinner /> : "Download"}
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
              {sources.length ? (
                <DownloadDialogSources sources={sources} />
              ) : isLoading ? (
                <div className="flex flex-row items-center justify-center w-full gap-2">
                  <Spinner /> {/* Loading indicator */}
                </div>
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
