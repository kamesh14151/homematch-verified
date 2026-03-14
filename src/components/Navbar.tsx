import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Building2, LogOut, Menu, X } from "lucide-react";
import { BrandWordmark } from "@/components/BrandWordmark";
import { Button } from "@/components/ui/button";
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
    <nav data-native-topbar="true" className="sticky top-0 z-50 bg-[#0f2a5c] shadow-lg">
      <div className="container mx-auto flex h-16 items-center justify-between gap-3 px-4">
        <Link to="/" className="flex items-center gap-3">
          <BrandWordmark theme="dark" showTagline className="gap-2.5" />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-1 md:flex">
          <Link to="/" className="rounded-full px-3 py-2 text-sm font-semibold text-yellow-400 transition-colors hover:text-yellow-300">Home</Link>
          {navLinks.map((link) => (
            <a key={link.label} href={link.href} className="rounded-full px-3 py-2 text-sm font-medium text-white/80 transition-colors hover:text-white">
              {link.label}
            </a>
          ))}
          <Link to="/for-tenants" className="rounded-full px-3 py-2 text-sm font-medium text-white/80 transition-colors hover:text-white">For Tenants</Link>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <Button variant="ghost" size="sm" asChild className="text-white/80 hover:text-white hover:bg-white/10">
                <Link to={dashboardPath}><Building2 className="mr-2 h-4 w-4" />Dashboard</Link>
              </Button>
              <Button size="sm" onClick={handleSignOut} className="rounded-full bg-yellow-400 px-5 font-bold text-gray-900 hover:bg-yellow-500">
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild className="text-white/80 hover:text-white hover:bg-white/10">
                <Link to="/login">Login</Link>
              </Button>
              <Button size="sm" asChild className="rounded-full bg-yellow-400 px-5 font-bold text-gray-900 hover:bg-yellow-500">
                <Link to="/register">Login/Signup</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setMobileOpen(!mobileOpen)} className="rounded-full border border-white/15 bg-white/10 text-white hover:bg-white/20">
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="border-t border-white/10 bg-[#0f2a5c] px-4 pb-4 md:hidden">
          <div className="mt-3 flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur">
            <Link to="/" className="rounded-xl px-3 py-2 text-sm font-semibold text-yellow-400" onClick={() => setMobileOpen(false)}>Home</Link>
            {navLinks.map((link) => (
              <a key={link.label} href={link.href} className="rounded-xl px-3 py-2 text-sm font-medium text-white/80" onClick={() => setMobileOpen(false)}>{link.label}</a>
            ))}
            <Link to="/for-tenants" className="rounded-xl px-3 py-2 text-sm font-medium text-white/80" onClick={() => setMobileOpen(false)}>For Tenants</Link>
            {user ? (
              <>
                <Link to={dashboardPath} className="rounded-xl px-3 py-2 text-sm font-medium text-white/80" onClick={() => setMobileOpen(false)}>Dashboard</Link>
                <Button size="sm" onClick={handleSignOut} className="rounded-full bg-yellow-400 font-bold text-gray-900 hover:bg-yellow-500">Logout</Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild className="justify-start text-white/80 hover:text-white hover:bg-white/10">
                  <Link to="/login">Login</Link>
                </Button>
                <Button size="sm" asChild className="w-full rounded-full bg-yellow-400 font-bold text-gray-900 hover:bg-yellow-500">
                  <Link to="/register">Login/Signup</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
