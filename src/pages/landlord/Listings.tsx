import { Building2, Home, PlusCircle, ListChecks, MessageSquare, UserCircle } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const navItems = [
  { title: "Overview", url: "/landlord/dashboard", icon: Home },
  { title: "Add Property", url: "/landlord/add-property", icon: PlusCircle },
  { title: "My Listings", url: "/landlord/listings", icon: Building2 },
  { title: "Tenant Requests", url: "/landlord/requests", icon: ListChecks },
  { title: "Messages", url: "/landlord/messages", icon: MessageSquare },
  { title: "Profile", url: "/landlord/profile", icon: UserCircle },
];

export default function Listings() {
  return (
    <DashboardLayout navItems={navItems} title="Landlord">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">My Listings</h1>
            <p className="text-muted-foreground">Manage your property listings</p>
          </div>
          <Button asChild>
            <Link to="/landlord/add-property">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Property
            </Link>
          </Button>
        </div>

        <div className="rounded-lg border bg-card p-8 text-center">
          <Building2 className="mx-auto h-12 w-12 text-muted-foreground/30" />
          <h3 className="mt-4 font-semibold">No listings yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">Your published properties will appear here</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
