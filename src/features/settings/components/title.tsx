import { cn } from "@/lib";
import { HTMLAttributes } from "react";

interface SettingTitleProps extends HTMLAttributes<HTMLDivElement> {
  children: string;
}

const SettingTitle = ({ children, className, ...props }: SettingTitleProps) => {
  return (
    <div className={cn("p-7 pb-5", className)} {...props}>
      <h1 className="text-xl font-bold">{children}</h1>
    </div>
  );
};

export default SettingTitle;
