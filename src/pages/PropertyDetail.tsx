import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, IndianRupee, Home, Droplets, Zap, Car, ShieldCheck, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/Navbar";

export default function PropertyDetail() {
  const { id } = useParams();

  // Placeholder data - will be fetched from Supabase later
  const property = {
    id,
    title: "Spacious 2BHK Apartment in Anna Nagar",
    address: "15, 3rd Cross Street, Anna Nagar East, Chennai - 600102",
    rent: 18000,
    houseType: "2 BHK",
    description:
      "Well-maintained spacious 2BHK apartment with natural lighting, cross ventilation, and modern amenities. Located in a peaceful residential area with easy access to schools, hospitals, and public transport.",
    facilities: { water: true, separateMeter: true, parking: true },
    verified: true,
    landlordName: "Rajesh Kumar",
    images: [] as string[],
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to listings
        </Link>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery Placeholder */}
            <div className="aspect-video overflow-hidden rounded-xl bg-muted">
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <Home className="mx-auto h-16 w-16 text-muted-foreground/30" />
                  <p className="mt-2 text-sm text-muted-foreground">Property images</p>
                </div>
              </div>
            </div>

            {/* Details */}
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold">{property.title}</h1>
                    {property.verified && (
                      <Badge className="bg-success text-success-foreground gap-1">
                        <ShieldCheck className="h-3 w-3" /> Verified
                      </Badge>
                    )}
                  </div>
                  <div className="mt-1 flex items-center gap-1 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{property.address}</span>
                  </div>
                </div>
              </div>
            </div>

            <Card>
              <CardContent className="p-6">
                <h2 className="mb-3 text-lg font-semibold">Description</h2>
                <p className="text-muted-foreground leading-relaxed">{property.description}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
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
            <Card className="sticky top-20">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-1 text-3xl font-bold text-primary">
                  <IndianRupee className="h-6 w-6" />
                  <span>{property.rent.toLocaleString("en-IN")}</span>
                  <span className="text-sm font-normal text-muted-foreground">/month</span>
                </div>

                <Badge variant="secondary" className="text-sm">{property.houseType}</Badge>

                <div className="border-t pt-4">
                  <p className="text-sm text-muted-foreground">Listed by</p>
                  <p className="font-semibold">{property.landlordName}</p>
                </div>

                <Button className="w-full">Apply for This Property</Button>
                <Button variant="outline" className="w-full">Contact Landlord</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
