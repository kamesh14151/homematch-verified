import { Capacitor } from "@capacitor/core";
import { CalendarCheck2, Compass, Heart, MessageCircle, User2 } from "lucide-react";
import { useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

type AppTab = {
  label: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
};

const HIDE_PREFIXES = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/admin",
  "/property/",
];

const isTabActive = (pathname: string, to: string) => pathname === to || pathname.startsWith(`${to}/`);

export function MobileAppBottomNav() {
  const { pathname } = useLocation();
  const { user, userRole } = useAuth();

  const isNative = Capacitor.isNativePlatform();
  const isHiddenRoute = HIDE_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  const tabs = useMemo<AppTab[]>(() => {
    if (userRole === "landlord") {
      return [
        { label: "Explore", to: "/", icon: Compass },
        { label: "Listings", to: "/landlord/listings", icon: Heart },
        { label: "Requests", to: "/landlord/requests", icon: CalendarCheck2 },
        { label: "Messages", to: "/landlord/messages", icon: MessageCircle },
        { label: "Profile", to: "/landlord/profile", icon: User2 },
      ];
    }

    if (userRole === "tenant") {
      return [
        { label: "Explore", to: "/", icon: Compass },
        { label: "Saved", to: "/tenant/saved", icon: Heart },
        { label: "Trips", to: "/tenant/bookings", icon: CalendarCheck2 },
        { label: "Messages", to: "/tenant/messages", icon: MessageCircle },
        { label: "Profile", to: "/tenant/profile", icon: User2 },
      ];
    }

    return [
      { label: "Explore", to: "/", icon: Compass },
      { label: "Saved", to: "/login", icon: Heart },
      { label: "Trips", to: "/login", icon: CalendarCheck2 },
      { label: "Messages", to: "/login", icon: MessageCircle },
      { label: user ? "Profile" : "Login", to: user ? "/tenant/dashboard" : "/login", icon: User2 },
    ];
  }, [user, userRole]);

  const showBar = isNative && !isHiddenRoute;

  useEffect(() => {
    document.body.classList.toggle("app-bottom-nav-visible", showBar);
    return () => {
      document.body.classList.remove("app-bottom-nav-visible");
    };
  }, [showBar]);

  if (!showBar) return null;

  return (
    <nav
      aria-label="App bottom navigation"
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-slate-200/80 bg-white/95 backdrop-blur md:hidden dark:border-slate-700 dark:bg-slate-950/95"
      style={{ paddingBottom: "calc(var(--safe-area-bottom) + 0.5rem)" }}
    >
      <div className="mx-auto grid max-w-lg grid-cols-5 px-2 pt-2">
        {tabs.map((tab) => {
          const active = isTabActive(pathname, tab.to);
          const Icon = tab.icon;

          return (
            <Link
              key={`${tab.label}-${tab.to}`}
              to={tab.to}
              className={[
                "flex flex-col items-center gap-1 rounded-2xl px-1 py-2 text-[11px] font-medium transition-colors",
                active
                  ? "text-[#ff385c]"
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white",
              ].join(" ")}
            >
              <Icon className={[
                "h-[18px] w-[18px]",
                active ? "text-[#ff385c]" : "",
              ].join(" ")} />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
