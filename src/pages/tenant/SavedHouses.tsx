import { useEffect, useState } from "react";
import {
  Search,
  Bookmark,
  FileText,
  MessageSquare,
  UserCircle,
  Home,
  Loader2,
} from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PropertyCard } from "@/components/PropertyCard";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const navItems = [
  { title: "Search Houses", url: "/tenant/dashboard", icon: Search },
  { title: "Saved Houses", url: "/tenant/saved", icon: Bookmark },
  { title: "Applications", url: "/tenant/applications", icon: FileText },
  { title: "My Bookings", url: "/tenant/bookings", icon: Home },
  { title: "Messages", url: "/tenant/messages", icon: MessageSquare },
  { title: "Profile", url: "/tenant/profile", icon: UserCircle },
];

type SavedProperty = {
  id: string;
  savedId: string;
  title: string;
  address: string;
  rent: number;
  houseType: string;
  verified: boolean;
  imageUrl?: string;
};

export default function SavedHouses() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState<SavedProperty[]>([]);

  const loadSaved = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    const { data: savedRows, error } = await supabase
      .from("saved_properties")
      .select("id, property_id")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error || !savedRows?.length) {
      setProperties([]);
      setLoading(false);
      return;
    }

    const propertyIds = savedRows.map((r) => r.property_id);
    const [{ data: props }, { data: images }] = await Promise.all([
      supabase
        .from("properties")
        .select("id, title, address, rent, house_type, is_verified")
        .in("id", propertyIds),
      supabase
        .from("property_images")
        .select("property_id, image_url, display_order")
        .in("property_id", propertyIds)
        .order("display_order", { ascending: true }),
    ]);

    const imageMap = new Map<string, string>();
    (images ?? []).forEach((img) => {
      if (!imageMap.has(img.property_id))
        imageMap.set(img.property_id, img.image_url);
    });
    const savedMap = new Map(savedRows.map((r) => [r.property_id, r.id]));

    setProperties(
      (props ?? []).map((p) => ({
        id: p.id,
        savedId: savedMap.get(p.id) || "",
        title: p.title,
        address: p.address,
        rent: p.rent,
        houseType: p.house_type,
        verified: !!p.is_verified,
        imageUrl: imageMap.get(p.id),
      }))
    );
    setLoading(false);
  };

  useEffect(() => {
    void loadSaved();
  }, [user]);

  const handleUnsave = async (propertyId: string) => {
    if (!user) return;
    await supabase
      .from("saved_properties")
      .delete()
      .eq("user_id", user.id)
      .eq("property_id", propertyId);
    setProperties((prev) => prev.filter((p) => p.id !== propertyId));
    toast({ title: "Removed from saved" });
  };

  return (
    <DashboardLayout navItems={navItems} title="Tenant">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Saved Houses</h1>
          <p className="text-muted-foreground">
            Your bookmarked properties ({properties.length})
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : properties.length === 0 ? (
          <div className="rounded-lg border bg-card p-8 text-center">
            <Bookmark className="mx-auto h-12 w-12 text-muted-foreground/30" />
            <h3 className="mt-4 font-semibold">No saved houses yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Browse listings and tap the bookmark icon to save properties here
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {properties.map((p) => (
              <PropertyCard
                key={p.id}
                id={p.id}
                title={p.title}
                address={p.address}
                rent={p.rent}
                houseType={p.houseType}
                imageUrl={p.imageUrl}
                verified={p.verified}
                isSaved
                onSave={() => handleUnsave(p.id)}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
