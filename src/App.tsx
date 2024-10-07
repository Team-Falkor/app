import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createMemoryHistory,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import { ThemeProvider } from "./components/theme-provider";

// import usePlugins from "./hooks/plugins/usePlugins";
import { routeTree } from "./routeTree.gen";

const queryClient = new QueryClient();

// Create a memory history instance to initialize the router so it doesn't break when compiled:
const memoryHistory = createMemoryHistory({
  initialEntries: ["/"], // Pass your initial url
});

// Create a new router instance
const router = createRouter({
  routeTree,
  history: memoryHistory,
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
  // usePlugins();

  // if (!hasInitialized) return <div>Loading...</div>;
  return (
    <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
      <QueryClientProvider client={queryClient}>
        <Toaster />
        {/* <TorrentProvider> */}
        <RouterProvider router={router} />
        {/* </TorrentProvider> */}
      </QueryClientProvider>
    </ThemeProvider>
  );
}
export default App;
