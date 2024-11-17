import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import ErrorComponent from "./components/errorComponent";
import { ThemeProvider } from "./components/theme-provider";
import { useThemes } from "./hooks/useThemes";
import { memoryHistory } from "./lib/history";
import { routeTree } from "./routeTree.gen";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchInterval: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
    },
  },
});

// Create the router instance
const appRouter = createRouter({
  routeTree,
  history: memoryHistory,
  context: {
    queryClient,
  },
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
  defaultErrorComponent: (props) => <ErrorComponent {...props} />,
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof appRouter;
  }
}

function App() {
  // Initialize theming logic
  useThemes();

  // Memoize queryClient and router to avoid recreating them on each render

  return (
    <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
      {/* {!hasLoaded && <SplashScreen />} */}
      <QueryClientProvider client={queryClient}>
        <Toaster />
        <RouterProvider router={appRouter} />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
