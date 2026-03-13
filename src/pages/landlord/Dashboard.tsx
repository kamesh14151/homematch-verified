import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Building2, Home, Users, MessageSquare, ListChecks, PlusCircle, Sparkles, UserCircle } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { DashboardHero, DashboardPanel, MiniInsight } from "@/components/dashboard-ui";
import { PropertyCard } from "@/components/PropertyCard";
import { StatCard } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const navItems = [
  { title: "Overview", url: "/landlord/dashboard", icon: Home },
  { title: "Add Property", url: "/landlord/add-property", icon: PlusCircle },
  { title: "My Listings", url: "/landlord/listings", icon: Building2 },
  { title: "Tenant Requests", url: "/landlord/requests", icon: ListChecks },
  { title: "Messages", url: "/landlord/messages", icon: MessageSquare },
  { title: "Profile", url: "/landlord/profile", icon: UserCircle },
];

export default function LandlordDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [requestsCount, setRequestsCount] = useState(0);
  const [messageThreads, setMessageThreads] = useState(0);
  const [properties, setProperties] = useState<
    Array<{
      id: string;
      title: string;
      address: string;
      rent: number;
      houseType: string;
      verified: boolean;
      active: boolean;
      createdAt: string;
      imageUrl?: string;
    }>
  >([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("properties")
        .select("id, title, address, rent, house_type, is_verified, is_active, created_at")
        .eq("landlord_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        toast({ title: "Unable to load dashboard", description: error.message, variant: "destructive" });
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

        const { count: applicationsCount } = await supabase
          .from("applications")
          .select("id", { count: "exact", head: true })
          .in("property_id", propertyIds);

        const { data: applicationThreads } = await supabase
          .from("applications")
          .select("id, message")
          .in("property_id", propertyIds);

        setRequestsCount(applicationsCount ?? 0);
        setMessageThreads((applicationThreads ?? []).filter((thread) => !!thread.message?.trim()).length);
      }

      setProperties(
        (data ?? []).map((item) => ({
          id: item.id,
          title: item.title,
          address: item.address,
          rent: item.rent,
          houseType: item.house_type,
          verified: !!item.is_verified,
          active: item.is_active ?? true,
          createdAt: item.created_at,
          imageUrl: imageMap.get(item.id),
        }))
      );
      setLoading(false);
    };

    void loadDashboardData();
  }, [toast, user]);

  const activeListings = useMemo(() => properties.filter((item) => item.active).length, [properties]);

  const addedThisMonth = useMemo(() => {
    const now = new Date();
    return properties.filter((item) => {
      const created = new Date(item.createdAt);
      return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
    }).length;
  }, [properties]);

  const occupancyHealth = useMemo(() => {
    if (properties.length === 0) return "No listings yet";
    const ratio = Math.round((activeListings / properties.length) * 100);
    return `${ratio}% active inventory`;
  }, [activeListings, properties.length]);

  return (
    <DashboardLayout navItems={navItems} title="Landlord">
      <div className="space-y-6">
        <DashboardHero
          eyebrow="Landlord control center"
          title="Manage inventory, trust, and tenant demand from one branded workspace"
          description="Premium landlord operations need fast listing visibility, cleaner tenant intake, and decision-friendly analytics. This dashboard now gives you all three in one consistent system."
          accent="blue"
          actions={
            <>
              <Button asChild className="bg-white text-[#0f2d68] hover:bg-white/90">
                <Link to="/landlord/add-property">Add Property</Link>
              </Button>
              <Button asChild variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/15">
                <Link to="/landlord/requests">Review Requests</Link>
              </Button>
            </>
          }
        >
          <div className="space-y-3 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/65">Performance snapshot</p>
            <MiniInsight icon={Building2} title="Portfolio" value={`${properties.length} listings`} />
            <MiniInsight icon={Sparkles} title="Inventory health" value={occupancyHealth} tone="green" />
          </div>
        </DashboardHero>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Properties" value={properties.length} icon={Building2} description="Listed on platform" />
          <StatCard title="Active Listings" value={activeListings} icon={Home} trend={`+${addedThisMonth} this month`} />
          <StatCard title="Pending Requests" value={requestsCount} icon={Users} description="Tenant applications" />
          <StatCard title="Messages" value={messageThreads} icon={MessageSquare} description="Active conversations" />
        </div>

        {loading ? (
          <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground">Loading dashboard data...</div>
        ) : properties.length === 0 ? (
          <div className="rounded-lg border bg-card p-8 text-center">
            <Building2 className="mx-auto h-12 w-12 text-muted-foreground/30" />
            <h3 className="mt-4 font-semibold">No properties listed yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">Start by adding your first property listing</p>
          </div>
        ) : (
          <div className="grid gap-6 xl:grid-cols-[1.45fr_0.55fr]">
            <DashboardPanel title="Recent Listings" description="Your newest properties with premium visibility for quick review." actionLabel="View all" actionTo="/landlord/listings">
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

            <DashboardPanel title="Owner Insights" description="Signals you should act on this week.">
              <div className="space-y-3">
                <MiniInsight icon={ListChecks} title="Demand pipeline" value={`${requestsCount} tenant requests`} tone="amber" />
                <MiniInsight icon={MessageSquare} title="Conversations" value={`${messageThreads} active threads`} tone="blue" />
                <MiniInsight icon={Home} title="Activation" value={occupancyHealth} tone="green" />
                <div className="rounded-2xl border border-slate-200/70 bg-slate-50 p-4 text-sm leading-7 text-muted-foreground dark:border-white/10 dark:bg-white/5">
                  Properties with strong visuals and complete verification details typically convert better. Keep listings active and current to improve response speed.
                </div>
              </div>
            </DashboardPanel>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
