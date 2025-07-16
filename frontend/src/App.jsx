import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Index from "./pages/Index.jsx";
import NotFound from "./pages/NotFound.jsx";
import Settings from "./pages/Settings.jsx";
import PNRStatus from "./pages/PNRStatus.jsx";
import History from "./pages/History.jsx";
import About from "./pages/About.jsx";
import ContactUsPage from "./pages/ContactUs.jsx";
import CoachLayout from "./pages/CoachLayout.jsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const router = createBrowserRouter([
  { path: "/", element: <Index /> },
  { path: "/settings", element: <Settings /> },
  { path: "/pnr-status", element: <PNRStatus /> },
  { path: "/history", element: <History /> },
  { path: "/about", element: <About /> },
  { path: "/contact-us", element: <ContactUsPage /> },
  { path: "/coach-layout", element: <CoachLayout /> },
  { path: "*", element: <NotFound /> },
]);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-center" />
      <RouterProvider router={router} />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
