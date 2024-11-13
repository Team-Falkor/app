import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import ms from "ms";

interface PlaytimeProps {
  playtime: number;
}

const Playtime = ({ playtime }: PlaytimeProps) => {
  if (!playtime) return <div></div>;

  return (
    <Badge
      className="flex items-center gap-1.5 px-2.5 h-full rounded-lg text-foreground/90 backdrop-blur-md"
      variant={"secondary"}
    >
      <Clock size={16} className="text-foreground/70" />
      <span className="font-semibold">{ms(playtime)}</span>
    </Badge>
  );
};

export default Playtime;
