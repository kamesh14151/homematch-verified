import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Search,
  Users,
  Lock,
  ArrowRight,
  Building2,
  UserCheck,
  FileCheck,
  Handshake,
  MapPin,
  Home,
  BedDouble,
  IndianRupee,
  Star,
  CheckCircle2,
  PhoneCall,
  TrendingUp,
  Sofa,
  Trees,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Navbar } from "@/components/Navbar";

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

const features = [
  { icon: ShieldCheck, title: "Verified Landlords", description: "Every landlord is PAN-verified ensuring only genuine owners list here." },
  { icon: Lock, title: "Secure Documents", description: "Tenant IDs encrypted and auto-deleted after 30 days for full privacy." },
  { icon: Search, title: "Smart Matching", description: "AI recommendations based on budget, location, family size & preferences." },
  { icon: Users, title: "Tenant Filtering", description: "Filter by occupation, company, family size and rent affordability." },
];

const stats = [
  { value: "10,000+", label: "Verified Listings" },
  { value: "50,000+", label: "Happy Tenants" },
  { value: "8,000+", label: "Verified Landlords" },
  { value: "99%", label: "Fraud-Free Rate" },
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
  { icon: UserCheck, title: "Register & Verify", description: "Sign up and verify your PAN card" },
  { icon: Building2, title: "List Property", description: "Add photos, video & all details" },
  { icon: Handshake, title: "Find Tenants", description: "Review & approve applications" },
];

const tenantSteps = [
  { icon: FileCheck, title: "Create Profile", description: "Add your details and preferences" },
  { icon: Search, title: "Search Houses", description: "Browse 10,000+ verified listings" },
  { icon: Home, title: "Apply & Move In", description: "Apply and connect with landlords" },
];

const topCities = [
  "Mumbai", "Delhi / NCR", "Bangalore", "Chennai", "Hyderabad", "Pune", "Kolkata", "Ahmedabad",
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.45 } }),
};

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

