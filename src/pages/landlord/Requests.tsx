import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  Home,
  PlusCircle,
  ListChecks,
  MessageSquare,
  UserCircle,
  Users,
} from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

const navItems = [
  { title: "Overview", url: "/landlord/dashboard", icon: Home },
  { title: "Add Property", url: "/landlord/add-property", icon: PlusCircle },
  { title: "My Listings", url: "/landlord/listings", icon: Building2 },
  { title: "Tenant Requests", url: "/landlord/requests", icon: ListChecks },
  { title: "Messages", url: "/landlord/messages", icon: MessageSquare },
  { title: "Profile", url: "/landlord/profile", icon: UserCircle },
];

export default function Requests() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<
    Array<{
      id: string;
      status: string;
      createdAt: string;
      propertyTitle: string;
      tenantName: string;
      latestMessage: string;
    }>
  >([]);

  const loadRequests = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const { data: properties } = await supabase
      .from("properties")
      .select("id, title")
      .eq("landlord_id", user.id);

    const propertyMap = new Map(
      (properties ?? []).map((item) => [item.id, item.title])
    );
    const propertyIds = (properties ?? []).map((item) => item.id);

    if (propertyIds.length === 0) {
      setRequests([]);
      setLoading(false);
      return;
    }

    const { data: applicationRows, error } = await supabase
      .from("applications")
      .select("id, property_id, tenant_id, status, message, created_at")
      .in("property_id", propertyIds)
      .order("updated_at", { ascending: false });

    if (error) {
      toast({
        title: "Unable to load requests",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    const tenantIds = Array.from(
      new Set((applicationRows ?? []).map((item) => item.tenant_id))
    );
    const { data: profileRows } = await supabase
      .from("profiles")
      .select("user_id, full_name")
      .in("user_id", tenantIds);

    const tenantMap = new Map(
      (profileRows ?? []).map((item) => [
        item.user_id,
        item.full_name || "Tenant",
      ])
    );

    setRequests(
      (applicationRows ?? []).map((item) => {
        const lines = (item.message ?? "").split("\n").filter(Boolean);
        const latestMessage =
          lines.length > 0 ? lines[lines.length - 1] : "No message yet";
        return {
          id: item.id,
          status: item.status,
          createdAt: new Date(item.created_at).toLocaleDateString("en-IN"),
          propertyTitle: propertyMap.get(item.property_id) || "Property",
          tenantName: tenantMap.get(item.tenant_id) || "Tenant",
          latestMessage,
        };
      })
    );
    setLoading(false);
  };

  useEffect(() => {
    void loadRequests();
  }, [user]);

  const pendingCount = useMemo(
    () => requests.filter((item) => item.status === "pending").length,
    [requests]
  );

  const handleStatusUpdate = async (
    applicationId: string,
    status: "approved" | "rejected"
  ) => {
    const { error } = await supabase
      .from("applications")
      .update({ status })
      .eq("id", applicationId);
    if (error) {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    toast({ title: `Request ${status}` });
    void loadRequests();
  };

  return (
    <DashboardLayout navItems={navItems} title="Landlord">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Tenant Requests</h1>
          <p className="text-muted-foreground">
            Review and manage tenant applications ({pendingCount} pending)
          </p>
        </div>

        {loading ? (
          <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground">
            Loading tenant requests...
          </div>
        ) : requests.length === 0 ? (
          <div className="rounded-lg border bg-card p-8 text-center">
            <Users className="mx-auto h-12 w-12 text-muted-foreground/30" />
            <h3 className="mt-4 font-semibold">No requests yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Tenant applications will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {requests.map((request) => (
              <Card key={request.id}>
                <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{request.tenantName}</p>
                      <Badge variant="secondary">{request.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {request.propertyTitle}
                    </p>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {request.latestMessage}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Requested on {request.createdAt}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" asChild>
                      <Link to={`/landlord/messages?app=${request.id}`}>
                        Open Chat
                      </Link>
                    </Button>
                    <Button
                      variant="default"
                      onClick={() => handleStatusUpdate(request.id, "approved")}
                      disabled={request.status === "approved"}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleStatusUpdate(request.id, "rejected")}
                      disabled={request.status === "rejected"}
                    >
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
