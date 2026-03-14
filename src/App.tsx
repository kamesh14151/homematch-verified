import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AdminRoute } from "@/components/AdminRoute";
import { DeviceAnalyticsTracker } from "@/components/DeviceAnalyticsTracker";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import PropertyDetail from "./pages/PropertyDetail";
import {
  AboutAJStudiozPage,
  AboutUsPage,
  ArticlesPage,
  CareersPage,
  CompanyPage,
  ContactUsPage,
  ForOwnersPage,
  ForTenantsPage,
  OurServicesPage,
  PostPropertyFreePage,
  PriceTrendsPage,
  PrivacyPolicyPage,
  SafetyGuidePage,
  SitemapPage,
  TermsAndConditionsPage,
} from "./pages/InfoPages";

import LandlordDashboard from "./pages/landlord/Dashboard";
import AddProperty from "./pages/landlord/AddProperty";
import Listings from "./pages/landlord/Listings";
import Requests from "./pages/landlord/Requests";
import LandlordMessages from "./pages/landlord/Messages";
import LandlordProfile from "./pages/landlord/Profile";

import TenantDashboard from "./pages/tenant/Dashboard";
import SavedHouses from "./pages/tenant/SavedHouses";
import Applications from "./pages/tenant/Applications";
import MyBookings from "./pages/tenant/MyBookings";
import TenantMessages from "./pages/tenant/Messages";
import TenantProfile from "./pages/tenant/Profile";
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import PropertyBooking from "./pages/PropertyBooking";
import SearchResults from "./pages/SearchResults";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <DeviceAnalyticsTracker />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/property/:id" element={<PropertyDetail />} />
              <Route path="/property/:id/book" element={<PropertyBooking />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/for-tenants" element={<ForTenantsPage />} />
              <Route path="/for-owners" element={<ForOwnersPage />} />
              <Route path="/about-us" element={<AboutUsPage />} />
              <Route path="/our-services" element={<OurServicesPage />} />
              <Route path="/price-trends" element={<PriceTrendsPage />} />
              <Route
                path="/post-property-free"
                element={<PostPropertyFreePage />}
              />
              <Route path="/articles" element={<ArticlesPage />} />
              <Route path="/sitemap" element={<SitemapPage />} />
              <Route path="/company" element={<CompanyPage />} />
              <Route
                path="/about-aj-studioz"
                element={<AboutAJStudiozPage />}
              />
              <Route path="/contact-us" element={<ContactUsPage />} />
              <Route path="/careers" element={<CareersPage />} />
              <Route
                path="/terms-conditions"
                element={<TermsAndConditionsPage />}
              />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/safety-guide" element={<SafetyGuidePage />} />

              {/* Landlord Routes */}
              <Route
                path="/landlord/dashboard"
                element={
                  <ProtectedRoute requiredRole="landlord">
                    <LandlordDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/landlord/add-property"
                element={
                  <ProtectedRoute requiredRole="landlord">
                    <AddProperty />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/landlord/listings"
                element={
                  <ProtectedRoute requiredRole="landlord">
                    <Listings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/landlord/requests"
                element={
                  <ProtectedRoute requiredRole="landlord">
                    <Requests />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/landlord/messages"
                element={
                  <ProtectedRoute requiredRole="landlord">
                    <LandlordMessages />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/landlord/profile"
                element={
                  <ProtectedRoute requiredRole="landlord">
                    <LandlordProfile />
                  </ProtectedRoute>
                }
              />

              {/* Tenant Routes */}
              <Route
                path="/tenant/dashboard"
                element={
                  <ProtectedRoute requiredRole="tenant">
                    <TenantDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tenant/saved"
                element={
                  <ProtectedRoute requiredRole="tenant">
                    <SavedHouses />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tenant/applications"
                element={
                  <ProtectedRoute requiredRole="tenant">
                    <Applications />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tenant/bookings"
                element={
                  <ProtectedRoute requiredRole="tenant">
                    <MyBookings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tenant/messages"
                element={
                  <ProtectedRoute requiredRole="tenant">
                    <TenantMessages />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tenant/profile"
                element={
                  <ProtectedRoute requiredRole="tenant">
                    <TenantProfile />
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin/dashboard"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
