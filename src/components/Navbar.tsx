import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Building2, LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, userRole, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const dashboardPath = userRole === "landlord" ? "/landlord/dashboard" : "/tenant/dashboard";

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/80">
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
        <Link to="/" className="flex items-center gap-3">
          <img src="/1000130925-Photoroom.png" alt="RentVerify" className="h-9 w-9 rounded-lg object-contain" />
          <div>
            <span className="block font-bunderon text-lg leading-none">RentVerify</span>
            <span className="hidden text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground lg:block">
              Verified Rental Network
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-1 md:flex">
          <Link to="/" className="rounded-full px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-slate-100 dark:hover:bg-white/5">Home</Link>
          {navLinks.map((link) => (
            <a key={link.label} href={link.href} className="rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-slate-100 hover:text-foreground dark:hover:bg-white/5">
              {link.label}
            </a>
          ))}
          <Link to="/for-tenants" className="rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-slate-100 hover:text-foreground dark:hover:bg-white/5">For Tenants</Link>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          {user ? (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to={dashboardPath}>Dashboard</Link>
              </Button>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button size="sm" asChild className="rounded-full bg-[#3A7AFE] px-5 text-white hover:bg-[#2F65D8]">
                <Link to="/register">Get Started</Link>
              </Button>
              <Button size="sm" asChild className="rounded-full bg-green-600 text-white hover:bg-green-700 font-semibold gap-1.5">
                <Link to="/register"><Building2 className="h-3.5 w-3.5" /> Post Property FREE</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Button variant="ghost" size="icon" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="border-t bg-white px-4 pb-4 dark:bg-slate-950 md:hidden">
          <div className="flex flex-col gap-3 pt-3">
            <Link to="/" className="text-sm font-medium" onClick={() => setMobileOpen(false)}>Home</Link>
            {navLinks.map((link) => (
              <a key={link.label} href={link.href} className="text-sm font-medium" onClick={() => setMobileOpen(false)}>{link.label}</a>
            ))}
            <Link to="/for-tenants" className="text-sm font-medium" onClick={() => setMobileOpen(false)}>For Tenants</Link>
            {user ? (
              <>
                <Link to={dashboardPath} className="text-sm font-medium" onClick={() => setMobileOpen(false)}>Dashboard</Link>
                <Button variant="outline" size="sm" onClick={handleSignOut}>Logout</Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild><Link to="/login">Login</Link></Button>
                <Button size="sm" asChild className="bg-[#3A7AFE] text-white hover:bg-[#2F65D8]"><Link to="/register">Get Started</Link></Button>
                <Button size="sm" asChild className="bg-green-600 text-white hover:bg-green-700 font-semibold w-full"><Link to="/register"><Building2 className="mr-1.5 h-3.5 w-3.5" /> Post Property FREE</Link></Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
