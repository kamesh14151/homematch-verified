import { useEffect, useState } from "react";
import { Building2, Home, PlusCircle, ListChecks, MessageSquare, UserCircle, ShieldCheck } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

export default function LandlordProfile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [verifyingPan, setVerifyingPan] = useState(false);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [panVerified, setPanVerified] = useState(false);
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, phone")
        .eq("user_id", user.id)
        .maybeSingle();

      const { data: landlord } = await supabase
        .from("landlords")
        .select("pan_number, pan_verified, address, pincode")
        .eq("user_id", user.id)
        .maybeSingle();

      setFullName(profile?.full_name ?? user.user_metadata?.full_name ?? "");
      setPhone(profile?.phone ?? "");
      setPanNumber(landlord?.pan_number ?? "");
      setPanVerified(!!landlord?.pan_verified);
      setAddress(landlord?.address ?? "");
      setPincode(landlord?.pincode ?? "");
    };

    void loadData();
  }, [user]);

  const handleVerifyPan = async () => {
    if (!user) return;

    const normalizedPan = panNumber.trim().toUpperCase();
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

    if (!panRegex.test(normalizedPan)) {
      toast({ title: "Invalid PAN", description: "Enter valid PAN format (e.g. ABCDE1234F).", variant: "destructive" });
      return;
    }

    setVerifyingPan(true);
    const { data, error } = await supabase.functions.invoke("kyc-verify-pan", {
      body: { panNumber: normalizedPan },
    });
    setVerifyingPan(false);

    if (error || !data?.verified) {
      toast({
        title: "PAN verification failed",
        description: error?.message || data?.message || "Provider is not configured.",
        variant: "destructive",
      });
      return;
    }

    const { error: saveError } = await supabase
      .from("landlords")
      .update({ pan_number: normalizedPan, pan_verified: true })
      .eq("user_id", user.id);

    if (saveError) {
      toast({ title: "Save failed", description: saveError.message, variant: "destructive" });
      return;
    }

    setPanNumber(normalizedPan);
    setPanVerified(true);
    toast({ title: "PAN verified", description: "Verification status updated." });
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);

    const { error: profileError } = await supabase
      .from("profiles")
      .update({ full_name: fullName || null, phone: phone || null })
      .eq("user_id", user.id);

    if (profileError) {
      setSaving(false);
      toast({ title: "Save failed", description: profileError.message, variant: "destructive" });
      return;
    }

    const { error: landlordError } = await supabase
      .from("landlords")
      .update({
        pan_number: panNumber || null,
        pan_verified: panVerified,
        address: address || null,
        pincode: pincode || null,
      })
      .eq("user_id", user.id);

    setSaving(false);

    if (landlordError) {
      toast({ title: "Save failed", description: landlordError.message, variant: "destructive" });
      return;
    }

    toast({ title: "Profile updated", description: "Your landlord profile has been saved." });
  };

  return (
    <DashboardLayout navItems={navItems} title="Landlord">
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold">My Profile</h1>
          <p className="text-muted-foreground">Manage your landlord profile</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Personal Information</CardTitle>
              {panVerified ? (
                <Badge className="gap-1 bg-success text-success-foreground">
                  <ShieldCheck className="h-3 w-3" /> PAN Verified
                </Badge>
              ) : (
                <Badge variant="secondary" className="gap-1">PAN Not Verified</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input value={fullName} onChange={(event) => setFullName(event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={user?.email || ""} disabled />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input placeholder="+91 98765 43210" value={phone} onChange={(event) => setPhone(event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>PAN Number</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="ABCDE1234F"
                  value={panNumber}
                  onChange={(event) => {
                    setPanVerified(false);
                    setPanNumber(event.target.value.toUpperCase());
                  }}
                />
                <Button type="button" variant="outline" onClick={() => void handleVerifyPan()} disabled={verifyingPan}>
                  {verifyingPan ? "Verifying..." : "Verify"}
                </Button>
              </div>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Address</Label>
              <Input placeholder="Your address" value={address} onChange={(event) => setAddress(event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>PIN Code</Label>
              <Input
                placeholder="600001"
                value={pincode}
                onChange={(event) => setPincode(event.target.value.replace(/\D/g, "").slice(0, 6))}
                inputMode="numeric"
                pattern="[0-9]{6}"
              />
            </div>
          </CardContent>
        </Card>

        <Button className="w-full" onClick={() => void handleSave()} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </DashboardLayout>
  );
}
