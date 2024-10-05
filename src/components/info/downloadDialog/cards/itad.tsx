import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { openLink } from "@/lib";
import { Deal } from "@/lib/api/itad/types";
import { Coins, ShoppingCart, StarIcon } from "lucide-react";

const ITADDownloadCard = (deal: Deal) => {
  if (!deal) return null;

  return (
    <Tooltip delayDuration={1500}>
      <TooltipTrigger>
        <button
          key={deal.url}
          className="flex flex-col items-start justify-center w-full gap-2 text-sm cursor-pointer group text-start hover:opacity-60"
          onClick={() => {
            openLink(deal.url);
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
              {deal.historyLow.amount} {deal.historyLow.currency}
            </div>
          </div>
        </button>
      </TooltipTrigger>
      <TooltipContent asChild side="bottom">
        <div className="">{deal.url}</div>
      </TooltipContent>
    </Tooltip>
  );
};

export default ITADDownloadCard;
