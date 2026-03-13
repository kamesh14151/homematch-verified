import { useEffect, useMemo, useState } from "react";
import { Search, Bookmark, FileText, MessageSquare, UserCircle, ShieldCheck } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";

const navItems = [
  { title: "Search Houses", url: "/tenant/dashboard", icon: Search },
  { title: "Saved Houses", url: "/tenant/saved", icon: Bookmark },
  { title: "Applications", url: "/tenant/applications", icon: FileText },
  { title: "Messages", url: "/tenant/messages", icon: MessageSquare },
  { title: "Profile", url: "/tenant/profile", icon: UserCircle },
];

type PincodeRecord = {
  city: string;
  area: string;
  pincode: string;
  district: string;
  state: string;
};

const parseCsvLine = (line: string) => {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"') {
      const nextChar = line[i + 1];
      if (inQuotes && nextChar === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
      continue;
    }
    current += char;
  }
  result.push(current.trim());
  return result;
};

const parsePincodeCsv = (csvText: string): PincodeRecord[] => {
  const lines = csvText.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (lines.length <= 1) return [];

  const headers = parseCsvLine(lines[0]).map((h) => h.toLowerCase());
  const getIndex = (name: string) => headers.findIndex((h) => h === name.toLowerCase());
  const cityIndex = getIndex("City");
  const areaIndex = getIndex("Area");
  const pincodeIndex = getIndex("Pincode");
  const districtIndex = getIndex("District");
  const stateIndex = getIndex("State");
  if ([cityIndex, areaIndex, pincodeIndex, districtIndex, stateIndex].some((i) => i === -1)) return [];

  return lines
    .slice(1)
    .map((line) => {
      const cols = parseCsvLine(line);
      return {
        city: cols[cityIndex] ?? "",
        area: cols[areaIndex] ?? "",
        pincode: (cols[pincodeIndex] ?? "").replace(/\D/g, "").slice(0, 6),
        district: cols[districtIndex] ?? "",
        state: cols[stateIndex] ?? "",
      };
    })
    .filter((record) => record.pincode.length > 0);
};

const organizationOptions: Record<string, string[]> = {
  government: ["Central Government", "State Government", "PSU", "Municipal Office"],
  bank: ["SBI", "Indian Bank", "Canara Bank", "HDFC Bank", "ICICI Bank"],
  corporate: ["TCS", "Infosys", "Wipro", "HCL", "Accenture", "Other Company"],
  "self-employed": ["Business", "Consulting", "Freelance", "Shop Owner"],
  student: ["School", "College", "University", "Coaching Institute"],
  other: ["Other"],
};

