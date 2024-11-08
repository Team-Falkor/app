import { LinkItemType } from "@/@types";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLanguageContext } from "@/contexts/I18N";
import { openLink } from "@/lib";

const SettingsLinkGroup = ({ links }: { links: Array<LinkItemType> }) => {
  const { t } = useLanguageContext();

  return (
    <div className="flex gap-2 md:gap-1">
      {links.map(({ icon, title, url }) => (
        <Tooltip key={title}>
          <TooltipTrigger>
            <Button
              onClick={() => openLink(url)}
              variant="ghost"
              size="icon"
              className="*:size-5"
            >
              {icon}
            </Button>
          </TooltipTrigger>
          <TooltipContent align="start">{t(title)}</TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
};

export default SettingsLinkGroup;
