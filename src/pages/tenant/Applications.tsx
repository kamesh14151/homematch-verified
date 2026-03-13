import { useEffect, useState } from "react";
import { Search, Bookmark, FileText, MessageSquare, UserCircle } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

const navItems = [
  { title: "Search Houses", url: "/tenant/dashboard", icon: Search },
  { title: "Saved Houses", url: "/tenant/saved", icon: Bookmark },
  { title: "Applications", url: "/tenant/applications", icon: FileText },
  { title: "Messages", url: "/tenant/messages", icon: MessageSquare },
  { title: "Profile", url: "/tenant/profile", icon: UserCircle },
];

export default function Applications() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<
    Array<{ id: string; propertyTitle: string; status: string; createdAt: string; latestMessage: string }>
  >([]);

  useEffect(() => {
    const loadApplications = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      const { data: rows } = await supabase
        .from("applications")
        .select("id, property_id, status, message, created_at")
        .eq("tenant_id", user.id)
        .order("updated_at", { ascending: false });

      const propertyIds = (rows ?? []).map((item) => item.property_id);
      const { data: properties } = await supabase
        .from("properties")
        .select("id, title")
        .in("id", propertyIds);
      const propertyMap = new Map((properties ?? []).map((item) => [item.id, item.title]));

      setApplications(
        (rows ?? []).map((item) => {
          const lines = (item.message ?? "").split("\n").filter(Boolean);
          const latestMessage = lines.length > 0 ? lines[lines.length - 1] : "No message yet";
          return {
            id: item.id,
            propertyTitle: propertyMap.get(item.property_id) || "Property",
            status: item.status,
            createdAt: new Date(item.created_at).toLocaleDateString("en-IN"),
            latestMessage,
          };
        })
      );
      setLoading(false);
    };

    void loadApplications();
  }, [user]);

  return (
    <DashboardLayout navItems={navItems} title="Tenant">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">My Applications</h1>
          <p className="text-muted-foreground">Track your property applications</p>
        </div>

        {loading ? (
          <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground">Loading applications...</div>
        ) : applications.length === 0 ? (
          <div className="rounded-lg border bg-card p-8 text-center">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground/30" />
            <h3 className="mt-4 font-semibold">No applications yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">Your submitted applications will appear here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {applications.map((application) => (
              <Card key={application.id}>
                <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold">{application.propertyTitle}</p>
                    <p className="text-sm text-muted-foreground line-clamp-1">{application.latestMessage}</p>
                    <p className="text-xs text-muted-foreground">Applied on {application.createdAt}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{application.status}</Badge>
                    <Button variant="outline" asChild>
                      <Link to={`/tenant/messages?app=${application.id}`}>Open Chat</Link>
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
