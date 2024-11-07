import { TooltipProvider } from "@/components/ui/tooltip";
import NavBar from "@/features/navigation/components/navbar";
import { useAppStartup } from "@/hooks";
import { createRootRoute, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: Root,
});

function Root() {
  useAppStartup();

  return (
    <TooltipProvider>
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <NavBar />
        <div className="flex flex-col sm:gap-4 sm:pl-16">
          <Outlet />
        </div>
      </div>
    </TooltipProvider>
  );
}
