import { Info } from "lucide-react";
import { BaseLog } from "./base";

interface ConsoleInfoDisplayProps {
  customIcon?: JSX.Element;
  // title: string;
  description: string;
}

const ConsoleInfoDisplay = ({
  description,
  customIcon,
}: ConsoleInfoDisplayProps) => {
  return (
    <BaseLog>
      <div className="text-orange-400">
        {customIcon ? customIcon : <Info />}
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </BaseLog>
  );
};

export { ConsoleInfoDisplay };
