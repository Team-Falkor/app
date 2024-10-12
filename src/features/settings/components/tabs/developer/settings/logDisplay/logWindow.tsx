import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib";
import {
  ConsoleErrorDisplay,
  ConsoleInfoDisplay,
  ConsoleWarningDisplay,
} from "./logTypes";

interface LogWindowProps {
  enabled: boolean;
}

const LogWindow = ({ enabled }: LogWindowProps) => {
  return (
    <div>
      <ScrollArea
        className={cn("rounded-lg transition-all ease-in-out w-full h-0", {
          "h-96 ring-1 ring-muted w-full": enabled,
        })}
      >
        <div className="grid gap-2 py-2">
          <ConsoleWarningDisplay description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit similique quas et obcaecati, quasi quae corporis distinctio, repellendus excepturi nostrum consequatur sequi earum culpa ratione ea est praesentium mollitia ipsam!" />
          <ConsoleErrorDisplay description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit similique quas et obcaecati, quasi quae corporis distinctio, repellendus excepturi nostrum consequatur sequi earum culpa ratione ea est praesentium mollitia ipsam!" />
          <ConsoleInfoDisplay description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit similique quas et obcaecati, quasi quae corporis distinctio, repellendus excepturi nostrum consequatur sequi earum culpa ratione ea est praesentium mollitia ipsam!" />
          <ConsoleInfoDisplay description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit similique quas et obcaecati, quasi quae corporis distinctio, repellendus excepturi nostrum consequatur sequi earum culpa ratione ea est praesentium mollitia ipsam!" />
          <ConsoleInfoDisplay description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit similique quas et obcaecati, quasi quae corporis distinctio, repellendus excepturi nostrum consequatur sequi earum culpa ratione ea est praesentium mollitia ipsam!" />
          <ConsoleErrorDisplay description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit similique quas et obcaecati, quasi quae corporis distinctio, repellendus excepturi nostrum consequatur sequi earum culpa ratione ea est praesentium mollitia ipsam!" />
          <ConsoleInfoDisplay description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit similique quas et obcaecati, quasi quae corporis distinctio, repellendus excepturi nostrum consequatur sequi earum culpa ratione ea est praesentium mollitia ipsam!" />
          <ConsoleInfoDisplay description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit similique quas et obcaecati, quasi quae corporis distinctio, repellendus excepturi nostrum consequatur sequi earum culpa ratione ea est praesentium mollitia ipsam!" />
          <ConsoleInfoDisplay description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit similique quas et obcaecati, quasi quae corporis distinctio, repellendus excepturi nostrum consequatur sequi earum culpa ratione ea est praesentium mollitia ipsam!" />
          <ConsoleInfoDisplay description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit similique quas et obcaecati, quasi quae corporis distinctio, repellendus excepturi nostrum consequatur sequi earum culpa ratione ea est praesentium mollitia ipsam!" />
        </div>
      </ScrollArea>
    </div>
  );
};

export default LogWindow;
