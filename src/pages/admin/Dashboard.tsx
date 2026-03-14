import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  Building2,
  CheckCircle2,
  Home,
  ListChecks,
  MapPinned,
  MessageSquare,
  ShieldCheck,
  Shield,
  UserCheck,
  Users,
} from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import {
  DashboardHero,
  DashboardPanel,
  MiniInsight,
} from "@/components/dashboard-ui";
import {
  ChartLineInteractive,
  type LineTrendPoint,
} from "@/components/ChartLineInteractive";
import { ChartRadialStacked } from "@/components/ChartRadialStacked";
import { StatCard } from "@/components/StatCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { setAdminAuthenticated } from "@/lib/admin-auth";

const navItems = [
  { title: "Overview", url: "/admin/dashboard", icon: Home },
  { title: "Properties", url: "/admin/dashboard#properties", icon: Building2 },
  {
    title: "Applications",
    url: "/admin/dashboard#applications",
    icon: ListChecks,
  },
  { title: "Users", url: "/admin/dashboard#users", icon: Users },
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

type AdminUserOverview = {
  user_id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  role: string | null;
  auth_methods: string;
  created_at: string;
  last_sign_in_at: string | null;
  landlord_pan_verified: boolean | null;
  tenant_pan_verified: boolean | null;
  tenant_aadhaar_verified: boolean | null;
};

export default function AdminDashboard() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState<AdminProperty[]>([]);
  const [applications, setApplications] = useState<AdminApplication[]>([]);
  const [users, setUsers] = useState<AdminUserOverview[]>([]);
  const [landlordsCount, setLandlordsCount] = useState(0);
  const [tenantsCount, setTenantsCount] = useState(0);
  const [desktopUsers, setDesktopUsers] = useState(0);
  const [mobileUsers, setMobileUsers] = useState(0);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [usersSearch, setUsersSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [authMethodFilter, setAuthMethodFilter] = useState("all");
  const [joinedSort, setJoinedSort] = useState<"newest" | "oldest">("newest");

  const loadData = async () => {
    setLoading(true);

    const [
      propertiesResult,
      applicationsResult,
      landlordsResult,
      tenantsResult,
      usersResult,
    ] = await Promise.all([
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
      supabase.rpc("admin_users_overview"),
    ]);

    if (
      propertiesResult.error ||
      applicationsResult.error ||
      landlordsResult.error ||
      tenantsResult.error ||
      usersResult.error
    ) {
      toast({
        title: "Failed to load admin data",
        description:
          propertiesResult.error?.message ||
          applicationsResult.error?.message ||
          landlordsResult.error?.message ||
          tenantsResult.error?.message ||
          usersResult.error?.message ||
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
    setUsers((usersResult.data ?? []) as AdminUserOverview[]);
    setLandlordsCount(landlordsResult.count ?? 0);
    setTenantsCount(tenantsResult.count ?? 0);

    const since = new Date();
    since.setDate(since.getDate() - 30);

    const { data: deviceEvents, error: deviceError } = await supabase
      .from("analytics_pageviews")
      .select("device_type, session_id")
      .gte("created_at", since.toISOString())
      .limit(50000);

    if (deviceError) {
      setDesktopUsers(0);
      setMobileUsers(0);
    } else {
      const events = deviceEvents ?? [];
      const desktopSessions = new Set(
        events
          .filter((event) => event.device_type === "desktop")
          .map((event) => event.session_id)
      );
      const mobileSessions = new Set(
        events
          .filter((event) => event.device_type === "mobile")
          .map((event) => event.session_id)
      );

      setDesktopUsers(desktopSessions.size);
      setMobileUsers(mobileSessions.size);
    }

    setSelectedAddress(loadedProperties[0]?.address ?? "");
    setLoading(false);
  };

  useEffect(() => {
    void loadData();
  }, []);

  const verifiedProperties = useMemo(
    () => properties.filter((property) => property.is_verified).length,
    [properties]
  );

  const activeProperties = useMemo(
    () => properties.filter((property) => property.is_active ?? true).length,
    [properties]
  );

  const pendingApplications = useMemo(
    () =>
      applications.filter((application) => application.status === "pending")
        .length,
    [applications]
  );

  const approveRate = useMemo(() => {
    if (applications.length === 0) return "0%";
    const approved = applications.filter(
      (application) => application.status === "approved"
    ).length;
    return `${Math.round((approved / applications.length) * 100)}%`;
  }, [applications]);

  const adminMonthlyTrendData = useMemo<LineTrendPoint[]>(() => {
    const months: LineTrendPoint[] = [];
    const monthIndex = new Map<string, number>();
    const now = new Date();

    for (let offset = 5; offset >= 0; offset -= 1) {
      const date = new Date(now.getFullYear(), now.getMonth() - offset, 1);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      monthIndex.set(key, months.length);
      months.push({
        date: `${key}-01`,
        revenue: 0,
        applications: 0,
      });
    }

    properties.forEach((property) => {
      const created = new Date(property.created_at);
      const key = `${created.getFullYear()}-${String(created.getMonth() + 1).padStart(2, "0")}`;
      const index = monthIndex.get(key);
      if (index !== undefined) {
        months[index].revenue += 1;
      }
    });

    applications.forEach((application) => {
      const created = new Date(application.created_at);
      const key = `${created.getFullYear()}-${String(created.getMonth() + 1).padStart(2, "0")}`;
      const index = monthIndex.get(key);
      if (index !== undefined) {
        months[index].applications += 1;
      }
    });

    return months;
  }, [applications, properties]);

  const mapQuery = encodeURIComponent(selectedAddress || "India");

  const availableRoles = useMemo(() => {
    return Array.from(
      new Set(
        users
          .map((userRow) => userRow.role?.trim())
          .filter((role): role is string => Boolean(role))
      )
    ).sort((left, right) => left.localeCompare(right));
  }, [users]);

  const availableAuthMethods = useMemo(() => {
    const methods = new Set<string>();

    users.forEach((userRow) => {
      userRow.auth_methods
        .split(",")
        .map((method) => method.trim())
        .filter(Boolean)
        .forEach((method) => methods.add(method));
    });

    return Array.from(methods).sort((left, right) => left.localeCompare(right));
  }, [users]);

  const filteredUsers = useMemo(() => {
    const normalizedSearch = usersSearch.trim().toLowerCase();

    return [...users]
      .filter((userRow) => {
        if (!normalizedSearch) return true;

        const searchable = [
          userRow.full_name ?? "",
          userRow.email ?? "",
          userRow.user_id ?? "",
          userRow.phone ?? "",
        ]
          .join(" ")
          .toLowerCase();

        return searchable.includes(normalizedSearch);
      })
      .filter((userRow) => {
        if (roleFilter === "all") return true;
        return (userRow.role ?? "").toLowerCase() === roleFilter.toLowerCase();
      })
      .filter((userRow) => {
        if (authMethodFilter === "all") return true;

        const methods = userRow.auth_methods
          .split(",")
          .map((method) => method.trim().toLowerCase());

        return methods.includes(authMethodFilter.toLowerCase());
      })
      .sort((left, right) => {
        const leftDate = new Date(left.created_at).getTime();
        const rightDate = new Date(right.created_at).getTime();
        return joinedSort === "newest" ? rightDate - leftDate : leftDate - rightDate;
      });
  }, [authMethodFilter, joinedSort, roleFilter, users, usersSearch]);

  const togglePropertyField = async (
    propertyId: string,
    field: "is_verified" | "is_active",
    value: boolean
  ) => {
    const { error } = await supabase
      .from("properties")
      .update({ [field]: value })
      .eq("id", propertyId);

    if (error) {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setProperties((previous) =>
      previous.map((property) =>
        property.id === propertyId ? { ...property, [field]: value } : property
      )
    );
  };

  const updateApplicationStatus = async (
    applicationId: string,
    status: string
  ) => {
    const { error } = await supabase
      .from("applications")
      .update({ status })
      .eq("id", applicationId);

    if (error) {
      toast({
        title: "Status update failed",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setApplications((previous) =>
      previous.map((application) =>
        application.id === applicationId
          ? { ...application, status }
          : application
      )
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
        <DashboardHero
          eyebrow="Admin command center"
          title="Monitor verification, inventory health, and request queues in one place"
          description={
            pendingApplications > 0
              ? `There are ${pendingApplications} pending application${
                  pendingApplications === 1 ? "" : "s"
                } in the queue. Prioritize unverified listings and open requests first to keep the marketplace trusted.`
              : "Verification, inventory, and applications are in a steady state. Use this view to spot anomalies early and keep the marketplace clean."
          }
          accent="violet"
        >
          <div className="space-y-3 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/65">
              Platform health
            </p>
            <MiniInsight
              icon={ShieldCheck}
              title="Verification"
              value={`${verifiedProperties} verified`}
              tone="green"
            />
            <MiniInsight
              icon={BarChart3}
              title="Approval rate"
              value={approveRate}
              tone="blue"
            />
          </div>
        </DashboardHero>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Properties"
            value={properties.length}
            icon={Building2}
            description="All listed records"
          />
          <StatCard
            title="Landlords"
            value={landlordsCount}
            icon={Users}
            description="Registered owners"
          />
          <StatCard
            title="Tenants"
            value={tenantsCount}
            icon={UserCheck}
            description="Registered seekers"
          />
          <StatCard
            title="Applications"
            value={applications.length}
            icon={MessageSquare}
            trend={`${approveRate} approved`}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Verified Properties"
            value={verifiedProperties}
            icon={Shield}
          />
          <StatCard
            title="Active Listings"
            value={activeProperties}
            icon={CheckCircle2}
          />
          <StatCard
            title="Pending Requests"
            value={pendingApplications}
            icon={ListChecks}
          />
          <StatCard
            title="Platform Health"
            value={loading ? "..." : "Live"}
            icon={BarChart3}
            description="Realtime snapshot"
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.45fr_0.55fr]">
          <DashboardPanel
            title="Operational Priorities"
            description="Live summary of inventory and platform posture."
          >
            <div className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <MiniInsight
                  icon={Building2}
                  title="Inventory"
                  value={`${properties.length} listed assets`}
                  tone="blue"
                />
                <MiniInsight
                  icon={Users}
                  title="Supply side"
                  value={`${landlordsCount} landlords`}
                  tone="amber"
                />
                <MiniInsight
                  icon={UserCheck}
                  title="Demand side"
                  value={`${tenantsCount} tenants`}
                  tone="green"
                />
                <MiniInsight
                  icon={ListChecks}
                  title="Queue"
                  value={`${pendingApplications} pending`}
                  tone="blue"
                />
              </div>
              <ChartLineInteractive
                data={adminMonthlyTrendData}
                title="Platform Activity Trend"
                subtitle="Monthly properties and applications (last 6 months)"
                primaryLabel="Properties"
                secondaryLabel="Applications"
              />
            </div>
          </DashboardPanel>

          <DashboardPanel
            title="Admin Notes"
            description="What needs attention right now."
          >
            <div className="space-y-4">
              <ChartRadialStacked
                desktop={desktopUsers}
                mobile={mobileUsers}
                title="Desktop vs Mobile Users"
                subtitle="Last 30 days (tracked pageviews)"
              />
              <div className="space-y-3 rounded-2xl border border-slate-200/70 bg-slate-50 p-4 text-sm leading-7 text-muted-foreground dark:border-white/8 dark:bg-zinc-900/72 dark:text-zinc-300/85">
                <p>
                  Prioritize unverified inventory and pending requests first.
                  They are the highest-friction points in the funnel.
                </p>
                <p>
                  Use the map preview to inspect address quality quickly and
                  keep listing metadata clean.
                </p>
              </div>
            </div>
          </DashboardPanel>
        </div>

        <Card
          id="properties"
          className="border-border/70 bg-background/92 shadow-[0_18px_48px_-34px_rgba(91,71,56,0.24)] dark:border-white/8 dark:bg-zinc-950/88 dark:shadow-[0_30px_80px_-46px_rgba(0,0,0,0.92)]"
        >
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
                    <TableCell className="font-medium">
                      {property.title}
                    </TableCell>
                    <TableCell className="max-w-[280px] truncate">
                      {property.address}
                    </TableCell>
                    <TableCell>₹{property.rent.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge
                        variant={property.is_verified ? "default" : "secondary"}
                      >
                        {property.is_verified ? "Verified" : "Unverified"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          property.is_active ?? true ? "default" : "outline"
                        }
                      >
                        {property.is_active ?? true ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            togglePropertyField(
                              property.id,
                              "is_verified",
                              !property.is_verified
                            )
                          }
                        >
                          {property.is_verified ? "Unverify" : "Verify"}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            togglePropertyField(
                              property.id,
                              "is_active",
                              !(property.is_active ?? true)
                            )
                          }
                        >
                          {property.is_active ?? true
                            ? "Deactivate"
                            : "Activate"}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedAddress(property.address)}
                        >
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

        <Card
          id="applications"
          className="border-border/70 bg-background/92 shadow-[0_18px_48px_-34px_rgba(91,71,56,0.24)] dark:border-white/8 dark:bg-zinc-950/88 dark:shadow-[0_30px_80px_-46px_rgba(0,0,0,0.92)]"
        >
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
                    <TableCell className="font-mono text-xs">
                      {application.id.slice(0, 8)}...
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {application.property_id.slice(0, 8)}...
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {application.tenant_id.slice(0, 8)}...
                    </TableCell>
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
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            updateApplicationStatus(application.id, "approved")
                          }
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            updateApplicationStatus(application.id, "rejected")
                          }
                        >
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            updateApplicationStatus(application.id, "pending")
                          }
                        >
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

        <Card
          id="users"
          className="border-border/70 bg-background/92 shadow-[0_18px_48px_-34px_rgba(91,71,56,0.24)] dark:border-white/8 dark:bg-zinc-950/88 dark:shadow-[0_30px_80px_-46px_rgba(0,0,0,0.92)]"
        >
          <CardHeader>
            <CardTitle>Users Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
              <Input
                value={usersSearch}
                onChange={(event) => setUsersSearch(event.target.value)}
                placeholder="Search by name, email, phone, or user ID"
              />

              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All roles</SelectItem>
                  {availableRoles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={authMethodFilter} onValueChange={setAuthMethodFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by auth method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All auth methods</SelectItem>
                  {availableAuthMethods.map((method) => (
                    <SelectItem key={method} value={method}>
                      {method}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={joinedSort}
                onValueChange={(value) => setJoinedSort(value as "newest" | "oldest")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sort by joined date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Joined: Newest first</SelectItem>
                  <SelectItem value="oldest">Joined: Oldest first</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <p className="text-sm text-muted-foreground">
              Showing {Math.min(filteredUsers.length, 200)} of {filteredUsers.length} matched users ({users.length} total).
            </p>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Auth Method</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>KYC</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Last Sign In</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.slice(0, 200).map((userRow) => {
                  const kycStatus = userRow.role === "landlord"
                    ? userRow.landlord_pan_verified
                      ? "PAN verified"
                      : "PAN pending"
                    : userRow.role === "tenant"
                    ? userRow.tenant_pan_verified || userRow.tenant_aadhaar_verified
                      ? "KYC verified"
                      : "KYC pending"
                    : "N/A";

                  return (
                    <TableRow key={userRow.user_id}>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium">{userRow.full_name || "Unnamed user"}</p>
                          <p className="text-xs text-muted-foreground">{userRow.email}</p>
                          <p className="font-mono text-[10px] text-muted-foreground">
                            {userRow.user_id.slice(0, 8)}...
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {userRow.role || "unknown"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{userRow.auth_methods}</Badge>
                      </TableCell>
                      <TableCell>{userRow.phone || "—"}</TableCell>
                      <TableCell>{kycStatus}</TableCell>
                      <TableCell>
                        {new Date(userRow.created_at).toLocaleDateString("en-IN")}
                      </TableCell>
                      <TableCell>
                        {userRow.last_sign_in_at
                          ? new Date(userRow.last_sign_in_at).toLocaleDateString("en-IN")
                          : "Never"}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card
          id="map"
          className="border-border/70 bg-background/92 shadow-[0_18px_48px_-34px_rgba(91,71,56,0.24)] dark:border-white/8 dark:bg-zinc-950/88 dark:shadow-[0_30px_80px_-46px_rgba(0,0,0,0.92)]"
        >
          <CardHeader>
            <CardTitle>Location Map</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {selectedAddress
                ? `Showing: ${selectedAddress}`
                : "Select a property from moderation table to preview location."}
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
