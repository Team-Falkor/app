// TODO: REFACTOR COMPONENT COMPLETLY

import { InfoItadProps, ItemDownload } from "@/@types";
import Spinner from "@/components/spinner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Website } from "@/lib/api/igdb/types";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import UsePlugins from "@/hooks/usePlugins";
import { formatName } from "@/lib";
import { Separator } from "@radix-ui/react-separator";
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

const DownloadDialog = ({
  isReleased,
  itadData,
  itadPending,
  title,
}: DownloadDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(baseProviders[0]);
  const [sources, setSources] = useState<ItemDownload[]>([]);
  const [loading, setLoading] = useState(false);
  const { searchAllPlugins, plugins } = UsePlugins();

  const initializeSources = useCallback(async () => {
    setLoading(true); // Start loading
    try {
      if (!itadData || itadPending) return;

      const newSources: ItemDownload[] = [
        {
          name: "itad",
          sources: itadData,
        },
      ];

      const pluginResults = await searchAllPlugins(formatName(title));
      const pluginSources = Object.entries(pluginResults).map(
        ([pluginId, response]) => ({
          name: pluginId,
          sources: response,
        })
      );

      // Combine sources
      setSources([...newSources, ...pluginSources]);
    } catch (error) {
      console.error("Error initializing sources:", error);
    } finally {
      setLoading(false); // Stop loading after sources are set or error occurs
    }
  }, [itadData, itadPending, searchAllPlugins, title]);

  // Effect for initializing sources when itadData is ready
  useEffect(() => {
    if (itadPending || !isReleased) return;
    initializeSources();
  }, [itadData, isReleased, itadPending, initializeSources]);

  const sourcesIsEmpty = useMemo(() => {
    return sources.length === 0;
  }, [sources]);

  const isLoading = itadPending;

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
          {!isLoading ? (
            <Download className="mr-2 size-4" />
          ) : (
            <Spinner className="mr-2 size-4" />
          )}
          Download
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="flex flex-col w-full gap-4">
          <DialogTitle className="text-center">Select your source</DialogTitle>
          <DialogDescription className="w-full mx-auto">
            <DownloadDialogPopover
              providers={[
                ...baseProviders,
                ...plugins.map((plugin) => ({
                  value: plugin.id,
                  label: plugin.name,
                })),
              ]}
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
              {!sourcesIsEmpty ? (
                <DownloadDialogSources sources={sources} />
              ) : isLoading && !itadPending ? (
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
