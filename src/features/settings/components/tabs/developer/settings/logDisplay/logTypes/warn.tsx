import { LogEntry } from "@/@types/logs";
import { CircleAlert } from "lucide-react";
import { JSX } from "react";
import { BaseLog } from "./base";

interface ConsoleWarningDisplayProps {
  customIcon?: JSX.Element;
  // title: string;
  description: string;
  timestamp?: LogEntry["timestamp"];
}

const ConsoleWarningDisplay = ({
  description,
  customIcon,
  timestamp,
}: ConsoleWarningDisplayProps) => {
  return (
    <BaseLog timestamp={timestamp}>
      <div className="text-yellow-400">
        {customIcon ? customIcon : <CircleAlert />}
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </BaseLog>
  );
};

export { ConsoleWarningDisplay };
