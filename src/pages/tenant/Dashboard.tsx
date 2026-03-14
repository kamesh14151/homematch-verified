import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Bookmark,
  FileText,
  MessageSquare,
  UserCircle,
  Home,
  SlidersHorizontal,
  Loader2,
} from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { TenantLeaseEscrow } from "@/components/TenantLeaseEscrow";
import {
  DashboardHero,
  DashboardPanel,
  MiniInsight,
} from "@/components/dashboard-ui";
import { StatCard } from "@/components/StatCard";
import { PropertyCard } from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type Property = {
  id: string;
  title: string;
  address: string;
  rent: number;
  houseType: string;
  verified: boolean;
  imageUrl?: string;
};

export default function TenantDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [savedCount, setSavedCount] = useState(0);
  const [applicationsCount, setApplicationsCount] = useState(0);
  const [messageCount, setMessageCount] = useState(0);
  const [properties, setProperties] = useState<Property[]>([]);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [hasActiveBooking, setHasActiveBooking] = useState(false);

  const navItems = useMemo(
    () => [
      { title: "Search Houses", url: "/tenant/dashboard", icon: Search },
      { title: "Saved Houses", url: "/tenant/saved", icon: Bookmark },
      { title: "Applications", url: "/tenant/applications", icon: FileText },
      { title: "My Bookings", url: "/tenant/bookings", icon: Home },
      { title: "Messages", url: "/tenant/messages", icon: MessageSquare, badge: messageCount || undefined },
      { title: "Profile", url: "/tenant/profile", icon: UserCircle },
    ],
    [messageCount]
  );

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [houseTypeFilter, setHouseTypeFilter] = useState("all");
  const [rentFilter, setRentFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const loadProperties = async () => {
      const [propertiesResult, savedResult, applicationsResult] =
        await Promise.all([
          supabase
            .from("properties")
            .select("id, title, address, rent, house_type, is_verified")
            .order("created_at", { ascending: false })
            .limit(50),
          user
            ? supabase
                .from("saved_properties")
                .select("id, property_id")
                .eq("user_id", user.id)
            : Promise.resolve({ data: [], count: 0, error: null } as any),
          user
            ? supabase
                .from("applications")
                .select("id", { count: "exact", head: true })
                .eq("tenant_id", user.id)
            : Promise.resolve({ count: 0, error: null } as const),
        ]);

      if (propertiesResult.error) {
        toast({
          title: "Unable to load properties",
          description: propertiesResult.error.message,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      const data = propertiesResult.data ?? [];
      const propertyIds = data.map((item) => item.id);
      const imageMap = new Map<string, string>();

      if (propertyIds.length > 0) {
        const { data: images } = await supabase
          .from("property_images")
          .select("property_id, image_url, display_order")
          .in("property_id", propertyIds)
          .order("display_order", { ascending: true });

        (images ?? []).forEach((img) => {
          if (!imageMap.has(img.property_id))
            imageMap.set(img.property_id, img.image_url);
        });
      }

      const savedSet = new Set<string>(
        (savedResult.data ?? []).map((s: any) => s.property_id as string)
      );
      setSavedIds(savedSet);
      setSavedCount(savedSet.size);
      setApplicationsCount(applicationsResult.count ?? 0);

      // Check for active/paid bookings to conditionally show lease escrow
      if (user) {
        const { data: bookings } = await supabase
          .from("applications")
          .select("id")
          .eq("tenant_id", user.id)
          .eq("status", "paid")
          .limit(1);
        setHasActiveBooking((bookings ?? []).length > 0);
      }

      // Count messages
      if (user) {
        const { count } = await supabase
          .from("messages")
          .select("id", { count: "exact", head: true })
          .eq("sender_id", user.id);
        setMessageCount(count ?? 0);
      }

      setProperties(
        data.map((item) => ({
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

  const filteredProperties = useMemo(() => {
    let result = properties;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.address.toLowerCase().includes(q)
      );
    }

    if (houseTypeFilter !== "all") {
      result = result.filter((p) =>
        p.houseType.toLowerCase().includes(houseTypeFilter.toLowerCase())
      );
    }

    if (rentFilter !== "all") {
      const [min, max] = rentFilter.split("-").map(Number);
      result = result.filter((p) => {
        if (max) return p.rent >= min && p.rent <= max;
        return p.rent >= min;
      });
    }

    return result;
  }, [properties, searchQuery, houseTypeFilter, rentFilter]);

  const handleToggleSave = async (propertyId: string) => {
    if (!user) {
      toast({
        title: "Please login",
        description: "Login to save properties.",
        variant: "destructive",
      });
      return;
    }

    if (savedIds.has(propertyId)) {
      await supabase
        .from("saved_properties")
        .delete()
        .eq("user_id", user.id)
        .eq("property_id", propertyId);
      setSavedIds((prev) => {
        const next = new Set(prev);
        next.delete(propertyId);
        return next;
      });
      setSavedCount((c) => c - 1);
      toast({ title: "Removed from saved" });
    } else {
      await supabase
        .from("saved_properties")
        .insert({ user_id: user.id, property_id: propertyId });
      setSavedIds((prev) => new Set(prev).add(propertyId));
      setSavedCount((c) => c + 1);
      toast({ title: "Property saved!" });
    }
  };

  return (
    <DashboardLayout navItems={navItems} title="Tenant">
      <div className="space-y-6">
        {/* Personalized greeting */}
        {user?.email && (
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold">
              {(() => {
                const hour = new Date().getHours();
                const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
                const name = user.email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
                return `${greeting}, ${name}!`;
              })()}
            </span>
          </div>
        )}
        <DashboardHero
          eyebrow="Tenant experience center"
          title="Your rental search, in one focused workspace"
          description={
            applicationsCount > 0 || savedCount > 0
              ? "Pick up where you left off: compare shortlisted homes, track applications, and keep conversations moving."
              : "Start by browsing verified homes, then save a few favorites to keep your search focused."
          }
          accent="emerald"
          actions={
            <>
              <Button
                asChild
                className="rounded-full bg-zinc-900 px-6 font-semibold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900"
              >
                <Link to="/">Browse Listings</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-full border-slate-200 px-6 font-semibold shadow-sm hover:bg-slate-50 dark:border-white/10 dark:hover:bg-zinc-800"
              >
                <Link to="/tenant/applications">Track Applications</Link>
              </Button>
            </>
          }
        >
          <div className="space-y-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500 dark:text-zinc-400">
              Search momentum
            </p>
            <MiniInsight
              icon={Home}
              title="Fresh supply"
              value={`${properties.length} live matches`}
              tone="green"
            />
            <MiniInsight
              icon={Bookmark}
              title="Saved interest"
              value={`${savedCount} shortlisted`}
              tone="blue"
            />
          </div>
        </DashboardHero>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Properties Available"
            value={filteredProperties.length}
            icon={Home}
          />
          <StatCard
            title="Saved Houses"
            value={savedCount}
            icon={Bookmark}
            description="Shortlisted homes"
          />
          <StatCard
            title="Applications"
            value={applicationsCount}
            icon={FileText}
            description="Submitted requests"
          />
          <StatCard
            title="Messages"
            value={messageCount}
            icon={MessageSquare}
            description="Sent messages"
          />
        </div>

        {/* Search, filters & quick summary */}
        <div className="space-y-3">
          <div className="flex gap-3 rounded-[1.6rem] border border-border/70 bg-background/82 p-2 shadow-[0_18px_44px_-36px_rgba(91,71,56,0.22)] dark:border-white/8 dark:bg-zinc-950/88 dark:shadow-[0_24px_60px_-42px_rgba(0,0,0,0.9)]">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by location, property name..."
                className="border-0 bg-transparent pl-10 shadow-none focus-visible:ring-1 focus-visible:ring-primary/30 dark:bg-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              className="gap-2 rounded-full border-border/70 bg-background text-foreground hover:bg-secondary dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </Button>
          </div>

          {showFilters && (
            <div className="flex flex-wrap items-center gap-3 rounded-[1.4rem] border border-border/70 bg-background/74 p-3 dark:border-white/8 dark:bg-zinc-950/72">
              <Select
                value={houseTypeFilter}
                onValueChange={setHouseTypeFilter}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="House Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="1 BHK">1 BHK</SelectItem>
                  <SelectItem value="2 BHK">2 BHK</SelectItem>
                  <SelectItem value="3 BHK">3 BHK</SelectItem>
                  <SelectItem value="4 BHK">4+ BHK</SelectItem>
                </SelectContent>
              </Select>
              <Select value={rentFilter} onValueChange={setRentFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Rent Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Price</SelectItem>
                  <SelectItem value="0-10000">Under ₹10,000</SelectItem>
                  <SelectItem value="10000-20000">₹10,000 – ₹20,000</SelectItem>
                  <SelectItem value="20000-30000">₹20,000 – ₹30,000</SelectItem>
                  <SelectItem value="30000-999999">₹30,000+</SelectItem>
                </SelectContent>
              </Select>
              {(houseTypeFilter !== "all" ||
                rentFilter !== "all" ||
                searchQuery) && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full dark:hover:bg-zinc-900"
                  onClick={() => {
                    setSearchQuery("");
                    setHouseTypeFilter("all");
                    setRentFilter("all");
                  }}
                >
                  Clear all
                </Button>
              )}
              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                {searchQuery && (
                  <span className="inline-flex items-center rounded-full bg-muted px-3 py-1">
                    Search:{" "}
                    <span className="ml-1 font-medium text-foreground">
                      {searchQuery}
                    </span>
                  </span>
                )}
                {houseTypeFilter !== "all" && (
                  <span className="inline-flex items-center rounded-full bg-muted px-3 py-1">
                    Type:{" "}
                    <span className="ml-1 font-medium text-foreground">
                      {houseTypeFilter}
                    </span>
                  </span>
                )}
                {rentFilter !== "all" && (
                  <span className="inline-flex items-center rounded-full bg-muted px-3 py-1">
                    Rent:{" "}
                    <span className="ml-1 font-medium text-foreground">
                      {rentFilter.replace("-", "–")}
                    </span>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="rounded-[1.75rem] border border-border/70 bg-background/82 p-8 text-center shadow-[0_18px_44px_-36px_rgba(91,71,56,0.22)] dark:border-white/8 dark:bg-zinc-950/88">
            <Search className="mx-auto h-12 w-12 text-muted-foreground/30" />
            <h3 className="mt-4 font-semibold">
              {properties.length === 0
                ? "No properties yet"
                : "No matches found"}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {properties.length === 0
                ? "Newly listed homes will appear here automatically"
                : "Try adjusting your search or filters"}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 xl:grid-cols-[1.45fr_0.55fr]">
            <DashboardPanel
              title="Recommended Listings"
              description="Verified homes that fit active search behavior."
              actionLabel="Open search"
              actionTo="/"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                {filteredProperties.slice(0, 6).map((property) => (
                  <PropertyCard
                    key={property.id}
                    id={property.id}
                    title={property.title}
                    address={property.address}
                    rent={property.rent}
                    houseType={property.houseType}
                    imageUrl={property.imageUrl}
                    verified={property.verified}
                    isSaved={savedIds.has(property.id)}
                    onSave={() => handleToggleSave(property.id)}
                  />
                ))}
              </div>
            </DashboardPanel>

            <DashboardPanel
              title="Tenant Insights"
              description="Signals that keep your housing search focused."
            >
              <div className="space-y-3">
                <MiniInsight
                  icon={Bookmark}
                  title="Shortlist"
                  value={`${savedCount} saved homes`}
                  tone="blue"
                />
                <MiniInsight
                  icon={FileText}
                  title="Application status"
                  value={`${applicationsCount} submissions`}
                  tone="amber"
                />
                <MiniInsight
                  icon={MessageSquare}
                  title="Conversations"
                  value={`${messageCount} messages`}
                  tone="green"
                />
                <div className="rounded-2xl border border-border bg-muted/30 p-4 text-sm leading-7 text-muted-foreground dark:border-white/8 dark:bg-zinc-900/72 dark:text-zinc-300/85">
                  Strong rental decisions come from comparing budget,
                  furnishing, commute fit, and owner credibility together. Keep
                  your shortlist focused and active.
                </div>
              </div>
            </DashboardPanel>
          </div>
        )}

        {/* Phase 5: Lease & Payments Escrow View */}
        {!loading && (
          <div className="mt-8">
            {/* Only show lease/escrow section when tenant has a paid booking */}
        {hasActiveBooking && <TenantLeaseEscrow />}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
