import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import PropertyDetail from "./pages/PropertyDetail";

import LandlordDashboard from "./pages/landlord/Dashboard";
import AddProperty from "./pages/landlord/AddProperty";
import Listings from "./pages/landlord/Listings";
import Requests from "./pages/landlord/Requests";
import LandlordMessages from "./pages/landlord/Messages";
import LandlordProfile from "./pages/landlord/Profile";

import TenantDashboard from "./pages/tenant/Dashboard";
import SavedHouses from "./pages/tenant/SavedHouses";
import Applications from "./pages/tenant/Applications";
import TenantMessages from "./pages/tenant/Messages";
import TenantProfile from "./pages/tenant/Profile";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/property/:id" element={<PropertyDetail />} />

              {/* Landlord Routes */}
              <Route path="/landlord/dashboard" element={<ProtectedRoute requiredRole="landlord"><LandlordDashboard /></ProtectedRoute>} />
              <Route path="/landlord/add-property" element={<ProtectedRoute requiredRole="landlord"><AddProperty /></ProtectedRoute>} />
              <Route path="/landlord/listings" element={<ProtectedRoute requiredRole="landlord"><Listings /></ProtectedRoute>} />
              <Route path="/landlord/requests" element={<ProtectedRoute requiredRole="landlord"><Requests /></ProtectedRoute>} />
              <Route path="/landlord/messages" element={<ProtectedRoute requiredRole="landlord"><LandlordMessages /></ProtectedRoute>} />
              <Route path="/landlord/profile" element={<ProtectedRoute requiredRole="landlord"><LandlordProfile /></ProtectedRoute>} />

              {/* Tenant Routes */}
              <Route path="/tenant/dashboard" element={<ProtectedRoute requiredRole="tenant"><TenantDashboard /></ProtectedRoute>} />
              <Route path="/tenant/saved" element={<ProtectedRoute requiredRole="tenant"><SavedHouses /></ProtectedRoute>} />
              <Route path="/tenant/applications" element={<ProtectedRoute requiredRole="tenant"><Applications /></ProtectedRoute>} />
              <Route path="/tenant/messages" element={<ProtectedRoute requiredRole="tenant"><TenantMessages /></ProtectedRoute>} />
              <Route path="/tenant/profile" element={<ProtectedRoute requiredRole="tenant"><TenantProfile /></ProtectedRoute>} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
