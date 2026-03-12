import { Building2, Home, Users, MessageSquare, ListChecks, PlusCircle, UserCircle } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StatCard } from "@/components/StatCard";

const navItems = [
  { title: "Overview", url: "/landlord/dashboard", icon: Home },
  { title: "Add Property", url: "/landlord/add-property", icon: PlusCircle },
  { title: "My Listings", url: "/landlord/listings", icon: Building2 },
  { title: "Tenant Requests", url: "/landlord/requests", icon: ListChecks },
  { title: "Messages", url: "/landlord/messages", icon: MessageSquare },
  { title: "Profile", url: "/landlord/profile", icon: UserCircle },
];

export default function LandlordDashboard() {
  return (
    <DashboardLayout navItems={navItems} title="Landlord">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard Overview</h1>
          <p className="text-muted-foreground">Welcome back! Here's your property summary.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Properties" value={0} icon={Building2} description="Listed on platform" />
          <StatCard title="Active Listings" value={0} icon={Home} trend="+0 this month" />
          <StatCard title="Pending Requests" value={0} icon={Users} description="Tenant applications" />
          <StatCard title="Messages" value={0} icon={MessageSquare} description="Unread messages" />
        </div>

        <div className="rounded-lg border bg-card p-8 text-center">
          <Building2 className="mx-auto h-12 w-12 text-muted-foreground/30" />
          <h3 className="mt-4 font-semibold">No properties listed yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">Start by adding your first property listing</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
