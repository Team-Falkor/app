import { useLanguageContext } from "@/contexts/I18N";
import { DownloadIcon } from "lucide-react";
import NavItem from "../item";

const NavBarBottom = () => {
  const { t } = useLanguageContext();

  return (
    <div className="grid gap-2">
      <NavItem
        href="/downloads"
        title={t("downloads")}
        icon={<DownloadIcon />}
      />
    </div>
  );
};

export default NavBarBottom;
