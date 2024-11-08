import NavBarBottom from "./containers/bottom";
import NavBarTop from "./containers/top";

const NavBar = () => {
  return (
    <aside className="fixed inset-y-0 top-8 left-0 z-10 w-16 flex flex-col border-r bg-background">
      <nav className="flex flex-col items-center gap-4 px-2 py-4 h-full">
        <NavBarTop />
        <div className="flex flex-col flex-1 gap-3 border-t border-b w-full"></div>
        <NavBarBottom />
      </nav>
    </aside>
  );
};

export default NavBar;
