import { useEffect, useState } from "react";
import { Building2, Home, PlusCircle, ListChecks, MessageSquare, UserCircle } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { PropertyCard } from "@/components/PropertyCard";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

const navItems = [
  { title: "Overview", url: "/landlord/dashboard", icon: Home },
  { title: "Add Property", url: "/landlord/add-property", icon: PlusCircle },
  { title: "My Listings", url: "/landlord/listings", icon: Building2 },
  { title: "Tenant Requests", url: "/landlord/requests", icon: ListChecks },
  { title: "Messages", url: "/landlord/messages", icon: MessageSquare },
  { title: "Profile", url: "/landlord/profile", icon: UserCircle },
];

export default function Listings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState<
    Array<{
      id: string;
      title: string;
      address: string;
      rent: number;
      houseType: string;
      verified: boolean;
      imageUrl?: string;
    }>
  >([]);

  useEffect(() => {
    const loadListings = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      const { data: properties, error } = await supabase
        .from("properties")
        .select("id, title, address, rent, house_type, is_verified")
        .eq("landlord_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        toast({ title: "Unable to load listings", description: error.message, variant: "destructive" });
        setLoading(false);
        return;
      }

      const propertyIds = (properties ?? []).map((item) => item.id);
      const imageMap = new Map<string, string>();

      if (propertyIds.length > 0) {
        const { data: images } = await supabase
          .from("property_images")
          .select("property_id, image_url, display_order")
          .in("property_id", propertyIds)
          .order("display_order", { ascending: true });

        (images ?? []).forEach((img) => {
          if (!imageMap.has(img.property_id)) {
            imageMap.set(img.property_id, img.image_url);
          }
        });
      }

      setListings(
        (properties ?? []).map((item) => ({
          id: item.id,
          title: item.title,
          address: item.address,
          rent: item.rent,
          houseType: item.house_type,
          verified: !!item.is_verified,
          imageUrl: imageMap.get(item.id),
        }))
      );
      setLoading(false);
    };

    void loadListings();
  }, [toast, user]);

  return (
    <DashboardLayout navItems={navItems} title="Landlord">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">My Listings</h1>
            <p className="text-muted-foreground">Manage your property listings</p>
          </div>
          <Button asChild>
            <Link to="/landlord/add-property">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Property
            </Link>
          </Button>
        </div>

        {loading ? (
          <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground">Loading your listings...</div>
        ) : listings.length === 0 ? (
          <div className="rounded-lg border bg-card p-8 text-center">
            <Building2 className="mx-auto h-12 w-12 text-muted-foreground/30" />
            <h3 className="mt-4 font-semibold">No listings yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">Your published properties will appear here</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {listings.map((property) => (
              <PropertyCard
                key={property.id}
                id={property.id}
                title={property.title}
                address={property.address}
                rent={property.rent}
                houseType={property.houseType}
                imageUrl={property.imageUrl}
                verified={property.verified}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
