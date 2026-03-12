import { Search, Bookmark, FileText, MessageSquare, UserCircle, Home } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StatCard } from "@/components/StatCard";

const navItems = [
  { title: "Search Houses", url: "/tenant/dashboard", icon: Search },
  { title: "Saved Houses", url: "/tenant/saved", icon: Bookmark },
  { title: "Applications", url: "/tenant/applications", icon: FileText },
  { title: "Messages", url: "/tenant/messages", icon: MessageSquare },
  { title: "Profile", url: "/tenant/profile", icon: UserCircle },
];

export default function TenantDashboard() {
  return (
    <DashboardLayout navItems={navItems} title="Tenant">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Find Your Perfect Home</h1>
          <p className="text-muted-foreground">Browse verified rental properties</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Properties Available" value={0} icon={Home} />
          <StatCard title="Saved Houses" value={0} icon={Bookmark} />
          <StatCard title="Applications" value={0} icon={FileText} />
          <StatCard title="Messages" value={0} icon={MessageSquare} />
        </div>

        <div className="rounded-lg border bg-card p-8 text-center">
          <Search className="mx-auto h-12 w-12 text-muted-foreground/30" />
          <h3 className="mt-4 font-semibold">Start searching for properties</h3>
          <p className="mt-1 text-sm text-muted-foreground">Use filters to find houses that match your preferences</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
