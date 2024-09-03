import { InfoItadProps } from "@/@types";
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
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip";
import { Website } from "@/lib/api/igdb/types";
import { TooltipContent } from "@radix-ui/react-tooltip";
import { Coins, Download, ShoppingCart, StarIcon, XCircle } from "lucide-react";
import { useState } from "react";
import DownloadDialogPopover from "./popover";

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

const DownloadDialog = ({ isReleased, itadData }: DownloadDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(providers[0]);

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
              providers={providers}
              selectedProvider={selectedProvider}
              setSelectedProvider={setSelectedProvider}
              isOpen={isOpen}
              setIsOpen={setIsOpen}
            />
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="w-full border rounded-md h-72">
          <div>
            <div className="sticky top-0 left-0 right-0 mb-3 bg-muted">
              <h4 className="p-3 pb-1 text-sm font-medium leading-none">
                Sources
              </h4>

              <Separator orientation="horizontal" className="mt-2" />
            </div>

            <ul className="flex flex-col gap-4 p-4 py-0">
              {!!itadData && !!itadData.length ? (
                itadData.map((itad) => {
                  return itad.deals.map((deal) => (
                    <Tooltip delayDuration={1500}>
                      <TooltipTrigger>
                        <button
                          key={deal.url}
                          className="flex flex-col items-start justify-center w-full gap-2 text-sm cursor-pointer group text-start hover:opacity-60"
                          onClick={() => {
                            open(deal.url);
                          }}
                        >
                          {deal.shop.name}

                          <div className="flex flex-row items-center justify-start w-full gap-3">
                            <div className="flex items-center gap-1 text-xs text-slate-300">
                              <ShoppingCart className="w-3 h-3 stroke-primary group-hover:stroke-foreground" />
                              Buy
                            </div>

                            <div className="flex items-center gap-1 text-xs text-slate-300">
                              <Coins className="w-3 h-3 stroke-primary group-hover:stroke-foreground" />
                              {deal.price.amount} {deal.price.currency}
                            </div>

                            <div className="flex items-center gap-1 text-xs text-slate-300">
                              <StarIcon className="w-3 h-3 stroke-primary group-hover:stroke-foreground" />
                              {deal.historyLow.amount}{" "}
                              {deal.historyLow.currency}
                            </div>
                          </div>
                        </button>
                      </TooltipTrigger>
                      <TooltipContent asChild side="bottom">
                        <div className="">{deal.url}</div>
                      </TooltipContent>
                    </Tooltip>
                  ));
                })
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
