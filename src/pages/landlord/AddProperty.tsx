import { useState } from "react";
import { Building2, Home, PlusCircle, ListChecks, MessageSquare, UserCircle } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

const navItems = [
  { title: "Overview", url: "/landlord/dashboard", icon: Home },
  { title: "Add Property", url: "/landlord/add-property", icon: PlusCircle },
  { title: "My Listings", url: "/landlord/listings", icon: Building2 },
  { title: "Tenant Requests", url: "/landlord/requests", icon: ListChecks },
  { title: "Messages", url: "/landlord/messages", icon: MessageSquare },
  { title: "Profile", url: "/landlord/profile", icon: UserCircle },
];

export default function AddProperty() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      toast({ title: "Property added!", description: "Your property has been listed successfully." });
      setLoading(false);
    }, 1000);
  };

  return (
    <DashboardLayout navItems={navItems} title="Landlord">
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Add New Property</h1>
          <p className="text-muted-foreground">Fill in the details to list your property</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Property Details</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label>Property Address</Label>
                  <Textarea placeholder="Full address of the property" required />
                </div>
                <div className="space-y-2">
                  <Label>PIN Code</Label>
                  <Input placeholder="600001" required />
                </div>
                <div className="space-y-2">
                  <Label>Monthly Rent (₹)</Label>
                  <Input type="number" placeholder="15000" required />
                </div>
                <div className="space-y-2">
                  <Label>House Type</Label>
                  <Select required>
                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1bhk">1 BHK</SelectItem>
                      <SelectItem value="2bhk">2 BHK</SelectItem>
                      <SelectItem value="3bhk">3 BHK</SelectItem>
                      <SelectItem value="4bhk">4 BHK</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>EB Bill Number</Label>
                  <Input placeholder="Electricity board bill number" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Description & Facilities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea placeholder="Describe the property, neighborhood, nearby facilities..." rows={4} />
                </div>
                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="water" />
                    <Label htmlFor="water">Water Supply</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="meter" />
                    <Label htmlFor="meter">Separate Electricity Meter</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="parking" />
                    <Label htmlFor="parking">Parking Available</Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Media</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Property Images</Label>
                  <Input type="file" accept="image/*" multiple />
                  <p className="text-xs text-muted-foreground">Upload up to 10 images (JPG, PNG)</p>
                </div>
                <div className="space-y-2">
                  <Label>Video URL</Label>
                  <Input placeholder="https://youtube.com/watch?v=..." />
                  <p className="text-xs text-muted-foreground">YouTube or direct video link</p>
                </div>
              </CardContent>
            </Card>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Publishing..." : "Publish Property"}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
