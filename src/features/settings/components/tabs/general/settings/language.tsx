import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguageContext } from "@/contexts/I18N";
import { useMemo } from "react";

const LanguageDropdown = () => {
  const { languages, i18n } = useLanguageContext();

  const currentLanguage = useMemo(() => {
    return Object.entries(languages).find(
      ([key, _value]) => key === i18n.language
    );
  }, [languages, i18n.language]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="outline" className="bg-none w-56">
          {currentLanguage?.[1].nativeName}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuLabel>Choose Language</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {Object.entries(languages).map(([key, value]) => (
          <DropdownMenuCheckboxItem
            key={key}
            checked={currentLanguage?.[0] === key}
            onCheckedChange={() => {
              console.log(key);
              i18n.changeLanguage(key);
            }}
          >
            {value.nativeName} ({key})
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageDropdown;
