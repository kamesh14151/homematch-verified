import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
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
  Heart,
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
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Navbar } from "@/components/Navbar";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";

const features = [
  {
    icon: ShieldCheck,
    title: "Verified Landlords",
    description: "Every landlord is PAN-verified before listing.",
  },
  {
    icon: Lock,
    title: "Secure Documents",
    description: "Tenant proofs are encrypted and auto-purged safely.",
  },
  {
    icon: Search,
    title: "Smart Matching",
    description: "Find homes by budget, location, and family preferences.",
  },
  {
    icon: Users,
    title: "Tenant Filtering",
    description: "Landlords can screen profiles with transparent details.",
  },
];

const stats = [
  { value: "10,000+", label: "Verified Listings" },
  { value: "50,000+", label: "Happy Tenants" },
  { value: "8,000+", label: "Verified Landlords" },
  { value: "99%", label: "Fraud-Free Rate" },
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
    description:
      "Free-text location search, verified inventory and fast shortlist-friendly browsing.",
  },
  {
    icon: FileText,
    title: "Compliance-ready leasing",
    description:
      "Structured tenant profiles, document checks and cleaner approval workflows for landlords.",
  },
  {
    icon: Headphones,
    title: "Owner success tools",
    description:
      "Post faster, respond sooner and manage leads from one focused landlord workspace.",
  },
];

const researchTools = [
  {
    icon: BarChart3,
    title: "Price Trends",
    description:
      "See how rental demand and pricing move across major localities before you decide.",
    link: "/price-trends",
  },
  {
    icon: Calculator,
    title: "Affordability Planning",
    description:
      "Compare budget bands quickly and match them with furnishing and BHK expectations.",
    link: "/for-tenants",
  },
  {
    icon: Newspaper,
    title: "Guides & Insights",
    description:
      "Research-backed content for tenants, owners, compliance and smarter rental decisions.",
    link: "/articles",
  },
];

const testimonials = [
  {
    quote:
      "The platform feels more credible than generic classifieds because verification and applications are built into the flow.",
    name: "Sanjay Raman",
    role: "Property Owner, Chennai",
  },
  {
    quote:
      "Shortlisting was easier because listings showed the right signals first: area, budget, furnishing and trust markers.",
    name: "Nivetha K",
    role: "Tenant, Bengaluru",
  },
  {
    quote:
      "The landlord dashboard and request pipeline reduce follow-up chaos. It feels like an actual operating system for rentals.",
    name: "Ashwin Joseph",
    role: "Portfolio Manager, Hyderabad",
  },
];

const propertyTypes = [
  {
    label: "Independent House / Villa",
    count: "120+",
    color: "bg-amber-50/80 dark:bg-amber-950/30",
  },
  {
    label: "Residential Apartment",
    count: "70+",
    color: "bg-primary/8 dark:bg-primary/12",
  },
  {
    label: "Independent Builder Floor",
    count: "50+",
    color: "bg-success/10 dark:bg-success/15",
  },
  {
    label: "Studio Apartment",
    count: "30+",
    color: "bg-secondary dark:bg-secondary/80",
  },
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
  {
    icon: UserCheck,
    title: "Register & Verify",
    description: "Sign up and verify your PAN card.",
  },
  {
    icon: Building2,
    title: "List Property",
    description: "Add photos, video and complete details.",
  },
  {
    icon: Handshake,
    title: "Find Tenants",
    description: "Review and approve applications quickly.",
  },
];

const tenantSteps = [
  {
    icon: FileCheck,
    title: "Create Profile",
    description: "Set your details and rental preferences.",
  },
  {
    icon: Search,
    title: "Search Houses",
    description: "Browse thousands of verified homes.",
  },
  {
    icon: Home,
    title: "Apply & Move In",
    description: "Apply and connect with the landlord directly.",
  },
];

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
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45 },
  }),
};

const getListingCity = (address: string) => {
  const parts = address
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  return parts.length >= 2 ? parts[1] : parts[0] || "Popular areas";
};

const propertyFallbackImages = {
  apartment:
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
  villa:
    "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80",
  studio:
    "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80",
  floor:
    "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
  default:
    "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?auto=format&fit=crop&w=1200&q=80",
} as const;

const getFallbackListingImage = (propertyType: string) => {
  const normalized = propertyType.toLowerCase();
  if (normalized.includes("apartment") || normalized.includes("flat"))
    return propertyFallbackImages.apartment;
  if (normalized.includes("villa") || normalized.includes("house"))
    return propertyFallbackImages.villa;
  if (normalized.includes("studio")) return propertyFallbackImages.studio;
  if (normalized.includes("floor")) return propertyFallbackImages.floor;
  return propertyFallbackImages.default;
};

