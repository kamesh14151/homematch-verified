import { useEffect, useState, useMemo, useRef, useCallback } from "react";
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
  Navigation,
  Locate,
  MapPin,
  ChevronRight,
  BadgeCheck,
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
import { PropertyMap } from "@/components/PropertyMap";
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

// ---------------------------------------------------------------------------
// City coordinate lookup for location-based ranking
// ---------------------------------------------------------------------------
const CITY_COORDS: Record<string, [number, number]> = {
  bangalore: [12.9716, 77.5946],
  bengaluru: [12.9716, 77.5946],
  chennai: [13.0827, 80.2707],
  hyderabad: [17.385, 78.4867],
  mumbai: [19.076, 72.8777],
  pune: [18.5204, 73.8567],
  delhi: [28.6139, 77.209],
  noida: [28.5355, 77.391],
  gurgaon: [28.4595, 77.0266],
  gurugram: [28.4595, 77.0266],
  kolkata: [22.5726, 88.3639],
  ahmedabad: [23.0225, 72.5714],
  jaipur: [26.9124, 75.7873],
};

/** Deterministic jitter so the same property always lands at the same pin. */
function hashFraction(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
  return (h % 1000) / 1000;
}

function guessPropertyCoords(id: string, address: string): [number, number] | null {
  const lower = address.toLowerCase();
  for (const [city, base] of Object.entries(CITY_COORDS)) {
    if (lower.includes(city)) {
      return [
        base[0] + (hashFraction(id + "lat") - 0.5) * 0.04,
        base[1] + (hashFraction(id + "lng") - 0.5) * 0.04,
      ];
    }
  }
  return null;
}

