import { Search, Bookmark, FileText, MessageSquare, UserCircle } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { title: "Search Houses", url: "/tenant/dashboard", icon: Search },
  { title: "Saved Houses", url: "/tenant/saved", icon: Bookmark },
  { title: "Applications", url: "/tenant/applications", icon: FileText },
  { title: "Messages", url: "/tenant/messages", icon: MessageSquare },
  { title: "Profile", url: "/tenant/profile", icon: UserCircle },
];

export default function TenantProfile() {
  const { user } = useAuth();

  return (
    <DashboardLayout navItems={navItems} title="Tenant">
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold">My Profile</h1>
          <p className="text-muted-foreground">Manage your tenant profile and preferences</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Personal Information</CardTitle>
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
              <Label>Occupation</Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Select occupation" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="government">Government Employee</SelectItem>
                  <SelectItem value="bank">Bank Employee</SelectItem>
                  <SelectItem value="corporate">Corporate Employee</SelectItem>
                  <SelectItem value="self-employed">Self Employed</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Company / Organization</Label>
              <Input placeholder="TCS, Wipro, SBI..." />
            </div>
            <div className="space-y-2">
              <Label>Family Members</Label>
              <Input type="number" placeholder="3" min={1} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Preferences</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Expected Rent (₹)</Label>
              <Input type="number" placeholder="15000" />
            </div>
            <div className="space-y-2">
              <Label>Preferred House Type</Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1bhk">1 BHK</SelectItem>
                  <SelectItem value="2bhk">2 BHK</SelectItem>
                  <SelectItem value="3bhk">3 BHK</SelectItem>
                  <SelectItem value="4bhk">4 BHK</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Preferred Location / PIN Code</Label>
              <Input placeholder="Location or PIN code" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Documents</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>ID Proof</Label>
              <Input type="file" accept=".pdf,.jpg,.png" />
              <p className="text-xs text-muted-foreground">Encrypted & auto-deleted after 30 days</p>
            </div>
            <div className="space-y-2">
              <Label>Employment Proof</Label>
              <Input type="file" accept=".pdf,.jpg,.png" />
              <p className="text-xs text-muted-foreground">Encrypted & auto-deleted after 30 days</p>
            </div>
          </CardContent>
        </Card>

        <Button className="w-full">Save Profile</Button>
      </div>
    </DashboardLayout>
  );
}
