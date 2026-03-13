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
  IndianRupee,
  MapPin,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Navbar } from "@/components/Navbar";

const features = [
  {
    icon: ShieldCheck,
    title: "Verified Landlords",
    description: "Every landlord goes through PAN verification ensuring only genuine property owners list here.",
  },
  {
    icon: Lock,
    title: "Secure Documents",
    description: "Tenant ID proofs are encrypted and auto-deleted after 30 days for maximum privacy.",
  },
  {
    icon: Search,
    title: "Smart Matching",
    description: "AI-powered recommendations based on your budget, location, family size and preferences.",
  },
  {
    icon: Users,
    title: "Tenant Filtering",
    description: "Landlords can filter tenants by occupation, company, family size and rent affordability.",
  },
];

const landlordSteps = [
  { icon: UserCheck, title: "Register & Verify", description: "Sign up and verify your PAN" },
  { icon: Building2, title: "List Property", description: "Add photos, video & details" },
  { icon: Handshake, title: "Find Tenants", description: "Review and approve applications" },
];

const tenantSteps = [
  { icon: FileCheck, title: "Create Profile", description: "Add your details and preferences" },
  { icon: Search, title: "Search Houses", description: "Browse verified listings" },
  { icon: Home, title: "Apply & Move In", description: "Apply and connect with landlords" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
          <div className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-brand-terracotta/5 blur-3xl" />
        </div>

        <div className="container mx-auto px-4 text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
            <span className="inline-block rounded-full border bg-card px-4 py-1.5 text-xs font-semibold text-primary mb-6">
              🏠 Trusted by 10,000+ landlords & tenants
            </span>
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={1}
            className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl"
          >
            Find Your Perfect Home with{" "}
            <span className="bg-gradient-to-r from-primary to-brand-terracotta bg-clip-text text-transparent">
              Verified Rentals
            </span>
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={2}
            className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground"
          >
            Connect with verified landlords and tenants. Secure document handling,
            smart property matching, and trusted rental experiences.
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={3}
            className="mx-auto mt-10 max-w-3xl"
          >
            <Card className="border-2 p-2">
              <CardContent className="flex flex-col gap-3 p-2 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                  <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Enter location or PIN code" className="pl-10" />
                </div>
                <Select>
                  <SelectTrigger className="w-full sm:w-[150px]">
                    <SelectValue placeholder="House Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2bhk">2 BHK</SelectItem>
                    <SelectItem value="3bhk">3 BHK</SelectItem>
                    <SelectItem value="4bhk">4 BHK</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-full sm:w-[160px]">
                    <SelectValue placeholder="Rent Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-10000">Under ₹10,000</SelectItem>
                    <SelectItem value="10000-20000">₹10k – ₹20k</SelectItem>
                    <SelectItem value="20000-30000">₹20k – ₹30k</SelectItem>
                    <SelectItem value="30000+">₹30,000+</SelectItem>
                  </SelectContent>
                </Select>
                <Button className="gap-2">
                  <Search className="h-4 w-4" /> Search
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-background-secondary py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold">Why Choose RentVerify?</h2>
            <p className="mt-3 text-muted-foreground">Built with trust, security, and convenience at the core</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
              >
                <Card className="h-full text-center transition-all hover:shadow-lg hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                      <f.icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="mb-2 font-semibold">{f.title}</h3>
                    <p className="text-sm text-muted-foreground">{f.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold">How It Works</h2>
            <p className="mt-3 text-muted-foreground">Simple steps for landlords and tenants</p>
          </div>

          <div className="grid gap-12 lg:grid-cols-2">
            {/* Landlord Steps */}
            <div>
              <h3 className="mb-6 flex items-center gap-2 text-xl font-bold">
                <Building2 className="h-6 w-6 text-brand-terracotta" /> For Landlords
              </h3>
              <div className="space-y-4">
                {landlordSteps.map((step, i) => (
                  <motion.div
                    key={step.title}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeUp}
                    custom={i}
                  >
                    <Card className="transition-colors hover:bg-card-hover">
                      <CardContent className="flex items-center gap-4 p-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-terracotta/10 text-brand-terracotta font-bold">
                          {i + 1}
                        </div>
                        <div>
                          <h4 className="font-semibold">{step.title}</h4>
                          <p className="text-sm text-muted-foreground">{step.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Tenant Steps */}
            <div>
              <h3 className="mb-6 flex items-center gap-2 text-xl font-bold">
                <Users className="h-6 w-6 text-primary" /> For Tenants
              </h3>
              <div className="space-y-4">
                {tenantSteps.map((step, i) => (
                  <motion.div
                    key={step.title}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeUp}
                    custom={i}
                  >
                    <Card className="transition-colors hover:bg-card-hover">
                      <CardContent className="flex items-center gap-4 p-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold">
                          {i + 1}
                        </div>
                        <div>
                          <h4 className="font-semibold">{step.title}</h4>
                          <p className="text-sm text-muted-foreground">{step.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-primary to-brand-terracotta py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-primary-foreground">Ready to Find Your Perfect Home?</h2>
          <p className="mx-auto mt-4 max-w-xl text-primary-foreground/80">
            Join thousands of verified landlords and tenants on India's most trusted rental platform.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/register">
                Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10" asChild>
              <Link to="/register">List Your Property</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <img src="/1000130925-Photoroom.png" alt="RentVerify" className="h-8 w-8 rounded-lg object-contain" />
              <span className="font-bunderon font-bold">RentVerify</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2026 RentVerify. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
