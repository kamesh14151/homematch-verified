import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  BedDouble,
  Building2,
  Calculator,
  CheckCircle2,
  ChevronRight,
  FileCheck,
  FileText,
  Handshake,
  Headphones,
  Home,
  Lock,
  Newspaper,
  MapPin,
  PhoneCall,
  Search,
  ShieldCheck,
  Sofa,
  Sparkles,
  Star,
  Trees,
  UserCheck,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandWordmark } from "@/components/BrandWordmark";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Navbar } from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";

const features = [
  { icon: ShieldCheck, title: "Verified Landlords", description: "Every landlord is PAN-verified before listing." },
  { icon: Lock, title: "Secure Documents", description: "Tenant proofs are encrypted and auto-purged safely." },
  { icon: Search, title: "Smart Matching", description: "Find homes by budget, location, and family preferences." },
  { icon: Users, title: "Tenant Filtering", description: "Landlords can screen profiles with transparent details." },
];

const stats = [
  { value: "10,000+", label: "Verified Listings" },
  { value: "50,000+", label: "Happy Tenants" },
  { value: "8,000+", label: "Verified Landlords" },
  { value: "99%", label: "Fraud-Free Rate" },
];

const categoryChips = [
  "All Categories",
  "For Sale: Houses & Apartments",
  "For Rent: Houses & Apartments",
  "Beds-Wardrobes",
  "TVs, Video - Audio",
];

const filterGroups = [
  { title: "BHK", items: ["1", "2", "3", "4+"] },
  { title: "Furnishing", items: ["Unfurnished", "Semi-Furnished", "Fully Furnished"] },
];

type HomeListing = {
  id: string;
  title: string;
  price: string;
  meta: string;
  location: string;
  time: string;
  image?: string;
  address: string;
  rent: number;
  propertyType: string;
  bedrooms: number | null;
  furnishing: string | null;
  createdAt: string;
};

const solutionCards = [
  {
    icon: Search,
    title: "Discovery-first search",
    description: "Free-text location search, verified inventory and fast shortlist-friendly browsing.",
  },
  {
    icon: FileText,
    title: "Compliance-ready leasing",
    description: "Structured tenant profiles, document checks and cleaner approval workflows for landlords.",
  },
  {
    icon: Headphones,
    title: "Owner success tools",
    description: "Post faster, respond sooner and manage leads from one focused landlord workspace.",
  },
];

const researchTools = [
  {
    icon: BarChart3,
    title: "Price Trends",
    description: "See how rental demand and pricing move across major localities before you decide.",
    link: "/price-trends",
  },
  {
    icon: Calculator,
    title: "Affordability Planning",
    description: "Compare budget bands quickly and match them with furnishing and BHK expectations.",
    link: "/for-tenants",
  },
  {
    icon: Newspaper,
    title: "Guides & Insights",
    description: "Research-backed content for tenants, owners, compliance and smarter rental decisions.",
    link: "/articles",
  },
];

const trustSignals = [
  "PAN-verified landlords",
  "Direct landlord contact flow",
  "Application and chat tracking",
  "Document-safe verification model",
];

const testimonials = [
  {
    quote: "The platform feels more credible than generic classifieds because verification and applications are built into the flow.",
    name: "Sanjay Raman",
    role: "Property Owner, Chennai",
  },
  {
    quote: "Shortlisting was easier because listings showed the right signals first: area, budget, furnishing and trust markers.",
    name: "Nivetha K",
    role: "Tenant, Bengaluru",
  },
  {
    quote: "The landlord dashboard and request pipeline reduce follow-up chaos. It feels like an actual operating system for rentals.",
    name: "Ashwin Joseph",
    role: "Portfolio Manager, Hyderabad",
  },
];

const propertyTypes = [
  { label: "Independent House / Villa", count: "120+", color: "bg-amber-50 dark:bg-amber-950/40" },
  { label: "Residential Apartment", count: "70+", color: "bg-blue-50 dark:bg-blue-950/40" },
  { label: "Independent Builder Floor", count: "50+", color: "bg-green-50 dark:bg-green-950/40" },
  { label: "Studio Apartment", count: "30+", color: "bg-rose-50 dark:bg-rose-950/40" },
];

const bhkOptions = [
  { bhk: "1 RK / 1 BHK", count: "80+", icon: BedDouble },
  { bhk: "2 BHK", count: "150+", icon: BedDouble },
  { bhk: "3 BHK", count: "20+", icon: BedDouble },
  { bhk: "4+ BHK", count: "10+", icon: BedDouble },
];