export default function Index() {
  const [activeTab, setActiveTab] = useState<"rent" | "buy" | "pg">("rent");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* â”€â”€ HERO â”€â”€ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0e2a5c] via-[#1a3a7a] to-[#0e2a5c] pb-20 pt-14">
        {/* subtle grid overlay */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M0 38.5h40v1H0zM0 .5h40v1H0zM.5 0v40h1V0zM38.5 0v40h1V0z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
        <div className="container relative mx-auto px-4">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0} className="mb-3 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white/90 backdrop-blur-sm">
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" /> India's Most Trusted Rental Platform
            </span>
          </motion.div>

          <motion.h1 initial="hidden" animate="visible" variants={fadeUp} custom={1}
            className="mx-auto mb-4 max-w-3xl text-center text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
            Find Your Perfect <span className="text-yellow-400">Verified</span> Rental Home
          </motion.h1>

          <motion.p initial="hidden" animate="visible" variants={fadeUp} custom={2}
            className="mx-auto mb-10 max-w-2xl text-center text-base text-blue-100/80 sm:text-lg">
            Connect with PAN-verified landlords. Secure documents. Smart matching. Zero fraud.
          </motion.p>

          {/* Search card */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={3}
            className="mx-auto max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-card">
            {/* Tabs */}
            <div className="flex border-b border-border">
              {(["rent", "buy", "pg"] as const).map((tab) => (
                <button key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-3.5 text-sm font-semibold capitalize transition-colors sm:flex-none sm:px-8 ${
                    activeTab === tab
                      ? "border-b-2 border-[#3A7AFE] text-[#3A7AFE]"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab === "pg" ? "PG / Hostel" : tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Inputs */}
            <div className="flex flex-col gap-0 sm:flex-row sm:divide-x sm:divide-border">
              <div className="relative flex-1 px-4 py-3.5">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Location / Pincode</label>
                <div className="mt-1 flex items-center gap-2">
                  <MapPin className="h-4 w-4 shrink-0 text-[#3A7AFE]" />
                  <Input placeholder="Enter city, area or PIN code" className="h-8 border-none p-0 text-sm font-medium shadow-none focus-visible:ring-0 bg-transparent" />
                </div>
              </div>
              <div className="relative px-4 py-3.5 sm:w-44">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Property Type</label>
                <Select>
                  <SelectTrigger className="mt-1 h-8 border-none p-0 text-sm font-medium shadow-none focus:ring-0 bg-transparent">
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
              <div className="relative px-4 py-3.5 sm:w-44">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Budget / Month</label>
                <Select>
                  <SelectTrigger className="mt-1 h-8 border-none p-0 text-sm font-medium shadow-none focus:ring-0 bg-transparent">
                    <SelectValue placeholder="Any Budget" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-10000">Under â‚¹10,000</SelectItem>
                    <SelectItem value="10000-20000">â‚¹10k â€“ â‚¹20k</SelectItem>
                    <SelectItem value="20000-30000">â‚¹20k â€“ â‚¹30k</SelectItem>
                    <SelectItem value="30000+">â‚¹30,000+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center p-3">
                <Button asChild className="h-12 w-full gap-2 rounded-xl bg-[#3A7AFE] px-8 text-sm font-bold hover:bg-[#2F65D8] sm:w-auto">
                  <Link to="/register"><Search className="h-4 w-4" /> Search</Link>
                </Button>
              </div>
            </div>
          </motion.div>

          {/* quick links */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={4}
            className="mt-5 flex flex-wrap justify-center gap-2 text-xs text-blue-200/70">
            <span className="font-medium text-blue-100/60">Recent:</span>
            {["Salem", "Coimbatore", "Chennai", "Bangalore", "Hyderabad"].map((city) => (
              <button key={city} className="rounded-full border border-white/20 px-3 py-1 hover:bg-white/10 hover:text-white transition-colors">
                {city}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* â”€â”€ STATS STRIP â”€â”€ */}
      <section className="border-b bg-card">
        <div className="container mx-auto grid grid-cols-2 divide-x divide-y divide-border sm:grid-cols-4 sm:divide-y-0">
          {stats.map((s, i) => (
            <motion.div key={s.label} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
              className="flex flex-col items-center py-6 text-center">
              <span className="text-2xl font-extrabold text-[#3A7AFE] sm:text-3xl">{s.value}</span>
              <span className="mt-1 text-xs font-medium text-muted-foreground">{s.label}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* â”€â”€ PROPERTY TYPES â”€â”€ */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold sm:text-3xl">Apartments, Villas and more</h2>
              <p className="mt-1 text-sm text-muted-foreground">Browse by property type</p>
            </div>
            <Link to="/register" className="hidden text-sm font-semibold text-[#3A7AFE] hover:underline sm:block">View all â†’</Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {propertyTypes.map((pt, i) => (
              <motion.div key={pt.label} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
                <Link to="/register">
                  <Card className={`group cursor-pointer overflow-hidden border transition-all hover:shadow-md hover:-translate-y-0.5 ${pt.color}`}>
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

      {/* â”€â”€ BHK CHOICE â”€â”€ */}
      <section className="bg-amber-50/60 py-16 dark:bg-amber-950/10">
        <div className="container mx-auto px-4">
          <div className="mb-2 flex items-center gap-2">
            <Home className="h-6 w-6 text-[#3A7AFE]" />
            <h2 className="text-2xl font-bold">BHK Choice in Mind?</h2>
          </div>
          <p className="mb-8 text-sm text-muted-foreground">Browse by number of bedrooms</p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {bhkOptions.map((b, i) => (
              <motion.div key={b.bhk} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
                <Link to="/register">
                  <Card className="group cursor-pointer border bg-white transition-all hover:shadow-md hover:-translate-y-0.5 dark:bg-card">
                    <CardContent className="flex flex-col items-center py-7 text-center">
                      <b.icon className="mb-3 h-10 w-10 text-[#3A7AFE] transition-transform group-hover:scale-110" />
                      <p className="font-semibold">{b.bhk}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{b.count} Properties</p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* â”€â”€ FURNISHING â”€â”€ */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-2 text-2xl font-bold">Homes by Furnishing</h2>
          <p className="mb-8 text-sm text-muted-foreground">Choose your preferred furnishing</p>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {furnishingOptions.map((f, i) => (
              <motion.div key={f.label} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
                <Link to="/register">
                  <Card className="group cursor-pointer border bg-card transition-all hover:shadow-md hover:-translate-y-0.5">
                    <CardContent className="flex items-center gap-4 p-5">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#3A7AFE]/10">
                        <f.icon className="h-6 w-6 text-[#3A7AFE]" />
                      </div>
                      <div>
                        <p className="font-semibold">{f.label}</p>
                        <p className="text-xs text-muted-foreground">Browse listings â†’</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* â”€â”€ WHY RENTVERIFY â”€â”€ */}
      <section id="features" className="bg-[#0e2a5c] py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <span className="mb-3 inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold text-blue-200">WHY RENTVERIFY</span>
            <h2 className="text-3xl font-bold text-white">India's Most Trusted Rental Platform</h2>
            <p className="mt-3 text-blue-200/70">Built with trust, security, and convenience at the core</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => (
              <motion.div key={f.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm transition-all hover:bg-white/10">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-400/10">
                    <f.icon className="h-7 w-7 text-yellow-400" />
                  </div>
                  <h3 className="mb-2 font-semibold text-white">{f.title}</h3>
                  <p className="text-sm text-blue-200/70">{f.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* â”€â”€ HOW IT WORKS â”€â”€ */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold">How It Works</h2>
            <p className="mt-3 text-muted-foreground">Simple steps for landlords and tenants</p>
          </div>
          <div className="grid gap-10 lg:grid-cols-2">
            {/* Landlord */}
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
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-sm font-bold text-orange-600 dark:bg-orange-900/30">
                      {i + 1}
                    </div>
                    <div>
                      <p className="font-semibold">{step.title}</p>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button asChild className="mt-6 w-full bg-orange-500 hover:bg-orange-600 text-white">
                <Link to="/register">List Your Property Free <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>

            {/* Tenant */}
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
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-sm font-bold text-[#3A7AFE] dark:bg-blue-900/30">
                      {i + 1}
                    </div>
                    <div>
                      <p className="font-semibold">{step.title}</p>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button asChild className="mt-6 w-full bg-[#3A7AFE] hover:bg-[#2F65D8] text-white">
                <Link to="/register">Find Your Home <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* â”€â”€ POST PROPERTY CTA â”€â”€ */}
      <section className="bg-green-50 py-16 dark:bg-green-950/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-start justify-between gap-8 rounded-2xl border border-green-200 bg-white p-8 shadow-sm dark:border-green-900/40 dark:bg-card sm:flex-row sm:items-center">
            <div>
              <h2 className="text-2xl font-bold text-foreground sm:text-3xl">Sell or rent faster at the right price!</h2>
              <p className="mt-2 text-muted-foreground">Your perfect tenant is waiting. List your property now for free.</p>
              <div className="mt-4 flex flex-wrap gap-3">
                {["Free Listing", "Verified Tenants", "Quick Response"].map((t) => (
                  <span key={t} className="flex items-center gap-1.5 text-sm font-medium text-green-700 dark:text-green-400">
                    <CheckCircle2 className="h-4 w-4" /> {t}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:items-center">
              <Button asChild size="lg" className="bg-[#3A7AFE] px-10 text-base font-bold hover:bg-[#2F65D8]">
                <Link to="/register">Post Property â€” It's FREE</Link>
              </Button>
              <a href="tel:+918000000000" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                <PhoneCall className="h-4 w-4" /> Post via call
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* â”€â”€ TOP CITIES â”€â”€ */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">Top Cities</div>
          <h2 className="mb-8 text-2xl font-bold sm:text-3xl">Explore Rentals in Popular Indian Cities</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
            {topCities.map((city, i) => (
              <motion.div key={city} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
                <Link to="/register">
                  <div className="group rounded-xl border bg-card p-4 text-center transition-all hover:border-[#3A7AFE] hover:shadow-sm">
                    <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#3A7AFE]/10 transition-colors group-hover:bg-[#3A7AFE]/20">
                      <MapPin className="h-5 w-5 text-[#3A7AFE]" />
                    </div>
                    <p className="text-xs font-semibold leading-tight">{city}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* â”€â”€ DEMAND INSIGHTS â”€â”€ */}
      <section className="border-t bg-card py-16">
        <div className="container mx-auto px-4">
          <div className="mb-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">Platform Insights</div>
          <h2 className="mb-8 text-2xl font-bold sm:text-3xl">Demand Across India</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { type: "Apartment", top: ["Bangalore", "Mumbai", "Hyderabad", "Pune", "Chennai"], pct: [32, 25, 18, 14, 11] },
              { type: "Independent House", top: ["Delhi NCR", "Chennai", "Jaipur", "Lucknow", "Ahmedabad"], pct: [28, 22, 20, 17, 13] },
              { type: "Studio / 1 BHK", top: ["Mumbai", "Bangalore", "Pune", "Hyderabad", "Noida"], pct: [35, 30, 16, 12, 7] },
            ].map((col, ci) => (
              <Card key={col.type} className="border">
                <CardContent className="p-5">
                  <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">{col.type}</p>
                  <p className="mb-4 text-[11px] text-muted-foreground">Most searched cities</p>
                  <div className="space-y-3">
                    {col.top.map((city, idx) => (
                      <div key={city}>
                        <div className="mb-1 flex justify-between text-xs font-medium">
                          <span>#{idx + 1} {city}</span>
                          <span className="text-muted-foreground">{col.pct[idx]}% Searches</span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                          <div className="h-full rounded-full bg-[#3A7AFE]" style={{ width: `${col.pct[idx]}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* â”€â”€ FOOTER â”€â”€ */}
      <footer className="border-t bg-[#0a0f1a] py-14 text-white">
        <div className="container mx-auto px-4">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div>
              <div className="mb-4 flex items-center gap-2">
                <img src="/1000130925-Photoroom.png" alt="RentVerify" className="h-9 w-9 rounded-lg object-contain" />
                <span className="font-bunderon text-xl text-white">RentVerify</span>
              </div>
              <p className="text-sm leading-relaxed text-white/50">
                India's most trusted rental verification platform. Connecting verified landlords and tenants since 2024.
              </p>
              <div className="mt-4 flex gap-3">
                {["f", "in", "tw", "yt"].map((s) => (
                  <div key={s} className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-xs text-white/50 hover:border-white/30 hover:text-white cursor-pointer transition-colors">
                    {s}
                  </div>
                ))}
              </div>
            </div>

            {/* RentVerify */}
            <div>
              <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-white/40">RentVerify</h4>
              <ul className="space-y-2.5 text-sm text-white/60">
                {["About Us", "Our Services", "Price Trends", "Post Property Free", "Articles", "Sitemap"].map((l) => (
                  <li key={l}><Link to="/register" className="hover:text-white transition-colors">{l}</Link></li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-white/40">Company</h4>
              <ul className="space-y-2.5 text-sm text-white/60">
                {["About AJ STUDIOZ", "Contact Us", "Careers", "Terms & Conditions", "Privacy Policy", "Safety Guide"].map((l) => (
                  <li key={l}><Link to="/register" className="hover:text-white transition-colors">{l}</Link></li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-white/40">Contact Us</h4>
              <div className="space-y-2.5 text-sm text-white/60">
                <p>Toll Free: <span className="text-white font-medium">1800-XXX-XXXX</span></p>
                <p>9:30 AM â€“ 6:30 PM (Monâ€“Sun)</p>
                <p>Email: <a href="mailto:support@rentverify.in" className="text-[#3A7AFE] hover:underline">support@rentverify.in</a></p>
              </div>
              <div className="mt-6">
                <p className="mb-3 text-xs font-bold uppercase tracking-widest text-white/40">Download App</p>
                <div className="flex flex-col gap-2">
                  <a href="#" className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-white hover:border-white/30 transition-colors">
                    â–¶ Google Play
                  </a>
                  <a href="#" className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-white hover:border-white/30 transition-colors">
                     App Store
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-8 text-xs text-white/30 sm:flex-row">
            <p>Â© 2026 RentVerify. All rights reserved.</p>
            <p>Crafted with â¤ï¸ by <a href="https://ajstudioz.com" className="text-white/50 hover:text-white transition-colors">AJ STUDIOZ</a></p>
          </div>
        </div>
      </footer>
    </div>
  );
}

