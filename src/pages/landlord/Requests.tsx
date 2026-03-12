import { Building2, Home, PlusCircle, ListChecks, MessageSquare, UserCircle, Users } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";

const navItems = [
  { title: "Overview", url: "/landlord/dashboard", icon: Home },
  { title: "Add Property", url: "/landlord/add-property", icon: PlusCircle },
  { title: "My Listings", url: "/landlord/listings", icon: Building2 },
  { title: "Tenant Requests", url: "/landlord/requests", icon: ListChecks },
  { title: "Messages", url: "/landlord/messages", icon: MessageSquare },
  { title: "Profile", url: "/landlord/profile", icon: UserCircle },
];

export default function Requests() {
  return (
    <DashboardLayout navItems={navItems} title="Landlord">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Tenant Requests</h1>
          <p className="text-muted-foreground">Review and manage tenant applications</p>
        </div>

        <div className="rounded-lg border bg-card p-8 text-center">
          <Users className="mx-auto h-12 w-12 text-muted-foreground/30" />
          <h3 className="mt-4 font-semibold">No requests yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">Tenant applications will appear here</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