const sampleListings: HomeListing[] = [
  {
    id: "sample-bengaluru-1",
    title: "Skyline 2BHK in Indiranagar",
    price: "Rs. 28,000",
    meta: "2 BHK · 2 Bathroom · 1100 sqft",
    location: "Indiranagar, Bengaluru, Karnataka",
    time: "14/03/2026",
    image:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
    address: "Indiranagar, Bengaluru, Karnataka",
    rent: 28000,
    propertyType: "Apartment",
    bedrooms: 2,
    furnishing: "Semi-Furnished",
    createdAt: "2026-03-14T10:00:00.000Z",
  },
  {
    id: "sample-bengaluru-2",
    title: "Minimal Studio near Koramangala",
    price: "Rs. 18,500",
    meta: "Studio · 1 Bathroom · 540 sqft",
    location: "Koramangala, Bengaluru, Karnataka",
    time: "13/03/2026",
    image:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
    address: "Koramangala, Bengaluru, Karnataka",
    rent: 18500,
    propertyType: "Studio",
    bedrooms: 1,
    furnishing: "Fully Furnished",
    createdAt: "2026-03-13T10:00:00.000Z",
  },
  {
    id: "sample-chennai-1",
    title: "Sunny Family Flat in Adyar",
    price: "Rs. 24,000",
    meta: "2 BHK · 2 Bathroom · 980 sqft",
    location: "Adyar, Chennai, Tamil Nadu",
    time: "12/03/2026",
    image:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80",
    address: "Adyar, Chennai, Tamil Nadu",
    rent: 24000,
    propertyType: "Apartment",
    bedrooms: 2,
    furnishing: "Semi-Furnished",
    createdAt: "2026-03-12T10:00:00.000Z",
  },
  {
    id: "sample-chennai-2",
    title: "Compact 1BHK in Velachery",
    price: "Rs. 15,500",
    meta: "1 BHK · 1 Bathroom · 620 sqft",
    location: "Velachery, Chennai, Tamil Nadu",
    time: "11/03/2026",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
    address: "Velachery, Chennai, Tamil Nadu",
    rent: 15500,
    propertyType: "Apartment",
    bedrooms: 1,
    furnishing: "Unfurnished",
    createdAt: "2026-03-11T10:00:00.000Z",
  },
  {
    id: "sample-hyderabad-1",
    title: "Modern 3BHK near Hitech City",
    price: "Rs. 36,000",
    meta: "3 BHK · 3 Bathroom · 1600 sqft",
    location: "Hitech City, Hyderabad, Telangana",
    time: "10/03/2026",
    image:
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80",
    address: "Hitech City, Hyderabad, Telangana",
    rent: 36000,
    propertyType: "Villa",
    bedrooms: 3,
    furnishing: "Fully Furnished",
    createdAt: "2026-03-10T10:00:00.000Z",
  },
  {
    id: "sample-hyderabad-2",
    title: "Quiet Builder Floor in Gachibowli",
    price: "Rs. 22,000",
    meta: "2 BHK · 2 Bathroom · 1020 sqft",
    location: "Gachibowli, Hyderabad, Telangana",
    time: "09/03/2026",
    image:
      "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?auto=format&fit=crop&w=1200&q=80",
    address: "Gachibowli, Hyderabad, Telangana",
    rent: 22000,
    propertyType: "Builder Floor",
    bedrooms: 2,
    furnishing: "Semi-Furnished",
    createdAt: "2026-03-09T10:00:00.000Z",
  },
  {
    id: "sample-pune-1",
    title: "Designer 2BHK in Baner",
    price: "Rs. 26,500",
    meta: "2 BHK · 2 Bathroom · 1080 sqft",
    location: "Baner, Pune, Maharashtra",
    time: "08/03/2026",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
    address: "Baner, Pune, Maharashtra",
    rent: 26500,
    propertyType: "Apartment",
    bedrooms: 2,
    furnishing: "Fully Furnished",
    createdAt: "2026-03-08T10:00:00.000Z",
  },
  {
    id: "sample-pune-2",
    title: "Cozy Rental in Wakad",
    price: "Rs. 19,000",
    meta: "1 BHK · 1 Bathroom · 700 sqft",
    location: "Wakad, Pune, Maharashtra",
    time: "07/03/2026",
    image:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
    address: "Wakad, Pune, Maharashtra",
    rent: 19000,
    propertyType: "Apartment",
    bedrooms: 1,
    furnishing: "Semi-Furnished",
    createdAt: "2026-03-07T10:00:00.000Z",
  },
  {
    id: "sample-mumbai-1",
    title: "Sea View Flat in Powai",
    price: "Rs. 42,000",
    meta: "2 BHK · 2 Bathroom · 1180 sqft",
    location: "Powai, Mumbai, Maharashtra",
    time: "06/03/2026",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
    address: "Powai, Mumbai, Maharashtra",
    rent: 42000,
    propertyType: "Apartment",
    bedrooms: 2,
    furnishing: "Fully Furnished",
    createdAt: "2026-03-06T10:00:00.000Z",
  },
  {
    id: "sample-mumbai-2",
    title: "Compact Studio in Andheri",
    price: "Rs. 21,000",
    meta: "Studio · 1 Bathroom · 500 sqft",
    location: "Andheri, Mumbai, Maharashtra",
    time: "05/03/2026",
    image:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
    address: "Andheri, Mumbai, Maharashtra",
    rent: 21000,
    propertyType: "Studio",
    bedrooms: 1,
    furnishing: "Semi-Furnished",
    createdAt: "2026-03-05T10:00:00.000Z",
  },
  {
    id: "sample-delhi-1",
    title: "Bright 3BHK in South Delhi",
    price: "Rs. 39,500",
    meta: "3 BHK · 3 Bathroom · 1550 sqft",
    location: "South Delhi, Delhi / NCR",
    time: "04/03/2026",
    image:
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80",
    address: "South Delhi, Delhi / NCR",
    rent: 39500,
    propertyType: "Builder Floor",
    bedrooms: 3,
    furnishing: "Semi-Furnished",
    createdAt: "2026-03-04T10:00:00.000Z",
  },
  {
    id: "sample-delhi-2",
    title: "Modern 2BHK in Noida",
    price: "Rs. 24,500",
    meta: "2 BHK · 2 Bathroom · 1040 sqft",
    location: "Noida, Delhi / NCR",
    time: "03/03/2026",
    image:
      "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?auto=format&fit=crop&w=1200&q=80",
    address: "Noida, Delhi / NCR",
    rent: 24500,
    propertyType: "Apartment",
    bedrooms: 2,
    furnishing: "Unfurnished",
    createdAt: "2026-03-03T10:00:00.000Z",
  },
  {
    id: "sample-kolkata-1",
    title: "Classic Apartment in Salt Lake",
    price: "Rs. 20,500",
    meta: "2 BHK · 2 Bathroom · 960 sqft",
    location: "Salt Lake, Kolkata, West Bengal",
    time: "02/03/2026",
    image:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80",
    address: "Salt Lake, Kolkata, West Bengal",
    rent: 20500,
    propertyType: "Apartment",
    bedrooms: 2,
    furnishing: "Semi-Furnished",
    createdAt: "2026-03-02T10:00:00.000Z",
  },
  {
    id: "sample-ahmedabad-1",
    title: "Spacious Rental in Prahlad Nagar",
    price: "Rs. 23,000",
    meta: "2 BHK · 2 Bathroom · 1120 sqft",
    location: "Prahlad Nagar, Ahmedabad, Gujarat",
    time: "01/03/2026",
    image:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
    address: "Prahlad Nagar, Ahmedabad, Gujarat",
    rent: 23000,
    propertyType: "Apartment",
    bedrooms: 2,
    furnishing: "Fully Furnished",
    createdAt: "2026-03-01T10:00:00.000Z",
  },
  {
    id: "sample-bengaluru-3",
    title: "Terrace Home in Jayanagar",
    price: "Rs. 31,000",
    meta: "3 BHK · 2 Bathroom · 1320 sqft",
    location: "Jayanagar, Bengaluru, Karnataka",
    time: "28/02/2026",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
    address: "Jayanagar, Bengaluru, Karnataka",
    rent: 31000,
    propertyType: "Villa",
    bedrooms: 3,
    furnishing: "Semi-Furnished",
    createdAt: "2026-02-28T10:00:00.000Z",
  },
  {
    id: "sample-chennai-3",
    title: "Calm 2BHK in OMR",
    price: "Rs. 22,500",
    meta: "2 BHK · 2 Bathroom · 1010 sqft",
    location: "OMR, Chennai, Tamil Nadu",
    time: "27/02/2026",
    image:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
    address: "OMR, Chennai, Tamil Nadu",
    rent: 22500,
    propertyType: "Apartment",
    bedrooms: 2,
    furnishing: "Fully Furnished",
    createdAt: "2026-02-27T10:00:00.000Z",
  },
  {
    id: "sample-bengaluru-4",
    title: "Loft Apartment in HSR Layout",
    price: "Rs. 27,500",
    meta: "2 BHK · 2 Bathroom · 1060 sqft",
    location: "HSR Layout, Bengaluru, Karnataka",
    time: "26/02/2026",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
    address: "HSR Layout, Bengaluru, Karnataka",
    rent: 27500,
    propertyType: "Apartment",
    bedrooms: 2,
    furnishing: "Fully Furnished",
    createdAt: "2026-02-26T10:00:00.000Z",
  },
  {
    id: "sample-bengaluru-5",
    title: "Garden Villa in Whitefield",
    price: "Rs. 46,000",
    meta: "3 BHK · 3 Bathroom · 1820 sqft",
    location: "Whitefield, Bengaluru, Karnataka",
    time: "25/02/2026",
    image:
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80",
    address: "Whitefield, Bengaluru, Karnataka",
    rent: 46000,
    propertyType: "Villa",
    bedrooms: 3,
    furnishing: "Semi-Furnished",
    createdAt: "2026-02-25T10:00:00.000Z",
  },
  {
    id: "sample-bengaluru-6",
    title: "Compact Flat in Marathahalli",
    price: "Rs. 17,500",
    meta: "1 BHK · 1 Bathroom · 640 sqft",
    location: "Marathahalli, Bengaluru, Karnataka",
    time: "24/02/2026",
    image:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
    address: "Marathahalli, Bengaluru, Karnataka",
    rent: 17500,
    propertyType: "Apartment",
    bedrooms: 1,
    furnishing: "Semi-Furnished",
    createdAt: "2026-02-24T10:00:00.000Z",
  },
  {
    id: "sample-chennai-4",
    title: "Premium Flat in Anna Nagar",
    price: "Rs. 29,000",
    meta: "3 BHK · 2 Bathroom · 1280 sqft",
    location: "Anna Nagar, Chennai, Tamil Nadu",
    time: "23/02/2026",
    image:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
    address: "Anna Nagar, Chennai, Tamil Nadu",
    rent: 29000,
    propertyType: "Apartment",
    bedrooms: 3,
    furnishing: "Semi-Furnished",
    createdAt: "2026-02-23T10:00:00.000Z",
  },
  {
    id: "sample-chennai-5",
    title: "Bright Studio in T Nagar",
    price: "Rs. 16,500",
    meta: "Studio · 1 Bathroom · 520 sqft",
    location: "T Nagar, Chennai, Tamil Nadu",
    time: "22/02/2026",
    image:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80",
    address: "T Nagar, Chennai, Tamil Nadu",
    rent: 16500,
    propertyType: "Studio",
    bedrooms: 1,
    furnishing: "Fully Furnished",
    createdAt: "2026-02-22T10:00:00.000Z",
  },
  {
    id: "sample-chennai-6",
    title: "Family Home in Porur",
    price: "Rs. 21,500",
    meta: "2 BHK · 2 Bathroom · 940 sqft",
    location: "Porur, Chennai, Tamil Nadu",
    time: "21/02/2026",
    image:
      "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?auto=format&fit=crop&w=1200&q=80",
    address: "Porur, Chennai, Tamil Nadu",
    rent: 21500,
    propertyType: "Apartment",
    bedrooms: 2,
    furnishing: "Unfurnished",
    createdAt: "2026-02-21T10:00:00.000Z",
  },
  {
    id: "sample-hyderabad-3",
    title: "Executive Flat in Jubilee Hills",
    price: "Rs. 34,000",
    meta: "2 BHK · 2 Bathroom · 1200 sqft",
    location: "Jubilee Hills, Hyderabad, Telangana",
    time: "20/02/2026",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
    address: "Jubilee Hills, Hyderabad, Telangana",
    rent: 34000,
    propertyType: "Apartment",
    bedrooms: 2,
    furnishing: "Fully Furnished",
    createdAt: "2026-02-20T10:00:00.000Z",
  },
  {
    id: "sample-hyderabad-4",
    title: "Smart 1BHK in Kondapur",
    price: "Rs. 18,000",
    meta: "1 BHK · 1 Bathroom · 680 sqft",
    location: "Kondapur, Hyderabad, Telangana",
    time: "19/02/2026",
    image:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
    address: "Kondapur, Hyderabad, Telangana",
    rent: 18000,
    propertyType: "Apartment",
    bedrooms: 1,
    furnishing: "Semi-Furnished",
    createdAt: "2026-02-19T10:00:00.000Z",
  },
  {
    id: "sample-hyderabad-5",
    title: "Open Terrace Home in Madhapur",
    price: "Rs. 28,500",
    meta: "2 BHK · 2 Bathroom · 1140 sqft",
    location: "Madhapur, Hyderabad, Telangana",
    time: "18/02/2026",
    image:
      "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?auto=format&fit=crop&w=1200&q=80",
    address: "Madhapur, Hyderabad, Telangana",
    rent: 28500,
    propertyType: "Builder Floor",
    bedrooms: 2,
    furnishing: "Semi-Furnished",
    createdAt: "2026-02-18T10:00:00.000Z",
  },
  {
    id: "sample-pune-3",
    title: "Urban Flat in Kharadi",
    price: "Rs. 23,500",
    meta: "2 BHK · 2 Bathroom · 980 sqft",
    location: "Kharadi, Pune, Maharashtra",
    time: "17/02/2026",
    image:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80",
    address: "Kharadi, Pune, Maharashtra",
    rent: 23500,
    propertyType: "Apartment",
    bedrooms: 2,
    furnishing: "Fully Furnished",
    createdAt: "2026-02-17T10:00:00.000Z",
  },
  {
    id: "sample-pune-4",
    title: "Compact 1BHK in Hinjewadi",
    price: "Rs. 16,800",
    meta: "1 BHK · 1 Bathroom · 630 sqft",
    location: "Hinjewadi, Pune, Maharashtra",
    time: "16/02/2026",
    image:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
    address: "Hinjewadi, Pune, Maharashtra",
    rent: 16800,
    propertyType: "Apartment",
    bedrooms: 1,
    furnishing: "Unfurnished",
    createdAt: "2026-02-16T10:00:00.000Z",
  },
  {
    id: "sample-pune-5",
    title: "Calm Builder Floor in Aundh",
    price: "Rs. 27,000",
    meta: "2 BHK · 2 Bathroom · 1090 sqft",
    location: "Aundh, Pune, Maharashtra",
    time: "15/02/2026",
    image:
      "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?auto=format&fit=crop&w=1200&q=80",
    address: "Aundh, Pune, Maharashtra",
    rent: 27000,
    propertyType: "Builder Floor",
    bedrooms: 2,
    furnishing: "Semi-Furnished",
    createdAt: "2026-02-15T10:00:00.000Z",
  },
  {
    id: "sample-mumbai-3",
    title: "Contemporary Home in Bandra",
    price: "Rs. 48,000",
    meta: "2 BHK · 2 Bathroom · 1160 sqft",
    location: "Bandra, Mumbai, Maharashtra",
    time: "14/02/2026",
    image:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
    address: "Bandra, Mumbai, Maharashtra",
    rent: 48000,
    propertyType: "Apartment",
    bedrooms: 2,
    furnishing: "Fully Furnished",
    createdAt: "2026-02-14T10:00:00.000Z",
  },
  {
    id: "sample-mumbai-4",
    title: "Soft Loft in Lower Parel",
    price: "Rs. 38,500",
    meta: "1 BHK · 1 Bathroom · 720 sqft",
    location: "Lower Parel, Mumbai, Maharashtra",
    time: "13/02/2026",
    image:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
    address: "Lower Parel, Mumbai, Maharashtra",
    rent: 38500,
    propertyType: "Studio",
    bedrooms: 1,
    furnishing: "Semi-Furnished",
    createdAt: "2026-02-13T10:00:00.000Z",
  },
  {
    id: "sample-mumbai-5",
    title: "Family Apartment in Chembur",
    price: "Rs. 29,500",
    meta: "2 BHK · 2 Bathroom · 1020 sqft",
    location: "Chembur, Mumbai, Maharashtra",
    time: "12/02/2026",
    image:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80",
    address: "Chembur, Mumbai, Maharashtra",
    rent: 29500,
    propertyType: "Apartment",
    bedrooms: 2,
    furnishing: "Unfurnished",
    createdAt: "2026-02-12T10:00:00.000Z",
  },
  {
    id: "sample-delhi-3",
    title: "Refined 2BHK in Saket",
    price: "Rs. 31,000",
    meta: "2 BHK · 2 Bathroom · 1080 sqft",
    location: "Saket, Delhi / NCR",
    time: "11/02/2026",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
    address: "Saket, Delhi / NCR",
    rent: 31000,
    propertyType: "Apartment",
    bedrooms: 2,
    furnishing: "Fully Furnished",
    createdAt: "2026-02-11T10:00:00.000Z",
  },
  {
    id: "sample-delhi-4",
    title: "Budget 1BHK in Dwarka",
    price: "Rs. 17,200",
    meta: "1 BHK · 1 Bathroom · 610 sqft",
    location: "Dwarka, Delhi / NCR",
    time: "10/02/2026",
    image:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
    address: "Dwarka, Delhi / NCR",
    rent: 17200,
    propertyType: "Apartment",
    bedrooms: 1,
    furnishing: "Semi-Furnished",
    createdAt: "2026-02-10T10:00:00.000Z",
  },
  {
    id: "sample-delhi-5",
    title: "Elegant Builder Floor in Gurgaon",
    price: "Rs. 35,000",
    meta: "3 BHK · 3 Bathroom · 1480 sqft",
    location: "Gurgaon, Delhi / NCR",
    time: "09/02/2026",
    image:
      "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?auto=format&fit=crop&w=1200&q=80",
    address: "Gurgaon, Delhi / NCR",
    rent: 35000,
    propertyType: "Builder Floor",
    bedrooms: 3,
    furnishing: "Semi-Furnished",
    createdAt: "2026-02-09T10:00:00.000Z",
  },
  {
    id: "sample-kolkata-2",
    title: "Warm Home in Ballygunge",
    price: "Rs. 22,800",
    meta: "2 BHK · 2 Bathroom · 1000 sqft",
    location: "Ballygunge, Kolkata, West Bengal",
    time: "08/02/2026",
    image:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
    address: "Ballygunge, Kolkata, West Bengal",
    rent: 22800,
    propertyType: "Apartment",
    bedrooms: 2,
    furnishing: "Semi-Furnished",
    createdAt: "2026-02-08T10:00:00.000Z",
  },
  {
    id: "sample-kolkata-3",
    title: "Compact Studio in New Town",
    price: "Rs. 14,500",
    meta: "Studio · 1 Bathroom · 480 sqft",
    location: "New Town, Kolkata, West Bengal",
    time: "07/02/2026",
    image:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
    address: "New Town, Kolkata, West Bengal",
    rent: 14500,
    propertyType: "Studio",
    bedrooms: 1,
    furnishing: "Fully Furnished",
    createdAt: "2026-02-07T10:00:00.000Z",
  },
  {
    id: "sample-kolkata-4",
    title: "Classic Flat in Alipore",
    price: "Rs. 26,000",
    meta: "3 BHK · 2 Bathroom · 1340 sqft",
    location: "Alipore, Kolkata, West Bengal",
    time: "06/02/2026",
    image:
      "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?auto=format&fit=crop&w=1200&q=80",
    address: "Alipore, Kolkata, West Bengal",
    rent: 26000,
    propertyType: "Apartment",
    bedrooms: 3,
    furnishing: "Unfurnished",
    createdAt: "2026-02-06T10:00:00.000Z",
  },
  {
    id: "sample-ahmedabad-2",
    title: "Smart Apartment in Bodakdev",
    price: "Rs. 21,500",
    meta: "2 BHK · 2 Bathroom · 980 sqft",
    location: "Bodakdev, Ahmedabad, Gujarat",
    time: "05/02/2026",
    image:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80",
    address: "Bodakdev, Ahmedabad, Gujarat",
    rent: 21500,
    propertyType: "Apartment",
    bedrooms: 2,
    furnishing: "Semi-Furnished",
    createdAt: "2026-02-05T10:00:00.000Z",
  },
  {
    id: "sample-ahmedabad-3",
    title: "Sunny 1BHK in Satellite",
    price: "Rs. 15,800",
    meta: "1 BHK · 1 Bathroom · 610 sqft",
    location: "Satellite, Ahmedabad, Gujarat",
    time: "04/02/2026",
    image:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
    address: "Satellite, Ahmedabad, Gujarat",
    rent: 15800,
    propertyType: "Apartment",
    bedrooms: 1,
    furnishing: "Unfurnished",
    createdAt: "2026-02-04T10:00:00.000Z",
  },
  {
    id: "sample-ahmedabad-4",
    title: "Elegant Home in Thaltej",
    price: "Rs. 27,500",
    meta: "3 BHK · 2 Bathroom · 1420 sqft",
    location: "Thaltej, Ahmedabad, Gujarat",
    time: "03/02/2026",
    image:
      "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?auto=format&fit=crop&w=1200&q=80",
    address: "Thaltej, Ahmedabad, Gujarat",
    rent: 27500,
    propertyType: "Villa",
    bedrooms: 3,
    furnishing: "Semi-Furnished",
    createdAt: "2026-02-03T10:00:00.000Z",
  },
];

