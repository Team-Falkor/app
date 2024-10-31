import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLanguageContext } from "@/contexts/I18N";
import { ArrowDownAZ, ArrowUpAZ, Check, Columns2, Rows3 } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { SortBy } from ".";

interface PluginsSortProps {
  showRows: boolean;
  setShowRows: (showRows: boolean) => void;
  sortBy: SortBy;
  setSortBy: Dispatch<SetStateAction<SortBy>>;
}

const PluginsSort = ({
  setShowRows,
  showRows,
  setSortBy,
  sortBy,
}: PluginsSortProps) => {
  const { t } = useLanguageContext();

  return (
    <div className="flex gap-2">
      <Tooltip>
        <TooltipTrigger>
          <Button variant={"ghost"} size={"icon"}>
            <Check />
          </Button>
        </TooltipTrigger>
        <TooltipContent className="capitalize">
          {t("show_installed_only")}
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger>
          <Button
            variant={"ghost"}
            size={"icon"}
            onClick={() =>
              setSortBy(
                sortBy === "alphabetic-asc"
                  ? "alphabetic-desc"
                  : "alphabetic-asc"
              )
            }
          >
            {sortBy === "alphabetic-asc" ? <ArrowUpAZ /> : <ArrowDownAZ />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {sortBy === "alphabetic-asc"
            ? t("sort_alphabeticly_asc")
            : t("sort_alphabeticly_desc")}
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger>
          <Button
            variant={"ghost"}
            size={"icon"}
            onClick={() => setShowRows(!showRows)}
          >
            {showRows ? <Columns2 /> : <Rows3 />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {showRows ? t("show_list") : t("show_grid")}
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

export default PluginsSort;
