import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { MapPin, Search, SlidersHorizontal } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";

type Listing = {
  id: string;
  title: string;
  address: string;
  rent: number;
  houseType: string;
  propertyType: string;
  meta: string;
  image?: string;
};

const getFallbackImage = (propertyType: string) => {
  const normalized = propertyType.toLowerCase();
  if (normalized.includes("apartment") || normalized.includes("flat")) {
    return "https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=1200&q=80";
  }
  if (normalized.includes("villa") || normalized.includes("house")) {
    return "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=80";
  }
  if (normalized.includes("studio")) {
    return "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80";
  }
  if (normalized.includes("floor")) {
    return "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=80";
  }
  return "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80";
};

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState<Listing[]>([]);
  const [showMap, setShowMap] = useState(false);

  const [location, setLocation] = useState(() => searchParams.get("q") ?? "");
  const [type, setType] = useState(() => searchParams.get("type") ?? "any");
  const [budget, setBudget] = useState(
    () => searchParams.get("budget") ?? "any"
  );

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      const { data: rows } = await supabase
        .from("properties")
        .select(
          "id, title, address, rent, house_type, property_type, bedrooms, bathrooms, super_builtup_area"
        )
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(120);

      const propertyIds = (rows ?? []).map((item) => item.id);
      const imageMap = new Map<string, string>();

      if (propertyIds.length > 0) {
        const { data: imageRows } = await supabase
          .from("property_images")
          .select("property_id, image_url, display_order")
          .in("property_id", propertyIds)
          .order("display_order", { ascending: true });

        (imageRows ?? []).forEach((image) => {
          if (!imageMap.has(image.property_id)) {
            imageMap.set(image.property_id, image.image_url);
          }
        });
      }

      const mapped: Listing[] = (rows ?? []).map((item) => {
        const metaParts = [
          item.house_type,
          item.bedrooms ? `${item.bedrooms} BHK` : null,
          item.bathrooms ? `${item.bathrooms} bath` : null,
          item.super_builtup_area ? `${item.super_builtup_area} sqft` : null,
        ].filter(Boolean);

        const propertyType = item.property_type || item.house_type || "";

        return {
          id: item.id,
          title: item.title,
          address: item.address,
          rent: item.rent,
          houseType: item.house_type,
          propertyType,
          meta: metaParts.join(" · "),
          image: imageMap.get(item.id) ?? getFallbackImage(propertyType),
        };
      });

      setListings(mapped);
      setLoading(false);
    };

    void load();
  }, []);

  const filteredListings = useMemo(() => {
    const q = location.trim().toLowerCase();

    const budgetMatch = (rent: number) => {
      if (budget === "any") return true;
      if (budget === "0-10000") return rent < 10000;
      if (budget === "10000-20000") return rent >= 10000 && rent <= 20000;
      if (budget === "20000-30000") return rent >= 20000 && rent <= 30000;
      if (budget === "30000+") return rent > 30000;
      return true;
    };

    const typeMatch = (value: string) => {
      if (type === "any") return true;
      const normalized = value.toLowerCase();
      if (type === "apartment")
        return normalized.includes("apartment") || normalized.includes("flat");
      if (type === "villa")
        return normalized.includes("villa") || normalized.includes("house");
      if (type === "studio") return normalized.includes("studio");
      if (type === "floor") return normalized.includes("floor");
      return true;
    };

    return listings.filter((listing) => {
      const locationOk = !q || listing.address.toLowerCase().includes(q);
      return (
        locationOk &&
        typeMatch(listing.propertyType) &&
        budgetMatch(listing.rent)
      );
    });
  }, [listings, location, type, budget]);

  const firstAddress = filteredListings[0]?.address ?? "";
  const mapQuery = encodeURIComponent(firstAddress || location || "India");

  const applyFiltersToUrl = () => {
    const params: Record<string, string> = {};
    if (location.trim()) params.q = location.trim();
    if (type !== "any") params.type = type;
    if (budget !== "any") params.budget = budget;
    setSearchParams(params, { replace: true });
  };

  const totalCount = filteredListings.length;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="border-b bg-card/40 pt-20">
        <div className="container mx-auto px-4 py-4 sm:py-6">
          <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                Search results
              </p>
              <h1 className="text-xl font-bold sm:text-2xl">
                Rentals{location ? ` around “${location}”` : ""}{" "}
                {totalCount > 0 && (
                  <span className="text-sm font-normal text-muted-foreground">
                    · {totalCount} home{totalCount === 1 ? "" : "s"}
                  </span>
                )}
              </h1>
            </div>
            <div className="flex items-center gap-2 sm:hidden">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowMap((prev) => !prev)}
                className="gap-2 rounded-full"
              >
                <MapPin className="h-4 w-4" />
                {showMap ? "Show list" : "Show map"}
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 rounded-2xl border border-border bg-background px-3 py-3 sm:px-4 sm:py-4">
            <div className="flex min-w-[220px] flex-1 items-center gap-2 rounded-xl border border-border bg-card px-3 py-2">
              <MapPin className="h-4 w-4 text-primary" />
              <Input
                placeholder="Search by area, city or landmark"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                className="h-8 border-none bg-transparent p-0 text-sm shadow-none focus-visible:ring-0"
              />
            </div>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="h-9 w-[150px] rounded-xl border-border bg-card text-xs sm:text-sm">
                <SelectValue placeholder="Any type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any type</SelectItem>
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="villa">Villa / House</SelectItem>
                <SelectItem value="studio">Studio</SelectItem>
                <SelectItem value="floor">Builder Floor</SelectItem>
              </SelectContent>
            </Select>
            <Select value={budget} onValueChange={setBudget}>
              <SelectTrigger className="h-9 w-[150px] rounded-xl border-border bg-card text-xs sm:text-sm">
                <SelectValue placeholder="Any budget" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any budget</SelectItem>
                <SelectItem value="0-10000">Under Rs. 10,000</SelectItem>
                <SelectItem value="10000-20000">Rs. 10k – Rs. 20k</SelectItem>
                <SelectItem value="20000-30000">Rs. 20k – Rs. 30k</SelectItem>
                <SelectItem value="30000+">Rs. 30,000+</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              className="ml-auto flex items-center gap-2 rounded-full"
              onClick={applyFiltersToUrl}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Update
            </Button>
          </div>
        </div>
      </main>

      <section className="py-4 sm:py-6">
        <div className="container mx-auto px-4">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
            <div className={showMap ? "hidden lg:block" : "block"}>
              {loading ? (
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Card
                      key={index}
                      className="overflow-hidden rounded-[1.5rem] border-border/50 bg-card"
                    >
                      <div className="grid gap-0 sm:grid-cols-[260px_minmax(0,1fr)]">
                        <Skeleton className="aspect-[4/3] w-full sm:h-full rounded-none" />
                        <CardContent className="flex flex-col justify-between gap-3 p-5 sm:p-6">
                          <div className="space-y-3">
                            <Skeleton className="h-4 w-1/3 rounded-full" />
                            <Skeleton className="h-6 w-3/4 rounded-full" />
                            <Skeleton className="h-4 w-1/2 rounded-full" />
                            <div className="flex gap-2 pt-2">
                              <Skeleton className="h-6 w-16 rounded-full" />
                              <Skeleton className="h-6 w-24 rounded-full" />
                            </div>
                          </div>
                          <div className="flex justify-between items-end border-t pt-4">
                            <div className="space-y-2">
                              <Skeleton className="h-3 w-10 rounded-full" />
                              <Skeleton className="h-6 w-24 rounded-full" />
                            </div>
                            <Skeleton className="h-9 w-20 rounded-full" />
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : filteredListings.length === 0 ? (
                <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-slate-50/50 p-8 text-center dark:bg-slate-900/20">
                  <div className="mb-4 rounded-full bg-slate-100 p-4 dark:bg-slate-800">
                    <Search className="h-8 w-8 text-muted-foreground/60" />
                  </div>
                  <h2 className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-200">
                    No homes match your criteria
                  </h2>
                  <p className="mt-2 max-w-md text-sm text-muted-foreground">
                    We couldn't find any properties matching your exact filters.
                    Try adjusting your search area or widening your budget.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-6 rounded-full px-6 transition-all hover:-translate-y-0.5 hover:shadow-sm"
                    onClick={() => {
                      setLocation("");
                      setType("any");
                      setBudget("any");
                      applyFiltersToUrl();
                    }}
                  >
                    Clear all filters
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredListings.map((listing) => (
                    <Card
                      key={listing.id}
                      className="group overflow-hidden rounded-[1.5rem] border border-border/50 bg-card/95 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_-10px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_12px_30px_-10px_rgba(0,0,0,0.5)]"
                    >
                      <Link
                        to={`/property/${listing.id}`}
                        className="grid gap-0 sm:grid-cols-[260px_minmax(0,1fr)]"
                      >
                        <div className="relative h-full overflow-hidden">
                          <img
                            src={listing.image}
                            alt={listing.title}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-500 ease-out sm:aspect-[4/3] group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                        </div>
                        <CardContent className="flex flex-col justify-between gap-3 p-5 sm:p-6">
                          <div>
                            <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/50">
                                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                              </span>
                              Verified landlord · KYC Checked
                            </p>
                            <h2 className="mt-2 line-clamp-2 text-lg font-bold leading-tight tracking-tight text-slate-900 transition-colors group-hover:text-primary dark:text-slate-100 sm:text-xl">
                              {listing.title}
                            </h2>
                            <p className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-500 dark:text-slate-400">
                              <MapPin className="h-3.5 w-3.5 shrink-0" />
                              <span className="line-clamp-1">
                                {listing.address}
                              </span>
                            </p>

                            <div className="mt-4 flex flex-wrap gap-2">
                              {listing.meta.split(" · ").map((tag, i) => (
                                <span
                                  key={i}
                                  className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="mt-4 flex items-end justify-between border-t border-border pt-4">
                            <div>
                              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                                Rent
                              </p>
                              <p className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-2xl">
                                Rs. {listing.rent.toLocaleString("en-IN")}
                                <span className="text-xs font-medium text-slate-500">
                                  {" "}
                                  / month
                                </span>
                              </p>
                            </div>
                            <Button
                              variant="default"
                              className="rounded-full bg-slate-900 px-6 font-semibold transition-transform hover:-translate-y-0.5 hover:shadow-md dark:bg-slate-100"
                            >
                              View
                            </Button>
                          </div>
                        </CardContent>
                      </Link>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            <div className={showMap ? "block" : "hidden lg:block"}>
              <div className="rounded-xl border bg-card p-3 sm:p-4">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold">Map view</p>
                  <p className="text-xs text-muted-foreground">
                    {firstAddress
                      ? "Centered on a matching listing"
                      : "Showing area based on your search"}
                  </p>
                </div>
                <div className="overflow-hidden rounded-lg border">
                  <iframe
                    title="Search map"
                    src={`https://maps.google.com/maps?q=${mapQuery}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                    className="h-[320px] w-full sm:h-[420px]"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
