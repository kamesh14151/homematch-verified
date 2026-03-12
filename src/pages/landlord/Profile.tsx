import { Building2, Home, PlusCircle, ListChecks, MessageSquare, UserCircle, ShieldCheck } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { title: "Overview", url: "/landlord/dashboard", icon: Home },
  { title: "Add Property", url: "/landlord/add-property", icon: PlusCircle },
  { title: "My Listings", url: "/landlord/listings", icon: Building2 },
  { title: "Tenant Requests", url: "/landlord/requests", icon: ListChecks },
  { title: "Messages", url: "/landlord/messages", icon: MessageSquare },
  { title: "Profile", url: "/landlord/profile", icon: UserCircle },
];

export default function LandlordProfile() {
  const { user } = useAuth();

  return (
    <DashboardLayout navItems={navItems} title="Landlord">
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold">My Profile</h1>
          <p className="text-muted-foreground">Manage your landlord profile</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Personal Information</CardTitle>
              <Badge className="gap-1 bg-success text-success-foreground">
                <ShieldCheck className="h-3 w-3" /> PAN Verified
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input defaultValue={user?.user_metadata?.full_name || ""} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={user?.email || ""} disabled />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input placeholder="+91 98765 43210" />
            </div>
            <div className="space-y-2">
              <Label>PAN Number</Label>
              <Input placeholder="ABCDE1234F" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Address</Label>
              <Input placeholder="Your address" />
            </div>
            <div className="space-y-2">
              <Label>PIN Code</Label>
              <Input placeholder="600001" />
            </div>
          </CardContent>
        </Card>

        <Button className="w-full">Save Changes</Button>
      </div>
    </DashboardLayout>
  );
}
