import { useEffect, useMemo, useState } from "react";
import { Building2, Home, Users, MessageSquare, ListChecks, PlusCircle, UserCircle } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PropertyCard } from "@/components/PropertyCard";
import { StatCard } from "@/components/StatCard";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const navItems = [
  { title: "Overview", url: "/landlord/dashboard", icon: Home },
  { title: "Add Property", url: "/landlord/add-property", icon: PlusCircle },
  { title: "My Listings", url: "/landlord/listings", icon: Building2 },
  { title: "Tenant Requests", url: "/landlord/requests", icon: ListChecks },
  { title: "Messages", url: "/landlord/messages", icon: MessageSquare },
  { title: "Profile", url: "/landlord/profile", icon: UserCircle },
];

export default function LandlordDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState<
    Array<{
      id: string;
      title: string;
      address: string;
      rent: number;
      houseType: string;
      verified: boolean;
      active: boolean;
      createdAt: string;
      imageUrl?: string;
    }>
  >([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("properties")
        .select("id, title, address, rent, house_type, is_verified, is_active, created_at")
        .eq("landlord_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        toast({ title: "Unable to load dashboard", description: error.message, variant: "destructive" });
        setLoading(false);
        return;
      }

      const propertyIds = (data ?? []).map((item) => item.id);
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

      setProperties(
        (data ?? []).map((item) => ({
          id: item.id,
          title: item.title,
          address: item.address,
          rent: item.rent,
          houseType: item.house_type,
          verified: !!item.is_verified,
          active: item.is_active ?? true,
          createdAt: item.created_at,
          imageUrl: imageMap.get(item.id),
        }))
      );
      setLoading(false);
    };

    void loadDashboardData();
  }, [toast, user]);

  const activeListings = useMemo(() => properties.filter((item) => item.active).length, [properties]);

  const addedThisMonth = useMemo(() => {
    const now = new Date();
    return properties.filter((item) => {
      const created = new Date(item.createdAt);
      return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
    }).length;
  }, [properties]);

  return (
    <DashboardLayout navItems={navItems} title="Landlord">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard Overview</h1>
          <p className="text-muted-foreground">Welcome back! Here's your property summary.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Properties" value={properties.length} icon={Building2} description="Listed on platform" />
          <StatCard title="Active Listings" value={activeListings} icon={Home} trend={`+${addedThisMonth} this month`} />
          <StatCard title="Pending Requests" value={0} icon={Users} description="Tenant applications" />
          <StatCard title="Messages" value={0} icon={MessageSquare} description="Unread messages" />
        </div>

        {loading ? (
          <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground">Loading dashboard data...</div>
        ) : properties.length === 0 ? (
          <div className="rounded-lg border bg-card p-8 text-center">
            <Building2 className="mx-auto h-12 w-12 text-muted-foreground/30" />
            <h3 className="mt-4 font-semibold">No properties listed yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">Start by adding your first property listing</p>
          </div>
        ) : (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold">Recent Listings</h2>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {properties.slice(0, 6).map((property) => (
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
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
