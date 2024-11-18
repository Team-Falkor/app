import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib";
import { format } from "date-fns";
import { HTMLAttributes, PropsWithChildren } from "react";

interface Props extends HTMLAttributes<HTMLDivElement> {
  timestamp?: number;
}

const BaseLog = ({
  children,
  timestamp,
  className,
}: PropsWithChildren<Props>) => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <div
          className={cn(
            "flex items-center justify-start text-left w-full gap-3 px-3 py-1",
            className
          )}
        >
          {children}
        </div>
      </TooltipTrigger>

      {!!timestamp && (
        <TooltipContent>
          {format(new Date(timestamp), "yyyy-MM-dd HH:mm:ss")}
        </TooltipContent>
      )}
    </Tooltip>
  );
};

export { BaseLog };
