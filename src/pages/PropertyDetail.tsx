import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, BedDouble, Building2, CalendarDays, Car, Droplets, Heart, MapPin, Share2, ShieldCheck, Zap } from "lucide-react";

// ---------------------------------------------------------------------------
// Sample listing fallback data (mirrors Index.tsx sampleListings).
// Used when a sample-* ID is opened directly / after page refresh.
// ---------------------------------------------------------------------------
type SampleEntry = {
  title: string; address: string; rent: number; houseType: string;
  propertyType: string; bedrooms: number; bathrooms: number;
  area: string; furnishing: string; image: string;
  floorNo: string; totalFloors: string; parkingSlots: string;
  facing: string; projectName: string; maintenance: string;
  listedBy: string;
};

const sampleMap: Record<string, SampleEntry> = {
  "sample-bengaluru-1": { title: "Skyline 2BHK in Indiranagar", address: "Indiranagar, Bengaluru, Karnataka", rent: 28000, houseType: "2 BHK", propertyType: "Flats / Apartments", bedrooms: 2, bathrooms: 2, area: "1100 sqft", furnishing: "Semi-Furnished", image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1400&q=80", floorNo: "3", totalFloors: "6", parkingSlots: "1", facing: "East", projectName: "Skyline Residency", maintenance: "Rs. 1,500 / month", listedBy: "Owner" },
  "sample-bengaluru-2": { title: "Minimal Studio near Koramangala", address: "Koramangala, Bengaluru, Karnataka", rent: 18500, houseType: "1 BHK", propertyType: "Studio Apartment", bedrooms: 1, bathrooms: 1, area: "540 sqft", furnishing: "Fully Furnished", image: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1400&q=80", floorNo: "2", totalFloors: "4", parkingSlots: "0", facing: "North", projectName: "-", maintenance: "-", listedBy: "Owner" },
  "sample-bengaluru-3": { title: "Terrace Home in Jayanagar", address: "Jayanagar, Bengaluru, Karnataka", rent: 31000, houseType: "3 BHK", propertyType: "Independent House / Villa", bedrooms: 3, bathrooms: 2, area: "1320 sqft", furnishing: "Semi-Furnished", image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80", floorNo: "1", totalFloors: "2", parkingSlots: "2", facing: "North", projectName: "-", maintenance: "Rs. 2,000 / month", listedBy: "Owner" },
  "sample-bengaluru-4": { title: "Loft Apartment in HSR Layout", address: "HSR Layout, Bengaluru, Karnataka", rent: 27500, houseType: "2 BHK", propertyType: "Flats / Apartments", bedrooms: 2, bathrooms: 2, area: "1060 sqft", furnishing: "Fully Furnished", image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80", floorNo: "4", totalFloors: "8", parkingSlots: "1", facing: "West", projectName: "HSR Lofts", maintenance: "Rs. 1,800 / month", listedBy: "Owner" },
  "sample-bengaluru-5": { title: "Garden Villa in Whitefield", address: "Whitefield, Bengaluru, Karnataka", rent: 46000, houseType: "3 BHK", propertyType: "Independent House / Villa", bedrooms: 3, bathrooms: 3, area: "1820 sqft", furnishing: "Semi-Furnished", image: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1400&q=80", floorNo: "G", totalFloors: "2", parkingSlots: "2", facing: "South", projectName: "Green Villa", maintenance: "Rs. 3,000 / month", listedBy: "Owner" },
  "sample-bengaluru-6": { title: "Compact Flat in Marathahalli", address: "Marathahalli, Bengaluru, Karnataka", rent: 17500, houseType: "1 BHK", propertyType: "Flats / Apartments", bedrooms: 1, bathrooms: 1, area: "640 sqft", furnishing: "Semi-Furnished", image: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1400&q=80", floorNo: "1", totalFloors: "5", parkingSlots: "1", facing: "East", projectName: "-", maintenance: "Rs. 800 / month", listedBy: "Owner" },
  "sample-chennai-1": { title: "Sunny Family Flat in Adyar", address: "Adyar, Chennai, Tamil Nadu", rent: 24000, houseType: "2 BHK", propertyType: "Flats / Apartments", bedrooms: 2, bathrooms: 2, area: "980 sqft", furnishing: "Semi-Furnished", image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1400&q=80", floorNo: "2", totalFloors: "6", parkingSlots: "1", facing: "North", projectName: "Adyar Complex", maintenance: "Rs. 1,200 / month", listedBy: "Owner" },
  "sample-chennai-2": { title: "Compact 1BHK in Velachery", address: "Velachery, Chennai, Tamil Nadu", rent: 15500, houseType: "1 BHK", propertyType: "Flats / Apartments", bedrooms: 1, bathrooms: 1, area: "620 sqft", furnishing: "Unfurnished", image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1400&q=80", floorNo: "1", totalFloors: "4", parkingSlots: "0", facing: "East", projectName: "-", maintenance: "-", listedBy: "Owner" },
  "sample-chennai-3": { title: "Calm 2BHK in OMR", address: "OMR, Chennai, Tamil Nadu", rent: 22500, houseType: "2 BHK", propertyType: "Flats / Apartments", bedrooms: 2, bathrooms: 2, area: "1010 sqft", furnishing: "Fully Furnished", image: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1400&q=80", floorNo: "3", totalFloors: "7", parkingSlots: "1", facing: "West", projectName: "OMR Heights", maintenance: "Rs. 1,500 / month", listedBy: "Owner" },
  "sample-chennai-4": { title: "Premium Flat in Anna Nagar", address: "Anna Nagar, Chennai, Tamil Nadu", rent: 29000, houseType: "3 BHK", propertyType: "Flats / Apartments", bedrooms: 3, bathrooms: 2, area: "1280 sqft", furnishing: "Semi-Furnished", image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1400&q=80", floorNo: "4", totalFloors: "8", parkingSlots: "2", facing: "North", projectName: "Anna Grand", maintenance: "Rs. 2,200 / month", listedBy: "Owner" },
  "sample-chennai-5": { title: "Bright Studio in T Nagar", address: "T Nagar, Chennai, Tamil Nadu", rent: 16500, houseType: "1 BHK", propertyType: "Studio Apartment", bedrooms: 1, bathrooms: 1, area: "520 sqft", furnishing: "Fully Furnished", image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1400&q=80", floorNo: "2", totalFloors: "5", parkingSlots: "0", facing: "East", projectName: "-", maintenance: "-", listedBy: "Owner" },
  "sample-chennai-6": { title: "Family Home in Porur", address: "Porur, Chennai, Tamil Nadu", rent: 21500, houseType: "2 BHK", propertyType: "Flats / Apartments", bedrooms: 2, bathrooms: 2, area: "940 sqft", furnishing: "Unfurnished", image: "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?auto=format&fit=crop&w=1400&q=80", floorNo: "1", totalFloors: "4", parkingSlots: "1", facing: "South", projectName: "-", maintenance: "Rs. 1,000 / month", listedBy: "Owner" },
  "sample-hyderabad-1": { title: "Modern 3BHK near Hitech City", address: "Hitech City, Hyderabad, Telangana", rent: 36000, houseType: "3 BHK", propertyType: "Independent House / Villa", bedrooms: 3, bathrooms: 3, area: "1600 sqft", furnishing: "Fully Furnished", image: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1400&q=80", floorNo: "G", totalFloors: "3", parkingSlots: "2", facing: "North-East", projectName: "HiTech Villas", maintenance: "Rs. 3,000 / month", listedBy: "Owner" },
  "sample-hyderabad-2": { title: "Quiet Builder Floor in Gachibowli", address: "Gachibowli, Hyderabad, Telangana", rent: 22000, houseType: "2 BHK", propertyType: "Builder Floor", bedrooms: 2, bathrooms: 2, area: "1020 sqft", furnishing: "Semi-Furnished", image: "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?auto=format&fit=crop&w=1400&q=80", floorNo: "1", totalFloors: "3", parkingSlots: "1", facing: "West", projectName: "-", maintenance: "Rs. 1,500 / month", listedBy: "Owner" },
  "sample-hyderabad-3": { title: "Executive Flat in Jubilee Hills", address: "Jubilee Hills, Hyderabad, Telangana", rent: 34000, houseType: "2 BHK", propertyType: "Flats / Apartments", bedrooms: 2, bathrooms: 2, area: "1200 sqft", furnishing: "Fully Furnished", image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80", floorNo: "5", totalFloors: "10", parkingSlots: "1", facing: "East", projectName: "Jubilee Heights", maintenance: "Rs. 2,500 / month", listedBy: "Owner" },
  "sample-hyderabad-4": { title: "Smart 1BHK in Kondapur", address: "Kondapur, Hyderabad, Telangana", rent: 18000, houseType: "1 BHK", propertyType: "Flats / Apartments", bedrooms: 1, bathrooms: 1, area: "680 sqft", furnishing: "Semi-Furnished", image: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1400&q=80", floorNo: "2", totalFloors: "6", parkingSlots: "1", facing: "North", projectName: "-", maintenance: "Rs. 900 / month", listedBy: "Owner" },
  "sample-hyderabad-5": { title: "Open Terrace Home in Madhapur", address: "Madhapur, Hyderabad, Telangana", rent: 28500, houseType: "2 BHK", propertyType: "Builder Floor", bedrooms: 2, bathrooms: 2, area: "1140 sqft", furnishing: "Semi-Furnished", image: "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?auto=format&fit=crop&w=1400&q=80", floorNo: "2", totalFloors: "3", parkingSlots: "1", facing: "South", projectName: "-", maintenance: "Rs. 1,800 / month", listedBy: "Owner" },
  "sample-pune-1": { title: "Designer 2BHK in Baner", address: "Baner, Pune, Maharashtra", rent: 26500, houseType: "2 BHK", propertyType: "Flats / Apartments", bedrooms: 2, bathrooms: 2, area: "1080 sqft", furnishing: "Fully Furnished", image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80", floorNo: "3", totalFloors: "7", parkingSlots: "1", facing: "North", projectName: "Baner Gardens", maintenance: "Rs. 2,000 / month", listedBy: "Owner" },
  "sample-pune-2": { title: "Cozy Rental in Wakad", address: "Wakad, Pune, Maharashtra", rent: 19000, houseType: "1 BHK", propertyType: "Flats / Apartments", bedrooms: 1, bathrooms: 1, area: "700 sqft", furnishing: "Semi-Furnished", image: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1400&q=80", floorNo: "1", totalFloors: "5", parkingSlots: "1", facing: "East", projectName: "-", maintenance: "Rs. 1,000 / month", listedBy: "Owner" },
  "sample-pune-3": { title: "Urban Flat in Kharadi", address: "Kharadi, Pune, Maharashtra", rent: 23500, houseType: "2 BHK", propertyType: "Flats / Apartments", bedrooms: 2, bathrooms: 2, area: "980 sqft", furnishing: "Fully Furnished", image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1400&q=80", floorNo: "4", totalFloors: "9", parkingSlots: "1", facing: "West", projectName: "Kharadi Towers", maintenance: "Rs. 1,600 / month", listedBy: "Owner" },
  "sample-pune-4": { title: "Compact 1BHK in Hinjewadi", address: "Hinjewadi, Pune, Maharashtra", rent: 16800, houseType: "1 BHK", propertyType: "Flats / Apartments", bedrooms: 1, bathrooms: 1, area: "630 sqft", furnishing: "Unfurnished", image: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1400&q=80", floorNo: "2", totalFloors: "6", parkingSlots: "0", facing: "North", projectName: "-", maintenance: "-", listedBy: "Owner" },
  "sample-pune-5": { title: "Calm Builder Floor in Aundh", address: "Aundh, Pune, Maharashtra", rent: 27000, houseType: "2 BHK", propertyType: "Builder Floor", bedrooms: 2, bathrooms: 2, area: "1090 sqft", furnishing: "Semi-Furnished", image: "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?auto=format&fit=crop&w=1400&q=80", floorNo: "1", totalFloors: "3", parkingSlots: "1", facing: "East", projectName: "-", maintenance: "Rs. 1,700 / month", listedBy: "Owner" },
  "sample-mumbai-1": { title: "Sea View Flat in Powai", address: "Powai, Mumbai, Maharashtra", rent: 42000, houseType: "2 BHK", propertyType: "Flats / Apartments", bedrooms: 2, bathrooms: 2, area: "1180 sqft", furnishing: "Fully Furnished", image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80", floorNo: "8", totalFloors: "14", parkingSlots: "1", facing: "West", projectName: "Powai Lakes", maintenance: "Rs. 3,500 / month", listedBy: "Owner" },
  "sample-mumbai-2": { title: "Compact Studio in Andheri", address: "Andheri, Mumbai, Maharashtra", rent: 21000, houseType: "1 BHK", propertyType: "Studio Apartment", bedrooms: 1, bathrooms: 1, area: "500 sqft", furnishing: "Semi-Furnished", image: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1400&q=80", floorNo: "3", totalFloors: "8", parkingSlots: "0", facing: "North", projectName: "-", maintenance: "-", listedBy: "Owner" },
  "sample-mumbai-3": { title: "Contemporary Home in Bandra", address: "Bandra, Mumbai, Maharashtra", rent: 48000, houseType: "2 BHK", propertyType: "Flats / Apartments", bedrooms: 2, bathrooms: 2, area: "1160 sqft", furnishing: "Fully Furnished", image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1400&q=80", floorNo: "6", totalFloors: "12", parkingSlots: "2", facing: "South", projectName: "Bandra Elite", maintenance: "Rs. 4,000 / month", listedBy: "Owner" },
  "sample-mumbai-4": { title: "Soft Loft in Lower Parel", address: "Lower Parel, Mumbai, Maharashtra", rent: 38500, houseType: "1 BHK", propertyType: "Studio Apartment", bedrooms: 1, bathrooms: 1, area: "720 sqft", furnishing: "Semi-Furnished", image: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1400&q=80", floorNo: "5", totalFloors: "10", parkingSlots: "1", facing: "East", projectName: "Parel Lofts", maintenance: "Rs. 2,500 / month", listedBy: "Owner" },
  "sample-mumbai-5": { title: "Family Apartment in Chembur", address: "Chembur, Mumbai, Maharashtra", rent: 29500, houseType: "2 BHK", propertyType: "Flats / Apartments", bedrooms: 2, bathrooms: 2, area: "1020 sqft", furnishing: "Unfurnished", image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1400&q=80", floorNo: "2", totalFloors: "6", parkingSlots: "1", facing: "North", projectName: "-", maintenance: "Rs. 1,800 / month", listedBy: "Owner" },
  "sample-delhi-1": { title: "Bright 3BHK in South Delhi", address: "South Delhi, Delhi / NCR", rent: 39500, houseType: "3 BHK", propertyType: "Builder Floor", bedrooms: 3, bathrooms: 3, area: "1550 sqft", furnishing: "Semi-Furnished", image: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1400&q=80", floorNo: "1", totalFloors: "3", parkingSlots: "2", facing: "North", projectName: "-", maintenance: "Rs. 2,500 / month", listedBy: "Owner" },
  "sample-delhi-2": { title: "Modern 2BHK in Noida", address: "Noida, Delhi / NCR", rent: 24500, houseType: "2 BHK", propertyType: "Flats / Apartments", bedrooms: 2, bathrooms: 2, area: "1040 sqft", furnishing: "Unfurnished", image: "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?auto=format&fit=crop&w=1400&q=80", floorNo: "3", totalFloors: "7", parkingSlots: "1", facing: "East", projectName: "Noida Vertex", maintenance: "Rs. 1,500 / month", listedBy: "Owner" },
  "sample-delhi-3": { title: "Refined 2BHK in Saket", address: "Saket, Delhi / NCR", rent: 31000, houseType: "2 BHK", propertyType: "Flats / Apartments", bedrooms: 2, bathrooms: 2, area: "1080 sqft", furnishing: "Fully Furnished", image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80", floorNo: "4", totalFloors: "8", parkingSlots: "1", facing: "West", projectName: "Saket Square", maintenance: "Rs. 2,000 / month", listedBy: "Owner" },
  "sample-delhi-4": { title: "Budget 1BHK in Dwarka", address: "Dwarka, Delhi / NCR", rent: 17200, houseType: "1 BHK", propertyType: "Flats / Apartments", bedrooms: 1, bathrooms: 1, area: "610 sqft", furnishing: "Semi-Furnished", image: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1400&q=80", floorNo: "2", totalFloors: "5", parkingSlots: "0", facing: "North", projectName: "-", maintenance: "Rs. 800 / month", listedBy: "Owner" },
  "sample-delhi-5": { title: "Elegant Builder Floor in Gurgaon", address: "Gurgaon, Delhi / NCR", rent: 35000, houseType: "3 BHK", propertyType: "Builder Floor", bedrooms: 3, bathrooms: 3, area: "1480 sqft", furnishing: "Semi-Furnished", image: "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?auto=format&fit=crop&w=1400&q=80", floorNo: "1", totalFloors: "3", parkingSlots: "2", facing: "South", projectName: "-", maintenance: "Rs. 2,800 / month", listedBy: "Owner" },
  "sample-kolkata-1": { title: "Classic Apartment in Salt Lake", address: "Salt Lake, Kolkata, West Bengal", rent: 20500, houseType: "2 BHK", propertyType: "Flats / Apartments", bedrooms: 2, bathrooms: 2, area: "960 sqft", furnishing: "Semi-Furnished", image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1400&q=80", floorNo: "2", totalFloors: "5", parkingSlots: "1", facing: "East", projectName: "Salt Lake Plaza", maintenance: "Rs. 1,300 / month", listedBy: "Owner" },
  "sample-kolkata-2": { title: "Warm Home in Ballygunge", address: "Ballygunge, Kolkata, West Bengal", rent: 22800, houseType: "2 BHK", propertyType: "Flats / Apartments", bedrooms: 2, bathrooms: 2, area: "1000 sqft", furnishing: "Semi-Furnished", image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1400&q=80", floorNo: "3", totalFloors: "6", parkingSlots: "1", facing: "North", projectName: "-", maintenance: "Rs. 1,400 / month", listedBy: "Owner" },
  "sample-kolkata-3": { title: "Compact Studio in New Town", address: "New Town, Kolkata, West Bengal", rent: 14500, houseType: "1 BHK", propertyType: "Studio Apartment", bedrooms: 1, bathrooms: 1, area: "480 sqft", furnishing: "Fully Furnished", image: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1400&q=80", floorNo: "1", totalFloors: "4", parkingSlots: "0", facing: "West", projectName: "-", maintenance: "-", listedBy: "Owner" },
  "sample-kolkata-4": { title: "Classic Flat in Alipore", address: "Alipore, Kolkata, West Bengal", rent: 26000, houseType: "3 BHK", propertyType: "Flats / Apartments", bedrooms: 3, bathrooms: 2, area: "1340 sqft", furnishing: "Unfurnished", image: "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?auto=format&fit=crop&w=1400&q=80", floorNo: "2", totalFloors: "5", parkingSlots: "2", facing: "South", projectName: "Alipore Abode", maintenance: "Rs. 2,000 / month", listedBy: "Owner" },
  "sample-ahmedabad-1": { title: "Spacious Rental in Prahlad Nagar", address: "Prahlad Nagar, Ahmedabad, Gujarat", rent: 23000, houseType: "2 BHK", propertyType: "Flats / Apartments", bedrooms: 2, bathrooms: 2, area: "1120 sqft", furnishing: "Fully Furnished", image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1400&q=80", floorNo: "3", totalFloors: "7", parkingSlots: "1", facing: "North", projectName: "Prahlad Greens", maintenance: "Rs. 1,600 / month", listedBy: "Owner" },
  "sample-ahmedabad-2": { title: "Smart Apartment in Bodakdev", address: "Bodakdev, Ahmedabad, Gujarat", rent: 21500, houseType: "2 BHK", propertyType: "Flats / Apartments", bedrooms: 2, bathrooms: 2, area: "980 sqft", furnishing: "Semi-Furnished", image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1400&q=80", floorNo: "2", totalFloors: "6", parkingSlots: "1", facing: "East", projectName: "-", maintenance: "Rs. 1,200 / month", listedBy: "Owner" },
};

function sampleToPropertyData(id: string, s: SampleEntry): PropertyData {
  return {
    id,
    title: s.title,
    address: s.address,
    rent: s.rent,
    securityDepositAmount: s.rent * 2,
    bookingHoldAmount: Math.round(s.rent * 0.3),
    houseType: s.houseType,
    postedAt: "Recently",
    description: `${s.title} located in ${s.address}. ${s.furnishing} property with ${s.area} super built-up area. Great connectivity and amenities nearby.`,
    details: [
      { key: "House Type", value: s.houseType },
      { key: "Type", value: s.propertyType },
      { key: "Bedrooms", value: s.bedrooms.toString() },
      { key: "Bathrooms", value: s.bathrooms.toString() },
      { key: "Super Built-up Area", value: s.area },
      { key: "Furnishing", value: s.furnishing },
      { key: "Listed By", value: s.listedBy },
      { key: "Floor No", value: s.floorNo },
      { key: "Total Floors", value: s.totalFloors },
      { key: "Parking Slots", value: s.parkingSlots },
      { key: "Facing", value: s.facing },
      { key: "Project Name", value: s.projectName },
      { key: "Maintenance", value: s.maintenance },
    ],
    facilities: { water: true, separateMeter: true, parking: s.parkingSlots !== "0" },
    verified: false,
    landlordName: "Sample Landlord",
    landlordPhone: null,
    landlordId: "",
    memberSince: "Recently",
    totalListings: 1,
    listingId: id,
    images: [s.image, fallbackGalleryImages[0], fallbackGalleryImages[1], fallbackGalleryImages[2]],
    videoUrl: null,
  };
}

const fallbackGalleryImages = [
  "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1200&q=80",
];
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

type PropertyData = {
  id: string;
  title: string;
  address: string;
  rent: number;
  securityDepositAmount: number | null;
  bookingHoldAmount: number | null;
  houseType: string;
  postedAt: string;
  description: string;
  details: Array<{ key: string; value: string }>;
  facilities: { water: boolean; separateMeter: boolean; parking: boolean };
  verified: boolean;
  landlordName: string;
  landlordPhone: string | null;
  landlordId: string;
  memberSince: string;
  totalListings: number;
  listingId: string;
  images: string[];
  videoUrl: string | null;
};

const fallbackProperty: PropertyData = {
  id: "demo",
  title: "Rental for 2BHK Gated Community Apartment",
  address: "Kitchipalayam, Salem, Tamil Nadu",
  rent: 15000,
  securityDepositAmount: 30000,
  bookingHoldAmount: 5000,
  houseType: "2 BHK",
  postedAt: "Today",
  description: "Rental for 2BHK furnished house in a gated community, ready to occupy. Walkable distance from Salem bus stand with all daily convenience facilities nearby.",
  details: [
    { key: "House Type", value: "2 BHK" },
    { key: "Type", value: "Flats / Apartments" },
    { key: "Bedrooms", value: "2" },
    { key: "Bathrooms", value: "2" },
    { key: "Super Built-up Area", value: "900 sqft" },
    { key: "Furnishing", value: "Semi-Furnished" },
    { key: "Listed By", value: "Owner" },
    { key: "Floor No", value: "1" },
    { key: "Total Floors", value: "5" },
    { key: "Parking Slots", value: "2" },
    { key: "Facing", value: "North" },
    { key: "Project Name", value: "Mahaveer Palace" },
    { key: "Maintenance", value: "Rs. 2,000 / month" },
  ],
  facilities: { water: true, separateMeter: true, parking: true },
  verified: true,
  landlordName: "Owner",
  landlordPhone: null,
  landlordId: "",
  memberSince: "Recently",
  totalListings: 1,
  listingId: "1826811384",
  images: [
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1200&q=80",
  ],
  videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
};

const getYouTubeEmbedUrl = (url: string) => {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace("www.", "").toLowerCase();

    if (host === "youtube.com" || host === "m.youtube.com") {
      const videoId = parsed.searchParams.get("v");
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    }

    if (host === "youtu.be") {
      const videoId = parsed.pathname.split("/").filter(Boolean)[0];
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    }

    if (host === "youtube.com" && parsed.pathname.startsWith("/shorts/")) {
      const videoId = parsed.pathname.split("/")[2];
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    }
  } catch {
    return null;
  }

  return null;
};

const getVideoSource = (videoUrl: string | null) => {
  if (!videoUrl) {
    return { type: "none" as const, embedUrl: null, directUrl: null };
  }

  const youtubeEmbed = getYouTubeEmbedUrl(videoUrl);
  if (youtubeEmbed) {
    return { type: "youtube" as const, embedUrl: youtubeEmbed, directUrl: null };
  }

  return { type: "direct" as const, embedUrl: null, directUrl: videoUrl };
};

export default function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, userRole } = useAuth();
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [chatLoading, setChatLoading] = useState(false);
  const [property, setProperty] = useState<PropertyData>(fallbackProperty);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const loadProperty = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      // Handle sample listings — no DB lookup needed
      if (id.startsWith("sample-")) {
        const sample = sampleMap[id];
        if (sample) {
          setProperty(sampleToPropertyData(id, sample));
        }
        setLoading(false);
        return;
      }
      }

      const { data: propertyRow } = await supabase
        .from("properties")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (!propertyRow) {
        setLoading(false);
        return;
      }

      const { data: profileData } = await supabase
        .from("profiles")
        .select("full_name, phone, created_at")
        .eq("user_id", propertyRow.landlord_id)
        .maybeSingle();

      const { count: listingsCount } = await supabase
        .from("properties")
        .select("id", { count: "exact", head: true })
        .eq("landlord_id", propertyRow.landlord_id);

      const { data: imageRows } = await supabase
        .from("property_images")
        .select("image_url, display_order")
        .eq("property_id", propertyRow.id)
        .order("display_order", { ascending: true });

      const details = [
        { key: "House Type", value: propertyRow.house_type ?? "-" },
        { key: "Type", value: propertyRow.property_type ?? "-" },
        { key: "Bedrooms", value: propertyRow.bedrooms?.toString() ?? "-" },
        { key: "Bathrooms", value: propertyRow.bathrooms?.toString() ?? "-" },
        { key: "Super Built-up Area", value: propertyRow.super_builtup_area ? `${propertyRow.super_builtup_area} sqft` : "-" },
        { key: "Furnishing", value: propertyRow.furnishing ?? "-" },
        { key: "Listed By", value: propertyRow.listed_by ?? "Owner" },
        { key: "Floor No", value: propertyRow.floor_no?.toString() ?? "-" },
        { key: "Total Floors", value: propertyRow.total_floors?.toString() ?? "-" },
        { key: "Parking Slots", value: propertyRow.parking_slots?.toString() ?? "-" },
        { key: "Facing", value: propertyRow.facing ?? "-" },
        { key: "Project Name", value: propertyRow.project_name ?? "-" },
        { key: "Maintenance", value: propertyRow.maintenance_amount ? `Rs. ${propertyRow.maintenance_amount.toLocaleString("en-IN")} / month` : "-" },
      ];

      setProperty({
        id: propertyRow.id,
        title: propertyRow.title,
        address: propertyRow.address,
        rent: propertyRow.rent,
        securityDepositAmount: propertyRow.security_deposit_amount,
        bookingHoldAmount: propertyRow.booking_hold_amount,
        houseType: propertyRow.house_type,
        postedAt: new Date(propertyRow.created_at).toLocaleDateString("en-IN"),
        description: propertyRow.description ?? "No description provided.",
        details,
        facilities: {
          water: !!propertyRow.water_supply,
          separateMeter: !!propertyRow.separate_meter,
          parking: !!propertyRow.parking,
        },
        verified: !!propertyRow.is_verified,
        landlordName: profileData?.full_name || "Landlord",
        landlordPhone: profileData?.phone || null,
        landlordId: propertyRow.landlord_id,
        memberSince: profileData?.created_at ? new Date(profileData.created_at).toLocaleDateString("en-IN") : "Recently",
        totalListings: listingsCount ?? 1,
        listingId: propertyRow.id.slice(0, 8),
        images:
          imageRows && imageRows.length > 0
            ? imageRows.map((item) => item.image_url)
            : fallbackProperty.images,
        videoUrl: propertyRow.video_url ?? null,
      });
      setLoading(false);

      // Check if saved
      if (user) {
        const { data: savedRow } = await supabase
          .from("saved_properties")
          .select("id")
          .eq("user_id", user.id)
          .eq("property_id", propertyRow.id)
          .maybeSingle();
        setIsSaved(!!savedRow);
      }
    };

    void loadProperty();
  }, [id, user]);

  const mapEmbedUrl = useMemo(
    () => `https://www.google.com/maps?q=${encodeURIComponent(property.address)}&output=embed`,
    [property.address]
  );
  const videoSource = useMemo(() => getVideoSource(property.videoUrl), [property.videoUrl]);
  const galleryImages = useMemo(() => property.images.slice(0, 5), [property.images]);
  const bedroomsLabel = useMemo(() => property.details.find((item) => item.key === "Bedrooms")?.value ?? "-", [property.details]);
  const bathroomsLabel = useMemo(() => property.details.find((item) => item.key === "Bathrooms")?.value ?? "-", [property.details]);
  const areaLabel = useMemo(() => property.details.find((item) => item.key === "Super Built-up Area")?.value ?? "-", [property.details]);

  const handleContactLandlord = () => {
    const rawPhone = (property.landlordPhone || "").trim();
    if (!rawPhone) {
      toast({
        title: "Phone not available",
        description: "Landlord phone number is not added yet.",
        variant: "destructive",
      });
      return;
    }

    const digits = rawPhone.replace(/\D/g, "");
    if (digits.length < 10) {
      toast({
        title: "Invalid phone",
        description: "Landlord phone number looks invalid.",
        variant: "destructive",
      });
      return;
    }

    const normalizedPhone = digits.length === 10 ? `91${digits}` : digits;
    const text = encodeURIComponent(
      `Hi ${property.landlordName}, I am interested in your property "${property.title}" (${property.houseType}) listed at ${property.address}.`
    );
    const whatsappUrl = `https://wa.me/${normalizedPhone}?text=${text}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  const handleStartChat = async () => {
    if (!user) {
      toast({ title: "Please login", description: "Login as tenant to chat with landlord.", variant: "destructive" });
      navigate("/login");
      return;
    }

    if (userRole !== "tenant") {
      toast({ title: "Tenant account required", description: "Switch to a tenant account to contact landlord.", variant: "destructive" });
      return;
    }

    if (property.landlordId && property.landlordId === user.id) {
      toast({ title: "Not allowed", description: "You cannot create a request on your own property.", variant: "destructive" });
      return;
    }

    const { data: tenantKyc, error: tenantKycError } = await supabase
      .from("tenants")
      .select("pan_verified, aadhaar_verified")
      .eq("user_id", user.id)
      .maybeSingle();

    if (tenantKycError) {
      toast({ title: "KYC check failed", description: tenantKycError.message, variant: "destructive" });
      return;
    }

    if (!tenantKyc?.pan_verified && !tenantKyc?.aadhaar_verified) {
      toast({
        title: "KYC required",
        description: "Verify PAN or Aadhaar in your profile before contacting landlords.",
        variant: "destructive",
      });
      navigate("/tenant/profile");
      return;
    }

    setChatLoading(true);

    const { data: existingApplication } = await supabase
      .from("applications")
      .select("id")
      .eq("property_id", property.id)
      .eq("tenant_id", user.id)
      .maybeSingle();

    if (existingApplication?.id) {
      setChatLoading(false);
      navigate(`/tenant/messages?app=${existingApplication.id}`);
      return;
    }

    const initialMessage = "Tenant: Hi, I am interested in this property. Please share availability details.";
    const { data: createdApplication, error } = await supabase
      .from("applications")
      .insert({
        property_id: property.id,
        tenant_id: user.id,
        status: "pending",
        message: initialMessage,
      })
      .select("id")
      .single();

    setChatLoading(false);

    if (error) {
      toast({ title: "Request failed", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "Request sent", description: "You can continue chat in Messages." });
    navigate(`/tenant/messages?app=${createdApplication.id}`);
  };

  return (
    <div className="min-h-screen bg-white text-foreground dark:bg-background">
      <Navbar />
      <div className="container mx-auto max-w-7xl px-4 py-5 sm:py-7">
        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to listings
        </Link>

        {loading ? (
          <div className="rounded-3xl border bg-card p-8 text-center text-muted-foreground shadow-sm">Loading property details...</div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-8">
            <div className="space-y-6 lg:col-span-2">
              <div className="space-y-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      {property.verified && (
                        <Badge className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-200">
                          <ShieldCheck className="mr-1 h-3.5 w-3.5" /> Verified home
                        </Badge>
                      )}
                      <Badge variant="secondary" className="rounded-full px-3 py-1">{property.houseType}</Badge>
                    </div>
                    <h1 className="max-w-4xl text-2xl font-semibold tracking-tight sm:text-[2rem]">{property.title}</h1>
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" /> {property.address}</span>
                      <span className="inline-flex items-center gap-1"><CalendarDays className="h-4 w-4" /> Posted {property.postedAt}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-10 w-10 rounded-full border bg-white shadow-sm dark:bg-card"
                      onClick={async () => {
                        const url = `${window.location.origin}/property/${property.id}`;
                        if (navigator.share) {
                          try { await navigator.share({ title: property.title, url }); } catch {}
                        } else {
                          await navigator.clipboard.writeText(url);
                          toast({ title: "Link copied!" });
                        }
                      }}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-10 w-10 rounded-full border bg-white shadow-sm dark:bg-card"
                      onClick={async () => {
                        if (!user) { toast({ title: "Please login to save", variant: "destructive" }); return; }
                        if (isSaved) {
                          await supabase.from("saved_properties").delete().eq("user_id", user.id).eq("property_id", property.id);
                          setIsSaved(false);
                          toast({ title: "Removed from saved" });
                        } else {
                          await supabase.from("saved_properties").insert({ user_id: user.id, property_id: property.id });
                          setIsSaved(true);
                          toast({ title: "Property saved!" });
                        }
                      }}
                    >
                      <Heart className={`h-4 w-4 ${isSaved ? "fill-red-500 text-red-500" : ""}`} />
                    </Button>
                  </div>
                </div>

                <div className="grid gap-2 sm:grid-cols-[2fr_1fr_1fr] sm:grid-rows-2">
                  <button className="relative overflow-hidden rounded-[24px] bg-muted sm:row-span-2" onClick={() => setActiveImage(0)}>
                    <img src={property.images[activeImage] ?? property.images[0]} alt={property.title} className="aspect-[16/12] h-full w-full object-cover sm:aspect-auto sm:min-h-[26rem]" />
                  </button>
                  {galleryImages.slice(1, 5).map((image, index) => {
                    const actualIndex = index + 1;
                    return (
                      <button
                        key={image}
                        onClick={() => setActiveImage(actualIndex)}
                        className={`relative overflow-hidden rounded-[20px] bg-muted ${activeImage === actualIndex ? "ring-2 ring-[#3A7AFE] ring-offset-2" : ""}`}
                      >
                        <img src={image} alt={`Property ${actualIndex + 1}`} className="aspect-[4/3] h-full w-full object-cover" />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-border/70 bg-white p-4 shadow-sm dark:bg-card">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#3A7AFE]/10 text-[#3A7AFE]"><BedDouble className="h-5 w-5" /></div>
                    <div>
                      <p className="text-sm text-muted-foreground">Bedrooms</p>
                      <p className="text-lg font-semibold">{bedroomsLabel}</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl border border-border/70 bg-white p-4 shadow-sm dark:bg-card">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#3A7AFE]/10 text-[#3A7AFE]"><Droplets className="h-5 w-5" /></div>
                    <div>
                      <p className="text-sm text-muted-foreground">Bathrooms</p>
                      <p className="text-lg font-semibold">{bathroomsLabel}</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl border border-border/70 bg-white p-4 shadow-sm dark:bg-card">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#3A7AFE]/10 text-[#3A7AFE]"><Building2 className="h-5 w-5" /></div>
                    <div>
                      <p className="text-sm text-muted-foreground">Built-up area</p>
                      <p className="text-lg font-semibold">{areaLabel}</p>
                    </div>
                  </div>
                </div>
              </div>

              <Card className="rounded-2xl border border-border/70 bg-white shadow-sm dark:bg-card">
                <CardContent className="p-5 sm:p-6">
                  <h2 className="mb-3 text-lg font-semibold">Details</h2>
                  <div className="grid gap-3 text-sm sm:grid-cols-2">
                    {property.details.map((item) => (
                      <div key={item.key} className="flex items-center justify-between rounded-xl border border-border/70 bg-slate-50 px-4 py-3 dark:bg-slate-950/20">
                        <span className="text-muted-foreground">{item.key}</span>
                        <span className="font-semibold text-right">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border border-border/70 bg-white shadow-sm dark:bg-card">
                <CardContent className="p-5 sm:p-6">
                  <h2 className="mb-3 text-lg font-semibold">Description</h2>
                  <p className="leading-7 text-muted-foreground">{property.description}</p>
                </CardContent>
              </Card>

              {videoSource.type !== "none" && (
                <Card className="overflow-hidden rounded-2xl border border-border/70 bg-white shadow-sm dark:bg-card">
                  <CardContent className="p-0">
                    <div className="flex items-center justify-between border-b px-4 py-3 sm:px-6">
                      <div>
                        <h2 className="text-lg font-semibold">Property Video</h2>
                        <p className="text-xs text-muted-foreground sm:text-sm">Virtual walkthrough</p>
                      </div>
                      <a
                        href={property.videoUrl ?? "#"}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-md border px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-accent"
                      >
                        Open source
                      </a>
                    </div>

                    <div className="bg-muted/30 p-3 sm:p-4">
                      <div className="overflow-hidden rounded-2xl border bg-black/90 shadow-sm">
                        {videoSource.type === "youtube" ? (
                          <iframe
                            title="Property Video"
                            src={videoSource.embedUrl ?? ""}
                            className="aspect-video w-full border-0"
                            loading="lazy"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                          />
                        ) : (
                          <video
                            className="aspect-video w-full"
                            controls
                            preload="metadata"
                            src={videoSource.directUrl ?? undefined}
                          >
                            Your browser does not support the video tag.
                          </video>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card className="rounded-2xl border border-border/70 bg-white shadow-sm dark:bg-card">
                <CardContent className="p-5 sm:p-6">
                  <h2 className="mb-4 text-lg font-semibold">Facilities</h2>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                    <div className="flex items-center gap-3 rounded-xl border border-border/70 bg-slate-50 px-4 py-3 dark:bg-slate-950/20">
                      <Droplets className={`h-5 w-5 ${property.facilities.water ? "text-success" : "text-muted-foreground"}`} />
                      <span className="text-sm">Water Supply</span>
                    </div>
                    <div className="flex items-center gap-3 rounded-xl border border-border/70 bg-slate-50 px-4 py-3 dark:bg-slate-950/20">
                      <Zap className={`h-5 w-5 ${property.facilities.separateMeter ? "text-success" : "text-muted-foreground"}`} />
                      <span className="text-sm">Separate Electricity Meter</span>
                    </div>
                    <div className="flex items-center gap-3 rounded-xl border border-border/70 bg-slate-50 px-4 py-3 dark:bg-slate-950/20">
                      <Car className={`h-5 w-5 ${property.facilities.parking ? "text-success" : "text-muted-foreground"}`} />
                      <span className="text-sm">Parking</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="overflow-hidden rounded-2xl border border-border/70 bg-white shadow-sm dark:bg-card">
                <CardContent className="p-0">
                  <div className="flex items-center justify-between border-b px-4 py-3 sm:px-6">
                    <div>
                      <h2 className="text-lg font-semibold">Location</h2>
                      <p className="text-xs text-muted-foreground sm:text-sm">{property.address}</p>
                    </div>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(property.address)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-md border px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-accent"
                    >
                      Open in Maps
                    </a>
                  </div>
                  <iframe
                    title="Property Location"
                    src={mapEmbedUrl}
                    className="h-56 w-full border-0 sm:h-64"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Card className="rounded-[28px] border border-border/70 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.07)] lg:sticky lg:top-20 dark:bg-card">
                <CardContent className="space-y-4 p-5">
                  <div>
                    <p className="text-3xl font-bold leading-none text-foreground">Rs. {property.rent.toLocaleString("en-IN")} <span className="text-sm font-medium text-muted-foreground">/ month</span></p>
                    <p className="mt-1.5 text-sm text-muted-foreground">{property.houseType} with clear move-in pricing and verified host details.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-border/70 bg-slate-50 p-3 dark:bg-slate-950/20">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">Stay type</p>
                      <p className="mt-1 text-sm font-semibold">{property.houseType}</p>
                    </div>
                    <div className="rounded-xl border border-border/70 bg-slate-50 p-3 dark:bg-slate-950/20">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">Listing ID</p>
                      <p className="mt-1 text-sm font-semibold">{property.listingId}</p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-border/70 p-4">
                    <p className="text-sm text-muted-foreground">Hosted by</p>
                    <p className="mt-1 text-lg font-semibold">{property.landlordName}</p>
                    <p className="text-xs text-muted-foreground">Member since {property.memberSince}</p>
                    <p className="mt-2 text-xs font-medium text-primary">{property.totalListings} active listings</p>
                  </div>

                  <Button className="h-11 w-full rounded-full bg-[#3A7AFE] font-semibold text-white hover:bg-[#2f68d7]" onClick={handleStartChat} disabled={chatLoading || loading}>
                    {chatLoading ? "Opening chat..." : "Chat with seller"}
                  </Button>
                  <Button variant="outline" className="h-11 w-full rounded-full" onClick={handleContactLandlord}>Contact Landlord</Button>

                  <div className="space-y-2 rounded-2xl border border-[#3A7AFE]/15 bg-[#3A7AFE]/5 p-4">
                    <h3 className="font-bold text-sm">Payment Details</h3>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Monthly rent from landlord</span>
                      <span className="font-semibold">Rs. {property.rent.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Security deposit</span>
                      <span className="font-semibold">Rs. {(property.securityDepositAmount ?? Math.round(property.rent * 0.5)).toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2 text-sm">
                      <span className="font-bold">Booking hold amount</span>
                      <span className="text-base font-bold text-[#3A7AFE]">Rs. {(property.bookingHoldAmount ?? Math.round(property.rent * 0.25)).toLocaleString("en-IN")}</span>
                    </div>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      Rent and booking amounts come from the landlord listing. Older listings still fall back to default calculations.
                    </p>
                  </div>

                  <Button
                    className="h-11 w-full rounded-full bg-[#ff385c] font-bold text-white hover:bg-[#e13153]"
                    onClick={() => navigate(`/property/${property.id}/book`)}
                  >
                    Book Now
                  </Button>

                  <div className="rounded-2xl border border-border/70 p-4">
                    <p className="text-sm font-semibold">Posted in</p>
                    <p className="text-sm text-muted-foreground">{property.address}</p>
                  </div>

                  <div className="rounded-2xl border border-border/70 p-4 text-xs text-muted-foreground">
                    <p>Ad ID {property.listingId}</p>
                    <button className="mt-2 font-semibold text-primary">Report this ad</button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
