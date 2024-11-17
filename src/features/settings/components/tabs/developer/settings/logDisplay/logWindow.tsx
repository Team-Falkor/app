import { ScrollArea } from "@/components/ui/scroll-area";
import { useLogger } from "@/hooks";
import { cn } from "@/lib";
import { useQuery } from "@tanstack/react-query";
import LogSwitch from "./logSwitch";

interface LogWindowProps {
  enabled: boolean;
}

const LogWindow = ({ enabled }: LogWindowProps) => {
  const { logs, retrieveLogs } = useLogger();

  useQuery({
    queryKey: ["logs"],
    queryFn: retrieveLogs,
    enabled: enabled,
  });

  return (
    <div>
      <ScrollArea
        className={cn("rounded-lg transition-all ease-in-out size-full h-0", {
          "h-96 ring-1 ring-muted w-full mt-4": enabled,
          "": !enabled,
        })}
      >
        <div className="flex flex-col items-start justify-start gap-2 py-2 size-full">
          {logs?.length ? (
            logs.map((log, i) => {
              return <LogSwitch {...log} key={i} />;
            })
          ) : (
            <div className="flex items-center justify-center size-full">
              <p className="text-lg font-bold">No logs</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default LogWindow;
