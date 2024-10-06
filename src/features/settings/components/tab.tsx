import { cn } from "@/lib/utils";

interface SettingTabProps {
  title: string;
  icon: JSX.Element;
  isActive: boolean;
  onClick: () => void;
}

const SettingTab = ({ icon, title, isActive, onClick }: SettingTabProps) => {
  return (
    <button
      className={cn([
        "flex items-center w-full gap-3 px-3 py-2 text-sm font-medium transition-all group text-foreground hover:text-blue-400",
        {
          "border-l-4": isActive,
          "border-l-4 border-transparent": !isActive,
        },
      ])}
      aria-current="page"
      onClick={onClick}
    >
      {icon}
      <span className="truncate">{title}</span>
    </button>
  );
};

export default SettingTab;
