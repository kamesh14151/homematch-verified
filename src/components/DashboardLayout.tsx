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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
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
      <Sidebar collapsible="icon" className="border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
        <SidebarContent className="bg-transparent">
          <SidebarGroup>
            <SidebarGroupLabel className="px-4 py-4">
              <Link to="/" className="flex items-center gap-3">
                {!collapsed && (
                  <BrandWordmark theme="dark" compact />
                )}
                {collapsed && <BrandWordmark theme="dark" compact className="[&>div:last-child]:hidden" />}
              </Link>
            </SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu>
                {!collapsed && (
                  <div className="px-4 py-3">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                      <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#f1c40f]/20 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#f1c40f]">
                        <ShieldCheck className="h-3 w-3" /> {title} workspace
                      </div>
                      <p className="text-sm leading-6 text-white/70">Unified operations, brand-safe workflows, and cleaner decision making.</p>
                    </div>
                  </div>
                )}
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <SidebarMenuButton asChild>
                          <NavLink
                            to={item.url}
                            end
                            className="rounded-xl text-white/72 hover:bg-white/8 hover:text-white"
                            activeClassName="bg-[#f1c40f] text-[#171717] shadow-sm font-medium"
                          >
                            <item.icon className="mr-2 h-4 w-4" />
                            {!collapsed && <span>{item.title}</span>}
                          </NavLink>
                        </SidebarMenuButton>
                      </TooltipTrigger>
                      {collapsed && <TooltipContent side="right">{item.title}</TooltipContent>}
                    </Tooltip>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup className="mt-auto">
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SidebarMenuButton
                        onClick={handleLogout}
                        className="rounded-xl text-white/60 hover:bg-white/8 hover:text-white"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        {!collapsed && <span>Logout</span>}
                      </SidebarMenuButton>
                    </TooltipTrigger>
                    {collapsed && <TooltipContent side="right">Logout</TooltipContent>}
                  </Tooltip>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </TooltipProvider>
  );
}

export function DashboardLayout({ children, navItems, title, onLogout }: DashboardLayoutProps) {
  const location = useLocation();
  const activeItem = navItems.find((item) => location.pathname === item.url || `${location.pathname}${location.hash}` === item.url);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-[radial-gradient(circle_at_top,_rgba(0,51,102,0.08),_transparent_32%),linear-gradient(180deg,_rgba(255,255,255,1)_0%,_rgba(249,249,249,0.94)_100%)] dark:bg-[radial-gradient(circle_at_top,_rgba(241,196,15,0.08),_transparent_24%),linear-gradient(180deg,_rgba(11,23,38,1)_0%,_rgba(16,30,47,0.98)_100%)]">
        <DashboardSidebar navItems={navItems} title={title} onLogout={onLogout} />
        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-background/92 px-4 backdrop-blur-xl sm:px-6">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">{title}</div>
                <div className="text-sm font-semibold text-foreground">{activeItem?.title ?? "Overview"}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm lg:flex">
                <Command className="h-3.5 w-3.5" /> Dashboard system
              </div>
              <ThemeToggle />
            </div>
          </header>
          <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
