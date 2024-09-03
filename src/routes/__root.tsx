import NavBar from "@/features/navigation/components/navbar";
import { createRootRoute, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: Root,
});

function Root() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <NavBar />
      <div className="flex flex-col sm:gap-4 sm:pl-16">
        <Outlet />
      </div>
    </div>
  );
}
