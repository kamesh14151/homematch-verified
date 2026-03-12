import { Search, Bookmark, FileText, MessageSquare, UserCircle } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";

const navItems = [
  { title: "Search Houses", url: "/tenant/dashboard", icon: Search },
  { title: "Saved Houses", url: "/tenant/saved", icon: Bookmark },
  { title: "Applications", url: "/tenant/applications", icon: FileText },
  { title: "Messages", url: "/tenant/messages", icon: MessageSquare },
  { title: "Profile", url: "/tenant/profile", icon: UserCircle },
];

export default function Applications() {
  return (
    <DashboardLayout navItems={navItems} title="Tenant">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">My Applications</h1>
          <p className="text-muted-foreground">Track your property applications</p>
        </div>
        <div className="rounded-lg border bg-card p-8 text-center">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground/30" />
          <h3 className="mt-4 font-semibold">No applications yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">Your submitted applications will appear here</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
