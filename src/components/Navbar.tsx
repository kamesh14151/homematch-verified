import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Building2,
  Home,
  LogOut,
  Menu,
  UserPlus,
  X,
  User,
  LayoutDashboard,
  Globe,
} from "lucide-react";
import { BrandWordmark } from "@/components/BrandWordmark";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navLinks = [
  { label: "For Tenants", href: "/for-tenants", type: "route" as const },
  { label: "For Owners", href: "/for-owners", type: "route" as const },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, userRole, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const dashboardPath =
    userRole === "landlord" ? "/landlord/dashboard" : "/tenant/dashboard";

  const isHome = location.pathname === "/";
  const isFloatingHomeNav = isHome && !scrolled;
  const isDarkHomeNav = isHome && scrolled;
  const navBg = isFloatingHomeNav
    ? "border-b border-transparent bg-background/55 backdrop-blur-xl supports-[backdrop-filter]:bg-background/45"
    : isDarkHomeNav
    ? "border-b border-white/10 bg-zinc-950/82 shadow-[0_24px_54px_-34px_rgba(0,0,0,0.82)] backdrop-blur-xl"
    : "border-b border-border/60 bg-background/88 shadow-[0_20px_46px_-34px_rgba(91,71,56,0.34)] backdrop-blur-xl supports-[backdrop-filter]:bg-background/76";
  const textColor = isFloatingHomeNav
    ? "text-foreground/78 hover:text-foreground"
    : isDarkHomeNav
    ? "text-white/85 hover:text-white"
    : "text-foreground";
  const brandTheme = isDarkHomeNav ? "dark" : "light";
  const navPillClasses = isFloatingHomeNav
    ? "border border-border/60 bg-background/72 shadow-[0_14px_28px_-22px_rgba(91,71,56,0.3)] backdrop-blur-xl dark:bg-card/82"
    : isDarkHomeNav
    ? "border border-white/15 bg-white/5 shadow-[0_14px_34px_-24px_rgba(0,0,0,0.7)] backdrop-blur-xl"
    : "border border-border/60 bg-background/88 shadow-[0_14px_30px_-22px_rgba(91,71,56,0.3)] backdrop-blur-xl dark:bg-card/90";
  const navLinkBase = isFloatingHomeNav
    ? "text-foreground/70 hover:text-foreground"
    : isDarkHomeNav
    ? "text-white/72 hover:text-white"
    : "text-foreground/75 hover:text-foreground";
  const navHeight = isFloatingHomeNav ? "h-[5.25rem]" : "h-[4.75rem]";
  const brandScale = isFloatingHomeNav ? "scale-110" : "scale-100";
  const navPillMotion = isFloatingHomeNav
    ? "scale-100 translate-y-0 px-0"
    : "scale-[0.96] -translate-y-0.5 px-1";
  const actionClusterMotion = isFloatingHomeNav
    ? "scale-100 translate-y-0"
    : "scale-[0.97] -translate-y-0.5";
  const desktopNavItems = [{ label: "Home", href: "/" }, ...navLinks];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}>
      <div
        className={`container mx-auto flex items-center justify-between gap-4 px-4 transition-all duration-300 sm:px-6 md:px-8 lg:px-10 ${navHeight}`}
      >
        {/* Brand / Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 transition-opacity hover:opacity-90"
          aria-label="RentVerify home"
        >
          <BrandWordmark
            theme={brandTheme}
            showTagline={false}
            className={`gap-2.5 transition-transform duration-300 ${brandScale}`}
          />
        </Link>

        {/* Desktop Nav Links (Center) */}
        <div
          className={`hidden absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform-gpu lg:flex items-center gap-1.5 rounded-full p-1 transition-all duration-300 ${navPillClasses} ${navPillMotion}`}
        >
          {desktopNavItems.map((link) => {
            const active = location.pathname === link.href;
            return (
              <Link
                key={link.label}
                to={link.href}
                className={`relative overflow-hidden rounded-full px-5 py-2 text-[13px] font-semibold tracking-[0.01em] transition-all duration-300 ${
                  active
                    ? isDarkHomeNav
                      ? "text-white"
                      : "text-foreground"
                    : `${navLinkBase} ${
                        isDarkHomeNav ? "hover:bg-white/10" : "hover:bg-background/60"
                      }`
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="public-nav-active-capsule"
                    transition={{ type: "spring", stiffness: 520, damping: 34 }}
                    className={`absolute inset-0 rounded-full ${
                      isDarkHomeNav
                        ? "border border-white/25 bg-white/14"
                        : "border border-primary/30 bg-primary/12 shadow-[0_10px_26px_-16px_rgba(255,126,87,0.6)]"
                    }`}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </Link>
            );
          })}
        </div>

        {/* User Account / Auth Actions (Right) */}
        <div className={`hidden items-center gap-3 transition-all duration-300 md:flex ${actionClusterMotion}`}>
          <Button
            className="hidden rounded-full px-5 text-[13px] font-semibold tracking-[0.01em] shadow-sm md:flex"
          >
            List your property
          </Button>
          <div
            className={`flex items-center gap-2 rounded-full p-1 pr-2 pl-3 shadow-[0_10px_24px_-18px_rgba(91,71,56,0.32)] transition-all duration-300 hover:shadow-md ${
              isDarkHomeNav
                ? "border border-white/15 bg-white/10"
                : "border border-border/60 bg-background/86 dark:bg-card/86"
            }`}
          >
            <Menu
              className={`mr-1 h-4 w-4 ${
                isDarkHomeNav ? "text-white/75" : "text-muted-foreground"
              }`}
            />
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`h-8 w-8 rounded-full p-0 focus-visible:ring-0 cursor-pointer ${
                      isDarkHomeNav
                        ? "bg-white/16 text-white hover:bg-white/20"
                        : "bg-secondary text-foreground"
                    }`}
                  >
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 rounded-2xl p-2 mt-2"
                >
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        Account
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    asChild
                    className="rounded-xl cursor-pointer"
                  >
                    <Link
                      to={dashboardPath}
                      className="flex items-center gap-2"
                    >
                      <LayoutDashboard className="h-4 w-4" /> Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="rounded-xl cursor-pointer text-red-600 focus:text-red-700"
                    onClick={handleSignOut}
                  >
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`h-8 w-8 rounded-full p-0 focus-visible:ring-0 cursor-pointer ${
                      isDarkHomeNav
                        ? "bg-white/16 text-white hover:bg-white/20"
                        : "bg-secondary text-foreground"
                    }`}
                  >
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 rounded-2xl p-2 mt-2"
                >
                  <DropdownMenuItem
                    asChild
                    className="rounded-xl cursor-pointer font-bold"
                  >
                    <Link to="/register">Sign up</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    asChild
                    className="rounded-xl cursor-pointer"
                  >
                    <Link to="/login">Log in</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    asChild
                    className="rounded-xl cursor-pointer"
                  >
                    <Link to="/for-owners">List your property</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    asChild
                    className="rounded-xl cursor-pointer"
                  >
                    <Link to="/for-tenants">Help Center</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-3 md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`rounded-full ${textColor} ${
              isFloatingHomeNav ? "hover:bg-background/75" : "hover:bg-muted/20"
            }`}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="absolute top-full left-0 right-0 border-b border-border/70 bg-background/95 px-4 pb-6 pt-2 shadow-xl backdrop-blur-xl md:hidden">
          <div className="flex flex-col space-y-1.5 rounded-2xl border border-border/70 bg-card/70 p-2">
            <Link
              to="/"
              className={`rounded-xl px-4 py-3 text-[15px] font-semibold tracking-tight transition-colors ${
                location.pathname === "/"
                  ? "bg-primary/12 text-foreground"
                  : "text-foreground hover:bg-muted"
              }`}
              onClick={() => setMobileOpen(false)}
            >
              Home
            </Link>
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className={`rounded-xl px-4 py-3 text-[15px] font-semibold tracking-tight transition-colors ${
                  location.pathname === link.href
                    ? "bg-primary/12 text-foreground"
                    : "text-foreground hover:bg-muted"
                }`}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="my-2 border-t border-border" />
            {user ? (
              <>
                <Link
                  to={dashboardPath}
                  className={`rounded-xl px-4 py-3 text-[15px] font-semibold tracking-tight transition-colors ${
                    location.pathname === dashboardPath
                      ? "bg-primary/12 text-foreground"
                      : "text-foreground hover:bg-muted"
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleSignOut();
                    setMobileOpen(false);
                  }}
                  className="rounded-xl px-4 py-3 text-left text-[15px] font-semibold tracking-tight text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`rounded-xl px-4 py-3 text-[15px] font-semibold tracking-tight transition-colors ${
                    location.pathname === "/login"
                      ? "bg-primary/12 text-foreground"
                      : "text-foreground hover:bg-muted"
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className={`rounded-xl px-4 py-3 text-[15px] font-semibold tracking-tight transition-colors ${
                    location.pathname === "/register"
                      ? "bg-primary/12 text-foreground"
                      : "text-foreground hover:bg-muted"
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
