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
import { Website } from "@/lib/api/igdb/types";
import { Download, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import DownloadDialogPopover from "./popover";
import DownloadDialogSources from "./sources";

interface DownloadDialogProps extends InfoItadProps {
  title: string;
  isReleased: boolean;
  websites: Website[];
}

const providers = [
  {
    value: "itad",
    label: "IsThereAnyDeal",
  },
];

const DownloadDialog = ({
  isReleased,
  itadData,
  itadPending,
}: DownloadDialogProps) => {
  const [names, setNames] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(providers[0]);
  const [sources, setSources] = useState<ItemDownload[]>([]);

  useEffect(() => {
    if (!itadData || itadPending) return;
    if (!isReleased) return;

    setSources([
      {
        name: "itad",
        sources: itadData ?? [],
      },
    ]);
  }, [itadData, isReleased, itadPending]);

  return (
    <Dialog>
      <DialogTrigger disabled={!isReleased}>
        <Button variant={"secondary"} disabled={!isReleased}>
          <Download className="mr-2 size-4" />
          {isReleased ? "Download" : "Not Released"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="flex flex-col w-full gap-4">
          <DialogTitle className="text-center">Select your source</DialogTitle>

          <DialogDescription className="w-full mx-auto">
            <DownloadDialogPopover
              providers={[
                ...providers,
                ...names.map((name) => ({
                  value: name,
                  label: name.replace(/-/g, " "),
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
              {!!sources?.length ? (
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

        {/* <DialogFooter className="w-full">
          <Button
            className="items-center w-full gap-2"
            type="submit"
            variant={'secondary'}
          >
            Show All Source Providers
            <ChevronsRight className="mt-1 size-5 stroke-slate-300" />
          </Button>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
};

export default DownloadDialog;
