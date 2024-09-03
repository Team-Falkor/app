import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { Toaster } from "sonner";
import { ThemeProvider } from "./components/theme-provider";
import { TooltipProvider } from "./components/ui/tooltip";

import { usePlugins } from "./hooks/plugins/usePlugins";
import { routeTree } from "./routeTree.gen";

const queryClient = new QueryClient();

// Create a new router instance
const router = createRouter({
  routeTree,
  context: {
    queryClient,
  },
  defaultPreload: "intent",
  // Since we're using React Query, we don't want loader calls to ever be stale
  // This will ensure that the loader is always called when the route is preloaded or visited
  defaultPreloadStaleTime: 0,
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function App() {
  const { hasInitialized } = usePlugins();

  if (!hasInitialized) return <div>Loading...</div>;
  return (
    <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
      <TooltipProvider>
        <QueryClientProvider client={queryClient}>
          <Toaster />
          {/* <TorrentProvider> */}
          <RouterProvider router={router} />
          {/* </TorrentProvider> */}
        </QueryClientProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
}
export default App;