export default function TenantProfile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [verifyingPan, setVerifyingPan] = useState(false);
  const [verifyingAadhaar, setVerifyingAadhaar] = useState(false);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [occupation, setOccupation] = useState("");
  const [organization, setOrganization] = useState("");
  const [familyMembers, setFamilyMembers] = useState("1");
  const [expectedRent, setExpectedRent] = useState("");
  const [preferredHouseType, setPreferredHouseType] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);

  const [panNumber, setPanNumber] = useState("");
  const [panName, setPanName] = useState("");
  const [panVerified, setPanVerified] = useState(false);

  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [aadhaarLast4, setAadhaarLast4] = useState("");
  const [aadhaarName, setAadhaarName] = useState("");
  const [aadhaarVerified, setAadhaarVerified] = useState(false);

  const [dataset, setDataset] = useState<PincodeRecord[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch("/data/India_pincode.csv");
        const text = await response.text();
        setDataset(parsePincodeCsv(text));
      } catch {
        setDataset([]);
      }
    };
    void loadData();
  }, []);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, phone")
        .eq("user_id", user.id)
        .maybeSingle();

      const { data: tenant } = await supabase
        .from("tenants")
        .select("occupation, company, family_members, expected_rent, preferred_house_type, preferred_location, pan_number, pan_verified, pan_name, aadhaar_last4, aadhaar_verified, aadhaar_name")
        .eq("user_id", user.id)
        .maybeSingle();

      setFullName(profile?.full_name ?? user.user_metadata?.full_name ?? "");
      setPhone(profile?.phone ?? "");
      setOccupation(tenant?.occupation ?? "");
      setOrganization(tenant?.company ?? "");
      setFamilyMembers(String(tenant?.family_members ?? 1));
      setExpectedRent(tenant?.expected_rent ? String(tenant.expected_rent) : "");
      setPreferredHouseType(tenant?.preferred_house_type ?? "");
      setLocationQuery(tenant?.preferred_location ?? "");
      setPanNumber(tenant?.pan_number ?? "");
      setPanName(tenant?.pan_name ?? "");
      setPanVerified(!!tenant?.pan_verified);
      setAadhaarLast4(tenant?.aadhaar_last4 ?? "");
      setAadhaarName(tenant?.aadhaar_name ?? "");
      setAadhaarVerified(!!tenant?.aadhaar_verified);
    };

    void loadProfile();
  }, [user]);

  const locationOptions = useMemo(() => {
    const q = locationQuery.trim().toLowerCase();
    if (q.length < 2) return [] as Array<{ label: string; value: string }>;

    const results = dataset
      .filter((record) =>
        record.pincode.startsWith(q) ||
        record.area.toLowerCase().includes(q) ||
        record.city.toLowerCase().includes(q) ||
        record.district.toLowerCase().includes(q) ||
        record.state.toLowerCase().includes(q)
      )
      .slice(0, 50)
      .map((record) => {
        const value = `${record.area}, ${record.city}, ${record.district}, ${record.state} - ${record.pincode}`;
        return { label: value, value };
      });

    return Array.from(new Map(results.map((item) => [item.value, item])).values());
  }, [dataset, locationQuery]);

  const currentOrganizationOptions = organizationOptions[occupation] ?? [];
  const organizationLabel = occupation === "student" ? "College / Institution" : "Company / Organization";

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);

    const { error: profileError } = await supabase
      .from("profiles")
      .update({ full_name: fullName || null, phone: phone || null })
      .eq("user_id", user.id);

    if (profileError) {
      toast({ title: "Profile save failed", description: profileError.message, variant: "destructive" });
      setSaving(false);
      return;
    }

    const { error: tenantError } = await supabase
      .from("tenants")
      .update({
        occupation: occupation || null,
        company: organization || null,
        family_members: familyMembers ? Number(familyMembers) : 1,
        expected_rent: expectedRent ? Number(expectedRent) : null,
        preferred_house_type: preferredHouseType || null,
        preferred_location: locationQuery || null,
        pan_number: panNumber || null,
        pan_name: panName || null,
        pan_verified: panVerified,
        aadhaar_last4: aadhaarLast4 || null,
        aadhaar_name: aadhaarName || null,
        aadhaar_verified: aadhaarVerified,
        kyc_verified_at: panVerified || aadhaarVerified ? new Date().toISOString() : null,
      })
      .eq("user_id", user.id);

    setSaving(false);
    if (tenantError) {
      toast({ title: "Tenant details save failed", description: tenantError.message, variant: "destructive" });
      return;
    }

    toast({ title: "Profile saved", description: "Your details were updated successfully." });
  };

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
      toast({ title: "PAN verification failed", description: error?.message || data?.message || "Configure KYC provider credentials and try again.", variant: "destructive" });
      return;
    }

    const verifiedName = data?.fullName || data?.name || "";
    setPanNumber(normalizedPan);
    setPanName(verifiedName);
    setPanVerified(true);
    if (!fullName && verifiedName) {
      setFullName(verifiedName);
    }

    const { error: saveError } = await supabase
      .from("tenants")
      .update({
        pan_number: normalizedPan,
        pan_name: verifiedName || null,
        pan_verified: true,
        kyc_verified_at: new Date().toISOString(),
      })
      .eq("user_id", user.id);

    if (saveError) {
      toast({ title: "PAN save failed", description: saveError.message, variant: "destructive" });
      return;
    }

    if (!fullName && verifiedName) {
      await supabase.from("profiles").update({ full_name: verifiedName }).eq("user_id", user.id);
    }

    toast({ title: "PAN verified", description: "Verification fetched and saved to your account." });
  };

  const handleVerifyAadhaar = async () => {
    if (!user) return;
    const normalizedAadhaar = aadhaarNumber.replace(/\D/g, "").slice(0, 12);

    if (normalizedAadhaar.length !== 12) {
      toast({ title: "Invalid Aadhaar", description: "Enter a valid 12-digit Aadhaar number.", variant: "destructive" });
      return;
    }

    setVerifyingAadhaar(true);
    const { data, error } = await supabase.functions.invoke("kyc-verify-aadhaar", {
      body: { aadhaarNumber: normalizedAadhaar },
    });
    setVerifyingAadhaar(false);

    if (error || !data?.verified) {
      toast({ title: "Aadhaar verification failed", description: error?.message || data?.message || "Configure KYC provider credentials and try again.", variant: "destructive" });
      return;
    }

    const last4 = data?.last4 || normalizedAadhaar.slice(-4);
    const verifiedName = data?.fullName || data?.name || "";

    setAadhaarLast4(last4);
    setAadhaarName(verifiedName);
    setAadhaarVerified(true);
    setAadhaarNumber(`XXXXXXXX${last4}`);
    if (!fullName && verifiedName) {
      setFullName(verifiedName);
    }

    const { error: saveError } = await supabase
      .from("tenants")
      .update({
        aadhaar_last4: last4,
        aadhaar_name: verifiedName || null,
        aadhaar_verified: true,
        kyc_verified_at: new Date().toISOString(),
      })
      .eq("user_id", user.id);

    if (saveError) {
      toast({ title: "Aadhaar save failed", description: saveError.message, variant: "destructive" });
      return;
    }

    if (!fullName && verifiedName) {
      await supabase.from("profiles").update({ full_name: verifiedName }).eq("user_id", user.id);
    }

    toast({ title: "Aadhaar verified", description: "Verification fetched and saved to your account." });
  };

  return (
    <DashboardLayout navItems={navItems} title="Tenant">
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold">My Profile</h1>
          <p className="text-muted-foreground">Manage your tenant profile and preferences</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Personal Information</CardTitle>
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
              <Label>Occupation</Label>
              <Select value={occupation} onValueChange={(value) => { setOccupation(value); setOrganization(""); }}>
                <SelectTrigger><SelectValue placeholder="Select occupation" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="government">Government Employee</SelectItem>
                  <SelectItem value="bank">Bank Employee</SelectItem>
                  <SelectItem value="corporate">Corporate Employee</SelectItem>
                  <SelectItem value="self-employed">Self Employed</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{organizationLabel}</Label>
              <Select value={organization} onValueChange={setOrganization}>
                <SelectTrigger><SelectValue placeholder={`Select ${organizationLabel.toLowerCase()}`} /></SelectTrigger>
                <SelectContent>
                  {currentOrganizationOptions.length > 0 ? (
                    currentOrganizationOptions.map((option) => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))
                  ) : (
                    <SelectItem value="Not Specified">Not Specified</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Family Members</Label>
              <Input type="number" placeholder="3" min={1} value={familyMembers} onChange={(event) => setFamilyMembers(event.target.value)} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">KYC Verification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>PAN Number</Label>
                <Input
                  placeholder="ABCDE1234F"
                  value={panNumber}
                  onChange={(event) => {
                    setPanVerified(false);
                    setPanNumber(event.target.value.toUpperCase());
                  }}
                />
                {panName ? <p className="text-xs text-muted-foreground">Name: {panName}</p> : null}
              </div>
              <div className="flex items-end gap-2">
                <Button onClick={() => void handleVerifyPan()} disabled={verifyingPan}>
                  {verifyingPan ? "Verifying PAN..." : "Verify PAN"}
                </Button>
                {panVerified ? <Badge className="gap-1 bg-success text-success-foreground"><ShieldCheck className="h-3 w-3" /> Verified</Badge> : null}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Aadhaar Number</Label>
                <Input
                  placeholder="12-digit Aadhaar"
                  value={aadhaarNumber}
                  onChange={(event) => {
                    setAadhaarVerified(false);
                    setAadhaarNumber(event.target.value.replace(/\D/g, "").slice(0, 12));
                  }}
                />
                {aadhaarLast4 ? <p className="text-xs text-muted-foreground">Saved: XXXX XXXX {aadhaarLast4}</p> : null}
                {aadhaarName ? <p className="text-xs text-muted-foreground">Name: {aadhaarName}</p> : null}
              </div>
              <div className="flex items-end gap-2">
                <Button onClick={() => void handleVerifyAadhaar()} disabled={verifyingAadhaar}>
                  {verifyingAadhaar ? "Verifying Aadhaar..." : "Verify Aadhaar"}
                </Button>
                {aadhaarVerified ? <Badge className="gap-1 bg-success text-success-foreground"><ShieldCheck className="h-3 w-3" /> Verified</Badge> : null}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Preferences</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Expected Rent (₹)</Label>
              <Input type="number" placeholder="15000" value={expectedRent} onChange={(event) => setExpectedRent(event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Preferred House Type</Label>
              <Select value={preferredHouseType} onValueChange={setPreferredHouseType}>
                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1bhk">1 BHK</SelectItem>
                  <SelectItem value="2bhk">2 BHK</SelectItem>
                  <SelectItem value="3bhk">3 BHK</SelectItem>
                  <SelectItem value="4bhk">4 BHK</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Preferred Location / PIN Code</Label>
              <div className="relative">
                <Input
                  placeholder="Type area, city, district, state or PIN"
                  value={locationQuery}
                  onChange={(event) => {
                    setLocationQuery(event.target.value);
                    setShowLocationDropdown(true);
                  }}
                  onFocus={() => setShowLocationDropdown(true)}
                  onBlur={() => setTimeout(() => setShowLocationDropdown(false), 120)}
                />
                {showLocationDropdown && locationQuery.trim().length >= 2 && (
                  <div className="absolute z-20 mt-1 max-h-52 w-full overflow-y-auto rounded-md border bg-background shadow-md">
                    {locationOptions.length > 0 ? (
                      locationOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          className="block w-full border-b px-3 py-2 text-left text-sm hover:bg-accent last:border-b-0"
                          onMouseDown={(event) => event.preventDefault()}
                          onClick={() => {
                            setLocationQuery(option.value);
                            setShowLocationDropdown(false);
                          }}
                        >
                          {option.label}
                        </button>
                      ))
                    ) : (
                      <div className="px-3 py-2 text-sm text-muted-foreground">No matching locations found</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Documents</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>ID Proof</Label>
              <Input type="file" accept=".pdf,.jpg,.png" />
              <p className="text-xs text-muted-foreground">Encrypted & auto-deleted after 30 days</p>
            </div>
            <div className="space-y-2">
              <Label>Employment Proof</Label>
              <Input type="file" accept=".pdf,.jpg,.png" />
              <p className="text-xs text-muted-foreground">Encrypted & auto-deleted after 30 days</p>
            </div>
          </CardContent>
        </Card>

        <Button className="w-full" onClick={() => void handleSaveProfile()} disabled={saving}>
          {saving ? "Saving..." : "Save Profile"}
        </Button>
      </div>
    </DashboardLayout>
  );
}