const furnishingOptions = [
  { label: "Unfurnished", icon: Home },
  { label: "Semi-Furnished", icon: Sofa },
  { label: "Fully Furnished", icon: Trees },
];

const landlordSteps = [
  { icon: UserCheck, title: "Register & Verify", description: "Sign up and verify your PAN card." },
  { icon: Building2, title: "List Property", description: "Add photos, video and complete details." },
  { icon: Handshake, title: "Find Tenants", description: "Review and approve applications quickly." },
];

const tenantSteps = [
  { icon: FileCheck, title: "Create Profile", description: "Set your details and rental preferences." },
  { icon: Search, title: "Search Houses", description: "Browse thousands of verified homes." },
  { icon: Home, title: "Apply & Move In", description: "Apply and connect with the landlord directly." },
];

const topCities = ["Mumbai", "Delhi / NCR", "Bangalore", "Chennai", "Hyderabad", "Pune", "Kolkata", "Ahmedabad"];

const rentverifyLinks = [
  { label: "About Us", to: "/about-us" },
  { label: "Our Services", to: "/our-services" },
  { label: "Price Trends", to: "/price-trends" },
  { label: "Post Property Free", to: "/post-property-free" },
  { label: "Articles", to: "/articles" },
  { label: "Sitemap", to: "/sitemap" },
];

const companyLinks = [
  { label: "Company", to: "/company" },
  { label: "About AJ STUDIOZ", to: "/about-aj-studioz" },
  { label: "Contact Us", to: "/contact-us" },
  { label: "Careers", to: "/careers" },
  { label: "Terms & Conditions", to: "/terms-conditions" },
  { label: "Privacy Policy", to: "/privacy-policy" },
  { label: "Safety Guide", to: "/safety-guide" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.45 } }),
};

