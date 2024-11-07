import TitleBar from "@/components/titleBar";
import { TooltipProvider } from "@/components/ui/tooltip";
import NavBar from "@/features/navigation/components/navbar";
import Updater from "@/features/updater/components/updater";
import { useAppStartup } from "@/hooks";
import { createRootRoute, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: Root,
});

function Root() {
  useAppStartup();

  return (
    <TooltipProvider>
      <TitleBar />
      <Updater />
      <div className="flex min-h-screen w-full flex-col bg-muted/40 relative">
        <NavBar />
        <div className="flex flex-col sm:gap-4 sm:pl-16 pt-5">
          <Outlet />
        </div>
      </div>
    </TooltipProvider>
  );
}
