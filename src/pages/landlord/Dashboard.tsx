import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  Home,
  Users,
  MessageSquare,
  ListChecks,
  PlusCircle,
  Sparkles,
  UserCircle,
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
import { PropertyCard } from "@/components/PropertyCard";
import { StatCard } from "@/components/StatCard";
import { PropertyAnalytics } from "@/components/PropertyAnalytics";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function LandlordDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [requestsCount, setRequestsCount] = useState(0);
  const [messageThreads, setMessageThreads] = useState(0);
  const [applicationEvents, setApplicationEvents] = useState<
    Array<{
      id: string;
      message: string | null;
      created_at: string;
    }>
  >([]);
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
        .select(
          "id, title, address, rent, house_type, is_verified, is_active, created_at"
        )
        .eq("landlord_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        toast({
          title: "Unable to load dashboard",
          description: error.message,
          variant: "destructive",
        });
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
          .select("id, message, created_at")
          .in("property_id", propertyIds);

        setRequestsCount(applicationsCount ?? 0);
        setMessageThreads(
          (applicationThreads ?? []).filter(
            (thread) => !!thread.message?.trim()
          ).length
        );
        setApplicationEvents(applicationThreads ?? []);
      } else {
        setRequestsCount(0);
        setMessageThreads(0);
        setApplicationEvents([]);
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

  const activeListings = useMemo(
    () => properties.filter((item) => item.active).length,
    [properties]
  );

  const addedThisMonth = useMemo(() => {
    const now = new Date();
    return properties.filter((item) => {
      const created = new Date(item.createdAt);
      return (
        created.getMonth() === now.getMonth() &&
        created.getFullYear() === now.getFullYear()
      );
    }).length;
  }, [properties]);

  const occupancyHealth = useMemo(() => {
    if (properties.length === 0) return "No listings yet";
    const ratio = Math.round((activeListings / properties.length) * 100);
    return `${ratio}% active inventory`;
  }, [activeListings, properties.length]);

  const vacantListings = useMemo(
    () => properties.length - activeListings,
    [properties.length, activeListings]
  );

  const navItems = useMemo(
    () => [
      { title: "Overview", url: "/landlord/dashboard", icon: Home },
      { title: "Add Property", url: "/landlord/add-property", icon: PlusCircle },
      { title: "My Listings", url: "/landlord/listings", icon: Building2 },
      { title: "Tenant Requests", url: "/landlord/requests", icon: ListChecks },
      { title: "Messages", url: "/landlord/messages", icon: MessageSquare, badge: messageThreads || undefined },
      { title: "Profile", url: "/landlord/profile", icon: UserCircle },
    ],
    [messageThreads]
  );

  const monthlyTrendData = useMemo<LineTrendPoint[]>(() => {
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
      const created = new Date(property.createdAt);
      const key = `${created.getFullYear()}-${String(created.getMonth() + 1).padStart(2, "0")}`;
      const index = monthIndex.get(key);
      if (index !== undefined) {
        months[index].revenue += property.rent;
      }
    });

    applicationEvents.forEach((event) => {
      const created = new Date(event.created_at);
      const key = `${created.getFullYear()}-${String(created.getMonth() + 1).padStart(2, "0")}`;
      const index = monthIndex.get(key);
      if (index !== undefined) {
        months[index].applications += 1;
      }
    });

    return months;
  }, [applicationEvents, properties]);

  return (
    <DashboardLayout navItems={navItems} title="Landlord">
      <div className="space-y-6">
        <DashboardHero
          eyebrow="Landlord control center"
          title={
            properties.length === 0
              ? "Publish your first verified rental listing"
              : "Keep your active rentals and tenant pipeline in sync"
          }
          description={
            properties.length === 0
              ? "Add your first property in a few steps and start receiving verified tenant requests with clear document flows."
              : requestsCount > 0
              ? `You have ${requestsCount} tenant request${
                  requestsCount === 1 ? "" : "s"
                } waiting. Review applications, update listing health, and keep conversations moving.`
              : "Your listings are live. Keep photos and details fresh to convert more verified tenant interest into confirmed bookings."
          }
          accent="rose"
          actions={
            <>
              <Button
                asChild
                className="rounded-full bg-zinc-900 px-6 font-semibold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900"
              >
                <Link to="/landlord/add-property">Add Property</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-full border-slate-200 px-6 font-semibold shadow-sm hover:bg-slate-50 dark:border-white/8 dark:hover:bg-zinc-800"
              >
                <Link to="/landlord/requests">Review Requests</Link>
              </Button>
            </>
          }
        >
          <div className="space-y-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500 dark:text-zinc-400">
              Performance snapshot
            </p>
            <MiniInsight
              icon={Building2}
              title="Portfolio"
              value={`${properties.length} listings`}
              tone="blue"
            />
            <MiniInsight
              icon={Sparkles}
              title="Inventory health"
              value={occupancyHealth}
              tone="green"
            />
          </div>
        </DashboardHero>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Properties"
            value={properties.length}
            icon={Building2}
            description="Listed on platform"
          />
          <StatCard
            title="Active Listings"
            value={activeListings}
            icon={Home}
            trend={`+${addedThisMonth} this month`}
          />
          <StatCard
            title="Pending Requests"
            value={requestsCount}
            icon={Users}
            description="Tenant applications"
          />
          <StatCard
            title="Messages"
            value={messageThreads}
            icon={MessageSquare}
            description="Active conversations"
          />
          <StatCard
            title="Vacant / Inactive"
            value={vacantListings}
            icon={ListChecks}
            description={vacantListings > 0 ? "Need attention" : "All active"}
          />
        </div>

        {loading ? (
          <div className="rounded-[1.75rem] border border-border/70 bg-background/82 p-8 text-center text-muted-foreground shadow-[0_18px_44px_-36px_rgba(91,71,56,0.22)] dark:border-white/8 dark:bg-zinc-950/88 dark:text-zinc-300/85">
            Loading dashboard data...
          </div>
        ) : properties.length === 0 ? (
          <div className="rounded-[1.75rem] border border-border/70 bg-background/82 p-8 text-center shadow-[0_18px_44px_-36px_rgba(91,71,56,0.22)] dark:border-white/8 dark:bg-zinc-950/88">
            <Building2 className="mx-auto h-12 w-12 text-muted-foreground/30" />
            <h3 className="mt-4 font-semibold">No properties listed yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Start by adding your first property listing
            </p>
          </div>
        ) : (
          <div className="grid gap-6 xl:grid-cols-[1.45fr_0.55fr]">
            <DashboardPanel
              title="Recent Listings"
              description="Your newest properties with premium visibility for quick review."
              actionLabel="View all"
              actionTo="/landlord/listings"
            >
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

            <DashboardPanel
              title="Owner Insights"
              description="Signals you should act on this week."
            >
              <div className="space-y-3">
                <MiniInsight
                  icon={ListChecks}
                  title="Demand pipeline"
                  value={`${requestsCount} tenant requests`}
                  tone="amber"
                />
                <MiniInsight
                  icon={MessageSquare}
                  title="Conversations"
                  value={`${messageThreads} active threads`}
                  tone="blue"
                />
                <MiniInsight
                  icon={Home}
                  title="Activation"
                  value={occupancyHealth}
                  tone="green"
                />
                <ChartLineInteractive
                  data={monthlyTrendData}
                  title="Revenue & Demand Trend"
                  subtitle="Monthly rent value and applications (last 6 months)"
                />
              </div>
            </DashboardPanel>
          </div>
        )}

        {/* Phase 4: Landlord Analytics */}
        {!loading && properties.length > 0 && (
          <div className="mt-8">
            <PropertyAnalytics />
          </div>
        )}
      </div>

      {/* Floating Add Property FAB */}
      <Link
        to="/landlord/add-property"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg transition-all hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        aria-label="Add new property"
      >
        <PlusCircle className="h-5 w-5" />
        <span className="hidden sm:inline">Add Property</span>
      </Link>
    </DashboardLayout>
  );
}
