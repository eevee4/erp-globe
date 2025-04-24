import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppContextProvider } from "./context/AppContext";
import AppLayout from "@/components/layout/AppLayout";
import PreProductionPage from "@/pages/PreProduction";
import PostProductionPage from "@/pages/PostProduction";
import BillingPage from "@/pages/Billing";
import BillingHistoryPage from "@/pages/BillingHistory";
import DatabasePage from "@/pages/Database";
import NotFoundPage from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppContextProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<PreProductionPage />} />
              <Route path="pre-production" element={<PreProductionPage />} />
              <Route path="post-production" element={<PostProductionPage />} />
              <Route path="billing" element={<BillingPage />} />
              <Route path="billing-history" element={<BillingHistoryPage />} />
              <Route path="database" element={<DatabasePage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AppContextProvider>
  </QueryClientProvider>
);

export default App;
