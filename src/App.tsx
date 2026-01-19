import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FilterProvider } from "@/store/filters";
import {
  CACHE_STALE_TIME_MS,
  CACHE_TIME_MS,
  API_RETRY_COUNT,
  API_RETRY_DELAY_MS,
} from "@/config/demoDefaults";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

/**
 * QueryClient Configuration
 * 
 * PHASE 5: Demo Hardening
 * - Extended cache times for stability during demo
 * - Minimal retry attempts for quick failure
 * - Keeps previous data during refetches
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: CACHE_STALE_TIME_MS,
      gcTime: CACHE_TIME_MS,
      retry: API_RETRY_COUNT,
      retryDelay: API_RETRY_DELAY_MS,
      refetchOnWindowFocus: false, // Prevent unexpected refetches during demo
      refetchOnReconnect: true,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <FilterProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </FilterProvider>
  </QueryClientProvider>
);

export default App;