export default function Index() {
  const [activeTab, setActiveTab] = useState<"rent" | "buy" | "pg">("rent");
  const [searchLocation, setSearchLocation] = useState("");
  const [searchType, setSearchType] = useState("any");
  const [searchBudget, setSearchBudget] = useState("any");
  const [loadingListings, setLoadingListings] = useState(true);
  const [allListings, setAllListings] = useState<HomeListing[]>([]);
  const [filteredListings, setFilteredListings] = useState<HomeListing[]>([]);
  const [selectedBedrooms, setSelectedBedrooms] = useState<string[]>([]);
  const [selectedFurnishing, setSelectedFurnishing] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState("newest");

  useEffect(() => {
    const loadListings = async () => {
      setLoadingListings(true);

      const { data: rows } = await supabase
        .from("properties")
        .select("id, title, address, rent, house_type, property_type, bedrooms, bathrooms, super_builtup_area, furnishing, created_at")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(60);

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

      const mapped: HomeListing[] = (rows ?? []).map((item) => {
        const metaParts = [
          item.house_type,
          item.bathrooms ? `${item.bathrooms} Bathroom` : null,
          item.super_builtup_area ? `${item.super_builtup_area} sqft` : null,
        ].filter(Boolean);

        return {
          id: item.id,
          title: item.title,
          price: `Rs. ${item.rent.toLocaleString("en-IN")}`,
          meta: metaParts.join(" · "),
          location: item.address,
          time: new Date(item.created_at).toLocaleDateString("en-IN"),
          image: imageMap.get(item.id),
          address: item.address,
          rent: item.rent,
          propertyType: item.property_type || item.house_type || "",
          bedrooms: item.bedrooms,
          furnishing: item.furnishing,
          createdAt: item.created_at,
        };
      });

      setAllListings(mapped);
      setFilteredListings(mapped);
      setLoadingListings(false);
    };

    void loadListings();
  }, []);

  const applySearch = () => {
    const location = searchLocation.trim().toLowerCase();

    const budgetMatch = (rent: number) => {
      if (searchBudget === "any") return true;
      if (searchBudget === "0-10000") return rent < 10000;
      if (searchBudget === "10000-20000") return rent >= 10000 && rent <= 20000;
      if (searchBudget === "20000-30000") return rent >= 20000 && rent <= 30000;
      if (searchBudget === "30000+") return rent > 30000;
      return true;
    };

    const typeMatch = (type: string) => {
      if (searchType === "any") return true;
      const normalized = type.toLowerCase();
      if (searchType === "apartment") return normalized.includes("apartment") || normalized.includes("flat");
      if (searchType === "villa") return normalized.includes("villa") || normalized.includes("house");
      if (searchType === "studio") return normalized.includes("studio");
      if (searchType === "floor") return normalized.includes("floor");
      return true;
    };

    const bedroomMatch = (bedrooms: number | null) => {
      if (selectedBedrooms.length === 0) return true;
      if (bedrooms === null) return false;

      return selectedBedrooms.some((selected) => {
        if (selected === "4+") return bedrooms >= 4;
        return bedrooms === Number(selected);
      });
    };

    const furnishingMatch = (furnishing: string | null) => {
      if (selectedFurnishing.length === 0) return true;
      const normalized = (furnishing || "").toLowerCase();
      return selectedFurnishing.some((selected) => normalized === selected.toLowerCase());
    };

    const next = allListings.filter((listing) => {
      const locationOk = !location || listing.address.toLowerCase().includes(location);
      return (
        locationOk &&
        typeMatch(listing.propertyType) &&
        budgetMatch(listing.rent) &&
        bedroomMatch(listing.bedrooms) &&
        furnishingMatch(listing.furnishing)
      );
    });

    const sorted = [...next].sort((left, right) => {
      if (sortOption === "rent-low") return left.rent - right.rent;
      if (sortOption === "rent-high") return right.rent - left.rent;
      return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
    });

    setFilteredListings(sorted);
    const listingSection = document.getElementById("home-listings");
    listingSection?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const toggleSelection = (value: string, selected: string[], setSelected: (updater: (current: string[]) => string[]) => void) => {
    setSelected((current) =>
      current.includes(value) ? current.filter((item) => item !== value) : [...current, value],
    );
  };

  useEffect(() => {
    applySearch();
  }, [selectedBedrooms, selectedFurnishing, sortOption]);

  const listingTitle = useMemo(() => {
    if (!searchLocation.trim()) return "Flats for Rent";
    return `Flats for Rent in ${searchLocation.trim()}`;
  }, [searchLocation]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <section className="relative overflow-hidden bg-gradient-to-br from-[#0e2a5c] via-[#1a3a7a] to-[#0e2a5c] pb-12 pt-10 sm:pb-20 sm:pt-14">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M0 38.5h40v1H0zM0 .5h40v1H0zM.5 0v40h1V0zM38.5 0v40h1V0z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
        <div className="container relative mx-auto px-4">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0} className="mb-3 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold text-white/90 backdrop-blur-sm sm:px-4 sm:py-1.5 sm:text-xs">
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" /> India&apos;s Most Trusted Rental Platform
            </span>
          </motion.div>
          <motion.h1 initial="hidden" animate="visible" variants={fadeUp} custom={1} className="mx-auto mb-3 max-w-3xl text-center text-3xl font-extrabold leading-tight text-white sm:mb-4 sm:text-5xl lg:text-6xl">
            Find Your Perfect <span className="text-yellow-400">Verified</span> Rental Home
          </motion.h1>
          <motion.p initial="hidden" animate="visible" variants={fadeUp} custom={2} className="mx-auto mb-7 max-w-2xl text-center text-sm text-blue-100/80 sm:mb-10 sm:text-lg">
            Connect with PAN-verified landlords. Secure documents. Smart matching. Zero fraud.
          </motion.p>

          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={3} className="mx-auto max-w-4xl overflow-hidden rounded-xl bg-white shadow-2xl sm:rounded-2xl dark:bg-card">
            <div className="flex border-b border-border">
              {(["rent", "buy", "pg"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-3 text-xs font-semibold capitalize transition-colors sm:flex-none sm:px-8 sm:py-3.5 sm:text-sm ${activeTab === tab ? "border-b-2 border-[#3A7AFE] text-[#3A7AFE]" : "text-muted-foreground hover:text-foreground"}`}
                >
                  {tab === "pg" ? "PG / Hostel" : tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
            <div className="flex flex-col gap-0 sm:flex-row sm:divide-x sm:divide-border">
              <div className="relative flex-1 px-4 py-3">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Location / Pincode</label>
                <div className="mt-1 flex items-center gap-2">
                  <MapPin className="h-4 w-4 shrink-0 text-[#3A7AFE]" />
                  <Input
                    placeholder="Enter city, area or PIN code"
                    value={searchLocation}
                    onChange={(event) => setSearchLocation(event.target.value)}
                    className="h-8 border-none bg-transparent p-0 text-sm font-medium shadow-none focus-visible:ring-0"
                  />
                </div>
              </div>
              <div className="relative px-4 py-3 sm:w-44">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Property Type</label>
                <Select value={searchType} onValueChange={setSearchType}>
                  <SelectTrigger className="mt-1 h-8 border-none bg-transparent p-0 text-sm font-medium shadow-none focus:ring-0">
                    <SelectValue placeholder="Any Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="villa">Villa / House</SelectItem>
                    <SelectItem value="studio">Studio</SelectItem>
                    <SelectItem value="floor">Builder Floor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="relative px-4 py-3 sm:w-44">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Budget / Month</label>
                <Select value={searchBudget} onValueChange={setSearchBudget}>
                  <SelectTrigger className="mt-1 h-8 border-none bg-transparent p-0 text-sm font-medium shadow-none focus:ring-0">
                    <SelectValue placeholder="Any Budget" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any Budget</SelectItem>
                    <SelectItem value="0-10000">Under Rs. 10,000</SelectItem>
                    <SelectItem value="10000-20000">Rs. 10k - Rs. 20k</SelectItem>
                    <SelectItem value="20000-30000">Rs. 20k - Rs. 30k</SelectItem>
                    <SelectItem value="30000+">Rs. 30,000+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center p-3">
                <Button onClick={applySearch} className="h-11 w-full gap-2 rounded-lg bg-yellow-400 px-6 text-sm font-bold text-gray-900 hover:bg-yellow-500 sm:h-12 sm:w-auto sm:rounded-xl sm:px-8">
                  <Search className="h-4 w-4" /> Search
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="border-b bg-card">
        <div className="container mx-auto grid grid-cols-2 divide-x divide-y divide-border sm:grid-cols-4 sm:divide-y-0">
          {stats.map((s, i) => (
            <motion.div key={s.label} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i} className="flex flex-col items-center py-6 text-center">
              <span className="text-2xl font-extrabold text-[#3A7AFE] sm:text-3xl">{s.value}</span>
              <span className="mt-1 text-xs font-medium text-muted-foreground">{s.label}</span>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="border-b bg-slate-50/70 py-10 dark:bg-slate-950/20">
        <div className="container mx-auto px-4">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.24em] text-[#3A7AFE]">Marketplace Standards</div>
              <h2 className="mt-2 text-2xl font-bold sm:text-3xl">Built for trust, conversion and operational clarity</h2>
            </div>
            <p className="max-w-2xl text-sm text-muted-foreground">
              Leading platforms win with strong trust signals, decision-support content and simplified journeys. RentVerify is now aligned with those core patterns.
            </p>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {solutionCards.map((card, index) => (
              <motion.div key={card.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={index}>
                <Card className="h-full border-0 bg-white shadow-[0_16px_48px_rgba(15,23,42,0.08)] dark:bg-card">
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#3A7AFE]/10">
                      <card.icon className="h-6 w-6 text-[#3A7AFE]" />
                    </div>
                    <h3 className="text-lg font-semibold">{card.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{card.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="home-listings" className="border-b bg-background py-6 sm:py-10">
        <div className="container mx-auto px-4">
          <div className="mb-4 flex flex-wrap gap-2 overflow-x-auto pb-1 sm:overflow-visible">
            {categoryChips.map((chip, index) => (
              <button
                key={chip}
                className={`whitespace-nowrap rounded-full border px-4 py-2 text-xs font-medium transition-colors sm:text-sm ${index === 0 ? "border-[#3A7AFE] bg-[#3A7AFE] text-white" : "bg-card text-muted-foreground hover:text-foreground"}`}
              >
                {chip}
              </button>
            ))}
          </div>
          <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
            <aside className="rounded-xl border bg-card p-4 lg:sticky lg:top-20 lg:h-fit">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">Filters</h3>
                  <p className="mt-1 text-xs text-muted-foreground">Refine results like leading marketplaces</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedBedrooms([]);
                    setSelectedFurnishing([]);
                    setSortOption("newest");
                  }}
                  className="text-xs font-semibold text-[#3A7AFE]"
                >
                  Reset
                </button>
              </div>

              {filterGroups.map((group) => {
                const selected = group.title === "BHK" ? selectedBedrooms : selectedFurnishing;
                const setSelected = group.title === "BHK" ? setSelectedBedrooms : setSelectedFurnishing;

                return (
                  <div key={group.title} className="mb-5">
                    <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-muted-foreground">{group.title}</h3>
                    <div className="space-y-2">
                      {group.items.map((item) => (
                        <label key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-border"
                            checked={selected.includes(item)}
                            onChange={() => toggleSelection(item, selected, setSelected)}
                          />
                          {item}
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}

              <div>
                <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-muted-foreground">Trust Signals</h3>
                <div className="space-y-2">
                  {trustSignals.map((item) => (
                    <div key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </aside>
            <div>
              <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-xl font-bold sm:text-2xl">{listingTitle}</h2>
                <Select value={sortOption} onValueChange={setSortOption}>
                  <SelectTrigger className="w-full sm:w-[220px]">
                    <SelectValue placeholder="Sort listings" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="rent-low">Rent: Low to High</SelectItem>
                    <SelectItem value="rent-high">Rent: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {loadingListings ? (
                <div className="rounded-xl border bg-card p-8 text-center text-muted-foreground">Loading listings...</div>
              ) : filteredListings.length === 0 ? (
                <div className="rounded-xl border bg-card p-8 text-center">
                  <p className="font-semibold">No listings found</p>
                  <p className="mt-1 text-sm text-muted-foreground">Try changing area, type, or budget filters.</p>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredListings.map((item) => (
                    <Link key={item.id} to={`/property/${item.id}`}>
                      <Card className="overflow-hidden border transition-all hover:-translate-y-0.5 hover:shadow-md">
                        <div className="relative h-40 overflow-hidden bg-muted sm:h-44">
                          {item.image ? (
                            <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full items-center justify-center text-muted-foreground">No image</div>
                          )}
                          <span className="absolute left-2 top-2 rounded bg-yellow-300 px-2 py-0.5 text-[10px] font-bold text-black">FEATURED</span>
                        </div>
                        <CardContent className="space-y-1.5 p-3.5 sm:p-4">
                          <p className="text-xl font-bold leading-none text-foreground sm:text-2xl">{item.price}</p>
                          <p className="text-xs font-semibold text-foreground/90 sm:text-sm">{item.meta}</p>
                          <p className="line-clamp-1 text-xs text-muted-foreground sm:text-sm">{item.title}</p>
                          <div className="flex items-center justify-between pt-1 text-[11px] text-muted-foreground sm:text-xs">
                            <span className="line-clamp-1">{item.location}</span>
                            <span>{item.time}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold sm:text-3xl">Apartments, Villas and more</h2>
              <p className="mt-1 text-sm text-muted-foreground">Browse by property type</p>
            </div>
            <Link to="/register" className="hidden text-sm font-semibold text-[#3A7AFE] hover:underline sm:block">View all <ChevronRight className="inline h-4 w-4" /></Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {propertyTypes.map((pt, i) => (
              <motion.div key={pt.label} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
                <Link to="/register">
                  <Card className={`group cursor-pointer overflow-hidden border transition-all hover:-translate-y-0.5 hover:shadow-md ${pt.color}`}>
                    <CardContent className="p-5">
                      <Building2 className="mb-3 h-8 w-8 text-[#3A7AFE] transition-transform group-hover:scale-110" />
                      <p className="font-semibold leading-tight">{pt.label}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{pt.count} Properties</p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-amber-50/60 py-16 dark:bg-amber-950/10">
        <div className="container mx-auto px-4">
          <div className="mb-2 flex items-center gap-2">
            <Home className="h-6 w-6 text-[#3A7AFE]" />
            <h2 className="text-2xl font-bold">BHK Choice in Mind?</h2>
          </div>
          <p className="mb-8 text-sm text-muted-foreground">Browse by number of bedrooms</p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {bhkOptions.map((item, i) => (
              <motion.div key={item.bhk} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
                <Card className="group border bg-white transition-all hover:-translate-y-0.5 hover:shadow-md dark:bg-card">
                  <CardContent className="flex flex-col items-center py-7 text-center">
                    <item.icon className="mb-3 h-10 w-10 text-[#3A7AFE] transition-transform group-hover:scale-110" />
                    <p className="font-semibold">{item.bhk}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{item.count} Properties</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-2 text-2xl font-bold">Homes by Furnishing</h2>
          <p className="mb-8 text-sm text-muted-foreground">Choose your preferred furnishing</p>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {furnishingOptions.map((option, i) => (
              <motion.div key={option.label} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
                <Card className="group border bg-card transition-all hover:-translate-y-0.5 hover:shadow-md">
                  <CardContent className="flex items-center gap-4 p-5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#3A7AFE]/10">
                      <option.icon className="h-6 w-6 text-[#3A7AFE]" />
                    </div>
                    <div>
                      <p className="font-semibold">{option.label}</p>
                      <p className="text-xs text-muted-foreground">Browse listings</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="bg-[#0e2a5c] py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <span className="mb-3 inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold text-blue-200">WHY RENTVERIFY</span>
            <h2 className="text-3xl font-bold text-white">India&apos;s Most Trusted Rental Platform</h2>
            <p className="mt-3 text-blue-200/70">Built with trust, security and convenience at the core</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, i) => (
              <motion.div key={feature.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm transition-all hover:bg-white/10">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-400/10">
                    <feature.icon className="h-7 w-7 text-yellow-400" />
                  </div>
                  <h3 className="mb-2 font-semibold text-white">{feature.title}</h3>
                  <p className="text-sm text-blue-200/70">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="insights" className="border-y bg-gradient-to-b from-white to-slate-50 py-16 dark:from-background dark:to-slate-950/20">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.24em] text-[#3A7AFE]">Research & Insights</div>
              <h2 className="mt-2 text-2xl font-bold sm:text-3xl">Tools users expect before making a decision</h2>
            </div>
            <p className="max-w-2xl text-sm text-muted-foreground">
              Inspired by high-performing property portals, these sections reduce hesitation by combining search, insights and planning help in one experience.
            </p>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {researchTools.map((tool, index) => (
              <motion.div key={tool.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={index}>
                <Link to={tool.link}>
                  <Card className="h-full border bg-card transition-all hover:-translate-y-0.5 hover:border-[#3A7AFE]/40 hover:shadow-lg">
                    <CardContent className="p-6">
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#3A7AFE]/10">
                        <tool.icon className="h-6 w-6 text-[#3A7AFE]" />
                      </div>
                      <h3 className="text-lg font-semibold">{tool.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{tool.description}</p>
                      <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#3A7AFE]">
                        Explore <ArrowRight className="h-4 w-4" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold">How It Works</h2>
            <p className="mt-3 text-muted-foreground">Simple steps for landlords and tenants</p>
          </div>
          <div className="grid gap-10 lg:grid-cols-2">
            <div className="rounded-2xl border bg-card p-6 sm:p-8">
              <h3 className="mb-6 flex items-center gap-2 text-xl font-bold">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/30">
                  <Building2 className="h-4 w-4 text-orange-600" />
                </div>
                For Landlords
              </h3>
              <div className="space-y-4">
                {landlordSteps.map((step, i) => (
                  <div key={step.title} className="flex items-center gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-sm font-bold text-orange-600 dark:bg-orange-900/30">{i + 1}</div>
                    <div>
                      <p className="font-semibold">{step.title}</p>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button asChild className="mt-6 w-full bg-orange-500 text-white hover:bg-orange-600">
                <Link to="/register">List Your Property Free <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>

            <div className="rounded-2xl border bg-card p-6 sm:p-8">
              <h3 className="mb-6 flex items-center gap-2 text-xl font-bold">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <Users className="h-4 w-4 text-[#3A7AFE]" />
                </div>
                For Tenants
              </h3>
              <div className="space-y-4">
                {tenantSteps.map((step, i) => (
                  <div key={step.title} className="flex items-center gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-sm font-bold text-[#3A7AFE] dark:bg-blue-900/30">{i + 1}</div>
                    <div>
                      <p className="font-semibold">{step.title}</p>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button asChild className="mt-6 w-full bg-[#3A7AFE] text-white hover:bg-[#2F65D8]">
                <Link to="/register">Find Your Home <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-green-50 py-16 dark:bg-green-950/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-start justify-between gap-8 rounded-2xl border border-green-200 bg-white p-8 shadow-sm dark:border-green-900/40 dark:bg-card sm:flex-row sm:items-center">
            <div>
              <h2 className="text-2xl font-bold text-foreground sm:text-3xl">Sell or rent faster at the right price</h2>
              <p className="mt-2 text-muted-foreground">Your perfect tenant is waiting. List your property now for free.</p>
              <div className="mt-4 flex flex-wrap gap-3">
                {[
                  "Free Listing",
                  "Verified Tenants",
                  "Quick Response",
                ].map((item) => (
                  <span key={item} className="flex items-center gap-1.5 text-sm font-medium text-green-700 dark:text-green-400">
                    <CheckCircle2 className="h-4 w-4" /> {item}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:items-center">
              <Button asChild size="lg" className="bg-[#3A7AFE] px-10 text-base font-bold hover:bg-[#2F65D8]">
                <Link to="/register">Post Property - It&apos;s FREE</Link>
              </Button>
              <a href="tel:+918000000000" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                <PhoneCall className="h-4 w-4" /> Post via call
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="trust-proof" className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 text-center">
            <div className="text-xs font-bold uppercase tracking-[0.24em] text-[#3A7AFE]">Proof of Trust</div>
            <h2 className="mt-2 text-2xl font-bold sm:text-3xl">What stronger marketplace design should feel like</h2>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <motion.div key={testimonial.name} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={index}>
                <Card className="h-full border bg-card shadow-sm">
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-center gap-1 text-amber-500">
                      {Array.from({ length: 5 }).map((_, starIndex) => (
                        <Star key={starIndex} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <p className="text-sm leading-7 text-foreground/85">&ldquo;{testimonial.quote}&rdquo;</p>
                    <div className="mt-5 border-t pt-4">
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="services" className="bg-[#0b1220] py-16 text-white">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.24em] text-blue-300">Owner & Tenant Services</div>
              <h2 className="mt-2 text-2xl font-bold sm:text-3xl">More than listings. A managed rental workflow.</h2>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70">
              <Sparkles className="h-4 w-4 text-yellow-400" /> Inspired by category leaders, adapted for verified rentals.
            </div>
          </div>
          <div className="grid gap-4 lg:grid-cols-4">
            {[
              "Verified lead handling",
              "Application review workflows",
              "Direct owner contact path",
              "Safer document and KYC readiness",
            ].map((item, index) => (
              <motion.div key={item} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={index}>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                  <CheckCircle2 className="mb-3 h-5 w-5 text-green-400" />
                  <p className="font-medium text-white/90">{item}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">Top Cities</div>
          <h2 className="mb-8 text-2xl font-bold sm:text-3xl">Explore Rentals in Popular Indian Cities</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
            {topCities.map((city, i) => (
              <motion.div key={city} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
                <div className="group rounded-xl border bg-card p-4 text-center transition-all hover:border-[#3A7AFE] hover:shadow-sm">
                  <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#3A7AFE]/10 transition-colors group-hover:bg-[#3A7AFE]/20">
                    <MapPin className="h-5 w-5 text-[#3A7AFE]" />
                  </div>
                  <p className="text-xs font-semibold leading-tight">{city}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t bg-[#0a0f1a] py-12 text-white sm:py-14">
        <div className="container mx-auto px-4">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <BrandWordmark theme="dark" compact />
              </div>
              <p className="text-sm leading-relaxed text-white/50">India&apos;s trusted rental verification platform for secure, transparent rentals.</p>
            </div>
            <div>
              <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-white/40">RentVerify</h4>
              <ul className="space-y-2.5 text-sm text-white/60">
                {rentverifyLinks.map((item) => (
                  <li key={item.label}><Link to={item.to} className="hover:text-white">{item.label}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-white/40">Company</h4>
              <ul className="space-y-2.5 text-sm text-white/60">
                {companyLinks.map((item) => (
                  <li key={item.label}><Link to={item.to} className="hover:text-white">{item.label}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-white/40">Contact Us</h4>
              <div className="space-y-2.5 text-sm text-white/60">
                <p>Toll Free: <span className="font-medium text-white">1800-XXX-XXXX</span></p>
                <p>9:30 AM - 6:30 PM (Mon-Sun)</p>
                <p>Email: <a href="mailto:support@rentverify.in" className="text-[#3A7AFE] hover:underline">support@rentverify.in</a></p>
              </div>
            </div>
          </div>
          <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-8 text-xs text-white/30 sm:flex-row">
            <p>Copyright 2026 RentVerify. All rights reserved.</p>
            <p>Crafted with love by <a href="https://ajstudioz.com" className="text-white/60 hover:text-white">AJ STUDIOZ</a></p>
          </div>
        </div>
      </footer>
    </div>
  );
}
