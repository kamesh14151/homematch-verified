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
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

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
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    address: "",
    pincode: "",
    rent: "",
    houseType: "",
    propertyType: "",
    bedrooms: "",
    bathrooms: "",
    superBuiltupArea: "",
    furnishing: "",
    listedBy: "Owner",
    floorNo: "",
    totalFloors: "",
    parkingSlots: "",
    facing: "",
    projectName: "",
    maintenance: "",
    ebBillNumber: "",
    description: "",
    videoUrl: "",
    waterSupply: false,
    separateMeter: false,
    parkingFacility: false,
  });

  const updateField = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((previous) => ({ ...previous, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ title: "Please log in", description: "Login as landlord to publish property.", variant: "destructive" });
      return;
    }

    if (!form.title || !form.address || !form.rent || !form.houseType) {
      toast({ title: "Missing required details", description: "Please fill title, address, rent and house type.", variant: "destructive" });
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from("properties")
      .insert({
        landlord_id: user.id,
        title: form.title,
        address: form.address,
        pincode: form.pincode || null,
        rent: Number(form.rent),
        house_type: form.houseType,
        eb_bill_number: form.ebBillNumber || null,
        description: form.description || null,
        video_url: form.videoUrl || null,
        water_supply: form.waterSupply,
        separate_meter: form.separateMeter,
        parking: form.parkingFacility,
        property_type: form.propertyType || null,
        bedrooms: form.bedrooms ? Number(form.bedrooms) : null,
        bathrooms: form.bathrooms ? Number(form.bathrooms) : null,
        super_builtup_area: form.superBuiltupArea ? Number(form.superBuiltupArea) : null,
        furnishing: form.furnishing || null,
        listed_by: form.listedBy || null,
        floor_no: form.floorNo ? Number(form.floorNo) : null,
        total_floors: form.totalFloors ? Number(form.totalFloors) : null,
        parking_slots: form.parkingSlots ? Number(form.parkingSlots) : null,
        facing: form.facing || null,
        project_name: form.projectName || null,
        maintenance_amount: form.maintenance ? Number(form.maintenance) : null,
      })
      .select("id")
      .single();

    if (error) {
      toast({ title: "Publish failed", description: error.message, variant: "destructive" });
      setLoading(false);
      return;
    }

    toast({ title: "Property published", description: "Your listing is now live." });
    setLoading(false);
    navigate(`/property/${data.id}`);
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
                  <Label>Property Title</Label>
                  <Input
                    placeholder="Rental for 2BHK Gated Community Apartment"
                    value={form.title}
                    onChange={(event) => updateField("title", event.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Property Address</Label>
                  <Textarea
                    placeholder="Full address used for Google Maps location"
                    value={form.address}
                    onChange={(event) => updateField("address", event.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>PIN Code</Label>
                  <Input
                    placeholder="600001"
                    value={form.pincode}
                    onChange={(event) => updateField("pincode", event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Monthly Rent (₹)</Label>
                  <Input
                    type="number"
                    placeholder="15000"
                    value={form.rent}
                    onChange={(event) => updateField("rent", event.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>House Type</Label>
                  <Select value={form.houseType} onValueChange={(value) => updateField("houseType", value)}>
                    <SelectTrigger><SelectValue placeholder="Select BHK" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1 BHK">1 BHK</SelectItem>
                      <SelectItem value="2 BHK">2 BHK</SelectItem>
                      <SelectItem value="3 BHK">3 BHK</SelectItem>
                      <SelectItem value="4 BHK">4 BHK</SelectItem>
                      <SelectItem value="4+ BHK">4+ BHK</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select value={form.propertyType} onValueChange={(value) => updateField("propertyType", value)}>
                    <SelectTrigger><SelectValue placeholder="Select property type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Flats / Apartments">Flats / Apartments</SelectItem>
                      <SelectItem value="Independent House / Villa">Independent House / Villa</SelectItem>
                      <SelectItem value="Builder Floor">Builder Floor</SelectItem>
                      <SelectItem value="Studio Apartment">Studio Apartment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Bedrooms</Label>
                  <Select value={form.bedrooms} onValueChange={(value) => updateField("bedrooms", value)}>
                    <SelectTrigger><SelectValue placeholder="Select bedrooms" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="4">4</SelectItem>
                      <SelectItem value="5">5+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Bathrooms</Label>
                  <Select value={form.bathrooms} onValueChange={(value) => updateField("bathrooms", value)}>
                    <SelectTrigger><SelectValue placeholder="Select bathrooms" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="4">4+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Super Built-up Area (sqft)</Label>
                  <Input
                    type="number"
                    placeholder="900"
                    value={form.superBuiltupArea}
                    onChange={(event) => updateField("superBuiltupArea", event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Furnishing</Label>
                  <Select value={form.furnishing} onValueChange={(value) => updateField("furnishing", value)}>
                    <SelectTrigger><SelectValue placeholder="Select furnishing" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Unfurnished">Unfurnished</SelectItem>
                      <SelectItem value="Semi-Furnished">Semi-Furnished</SelectItem>
                      <SelectItem value="Fully Furnished">Fully Furnished</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Listed By</Label>
                  <Select value={form.listedBy} onValueChange={(value) => updateField("listedBy", value)}>
                    <SelectTrigger><SelectValue placeholder="Select owner type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Owner">Owner</SelectItem>
                      <SelectItem value="Builder">Builder</SelectItem>
                      <SelectItem value="Agent">Agent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Floor No</Label>
                  <Input
                    type="number"
                    placeholder="1"
                    value={form.floorNo}
                    onChange={(event) => updateField("floorNo", event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Total Floors</Label>
                  <Input
                    type="number"
                    placeholder="5"
                    value={form.totalFloors}
                    onChange={(event) => updateField("totalFloors", event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Parking Slots</Label>
                  <Input
                    type="number"
                    placeholder="2"
                    value={form.parkingSlots}
                    onChange={(event) => updateField("parkingSlots", event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Facing</Label>
                  <Select value={form.facing} onValueChange={(value) => updateField("facing", value)}>
                    <SelectTrigger><SelectValue placeholder="Select facing" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="North">North</SelectItem>
                      <SelectItem value="South">South</SelectItem>
                      <SelectItem value="East">East</SelectItem>
                      <SelectItem value="West">West</SelectItem>
                      <SelectItem value="North-East">North-East</SelectItem>
                      <SelectItem value="North-West">North-West</SelectItem>
                      <SelectItem value="South-East">South-East</SelectItem>
                      <SelectItem value="South-West">South-West</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Project Name</Label>
                  <Input
                    placeholder="Mahaveer Palace"
                    value={form.projectName}
                    onChange={(event) => updateField("projectName", event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Maintenance (₹ / month)</Label>
                  <Input
                    type="number"
                    placeholder="2000"
                    value={form.maintenance}
                    onChange={(event) => updateField("maintenance", event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>EB Bill Number</Label>
                  <Input
                    placeholder="Electricity board bill number"
                    value={form.ebBillNumber}
                    onChange={(event) => updateField("ebBillNumber", event.target.value)}
                  />
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
                  <Textarea
                    placeholder="Describe the property, neighborhood, nearby facilities..."
                    rows={4}
                    value={form.description}
                    onChange={(event) => updateField("description", event.target.value)}
                  />
                </div>
                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="water" checked={form.waterSupply} onCheckedChange={(checked) => updateField("waterSupply", !!checked)} />
                    <Label htmlFor="water">Water Supply</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="meter" checked={form.separateMeter} onCheckedChange={(checked) => updateField("separateMeter", !!checked)} />
                    <Label htmlFor="meter">Separate Electricity Meter</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="parking" checked={form.parkingFacility} onCheckedChange={(checked) => updateField("parkingFacility", !!checked)} />
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
                  <Input
                    placeholder="https://youtube.com/watch?v=..."
                    value={form.videoUrl}
                    onChange={(event) => updateField("videoUrl", event.target.value)}
                  />
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