export default function Index() {
  const [activeTab, setActiveTab] = useState<"rent" | "buy" | "pg">("rent");
  const [searchLocation, setSearchLocation] = useState("");
  const [searchType, setSearchType] = useState("any");
  const [searchBudget, setSearchBudget] = useState("any");
  const [loadingListings, setLoadingListings] = useState(true);
  const [allListings, setAllListings] = useState<HomeListing[]>([]);
  const [filteredListings, setFilteredListings] = useState<HomeListing[]>([]);
  const [recentSearchChips, setRecentSearchChips] = useState<
    Array<{ label: string; location?: string; type?: string; budget?: string }>
  >([]);

  const navigate = useNavigate();

  useEffect(() => {
    const loadListings = async () => {
      setLoadingListings(true);

      const { data: rows } = await supabase
        .from("properties")
        .select(
          "id, title, address, rent, house_type, property_type, bedrooms, bathrooms, super_builtup_area, furnishing, created_at"
        )
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

      const completedListings = [
        ...mapped.map((listing) => ({
          ...listing,
          image: listing.image || getFallbackListingImage(listing.propertyType),
        })),
        ...sampleListings,
      ];

      setAllListings(completedListings);
      setFilteredListings(completedListings);
      setLoadingListings(false);
    };

    void loadListings();

    const stored = window.localStorage.getItem("rv_recent_searches");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Array<{
          label: string;
          location?: string;
          type?: string;
          budget?: string;
        }>;
        if (Array.isArray(parsed) && parsed.length > 0) {
          setRecentSearchChips(parsed.slice(0, 4));
        }
      } catch {
        // ignore
      }
    } else {
      setRecentSearchChips([
        {
          label: "Bengaluru · under Rs. 30,000",
          location: "bengaluru",
          budget: "20000-30000",
        },
        {
          label: "2 BHK in Chennai",
          location: "chennai",
          type: "apartment",
        },
        {
          label: "Studios in Hyderabad",
          location: "hyderabad",
          type: "studio",
        },
      ]);
    }
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
      if (searchType === "apartment")
        return normalized.includes("apartment") || normalized.includes("flat");
      if (searchType === "villa")
        return normalized.includes("villa") || normalized.includes("house");
      if (searchType === "studio") return normalized.includes("studio");
      if (searchType === "floor") return normalized.includes("floor");
      return true;
    };

    const next = allListings.filter((listing) => {
      const locationOk =
        !location || listing.address.toLowerCase().includes(location);
      return (
        locationOk &&
        typeMatch(listing.propertyType) &&
        budgetMatch(listing.rent)
      );
    });
    setFilteredListings(next);

    const labelParts: string[] = [];
    if (location) labelParts.push(location);
    if (searchType !== "any") labelParts.push(searchType);
    if (searchBudget !== "any") labelParts.push(searchBudget);
    const label =
      labelParts.length > 0 ? labelParts.join(" · ") : "Recent search";

    const nextChip = {
      label,
      location,
      type: searchType !== "any" ? searchType : undefined,
      budget: searchBudget !== "any" ? searchBudget : undefined,
    };
    setRecentSearchChips((prev) => {
      const merged = [
        nextChip,
        ...prev.filter((chip) => chip.label !== nextChip.label),
      ];
      const trimmed = merged.slice(0, 4);
      window.localStorage.setItem(
        "rv_recent_searches",
        JSON.stringify(trimmed)
      );
      return trimmed;
    });

    const params = new URLSearchParams();
    if (location) params.set("q", location);
    if (searchType !== "any") params.set("type", searchType);
    if (searchBudget !== "any") params.set("budget", searchBudget);
    navigate(`/search?${params.toString()}`);
  };

  const homeCarouselSections = useMemo(() => {
    const grouped = new Map<string, HomeListing[]>();

    filteredListings.forEach((listing) => {
      const city = getListingCity(listing.address);
      const current = grouped.get(city) ?? [];
      current.push(listing);
      grouped.set(city, current);
    });

    const topGroups = Array.from(grouped.entries())
      .sort((left, right) => right[1].length - left[1].length)
      .slice(0, 3)
      .map(([city, listings], index) => ({
        title:
          index === 0
            ? `Popular homes in ${city}`
            : index === 1
            ? `Available in ${city} this week`
            : `Trending stays around ${city}`,
        subtitle:
          index === 0
            ? "Guest-favorite rentals with strong photos and clear pricing"
            : index === 1
            ? "Freshly listed homes ready for shortlist and comparison"
            : "Well-presented homes people are viewing right now",
        listings: listings.slice(0, 12),
      }));

    if (topGroups.length > 0) {
      return topGroups;
    }

    return filteredListings.length > 0
      ? [
          {
            title: "Popular homes",
            subtitle: "Verified homes worth exploring now",
            listings: filteredListings.slice(0, 12),
          },
        ]
      : [];
  }, [filteredListings]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>HomeMatch - Verified Properties & Secure Rentals</title>
        <meta name="description" content="Find the perfect verified rental property, complete your secure KYC, and connect directly with trusted landlords." />
        <meta property="og:title" content="HomeMatch - Verified Properties & Secure Rentals" />
        <meta property="og:description" content="Find the perfect verified rental property, complete your secure KYC, and connect directly with trusted landlords." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="HomeMatch - Verified Properties & Secure Rentals" />
        <meta name="twitter:description" content="Find the perfect verified rental property, complete your secure KYC, and connect directly with trusted landlords." />
      </Helmet>

      <Navbar />

      <section className="relative overflow-hidden border-b bg-background pb-8 pt-28 sm:pb-12 sm:pt-32 lg:pt-36">
        <div className="container relative mx-auto px-4">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={0}
            className="mb-3 text-center"
          >
            <span className="trust-chip sm:px-4 sm:text-xs">
              <Star className="h-3.5 w-3.5 fill-primary text-primary" />{" "}
              100% online booking-ready rental flow
            </span>
          </motion.div>
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={1}
            className="mx-auto mb-2 max-w-4xl text-center text-[1.7rem] font-extrabold leading-[1.05] text-slate-900 sm:text-[2.8rem] lg:text-[3.8rem] dark:text-white"
          >
            Verified homes with the
            <span className="text-primary"> right trust signals</span> before
            you book
          </motion.h1>
          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={2}
            className="mx-auto mb-6 max-w-3xl text-center text-sm text-slate-600 sm:text-[1.02rem] dark:text-zinc-300/85"
          >
            Search by location, compare pricing, review availability, and spot
            verified landlord signals before you commit to a visit or booking
            request.
          </motion.p>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={3}
            className="surface-soft mx-auto max-w-5xl overflow-hidden"
          >
            <div className="flex justify-center gap-1 border-b border-border/80 px-3 pt-3">
              <button
                type="button"
                onClick={() => setActiveTab("rent")}
                className={`rounded-full px-5 py-2 text-xs font-semibold capitalize transition-colors sm:px-7 sm:text-sm ${
                  activeTab === "rent"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                Homes
              </button>
              <button
                type="button"
                disabled
                className="cursor-not-allowed rounded-full px-5 py-2 text-xs font-semibold capitalize text-muted-foreground/60 sm:px-7 sm:text-sm"
              >
                Rooms (soon)
              </button>
              <button
                type="button"
                disabled
                className="cursor-not-allowed rounded-full px-5 py-2 text-xs font-semibold capitalize text-muted-foreground/60 sm:px-7 sm:text-sm"
              >
                Studios (soon)
              </button>
            </div>
            <div className="p-3 md:p-5">
              <div className="grid gap-2 rounded-[1.8rem] border border-border/80 bg-white/92 p-2 md:grid-cols-[1.45fr_1fr_1fr_auto] md:items-center md:gap-0 md:rounded-[1.8rem] md:p-2 dark:bg-card/92">
                <div className="relative rounded-[1.25rem] px-3 py-3 transition-colors hover:bg-accent/50 md:px-5">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    City or locality
                  </label>
                  <div className="mt-1 flex items-center gap-2">
                    <MapPin className="h-4 w-4 shrink-0 text-primary" />
                    <Input
                      placeholder="Search destinations"
                      value={searchLocation}
                      onChange={(event) =>
                        setSearchLocation(event.target.value)
                      }
                      className="h-7 border-none bg-transparent p-0 text-sm font-medium shadow-none focus-visible:ring-0 truncate"
                    />
                  </div>
                </div>

                <div className="rounded-[1.25rem] px-3 py-3 transition-colors hover:bg-accent/50 md:relative md:px-5 md:before:absolute md:before:left-0 md:before:top-1/2 md:before:h-10 md:before:w-px md:before:-translate-y-1/2 md:before:bg-border">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Home type
                  </label>
                  <Select value={searchType} onValueChange={setSearchType}>
                    <SelectTrigger className="mt-1 h-7 border-none bg-transparent p-0 text-sm font-medium shadow-none focus:ring-0 [&>span]:truncate">
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
                </div>

                <div className="rounded-[1.25rem] px-3 py-3 transition-colors hover:bg-accent/50 md:relative md:px-5 md:before:absolute md:before:left-0 md:before:top-1/2 md:before:h-10 md:before:w-px md:before:-translate-y-1/2 md:before:bg-border">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Monthly budget
                  </label>
                  <Select value={searchBudget} onValueChange={setSearchBudget}>
                    <SelectTrigger className="mt-1 h-7 border-none bg-transparent p-0 text-sm font-medium shadow-none focus:ring-0 [&>span]:truncate">
                      <SelectValue placeholder="Any budget" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any Budget</SelectItem>
                      <SelectItem value="0-10000">Under Rs. 10,000</SelectItem>
                      <SelectItem value="10000-20000">
                        Rs. 10k - Rs. 20k
                      </SelectItem>
                      <SelectItem value="20000-30000">
                        Rs. 20k - Rs. 30k
                      </SelectItem>
                      <SelectItem value="30000+">Rs. 30,000+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-end p-2 md:p-0 md:pl-3">
                  <Button
                    onClick={applySearch}
                    className="h-12 w-full gap-2 rounded-full bg-primary px-7 text-sm font-semibold text-primary-foreground shadow-[0_18px_30px_-18px_hsl(var(--primary))] hover:bg-primary/90 md:w-auto"
                  >
                    <Search className="h-4 w-4" />
                    <span className="md:hidden lg:inline">Search</span>
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={4}
            className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[11px] sm:mt-5 sm:text-xs"
          >
            {[
              "PAN-verified landlords",
              "Deposit-safe flow",
              "Clear monthly pricing",
            ].map((item) => (
              <span
                key={item}
                className="rounded-full border border-border/70 bg-white/85 px-3 py-1.5 font-medium text-slate-600 shadow-sm dark:bg-card/70"
              >
                {item}
              </span>
            ))}
          </motion.div>

          {recentSearchChips.length > 0 && (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={5}
              className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[11px] sm:text-xs"
            >
              <span className="text-muted-foreground">Quick picks:</span>
              {recentSearchChips.map((chip) => (
                <button
                  key={chip.label}
                  type="button"
                  onClick={() => {
                    if (chip.location) setSearchLocation(chip.location);
                    if (chip.type) setSearchType(chip.type);
                    if (chip.budget) setSearchBudget(chip.budget);
                    applySearch();
                  }}
                  className="rounded-full border border-border/70 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition-colors hover:bg-accent"
                >
                  {chip.label}
                </button>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {loadingListings ? (
        <section className="bg-background py-8 sm:py-10">
          <div className="container mx-auto space-y-6 px-4">
            <div className="space-y-2">
              <div className="h-4 w-40 rounded-full bg-muted" />
              <div className="h-3 w-64 rounded-full bg-muted/80" />
            </div>
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="space-y-3">
                  <Skeleton className="aspect-[4/4.1] w-full rounded-[24px]" />
                  <div className="space-y-1.5 px-1">
                    <Skeleton className="h-3 w-5/6 rounded-full" />
                    <Skeleton className="h-3 w-2/3 rounded-full" />
                    <Skeleton className="h-3 w-3/4 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : (
        homeCarouselSections.length > 0 && (
          <section className="bg-background py-8 sm:py-10">
            <div className="container mx-auto space-y-8 px-4">
              {homeCarouselSections.map((section, sectionIndex) => (
                <motion.div
                  key={section.title}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  custom={sectionIndex}
                >
                  <div className="mb-4 flex items-end justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
                        {section.title}
                      </h2>
                      <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                        {section.subtitle}
                      </p>
                    </div>
                  </div>

                  <Carousel
                    opts={{ align: "start", loop: false }}
                    className="relative"
                  >
                    <CarouselContent className="-ml-3">
                      {section.listings.map((item) => (
                        <CarouselItem
                          key={`${section.title}-${item.id}`}
                          className="pl-3 basis-[85%] sm:basis-[48%] md:basis-[33%] lg:basis-[25%] xl:basis-[20%]"
                        >
                          <Link to={`/property/${item.id}`} className="block">
                            <div className="group overflow-hidden">
                              <div className="relative aspect-[4/3.8] overflow-hidden rounded-[1.5rem] bg-muted shadow-sm transition-transform duration-300 group-hover:shadow-md">
                                {item.image ? (
                                  <img
                                    src={item.image}
                                    alt={item.title}
                                    loading="lazy"
                                    onError={(event) => {
                                      event.currentTarget.src =
                                        getFallbackListingImage(
                                          item.propertyType
                                        );
                                    }}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                  />
                                ) : (
                                  <img
                                    src={getFallbackListingImage(
                                      item.propertyType
                                    )}
                                    alt={item.title}
                                    loading="lazy"
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                  />
                                )}

                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />

                                <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-[11px] font-bold text-slate-800 shadow-sm border-none dark:bg-card dark:text-slate-100">
                                  Guest favourite
                                </span>
                                <button
                                  type="button"
                                  aria-label="Save home"
                                  className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-slate-700 shadow-sm backdrop-blur transition-transform hover:scale-110"
                                >
                                  <Heart className="h-4 w-4" />
                                </button>
                              </div>

                              <div className="px-1 pb-1 pt-3">
                                <div className="flex items-start justify-between gap-3">
                                  <div>
                                    <p className="line-clamp-1 text-[15px] font-bold leading-tight tracking-tight text-foreground transition-colors group-hover:text-primary">
                                      {item.title}
                                    </p>
                                    <p className="mt-0.5 line-clamp-1 text-[13px] text-muted-foreground">
                                      {item.location}
                                    </p>
                                  </div>
                                  <div className="shrink-0 text-right">
                                    <div className="flex items-center gap-1 text-[13px] font-semibold text-foreground">
                                      <Star className="h-3.5 w-3.5 fill-foreground text-foreground" />
                                      <span>4.9</span>
                                    </div>
                                  </div>
                                </div>
                                <p className="mt-1 line-clamp-1 text-[13px] font-medium text-slate-600 dark:text-slate-400">
                                  {item.meta}
                                </p>
                                <p className="mt-0.5 text-[13px] text-muted-foreground">
                                  Available from {item.time}
                                </p>
                                <div className="mt-2 flex items-baseline gap-1">
                                  <span className="text-[15px] font-bold tracking-tight text-foreground">
                                    {item.price}
                                  </span>
                                  <span className="text-xs font-medium text-muted-foreground">
                                    / month
                                  </span>
                                </div>
                              </div>
                            </div>
                          </Link>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-auto right-11 top-[-3rem] h-9 w-9 translate-y-0 border-border/70 bg-white shadow-sm disabled:opacity-40 dark:bg-card" />
                    <CarouselNext className="right-0 top-[-3rem] h-9 w-9 translate-y-0 border-border/70 bg-white shadow-sm disabled:opacity-40 dark:bg-card" />
                  </Carousel>
                </motion.div>
              ))}
            </div>
          </section>
        )
      )}

      <section className="border-b bg-background py-12">
        <div className="container mx-auto px-4">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.24em] text-primary">
                Marketplace Standards
              </div>
              <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
                Built for trust, conversion and operational clarity
              </h2>
            </div>
            <p className="max-w-2xl text-sm text-muted-foreground">
              Leading platforms win with strong trust signals, decision-support
              content and simplified journeys. RentVerify is now aligned with
              those core patterns.
            </p>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {solutionCards.map((card, index) => (
              <motion.div
                key={card.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={index}
              >
                <Card className="h-full border border-border/60 bg-white/90 shadow-[0_16px_48px_-30px_rgba(91,71,56,0.22)] dark:bg-card/90">
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                      <card.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold">{card.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {card.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold sm:text-3xl">
                Apartments, Villas and more
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Browse by property type
              </p>
            </div>
            <Link
              to="/register"
              className="hidden text-sm font-semibold text-primary hover:underline sm:block"
            >
              View all <ChevronRight className="inline h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {propertyTypes.map((pt, i) => (
              <motion.div
                key={pt.label}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
              >
                <Link to="/register">
                  <Card
                    className={`group cursor-pointer overflow-hidden border border-border/70 transition-all hover:-translate-y-0.5 hover:shadow-md ${pt.color}`}
                  >
                    <CardContent className="p-5">
                      <Building2 className="mb-3 h-8 w-8 text-primary transition-transform group-hover:scale-110" />
                      <p className="font-semibold leading-tight">{pt.label}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {pt.count} Properties
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background py-16">
        <div className="container mx-auto px-4">
          <div className="mb-2 flex items-center gap-2">
            <Home className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">BHK Choice in Mind?</h2>
          </div>
          <p className="mb-8 text-sm text-muted-foreground">
            Browse by number of bedrooms
          </p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {bhkOptions.map((item, i) => (
              <motion.div
                key={item.bhk}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
              >
                <Card className="group border bg-white transition-all hover:-translate-y-0.5 hover:shadow-md dark:bg-card">
                  <CardContent className="flex flex-col items-center py-7 text-center">
                    <item.icon className="mb-3 h-10 w-10 text-primary transition-transform group-hover:scale-110" />
                    <p className="font-semibold">{item.bhk}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {item.count} Properties
                    </p>
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
          <p className="mb-8 text-sm text-muted-foreground">
            Choose your preferred furnishing
          </p>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {furnishingOptions.map((option, i) => (
              <motion.div
                key={option.label}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
              >
                <Card className="group border bg-card transition-all hover:-translate-y-0.5 hover:shadow-md">
                  <CardContent className="flex items-center gap-4 p-5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                      <option.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">{option.label}</p>
                      <p className="text-xs text-muted-foreground">
                        Browse listings
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="bg-zinc-950 py-20 text-white">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <span className="mb-3 inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold text-orange-100">
              WHY RENTVERIFY
            </span>
            <h2 className="text-3xl font-bold text-white">
              Search, trust and booking signals in one rental workflow
            </h2>
            <p className="mt-3 text-orange-100/70">
              Inspired by the best rental portals: image-first browsing, clear
              rules, and trust before contact.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
              >
                <div className="rounded-[1.7rem] border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm transition-all hover:bg-white/10">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15">
                    <feature.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="mb-2 font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-orange-100/70">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="insights"
        className="border-y bg-gradient-to-b from-white to-[#fff7f1] py-16 dark:from-background dark:to-slate-950/20"
      >
        <div className="container mx-auto px-4">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.24em] text-primary">
                Research & Insights
              </div>
              <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
                Tools users expect before making a decision
              </h2>
            </div>
            <p className="max-w-2xl text-sm text-muted-foreground">
              Inspired by high-performing property portals, these sections
              reduce hesitation by combining search, insights and planning help
              in one experience.
            </p>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {researchTools.map((tool, index) => (
              <motion.div
                key={tool.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={index}
              >
                <Link to={tool.link}>
                  <Card className="h-full border border-border/70 bg-card transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg">
                    <CardContent className="p-6">
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                        <tool.icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold">{tool.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {tool.description}
                      </p>
                      <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">
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
            <p className="mt-3 text-muted-foreground">
              Simple steps for landlords and tenants
            </p>
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
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-sm font-bold text-orange-600 dark:bg-orange-900/30">
                      {i + 1}
                    </div>
                    <div>
                      <p className="font-semibold">{step.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                asChild
                className="mt-6 w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Link to="/register">
                  List Your Property Free{" "}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="rounded-2xl border bg-card p-6 sm:p-8">
              <h3 className="mb-6 flex items-center gap-2 text-xl font-bold">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted dark:bg-muted/80">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                For Tenants
              </h3>
              <div className="space-y-4">
                {tenantSteps.map((step, i) => (
                  <div key={step.title} className="flex items-center gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted text-sm font-bold text-primary dark:bg-muted/80">
                      {i + 1}
                    </div>
                    <div>
                      <p className="font-semibold">{step.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                asChild
                className="mt-6 w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Link to="/register">
                  Find Your Home <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-secondary/55 py-16 dark:bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-start justify-between gap-8 rounded-2xl border border-green-200 bg-white p-8 shadow-sm dark:border-green-900/40 dark:bg-card sm:flex-row sm:items-center">
            <div>
              <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
                Sell or rent faster at the right price
              </h2>
              <p className="mt-2 text-muted-foreground">
                Your perfect tenant is waiting. List your property now for free.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                {["Free Listing", "Verified Tenants", "Quick Response"].map(
                  (item) => (
                    <span
                      key={item}
                      className="flex items-center gap-1.5 text-sm font-medium text-success"
                    >
                      <CheckCircle2 className="h-4 w-4" /> {item}
                    </span>
                  )
                )}
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:items-center">
              <Button
                asChild
                size="lg"
                className="bg-primary px-10 text-base font-bold text-primary-foreground hover:bg-primary/90"
              >
                <Link to="/register">Post Property - It&apos;s FREE</Link>
              </Button>
              <a
                href="tel:+918000000000"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
              >
                <PhoneCall className="h-4 w-4" /> Post via call
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="trust-proof" className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 text-center">
            <div className="text-xs font-bold uppercase tracking-[0.24em] text-primary">
              Proof of Trust
            </div>
            <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
              What stronger marketplace design should feel like
            </h2>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={index}
              >
                <Card className="h-full border bg-card shadow-sm">
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-center gap-1 text-amber-500">
                      {Array.from({ length: 5 }).map((_, starIndex) => (
                        <Star
                          key={starIndex}
                          className="h-4 w-4 fill-current"
                        />
                      ))}
                    </div>
                    <p className="text-sm leading-7 text-foreground/85">
                      &ldquo;{testimonial.quote}&rdquo;
                    </p>
                    <div className="mt-5 border-t pt-4">
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {testimonial.role}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="services" className="bg-zinc-950 dark:bg-zinc-900 py-16 text-white">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.24em] text-primary/60">
                Owner & Tenant Services
              </div>
              <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
                More than listings. A managed rental workflow.
              </h2>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70">
              <Sparkles className="h-4 w-4 text-yellow-400" /> Inspired by
              category leaders, adapted for verified rentals.
            </div>
          </div>
          <div className="grid gap-4 lg:grid-cols-4">
            {[
              "Verified lead handling",
              "Application review workflows",
              "Direct owner contact path",
              "Safer document and KYC readiness",
            ].map((item, index) => (
              <motion.div
                key={item}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={index}
              >
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                  <CheckCircle2 className="mb-3 h-5 w-5 text-green-400" />
                  <p className="font-medium text-white/90">{item}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-zinc-950 dark:bg-zinc-900 py-12 text-white sm:py-14">
        <div className="container mx-auto px-4">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <BrandWordmark theme="dark" compact />
              </div>
              <p className="text-sm leading-relaxed text-white/50">
                India&apos;s trusted rental verification platform for secure,
                transparent rentals.
              </p>
            </div>
            <div>
              <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-white/40">
                RentVerify
              </h4>
              <ul className="space-y-2.5 text-sm text-white/60">
                {rentverifyLinks.map((item) => (
                  <li key={item.label}>
                    <Link to={item.to} className="hover:text-white">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-white/40">
                Company
              </h4>
              <ul className="space-y-2.5 text-sm text-white/60">
                {companyLinks.map((item) => (
                  <li key={item.label}>
                    <Link to={item.to} className="hover:text-white">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-white/40">
                Contact Us
              </h4>
              <div className="space-y-2.5 text-sm text-white/60">
                <p>
                  Toll Free:{" "}
                  <span className="font-medium text-white">1800-XXX-XXXX</span>
                </p>
                <p>9:30 AM - 6:30 PM (Mon-Sun)</p>
                <p>
                  Email:{" "}
                  <a
                    href="mailto:support@rentverify.in"
                    className="text-primary hover:underline"
                  >
                    support@rentverify.in
                  </a>
                </p>
              </div>
            </div>
          </div>
          <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-8 text-xs text-white/30 sm:flex-row">
            <p>Copyright 2026 RentVerify. All rights reserved.</p>
            <p>
              Crafted with love by{" "}
              <a
                href="https://ajstudioz.com"
                className="text-white/60 hover:text-white"
              >
                AJ STUDIOZ
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}


