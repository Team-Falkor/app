import { NonDefaultSource } from "@/@types";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DownloadIcon, UserIcon } from "lucide-react";

const DefaultDownloadCard = (props: NonDefaultSource) => {
  if (!props.url) return null;

  return (
    <Tooltip delayDuration={1500}>
      <TooltipTrigger>
        <button
          key={props.url}
          className="flex flex-col items-start justify-center w-full gap-2 text-sm cursor-pointer group text-start hover:opacity-60"
        >
          {props.title}

          <div className="flex flex-row items-center justify-start w-full gap-3">
            <div className="flex items-center gap-1 text-xs text-slate-300 capitalize">
              <DownloadIcon className="w-3 h-3 stroke-primary group-hover:stroke-foreground" />
              {props.type}
            </div>

            <div className="flex items-center gap-1 text-xs text-slate-300 capitalize">
              <UserIcon className="w-3 h-3 stroke-primary group-hover:stroke-foreground" />
              {props.name}
            </div>
          </div>
        </button>
      </TooltipTrigger>
      <TooltipContent asChild side="bottom">
        <div className="">{props.url}</div>
      </TooltipContent>
    </Tooltip>
  );
};

export default DefaultDownloadCard;
