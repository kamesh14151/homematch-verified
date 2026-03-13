import { useEffect, useState } from "react";
import { Search, Bookmark, FileText, MessageSquare, UserCircle, Home } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StatCard } from "@/components/StatCard";
import { PropertyCard } from "@/components/PropertyCard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const navItems = [
  { title: "Search Houses", url: "/tenant/dashboard", icon: Search },
  { title: "Saved Houses", url: "/tenant/saved", icon: Bookmark },
  { title: "Applications", url: "/tenant/applications", icon: FileText },
  { title: "Messages", url: "/tenant/messages", icon: MessageSquare },
  { title: "Profile", url: "/tenant/profile", icon: UserCircle },
];

export default function TenantDashboard() {
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
      imageUrl?: string;
    }>
  >([]);

  useEffect(() => {
    const loadProperties = async () => {
      const { data, error } = await supabase
        .from("properties")
        .select("id, title, address, rent, house_type, is_verified")
        .order("created_at", { ascending: false })
        .limit(12);

      if (error) {
        toast({ title: "Unable to load properties", description: error.message, variant: "destructive" });
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
          imageUrl: imageMap.get(item.id),
        }))
      );
      setLoading(false);
    };

    void loadProperties();
  }, [toast]);

  return (
    <DashboardLayout navItems={navItems} title="Tenant">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Find Your Perfect Home</h1>
          <p className="text-muted-foreground">Browse verified rental properties</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Properties Available" value={properties.length} icon={Home} />
          <StatCard title="Saved Houses" value={0} icon={Bookmark} />
          <StatCard title="Applications" value={0} icon={FileText} />
          <StatCard title="Messages" value={0} icon={MessageSquare} />
        </div>

        {loading ? (
          <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground">Loading properties...</div>
        ) : properties.length === 0 ? (
          <div className="rounded-lg border bg-card p-8 text-center">
            <Search className="mx-auto h-12 w-12 text-muted-foreground/30" />
            <h3 className="mt-4 font-semibold">No properties yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">Newly listed homes will appear here automatically</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {properties.map((property) => (
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
