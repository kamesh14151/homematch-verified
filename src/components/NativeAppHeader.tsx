import { Capacitor } from "@capacitor/core";
import { ArrowLeft, Search } from "lucide-react";
import { useEffect, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

const HIDE_PREFIXES = ["/login", "/register", "/forgot-password", "/reset-password", "/admin"];

const getTitle = (pathname: string) => {
  if (pathname === "/") return "Explore";
  if (pathname.startsWith("/property/") && pathname.endsWith("/book")) return "Booking";
  if (pathname.startsWith("/property/")) return "Property";
  if (pathname.startsWith("/tenant/saved")) return "Saved";
  if (pathname.startsWith("/tenant/bookings")) return "Trips";
  if (pathname.startsWith("/tenant/messages") || pathname.startsWith("/landlord/messages")) return "Messages";
  if (pathname.startsWith("/tenant/profile") || pathname.startsWith("/landlord/profile")) return "Profile";
  if (pathname.startsWith("/tenant/applications")) return "Applications";
  if (pathname.startsWith("/tenant/dashboard") || pathname.startsWith("/landlord/dashboard")) return "Dashboard";
  if (pathname.startsWith("/landlord/listings")) return "Listings";
  if (pathname.startsWith("/landlord/requests")) return "Requests";
  if (pathname.startsWith("/landlord/add-property")) return "Add Property";
  if (pathname.startsWith("/for-tenants")) return "For Tenants";
  if (pathname.startsWith("/for-owners")) return "For Owners";
  if (pathname.startsWith("/about-us")) return "About";
  return "RentVerify";
};

export function NativeAppHeader() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const isNative = Capacitor.isNativePlatform();
  const isHiddenRoute = HIDE_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  const showHeader = isNative && !isHiddenRoute;

  const title = useMemo(() => getTitle(pathname), [pathname]);
  const isRootLike = pathname === "/" || pathname.endsWith("/dashboard");

  useEffect(() => {
    document.body.classList.toggle("app-top-header-visible", showHeader);
    document.body.setAttribute("data-app-route", pathname);

    return () => {
      document.body.classList.remove("app-top-header-visible");
      document.body.removeAttribute("data-app-route");
    };
  }, [pathname, showHeader]);

  if (!showHeader) return null;

  return (
    <header
      className="fixed inset-x-0 top-0 z-[70] border-b border-slate-200/80 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95"
      style={{ paddingTop: "var(--safe-area-top)" }}
    >
      <div className="mx-auto flex h-14 max-w-lg items-center justify-between px-3">
        <div className="flex items-center gap-2">
          {isRootLike ? (
            <Button variant="ghost" size="icon" asChild className="h-9 w-9 rounded-full">
              <Link to="/" aria-label="Home">
                <Search className="h-4 w-4" />
              </Link>
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="h-9 w-9 rounded-full"
              aria-label="Go back"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <p className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-100">{title}</p>
        </div>

        <ThemeToggle />
      </div>
    </header>
  );
}