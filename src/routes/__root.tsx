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
      <div className="flex flex-col min-h-screen overflow-hidden">
        {/* TitleBar positioned at the top */}
        <TitleBar />

        {/* Wrapper for Updater and main content */}
        <Updater />
        <div className="flex min-h-screen w-full bg-muted/40 pt-8 relative">
          {/* Sidebar navigation */}
          <NavBar />

          {/* Main content area */}
          <div className="flex-grow flex flex-col sm:pl-16 w-full h-full overflow-y-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
