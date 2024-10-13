import { FC } from "react";

import { CircleAlert } from "lucide-react";
import { BaseLog } from "./base";

interface ConsoleWarningDisplayProps {
  customIcon?: JSX.Element;
  // title: string;
  description: string;
  timestamp?: string;
}

const ConsoleWarningDisplay: FC<ConsoleWarningDisplayProps> = ({
  description,
  customIcon,
  timestamp,
}) => {
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
