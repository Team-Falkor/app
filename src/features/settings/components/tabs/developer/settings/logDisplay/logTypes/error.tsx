import { Ban } from "lucide-react";
import { BaseLog } from "./base";

interface ConsoleErrorDisplayProps {
  customIcon?: JSX.Element;
  // title: string;
  description: string;
}

const ConsoleErrorDisplay = ({
  description,
  customIcon,
}: ConsoleErrorDisplayProps) => {
  return (
    <BaseLog>
      <div className="text-red-400">{customIcon ? customIcon : <Ban />}</div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </BaseLog>
  );
};

export { ConsoleErrorDisplay };
