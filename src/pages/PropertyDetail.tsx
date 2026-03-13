import { useParams, Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { ArrowLeft, BedDouble, Car, Droplets, Heart, MapPin, Share2, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/Navbar";

export default function PropertyDetail() {
  const { id } = useParams();
  const [activeImage, setActiveImage] = useState(0);

  const property = useMemo(() => ({
    id,
    title: "Rental for 2BHK Gated Community Apartment",
    address: "Kitchipalayam, Salem, Tamil Nadu",
    rent: 15000,
    houseType: "2 BHK",
    bathrooms: 2,
    sqft: 900,
    postedAt: "Today",
    listingId: "1826811384",
    description:
      "Rental for 2BHK furnished house in a gated community, ready to occupy. Walkable distance from Salem bus stand with all daily convenience facilities nearby.",
    highlights: [
      "24/7 Water Supply",
      "Gym and Play Area",
      "Children Park",
      "Nearby Clinic and Super Market",
      "CCTV Security",
    ],
    details: [
      { key: "Type", value: "Flats / Apartments" },
      { key: "Bedrooms", value: "2" },
      { key: "Bathrooms", value: "2" },
      { key: "Super Built-up Area", value: "900 sqft" },
      { key: "Furnishing", value: "Semi-Furnished" },
      { key: "Listed By", value: "Owner" },
      { key: "Floor No", value: "1" },
      { key: "Total Floors", value: "5" },
      { key: "Parking", value: "2" },
      { key: "Facing", value: "North" },
      { key: "Project Name", value: "Mahaveer Palace" },
      { key: "Maintenance", value: "Rs. 2,000 / month" },
    ],
    facilities: { water: true, separateMeter: true, parking: true },
    verified: true,
    landlordName: "Bseeni Vasan",
    memberSince: "Nov 2016",
    totalListings: 2,
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1200&q=80",
    ],
  }), [id]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to listings
        </Link>

        <div className="grid gap-5 lg:grid-cols-3 lg:gap-8">
          <div className="space-y-6 lg:col-span-2">
            <Card className="overflow-hidden border">
              <div className="relative aspect-[16/9] bg-muted">
                <img src={property.images[activeImage]} alt={property.title} className="h-full w-full object-cover" />
                <div className="absolute right-3 top-3 flex gap-2">
                  <Button size="icon" variant="secondary" className="h-9 w-9 rounded-full"><Share2 className="h-4 w-4" /></Button>
                  <Button size="icon" variant="secondary" className="h-9 w-9 rounded-full"><Heart className="h-4 w-4" /></Button>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2 border-t p-2.5 sm:p-3">
                {property.images.map((image, index) => (
                  <button
                    key={image}
                    onClick={() => setActiveImage(index)}
                    className={`overflow-hidden rounded-md border-2 ${activeImage === index ? "border-primary" : "border-transparent"}`}
                  >
                    <img src={image} alt={`Property ${index + 1}`} className="h-14 w-full object-cover sm:h-16" />
                  </button>
                ))}
              </div>
            </Card>

            <div className="rounded-xl border bg-card p-4 sm:p-5">
              <div className="mb-2 flex items-center gap-2">
                <h1 className="text-lg font-bold sm:text-2xl">{property.title}</h1>
                {property.verified && (
                  <Badge className="gap-1 bg-success text-success-foreground">
                    <ShieldCheck className="h-3 w-3" /> Verified
                  </Badge>
                )}
              </div>
              <div className="mb-2 flex flex-wrap items-center gap-2.5 text-xs text-muted-foreground sm:mb-4 sm:gap-3 sm:text-sm">
                <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" /> {property.address}</span>
                <span className="inline-flex items-center gap-1"><BedDouble className="h-4 w-4" /> {property.houseType}</span>
                <span>{property.bathrooms} Bathrooms</span>
                <span>{property.sqft} sqft</span>
                <span>Posted: {property.postedAt}</span>
              </div>
            </div>

            <Card>
              <CardContent className="p-4 sm:p-6">
                <h2 className="mb-3 text-lg font-semibold">Details</h2>
                <div className="grid gap-3 text-sm sm:grid-cols-2">
                  {property.details.map((item) => (
                    <div key={item.key} className="flex items-center justify-between rounded-md border px-3 py-2">
                      <span className="text-muted-foreground">{item.key}</span>
                      <span className="font-semibold">{item.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 sm:p-6">
                <h2 className="mb-3 text-lg font-semibold">Description</h2>
                <p className="text-muted-foreground leading-relaxed">{property.description}</p>
                <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                  {property.highlights.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 sm:p-6">
                <h2 className="mb-4 text-lg font-semibold">Facilities</h2>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  <div className="flex items-center gap-2">
                    <Droplets className={`h-5 w-5 ${property.facilities.water ? "text-success" : "text-muted-foreground"}`} />
                    <span className="text-sm">Water Supply</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className={`h-5 w-5 ${property.facilities.separateMeter ? "text-success" : "text-muted-foreground"}`} />
                    <span className="text-sm">Separate Meter</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Car className={`h-5 w-5 ${property.facilities.parking ? "text-success" : "text-muted-foreground"}`} />
                    <span className="text-sm">Parking</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <Card className="lg:sticky lg:top-20">
              <CardContent className="space-y-3.5 p-4 sm:space-y-4 sm:p-6">
                <div>
                  <p className="text-3xl font-bold leading-none text-foreground sm:text-4xl">Rs. {property.rent.toLocaleString("en-IN")}</p>
                  <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{property.houseType} · {property.bathrooms} Bathroom · {property.sqft} sqft</p>
                </div>

                <Badge variant="secondary" className="text-sm">{property.houseType}</Badge>

                <div className="rounded-lg border p-4">
                  <p className="text-sm text-muted-foreground">Posted by</p>
                  <p className="font-semibold">{property.landlordName}</p>
                  <p className="text-xs text-muted-foreground">Member since {property.memberSince}</p>
                  <p className="mt-2 text-xs font-medium text-primary">{property.totalListings} Items listed</p>
                </div>

                <Button className="h-11 w-full">Chat with seller</Button>
                <Button variant="outline" className="h-11 w-full">Contact Landlord</Button>

                <div className="rounded-lg border p-4">
                  <p className="text-sm font-semibold">Posted in</p>
                  <p className="text-sm text-muted-foreground">{property.address}</p>
                </div>

                <div className="rounded-lg border p-4 text-xs text-muted-foreground">
                  <p>Ad ID {property.listingId}</p>
                  <button className="mt-2 font-semibold text-primary">Report this ad</button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