type Property = {
  id: string;
  title: string;
  address: string;
  rent: number;
  houseType: string;
  verified: boolean;
  imageUrl?: string;
  securityDeposit?: number;
  area?: number;
  furnishing?: string;
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

  // Location state
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number; city: string } | null>(null);
  const [locationStatus, setLocationStatus] = useState<"detecting" | "gps" | "ip" | "default">("detecting");
  const [hoveredPropertyId, setHoveredPropertyId] = useState<string | null>(null);

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

  // ---------------------------------------------------------------------------
  // Location detection: GPS first, fallback to IP
  // ---------------------------------------------------------------------------
  const applyGPSCoords = useCallback(async (lat: number, lng: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=en`
      );
      const data = await res.json();
      const city =
        data?.address?.city ||
        data?.address?.town ||
        data?.address?.suburb ||
        data?.address?.state ||
        "your area";
      setUserLocation({ lat, lng, city });
      setLocationStatus("gps");
    } catch {
      setUserLocation({ lat, lng, city: "your area" });
      setLocationStatus("gps");
    }
  }, []);

  const requestGPS = useCallback(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => { void applyGPSCoords(pos.coords.latitude, pos.coords.longitude); },
      () => { /* user denied, do nothing */ },
      { timeout: 8000 }
    );
  }, [applyGPSCoords]);

  useEffect(() => {
    let cancelled = false;
    const detect = async () => {
      // Try GPS (silently — don't prompt if already denied)
      try {
        const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 })
        );
        if (!cancelled) await applyGPSCoords(pos.coords.latitude, pos.coords.longitude);
        return;
      } catch { /* continue to IP fallback */ }

      // Fallback: IP geolocation
      try {
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();
        if (!cancelled && data?.latitude) {
          setUserLocation({ lat: data.latitude, lng: data.longitude, city: data.city || "your area" });
          setLocationStatus("ip");
          return;
        }
      } catch { /* ignore */ }

      // Last resort default (Bangalore)
      if (!cancelled) {
        setUserLocation({ lat: 12.9716, lng: 77.5946, city: "Bangalore" });
        setLocationStatus("default");
      }
    };
    void detect();
    return () => { cancelled = true; };
  }, [applyGPSCoords]);

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
            .select("id, title, address, rent, house_type, is_verified, security_deposit_amount, super_builtup_area, furnishing")
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
          securityDeposit: (item as any).security_deposit_amount ?? undefined,
          area: (item as any).super_builtup_area ?? undefined,
          furnishing: (item as any).furnishing ?? undefined,
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

  // ---------------------------------------------------------------------------
  // Near-you sorting: city-matched properties bubble to the top
  // ---------------------------------------------------------------------------
  const nearbyProperties = useMemo(() => {
    if (!userLocation) return filteredProperties;
    const cityLower = userLocation.city.toLowerCase();
    const isLocal = (address: string) => {
      const addrLower = address.toLowerCase();
      if (addrLower.includes(cityLower)) return true;
      // also match broad city aliases
      return Object.keys(CITY_COORDS).some(
        (c) => cityLower.includes(c) && addrLower.includes(c)
      );
    };
    return [...filteredProperties].sort((a, b) => {
      const aL = isLocal(a.address);
      const bL = isLocal(b.address);
      if (aL && !bL) return -1;
      if (!aL && bL) return 1;
      return 0;
    });
  }, [filteredProperties, userLocation]);

  // Map pin data (only properties we can geocode)
  const mapListings = useMemo(() => {
    return nearbyProperties
      .slice(0, 15)
      .map((p) => {
        const coords = guessPropertyCoords(p.id, p.address);
        if (!coords) return null;
        return { id: p.id, title: p.title, rent: p.rent, image: p.imageUrl, lat: coords[0], lng: coords[1] };
      })
      .filter(Boolean) as Array<{ id: string; title: string; rent: number; image?: string; lat: number; lng: number }>;
  }, [nearbyProperties]);

  const mapCenter = useMemo<[number, number]>(
    () => (userLocation ? [userLocation.lat, userLocation.lng] : [12.9716, 77.5946]),
    [userLocation]
  );

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
          <div className="space-y-4">
            {/* Location source banner */}
            {locationStatus === "ip" && userLocation && (
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm text-blue-800 dark:border-blue-800/30 dark:bg-blue-950/20 dark:text-blue-300">
                <span className="flex items-center gap-2">
                  <Navigation className="h-4 w-4 shrink-0" />
                  Showing homes near <strong className="mx-1">{userLocation.city}</strong> based on your IP address.
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 rounded-full border-blue-300 bg-white px-3 text-xs text-blue-700 hover:bg-blue-50 dark:border-blue-700 dark:bg-transparent dark:text-blue-400"
                  onClick={requestGPS}
                >
                  <Locate className="mr-1.5 h-3.5 w-3.5" /> Enable GPS for accuracy
                </Button>
              </div>
            )}
            {locationStatus === "gps" && userLocation && (
              <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-800 dark:border-emerald-800/30 dark:bg-emerald-950/20 dark:text-emerald-300">
                <Locate className="h-4 w-4 shrink-0" />
                Showing verified homes near <strong className="ml-1">{userLocation.city}</strong> using your GPS location.
              </div>
            )}

            {/* ── Nestaway-style split layout ── */}
            <div className="overflow-hidden rounded-[1.75rem] border border-border/70 bg-background shadow-[0_18px_44px_-36px_rgba(91,71,56,0.22)] dark:border-white/8 dark:bg-zinc-950">
              {/* Header bar */}
              <div className="flex items-center justify-between border-b border-border/60 px-5 py-3.5 dark:border-white/8">
                <div>
                  <h2 className="font-semibold text-foreground">
                    Recommended Near You
                    {locationStatus === "detecting" && (
                      <span className="ml-2 text-xs font-normal text-muted-foreground">Detecting location…</span>
                    )}
                  </h2>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {nearbyProperties.length} verified homes
                    {userLocation ? ` · ${userLocation.city}` : ""}
                  </p>
                </div>
                <Link
                  to="/"
                  className="flex items-center gap-1 rounded-full border border-border/60 bg-muted/50 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground dark:border-white/8 dark:bg-zinc-900/60"
                >
                  All listings <ChevronRight className="h-3 w-3" />
                </Link>
              </div>

              {/* Map + card list */}
              <div className="flex flex-col lg:grid lg:grid-cols-[55%_45%]" style={{ height: "440px" }}>
                {/* LEFT: Leaflet map */}
                <div className="relative h-52 lg:h-full" style={{ zIndex: 0 }}>
                  {userLocation ? (
                    <PropertyMap
                      listings={mapListings}
                      center={mapCenter}
                      zoom={12}
                      selectedId={hoveredPropertyId ?? undefined}
                      userMarker={mapCenter}
                      onMarkerClick={(id) => {
                        setHoveredPropertyId(id);
                        document.getElementById(`nc-${id}`)?.scrollIntoView({ behavior: "smooth", block: "nearest" });
                      }}
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-muted/30">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground/50" />
                    </div>
                  )}
                </div>

                {/* RIGHT: scrollable property card list */}
                <div className="flex flex-col border-t border-border/50 lg:border-l lg:border-t-0 dark:border-white/8">
                  {/* mini filter chips */}
                  <div className="flex items-center gap-1.5 overflow-x-auto border-b border-border/50 px-3 py-2 dark:border-white/8">
                    {["All", "1 BHK", "2 BHK", "3 BHK", "Furnished"].map((chip) => (
                      <button
                        key={chip}
                        onClick={() => {
                          if (chip === "All") { setHouseTypeFilter("all"); }
                          else if (chip === "Furnished") { setHouseTypeFilter("all"); }
                          else setHouseTypeFilter(chip);
                        }}
                        className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold transition-colors ${
                          (chip === "All" && houseTypeFilter === "all") ||
                          houseTypeFilter === chip
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                      >
                        {chip}
                      </button>
                    ))}
                  </div>

                  {/* card list */}
                  <div className="flex-1 overflow-y-auto" style={{ maxHeight: "388px" }}>
                    {nearbyProperties.slice(0, 12).map((property, idx) => (
                      <div
                        key={property.id}
                        id={`nc-${property.id}`}
                        onMouseEnter={() => setHoveredPropertyId(property.id)}
                        onMouseLeave={() => setHoveredPropertyId(null)}
                        className={`group relative flex items-stretch gap-3 border-b border-border/30 px-3 py-2.5 transition-colors last:border-0 dark:border-white/5 ${
                          hoveredPropertyId === property.id
                            ? "bg-primary/5 dark:bg-primary/8"
                            : "hover:bg-muted/20 dark:hover:bg-zinc-900/50"
                        }`}
                      >
                        {/* Row number */}
                        <span className="absolute left-2 top-2 text-[9px] font-bold text-muted-foreground/40 select-none">
                          {idx + 1}
                        </span>

                        {/* Thumbnail */}
                        <div className="relative ml-3 h-[72px] w-[88px] shrink-0 overflow-hidden rounded-lg">
                          {property.imageUrl ? (
                            <img
                              src={property.imageUrl}
                              alt={property.title}
                              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full w-full flex-col items-center justify-center gap-1 bg-gradient-to-br from-muted to-muted/60">
                              <Home className="h-5 w-5 text-muted-foreground/40" />
                              <span className="text-[9px] text-muted-foreground/40">No photo</span>
                            </div>
                          )}
                          {property.verified && (
                            <span className="absolute bottom-1 left-1 flex items-center gap-0.5 rounded bg-emerald-500/90 px-1 py-0.5 text-[8px] font-bold leading-none text-white backdrop-blur-sm">
                              ✓
                            </span>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
                          {/* Top: title + location */}
                          <div className="min-w-0">
                            <h3 className="line-clamp-1 text-[13px] font-semibold leading-tight text-foreground">
                              {property.title}
                            </h3>
                            <p className="mt-0.5 flex items-start gap-0.5 text-[10px] leading-tight text-muted-foreground">
                              <MapPin className="mt-px h-2.5 w-2.5 shrink-0" />
                              <span className="line-clamp-1">{property.address}</span>
                            </p>
                          </div>

                          {/* Chips row */}
                          <div className="mt-1.5 flex items-center gap-1 overflow-hidden">
                            <span className="shrink-0 rounded bg-muted px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">
                              {property.houseType}
                            </span>
                            {property.furnishing && (
                              <span className="shrink-0 rounded bg-muted px-1.5 py-0.5 text-[9px] font-medium capitalize text-muted-foreground">
                                {property.furnishing}
                              </span>
                            )}
                            {property.area && (
                              <span className="shrink-0 rounded bg-muted px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground">
                                {property.area} sq.ft
                              </span>
                            )}
                          </div>

                          {/* Bottom: price + button */}
                          <div className="mt-1.5 flex items-center justify-between gap-2">
                            <div className="min-w-0">
                              <span className="text-[13px] font-bold text-foreground">
                                ₹{property.rent.toLocaleString("en-IN")}
                              </span>
                              <span className="text-[10px] text-muted-foreground">/mo</span>
                              {property.securityDeposit ? (
                                <span className="ml-1.5 text-[9px] text-muted-foreground/70">
                                  · ₹{(property.securityDeposit / 1000).toFixed(0)}k dep.
                                </span>
                              ) : null}
                            </div>
                            <Link
                              to={`/property/${property.id}`}
                              className="shrink-0 rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold text-primary-foreground shadow-sm transition-all hover:brightness-110 hover:shadow-md"
                            >
                              Book Visit
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Tenant Insights — kept below the map split */}
            <DashboardPanel
              title="Tenant Insights"
              description="Signals that keep your housing search focused."
            >
              <div className="grid gap-3 sm:grid-cols-3">
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
