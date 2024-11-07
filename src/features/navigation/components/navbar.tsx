import NavBarBottom from "./containers/bottom";
import NavBarTop from "./containers/top";

const NavBar = () => {
  return (
    <div>
      <aside className="fixed inset-y-0 top-9 left-0 z-10 hidden w-16 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 py-4 h-full">
          <NavBarTop />
          <div className="flex flex-col flex-1 gap-3 border-t border-b w-full"></div>
          <NavBarBottom />
        </nav>
      </aside>
    </div>
  );
};

export default NavBar;
