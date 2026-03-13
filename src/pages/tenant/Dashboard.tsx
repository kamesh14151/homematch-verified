import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Bookmark, FileText, MessageSquare, UserCircle, Home } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { DashboardHero, DashboardPanel, MiniInsight } from "@/components/dashboard-ui";
import { StatCard } from "@/components/StatCard";
import { PropertyCard } from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const navItems = [
  { title: "Search Houses", url: "/tenant/dashboard", icon: Search },
  { title: "Saved Houses", url: "/tenant/saved", icon: Bookmark },
  { title: "Applications", url: "/tenant/applications", icon: FileText },
  { title: "Messages", url: "/tenant/messages", icon: MessageSquare },
  { title: "Profile", url: "/tenant/profile", icon: UserCircle },
];

export default function TenantDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [savedCount, setSavedCount] = useState(0);
  const [applicationsCount, setApplicationsCount] = useState(0);
  const [messageCount, setMessageCount] = useState(0);
  const [properties, setProperties] = useState<
    Array<{
      id: string;
      title: string;
      address: string;
      rent: number;
      houseType: string;
      verified: boolean;
      imageUrl?: string;
    }>
  >([]);

  useEffect(() => {
    const loadProperties = async () => {
      const [propertiesResult, savedResult, applicationsResult] = await Promise.all([
        supabase
          .from("properties")
          .select("id, title, address, rent, house_type, is_verified")
          .order("created_at", { ascending: false })
          .limit(12),
        user
          ? supabase.from("saved_properties").select("id", { count: "exact", head: true }).eq("user_id", user.id)
          : Promise.resolve({ count: 0, error: null } as const),
        user
          ? supabase.from("applications").select("id, message", { count: "exact" }).eq("tenant_id", user.id)
          : Promise.resolve({ data: [], count: 0, error: null } as const),
      ]);

      const data = propertiesResult.data;
      const error = propertiesResult.error;

      if (error) {
        toast({ title: "Unable to load properties", description: error.message, variant: "destructive" });
        setLoading(false);
        return;
      }

      const propertyIds = (data ?? []).map((item) => item.id);
      const imageMap = new Map<string, string>();

      if (propertyIds.length > 0) {
        const { data: images } = await supabase
          .from("property_images")
          .select("property_id, image_url, display_order")
          .in("property_id", propertyIds)
          .order("display_order", { ascending: true });

        (images ?? []).forEach((img) => {
          if (!imageMap.has(img.property_id)) {
            imageMap.set(img.property_id, img.image_url);
          }
        });
      }

      setSavedCount(savedResult.count ?? 0);
      setApplicationsCount(applicationsResult.count ?? 0);
      setMessageCount((applicationsResult.data ?? []).filter((item) => !!item.message?.trim()).length);

      setProperties(
        (data ?? []).map((item) => ({
          id: item.id,
          title: item.title,
          address: item.address,
          rent: item.rent,
          houseType: item.house_type,
          verified: !!item.is_verified,
          imageUrl: imageMap.get(item.id),
        }))
      );
      setLoading(false);
    };

    void loadProperties();
  }, [toast, user]);

  return (
    <DashboardLayout navItems={navItems} title="Tenant">
      <div className="space-y-6">
        <DashboardHero
          eyebrow="Tenant experience center"
          title="Discover, shortlist, and track rental decisions inside one premium search workspace"
          description="Top rental products reduce friction by combining discovery, trust signals, and status tracking. Your tenant dashboard now follows that model."
          accent="emerald"
          actions={
            <>
              <Button asChild className="bg-white text-emerald-800 hover:bg-white/90">
                <Link to="/">Browse Listings</Link>
              </Button>
              <Button asChild variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/15">
                <Link to="/tenant/applications">Track Applications</Link>
              </Button>
            </>
          }
        >
          <div className="space-y-3 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/65">Search momentum</p>
            <MiniInsight icon={Home} title="Fresh supply" value={`${properties.length} live matches`} tone="green" />
            <MiniInsight icon={Bookmark} title="Saved interest" value={`${savedCount} shortlisted`} tone="blue" />
          </div>
        </DashboardHero>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Properties Available" value={properties.length} icon={Home} />
          <StatCard title="Saved Houses" value={savedCount} icon={Bookmark} description="Shortlisted homes" />
          <StatCard title="Applications" value={applicationsCount} icon={FileText} description="Submitted requests" />
          <StatCard title="Messages" value={messageCount} icon={MessageSquare} description="Active conversations" />
        </div>

        {loading ? (
          <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground">Loading properties...</div>
        ) : properties.length === 0 ? (
          <div className="rounded-lg border bg-card p-8 text-center">
            <Search className="mx-auto h-12 w-12 text-muted-foreground/30" />
            <h3 className="mt-4 font-semibold">No properties yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">Newly listed homes will appear here automatically</p>
          </div>
        ) : (
          <div className="grid gap-6 xl:grid-cols-[1.45fr_0.55fr]">
            <DashboardPanel title="Recommended Listings" description="Verified homes that fit active search behavior." actionLabel="Open search" actionTo="/">
              <div className="grid gap-4 sm:grid-cols-2">
                {properties.slice(0, 4).map((property) => (
                  <PropertyCard
                    key={property.id}
                    id={property.id}
                    title={property.title}
                    address={property.address}
                    rent={property.rent}
                    houseType={property.houseType}
                    imageUrl={property.imageUrl}
                    verified={property.verified}
                  />
                ))}
              </div>
            </DashboardPanel>

            <DashboardPanel title="Tenant Insights" description="Signals that keep your housing search focused.">
              <div className="space-y-3">
                <MiniInsight icon={Bookmark} title="Shortlist" value={`${savedCount} saved homes`} tone="blue" />
                <MiniInsight icon={FileText} title="Application status" value={`${applicationsCount} submissions`} tone="amber" />
                <MiniInsight icon={MessageSquare} title="Owner replies" value={`${messageCount} live chats`} tone="green" />
                <div className="rounded-2xl border border-slate-200/70 bg-slate-50 p-4 text-sm leading-7 text-muted-foreground dark:border-white/10 dark:bg-white/5">
                  Strong rental decisions come from comparing budget, furnishing, commute fit, and owner credibility together. Keep your shortlist focused and active.
                </div>
              </div>
            </DashboardPanel>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
