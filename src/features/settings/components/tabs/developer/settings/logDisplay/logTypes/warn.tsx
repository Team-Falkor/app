import { FC } from "react";

import { CircleAlert } from "lucide-react";
import { BaseLog } from "./base";

interface ConsoleWarningDisplayProps {
  customIcon?: JSX.Element;
  // title: string;
  description: string;
}

const ConsoleWarningDisplay: FC<ConsoleWarningDisplayProps> = ({
  description,
  customIcon,
}) => {
  return (
    <BaseLog>
      <div className="text-yellow-400">
        {customIcon ? customIcon : <CircleAlert />}
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </BaseLog>
  );
};

export { ConsoleWarningDisplay };
