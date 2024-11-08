import { useLanguageContext } from "@/contexts/I18N";
import TitleBarControl from "./control";

const TitleBar = () => {
  const { t } = useLanguageContext();
  return (
    <div className="fixed top-0 z-50 w-full h-8 bg-background border-b border-muted shadow-md flex items-center">
      <div className="flex flex-row w-full justify-between items-center">
        {/* Title */}
        <div id="titlebar" className="flex-1 h-full flex items-center pl-3">
          <h1 className="font-semibold text-lg text-foreground pointer-events-none select-none">
            {t("falkor")}
          </h1>
        </div>
        {/* Control Buttons */}
        <div className="flex gap-1 pr-3">
          <TitleBarControl
            className="fill-yellow-400 group-hover:fill-yellow-500 group-focus-visible:fill-yellow-500"
            type="minimize"
          />
          <TitleBarControl
            className="fill-green-400 group-hover:fill-green-500 group-focus-visible:fill-green-500"
            type="maximize"
          />
          <TitleBarControl
            className="fill-red-400 group-hover:fill-red-500 group-focus-visible:fill-red-500"
            type="close"
          />
        </div>
      </div>
    </div>
  );
};

export default TitleBar;
