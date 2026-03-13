import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  Building2,
  CheckCircle2,
  Home,
  ListChecks,
  MapPinned,
  MessageSquare,
  Shield,
  UserCheck,
  Users,
} from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StatCard } from "@/components/StatCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { setAdminAuthenticated } from "@/lib/admin-auth";

const navItems = [
  { title: "Overview", url: "/admin/dashboard", icon: Home },
  { title: "Properties", url: "/admin/dashboard#properties", icon: Building2 },
  { title: "Applications", url: "/admin/dashboard#applications", icon: ListChecks },
  { title: "Map", url: "/admin/dashboard#map", icon: MapPinned },
];

type AdminProperty = {
  id: string;
  title: string;
  address: string;
  rent: number;
  is_verified: boolean | null;
  is_active: boolean | null;
  created_at: string;
};

type AdminApplication = {
  id: string;
  property_id: string;
  tenant_id: string;
  status: string;
  created_at: string;
};

export default function AdminDashboard() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState<AdminProperty[]>([]);
  const [applications, setApplications] = useState<AdminApplication[]>([]);
  const [landlordsCount, setLandlordsCount] = useState(0);
  const [tenantsCount, setTenantsCount] = useState(0);
  const [selectedAddress, setSelectedAddress] = useState("");

  const loadData = async () => {
    setLoading(true);

    const [propertiesResult, applicationsResult, landlordsResult, tenantsResult] = await Promise.all([
      supabase
        .from("properties")
        .select("id, title, address, rent, is_verified, is_active, created_at")
        .order("created_at", { ascending: false })
        .limit(200),
      supabase
        .from("applications")
        .select("id, property_id, tenant_id, status, created_at")
        .order("created_at", { ascending: false })
        .limit(200),
      supabase.from("landlords").select("id", { count: "exact", head: true }),
      supabase.from("tenants").select("id", { count: "exact", head: true }),
    ]);

    if (propertiesResult.error || applicationsResult.error || landlordsResult.error || tenantsResult.error) {
      toast({
        title: "Failed to load admin data",
        description:
          propertiesResult.error?.message ||
          applicationsResult.error?.message ||
          landlordsResult.error?.message ||
          tenantsResult.error?.message ||
          "Please check permissions and try again.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    const loadedProperties = propertiesResult.data ?? [];
    const loadedApplications = applicationsResult.data ?? [];

    setProperties(loadedProperties);
    setApplications(loadedApplications);
    setLandlordsCount(landlordsResult.count ?? 0);
    setTenantsCount(tenantsResult.count ?? 0);
    setSelectedAddress(loadedProperties[0]?.address ?? "");
    setLoading(false);
  };

  useEffect(() => {
    void loadData();
  }, []);

  const verifiedProperties = useMemo(
    () => properties.filter((property) => property.is_verified).length,
    [properties],
  );

  const activeProperties = useMemo(
    () => properties.filter((property) => property.is_active ?? true).length,
    [properties],
  );

  const pendingApplications = useMemo(
    () => applications.filter((application) => application.status === "pending").length,
    [applications],
  );

  const approveRate = useMemo(() => {
    if (applications.length === 0) return "0%";
    const approved = applications.filter((application) => application.status === "approved").length;
    return `${Math.round((approved / applications.length) * 100)}%`;
  }, [applications]);

  const mapQuery = encodeURIComponent(selectedAddress || "India");

  const togglePropertyField = async (propertyId: string, field: "is_verified" | "is_active", value: boolean) => {
    const { error } = await supabase.from("properties").update({ [field]: value }).eq("id", propertyId);

    if (error) {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
      return;
    }

    setProperties((previous) =>
      previous.map((property) => (property.id === propertyId ? { ...property, [field]: value } : property)),
    );
  };

  const updateApplicationStatus = async (applicationId: string, status: string) => {
    const { error } = await supabase.from("applications").update({ status }).eq("id", applicationId);

    if (error) {
      toast({ title: "Status update failed", description: error.message, variant: "destructive" });
      return;
    }

    setApplications((previous) =>
      previous.map((application) =>
        application.id === applicationId ? { ...application, status } : application,
      ),
    );
  };

  return (
    <DashboardLayout
      navItems={navItems}
      title="Admin"
      onLogout={() => {
        setAdminAuthenticated(false);
        window.location.href = "/admin/login";
      }}
    >
      <div className="space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Platform control panel with live operational insights.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Total Properties" value={properties.length} icon={Building2} description="All listed records" />
          <StatCard title="Landlords" value={landlordsCount} icon={Users} description="Registered owners" />
          <StatCard title="Tenants" value={tenantsCount} icon={UserCheck} description="Registered seekers" />
          <StatCard title="Applications" value={applications.length} icon={MessageSquare} trend={`${approveRate} approved`} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Verified Properties" value={verifiedProperties} icon={Shield} />
          <StatCard title="Active Listings" value={activeProperties} icon={CheckCircle2} />
          <StatCard title="Pending Requests" value={pendingApplications} icon={ListChecks} />
          <StatCard title="Platform Health" value={loading ? "..." : "Live"} icon={BarChart3} description="Realtime snapshot" />
        </div>

        <Card id="properties">
          <CardHeader>
            <CardTitle>Property Moderation</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Property</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Rent</TableHead>
                  <TableHead>Verification</TableHead>
                  <TableHead>Listing State</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {properties.slice(0, 20).map((property) => (
                  <TableRow key={property.id}>
                    <TableCell className="font-medium">{property.title}</TableCell>
                    <TableCell className="max-w-[280px] truncate">{property.address}</TableCell>
                    <TableCell>₹{property.rent.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant={property.is_verified ? "default" : "secondary"}>
                        {property.is_verified ? "Verified" : "Unverified"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={property.is_active ?? true ? "default" : "outline"}>
                        {property.is_active ?? true ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => togglePropertyField(property.id, "is_verified", !property.is_verified)}
                        >
                          {property.is_verified ? "Unverify" : "Verify"}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => togglePropertyField(property.id, "is_active", !(property.is_active ?? true))}
                        >
                          {property.is_active ?? true ? "Deactivate" : "Activate"}
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setSelectedAddress(property.address)}>
                          Show on map
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card id="applications">
          <CardHeader>
            <CardTitle>Application Queue</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Application ID</TableHead>
                  <TableHead>Property ID</TableHead>
                  <TableHead>Tenant ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.slice(0, 20).map((application) => (
                  <TableRow key={application.id}>
                    <TableCell className="font-mono text-xs">{application.id.slice(0, 8)}...</TableCell>
                    <TableCell className="font-mono text-xs">{application.property_id.slice(0, 8)}...</TableCell>
                    <TableCell className="font-mono text-xs">{application.tenant_id.slice(0, 8)}...</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          application.status === "approved"
                            ? "default"
                            : application.status === "rejected"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {application.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => updateApplicationStatus(application.id, "approved")}>
                          Approve
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => updateApplicationStatus(application.id, "rejected")}>
                          Reject
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => updateApplicationStatus(application.id, "pending")}>
                          Reset
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card id="map">
          <CardHeader>
            <CardTitle>Location Map</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {selectedAddress ? `Showing: ${selectedAddress}` : "Select a property from moderation table to preview location."}
            </p>
            <div className="overflow-hidden rounded-xl border">
              <iframe
                title="Property Map"
                src={`https://maps.google.com/maps?q=${mapQuery}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                className="h-[420px] w-full"
                loading="lazy"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
