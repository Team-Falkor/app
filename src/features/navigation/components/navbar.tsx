import { useSettings } from "@/hooks";
import { cn, shouldHideTitleBar } from "@/lib";
import NavBarBottom from "./containers/bottom";
import NavBarTop from "./containers/top";

const NavBar = () => {
  const { settings } = useSettings();

  const titleBarStyle = settings?.titleBarStyle;

  return (
    <aside
      className={cn(
        "fixed inset-y-0  left-0 z-10 w-16 flex flex-col border-r bg-background",
        {
          "top-8": !shouldHideTitleBar(titleBarStyle),
        }
      )}
    >
      <nav className="flex flex-col items-center h-full gap-4 px-2 py-4">
        <NavBarTop />
        <div className="flex flex-col flex-1 w-full gap-3 border-t border-b"></div>
        <NavBarBottom />
      </nav>
    </aside>
  );
};

export default NavBar;
