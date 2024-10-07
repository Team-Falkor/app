import { Button, buttonVariants } from "@/components/ui/button";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLanguageContext } from "@/contexts/I18N";
import Search from "@/features/search/components/search";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { HomeIcon, LibraryIcon, SearchIcon, Settings2 } from "lucide-react";
import { useState } from "react";
import NavItem from "../item";

import logo from "@/assets/icon.png";

const NavBarTop = () => {
  const [open, setOpen] = useState(false);

  const { t } = useLanguageContext();
  return (
    <>
      <div className="p-2 border-b">
        <Tooltip>
          <TooltipTrigger>
            <Link
              aria-label="Home"
              className={buttonVariants({
                variant: "ghost",
                size: "icon",
                className: "group",
              })}
              to="/"
            >
              <img
                src={logo}
                alt="logo"
                className="size-9 group-hover:opacity-80 transition-all"
              />
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">{t("logo_hover")}</TooltipContent>
        </Tooltip>
      </div>

      <div className="grid gap-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger>
            <Button
              variant="ghost"
              size="icon"
              className={cn({
                "bg-muted": false,
              })}
            >
              <SearchIcon className="size-5" />
            </Button>
          </PopoverTrigger>

          <Search setOpen={setOpen} />
        </Popover>

        <NavItem href="/" title={t("home")} icon={<HomeIcon />} />

        <NavItem href="/library" title={t("my_games")} icon={<LibraryIcon />} />

        <NavItem href="/settings" title={t("settings")} icon={<Settings2 />} />
      </div>
    </>
  );
};

export default NavBarTop;
