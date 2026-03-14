import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, Bookmark, FileText, MessageSquare, UserCircle, Home, SlidersHorizontal, Loader2 } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { DashboardHero, DashboardPanel, MiniInsight } from "@/components/dashboard-ui";
import { StatCard } from "@/components/StatCard";
import { PropertyCard } from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const navItems = [
  { title: "Search Houses", url: "/tenant/dashboard", icon: Search },
  { title: "Saved Houses", url: "/tenant/saved", icon: Bookmark },
  { title: "Applications", url: "/tenant/applications", icon: FileText },
  { title: "My Bookings", url: "/tenant/bookings", icon: Home },
  { title: "Messages", url: "/tenant/messages", icon: MessageSquare },
  { title: "Profile", url: "/tenant/profile", icon: UserCircle },
];

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

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [houseTypeFilter, setHouseTypeFilter] = useState("all");
  const [rentFilter, setRentFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const loadProperties = async () => {
      const [propertiesResult, savedResult, applicationsResult] = await Promise.all([
        supabase
          .from("properties")
          .select("id, title, address, rent, house_type, is_verified")
          .order("created_at", { ascending: false })
          .limit(50),
        user
          ? supabase.from("saved_properties").select("id, property_id").eq("user_id", user.id)
          : Promise.resolve({ data: [], count: 0, error: null } as any),
        user
          ? supabase.from("applications").select("id", { count: "exact", head: true }).eq("tenant_id", user.id)
          : Promise.resolve({ count: 0, error: null } as const),
      ]);

      if (propertiesResult.error) {
        toast({ title: "Unable to load properties", description: propertiesResult.error.message, variant: "destructive" });
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
          if (!imageMap.has(img.property_id)) imageMap.set(img.property_id, img.image_url);
        });
      }

      const savedSet = new Set<string>((savedResult.data ?? []).map((s: any) => s.property_id as string));
      setSavedIds(savedSet);
      setSavedCount(savedSet.size);
      setApplicationsCount(applicationsResult.count ?? 0);

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
        (p) => p.title.toLowerCase().includes(q) || p.address.toLowerCase().includes(q)
      );
    }

    if (houseTypeFilter !== "all") {
      result = result.filter((p) => p.houseType.toLowerCase().includes(houseTypeFilter.toLowerCase()));
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
      toast({ title: "Please login", description: "Login to save properties.", variant: "destructive" });
      return;
    }

    if (savedIds.has(propertyId)) {
      await supabase.from("saved_properties").delete().eq("user_id", user.id).eq("property_id", propertyId);
      setSavedIds((prev) => { const next = new Set(prev); next.delete(propertyId); return next; });
      setSavedCount((c) => c - 1);
      toast({ title: "Removed from saved" });
    } else {
      await supabase.from("saved_properties").insert({ user_id: user.id, property_id: propertyId });
      setSavedIds((prev) => new Set(prev).add(propertyId));
      setSavedCount((c) => c + 1);
      toast({ title: "Property saved!" });
    }
  };

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
          <StatCard title="Properties Available" value={filteredProperties.length} icon={Home} />
          <StatCard title="Saved Houses" value={savedCount} icon={Bookmark} description="Shortlisted homes" />
          <StatCard title="Applications" value={applicationsCount} icon={FileText} description="Submitted requests" />
          <StatCard title="Messages" value={messageCount} icon={MessageSquare} description="Sent messages" />
        </div>

        {/* Search & Filters */}
        <div className="space-y-3">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by location, property name..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="gap-2" onClick={() => setShowFilters(!showFilters)}>
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </Button>
          </div>

          {showFilters && (
            <div className="flex flex-wrap gap-3">
              <Select value={houseTypeFilter} onValueChange={setHouseTypeFilter}>
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
              {(houseTypeFilter !== "all" || rentFilter !== "all" || searchQuery) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => { setSearchQuery(""); setHouseTypeFilter("all"); setRentFilter("all"); }}
                >
                  Clear all
                </Button>
              )}
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="rounded-lg border bg-card p-8 text-center">
            <Search className="mx-auto h-12 w-12 text-muted-foreground/30" />
            <h3 className="mt-4 font-semibold">
              {properties.length === 0 ? "No properties yet" : "No matches found"}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {properties.length === 0
                ? "Newly listed homes will appear here automatically"
                : "Try adjusting your search or filters"}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 xl:grid-cols-[1.45fr_0.55fr]">
            <DashboardPanel title="Recommended Listings" description="Verified homes that fit active search behavior." actionLabel="Open search" actionTo="/">
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

            <DashboardPanel title="Tenant Insights" description="Signals that keep your housing search focused.">
              <div className="space-y-3">
                <MiniInsight icon={Bookmark} title="Shortlist" value={`${savedCount} saved homes`} tone="blue" />
                <MiniInsight icon={FileText} title="Application status" value={`${applicationsCount} submissions`} tone="amber" />
                <MiniInsight icon={MessageSquare} title="Conversations" value={`${messageCount} messages`} tone="green" />
                <div className="rounded-2xl border border-border bg-muted/30 p-4 text-sm leading-7 text-muted-foreground">
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
