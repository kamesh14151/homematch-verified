import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { Command, LogOut, LucideIcon, ShieldCheck } from "lucide-react";
import { BrandWordmark } from "@/components/BrandWordmark";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion } from "framer-motion";

interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  badge?: number;
}

interface DashboardLayoutProps {
  children: ReactNode;
  navItems: NavItem[];
  title: string;
  onLogout?: () => Promise<void> | void;
}

function DashboardSidebar({
  navItems,
  title,
  onLogout,
}: {
  navItems: NavItem[];
  title: string;
  onLogout?: () => Promise<void> | void;
}) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (onLogout) {
      await onLogout();
      return;
    }
    await signOut();
    navigate("/");
  };

  return (
    <TooltipProvider delayDuration={120}>
      <Sidebar
        collapsible="icon"
        className="border-r border-sidebar-border bg-sidebar text-sidebar-foreground shadow-[0_24px_60px_-40px_rgba(91,71,56,0.22)] dark:shadow-[0_24px_60px_-40px_rgba(0,0,0,0.65)]"
      >
        <SidebarContent className="bg-transparent">
          <SidebarGroup>
            <SidebarGroupLabel className="px-4 py-8">
              <Link
                to="/"
                className="flex items-center gap-3 transition-opacity hover:opacity-80"
              >
                {!collapsed && <BrandWordmark theme="light" compact />}
                {collapsed && (
                  <BrandWordmark
                    theme="light"
                    compact
                    className="[&>div:last-child]:hidden"
                  />
                )}
              </Link>
            </SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu>
                {!collapsed && (
                  <div className="px-4 py-4 mb-2">
                    <div className="relative overflow-hidden rounded-[1.3rem] border border-primary/10 bg-gradient-to-br from-white via-orange-50/90 to-stone-50 p-4 shadow-[0_18px_35px_-28px_rgba(91,71,56,0.22)] dark:border-primary/10 dark:bg-gradient-to-br dark:from-zinc-900 dark:via-zinc-900 dark:to-orange-950/20">
                      <div className="absolute inset-0 bg-white/55 backdrop-blur-[2px] dark:bg-zinc-950/35 z-0"></div>
                      <div className="relative z-10">
                        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-primary/10 bg-background px-3 py-1 text-[11px] font-bold uppercase tracking-[0.1em] text-primary shadow-sm dark:bg-zinc-900/90 dark:border-white/10">
                          <ShieldCheck className="h-3.5 w-3.5" /> {title} Panel
                        </div>
                        <p className="text-sm font-medium leading-relaxed text-slate-600 dark:text-zinc-300">
                          Simplified management <br /> and clear actions.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                <div className="px-3 gap-1 flex flex-col mt-2">
                  {navItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <SidebarMenuButton asChild>
                            <NavLink
                              to={item.url}
                              end
                              className="rounded-xl px-3 py-2.5 text-slate-500 transition-all hover:bg-white hover:text-slate-900 hover:shadow-sm dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
                              activeClassName="border border-primary/10 bg-white text-slate-900 shadow-[0_16px_28px_-24px_rgba(91,71,56,0.28)] font-semibold dark:border-primary/15 dark:bg-zinc-900 dark:text-white"
                            >
                              <span className="relative">
                                <item.icon className="mr-3 h-5 w-5" />
                                {!!item.badge && collapsed && (
                                  <span className="absolute -right-1 -top-1 flex h-2 w-2 items-center justify-center rounded-full bg-primary" />
                                )}
                              </span>
                              {!collapsed && (
                                <span className="flex flex-1 items-center justify-between text-[15px]">
                                  {item.title}
                                  {!!item.badge && (
                                    <span className="ml-2 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">
                                      {item.badge > 99 ? "99+" : item.badge}
                                    </span>
                                  )}
                                </span>
                              )}
                            </NavLink>
                          </SidebarMenuButton>
                        </TooltipTrigger>
                        {collapsed && (
                          <TooltipContent
                            side="right"
                            className="rounded-xl bg-slate-900 text-white border-0 font-medium z-50"
                          >
                            {item.title}
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </SidebarMenuItem>
                  ))}
                </div>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup className="mt-auto">
            <SidebarGroupContent>
              <SidebarMenu>
                <div className="px-3 mb-4">
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={handleLogout}
                      className="rounded-xl px-3 py-2.5 text-slate-500 transition-colors hover:bg-primary/8 hover:text-primary dark:text-zinc-400 dark:hover:bg-primary/10 dark:hover:text-primary"
                    >
                      <LogOut className="mr-3 h-5 w-5" />
                      {!collapsed && (
                        <span className="text-[15px] font-medium">Log out</span>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </div>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </TooltipProvider>
  );
}

export function DashboardLayout({
  children,
  navItems,
  title,
  onLogout,
}: DashboardLayoutProps) {
  const location = useLocation();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <DashboardSidebar
          navItems={navItems}
          title={title}
          onLogout={onLogout}
        />
        <div className="flex w-full flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-border bg-background/90 px-4 py-3 backdrop-blur-xl sm:px-6">
            <div className="flex items-center justify-between gap-3 rounded-full border border-border/60 bg-background/86 px-4 py-2.5 shadow-[0_14px_30px_-22px_rgba(91,71,56,0.3)] backdrop-blur-xl dark:border-white/10 dark:bg-card/86">
              <div className="flex items-center gap-3">
                <SidebarTrigger className="rounded-full text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white" />
                <div className="h-4 w-[1px] bg-slate-200 dark:bg-zinc-800" />
                <h1 className="text-sm font-semibold tracking-tight text-slate-900 dark:text-white sm:text-base">
                  {title}
                </h1>
              </div>

              <nav className="hidden items-center gap-1 rounded-full border border-border/60 bg-background/70 p-1 lg:flex dark:bg-zinc-900/70">
                {navItems.map((item) => {
                  const active = location.pathname === item.url;
                  return (
                    <Link
                      key={item.title}
                      to={item.url}
                      className={`relative overflow-hidden rounded-full px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] transition-all duration-300 ${
                        active
                          ? "text-foreground"
                          : "text-muted-foreground hover:bg-background/85 hover:text-foreground"
                      }`}
                    >
                      {active && (
                        <motion.span
                          layoutId="dashboard-nav-active-capsule"
                          transition={{ type: "spring", stiffness: 520, damping: 34 }}
                          className="absolute inset-0 rounded-full border border-primary/30 bg-primary/12 shadow-[0_10px_24px_-16px_rgba(255,126,87,0.55)]"
                        />
                      )}
                      <span className="relative z-10">{item.title}</span>
                      {!!item.badge && (
                        <span className="relative z-10 ml-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold text-primary-foreground">
                          {item.badge > 99 ? "99+" : item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>

              <div className="flex items-center gap-3">
                <ThemeToggle />
              </div>
            </div>
          </header>
          <main className="flex-1 p-4 sm:p-6 md:p-8 w-full max-w-[1400px] mx-auto">
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 w-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
