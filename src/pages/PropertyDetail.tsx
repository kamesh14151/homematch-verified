import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Car, Droplets, Heart, MapPin, Share2, ShieldCheck, Zap } from "lucide-react";
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

  useEffect(() => {
    const loadProperty = async () => {
      if (!id) {
        setLoading(false);
        return;
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
        { key: "Type", value: propertyRow.property_type ?? "Flats / Apartments" },
        { key: "Bedrooms", value: propertyRow.bedrooms?.toString() ?? "-" },
        { key: "Bathrooms", value: propertyRow.bathrooms?.toString() ?? "-" },
        { key: "Super Built-up Area", value: propertyRow.super_builtup_area ? `${propertyRow.super_builtup_area} sqft` : "-" },
        { key: "Furnishing", value: propertyRow.furnishing ?? "-" },
        { key: "Listed By", value: propertyRow.listed_by ?? "Owner" },
        { key: "Floor No", value: propertyRow.floor_no?.toString() ?? "-" },
        { key: "Total Floors", value: propertyRow.total_floors?.toString() ?? "-" },
        { key: "Parking", value: propertyRow.parking_slots?.toString() ?? "-" },
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
    };

    void loadProperty();
  }, [id]);

  const mapEmbedUrl = useMemo(
    () => `https://www.google.com/maps?q=${encodeURIComponent(property.address)}&output=embed`,
    [property.address]
  );
  const videoSource = useMemo(() => getVideoSource(property.videoUrl), [property.videoUrl]);

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
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to listings
        </Link>

        {loading ? (
          <div className="rounded-xl border bg-card p-8 text-center text-muted-foreground">Loading property details...</div>
        ) : (
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
                  <p className="leading-relaxed text-muted-foreground">{property.description}</p>
                </CardContent>
              </Card>

              {videoSource.type !== "none" && (
                <Card className="overflow-hidden border">
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
                      <div className="overflow-hidden rounded-xl border bg-black/90 shadow-sm">
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

              <Card className="overflow-hidden border">
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
              <Card className="lg:sticky lg:top-20">
                <CardContent className="space-y-3.5 p-4 sm:space-y-4 sm:p-6">
                  <div>
                    <p className="text-3xl font-bold leading-none text-foreground sm:text-4xl">Rs. {property.rent.toLocaleString("en-IN")}</p>
                    <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{property.houseType}</p>
                  </div>

                  <Badge variant="secondary" className="text-sm">{property.houseType}</Badge>

                  <div className="rounded-lg border p-4">
                    <p className="text-sm text-muted-foreground">Posted by</p>
                    <p className="font-semibold">{property.landlordName}</p>
                    <p className="text-xs text-muted-foreground">Member since {property.memberSince}</p>
                    <p className="mt-2 text-xs font-medium text-primary">{property.totalListings} Items listed</p>
                  </div>

                  <Button className="h-11 w-full" onClick={handleStartChat} disabled={chatLoading || loading}>
                    {chatLoading ? "Opening chat..." : "Chat with seller"}
                  </Button>
                  <Button variant="outline" className="h-11 w-full" onClick={handleContactLandlord}>Contact Landlord</Button>

                  {/* Payment summary */}
                  <div className="space-y-2 rounded-xl border bg-muted/30 p-4">
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
                    className="h-11 w-full rounded-full bg-yellow-400 font-bold text-gray-900 hover:bg-yellow-500"
                    onClick={() => navigate(`/property/${property.id}/book`)}
                  >
                    Book Now
                  </Button>

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
        )}
      </div>
    </div>
  );
}
