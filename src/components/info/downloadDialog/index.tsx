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
import { useQuery } from "@tanstack/react-query";
import { Download, XCircle } from "lucide-react";
import { useMemo, useState } from "react";
import DownloadDialogPopover from "./popover";
import DownloadDialogSources from "./sources";

interface DownloadDialogProps extends InfoItadProps {
  title: string;
  isReleased: boolean;
  websites: Website[];
  igdb_id: number;
}

// Centralized provider management
const baseProviders = [{ value: "itad", label: "IsThereAnyDeal" }];

const DownloadDialog = ({
  isReleased,
  itadData,
  itadPending,
  title,
  igdb_id,
}: DownloadDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(baseProviders[0]);
  const { searchAllPlugins, plugins } = UsePlugins();

  const itadSources: ItemDownload[] = useMemo(
    () => [
      {
        name: "itad",
        sources: itadData ?? [],
      },
    ],
    [itadData]
  );

  const { data: sources, isPending } = useQuery<ItemDownload[]>({
    queryKey: ["sources", formatName(title)],
    queryFn: async () => {
      const plugins = await searchAllPlugins(formatName(title));
      const pluginSources: ItemDownload[] = plugins.filter((plugin) => {
        return plugin.sources.length > 0;
      });

      return pluginSources;
    },
    enabled: isReleased,
  });

  const isLoading = itadPending || isPending;

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
              {!isLoading ? (
                <DownloadDialogSources
                  sources={[...itadSources, ...(sources ?? [])]}
                  igdb_id={igdb_id}
                />
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
