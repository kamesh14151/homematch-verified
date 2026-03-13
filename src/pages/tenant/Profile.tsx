import { useEffect, useMemo, useState } from "react";
import { Search, Bookmark, FileText, MessageSquare, UserCircle } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";

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
  const [occupation, setOccupation] = useState("");
  const [organization, setOrganization] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
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
              <Input defaultValue={user?.user_metadata?.full_name || ""} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={user?.email || ""} disabled />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input placeholder="+91 98765 43210" />
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
              <Input type="number" placeholder="3" min={1} />
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
              <Input type="number" placeholder="15000" />
            </div>
            <div className="space-y-2">
              <Label>Preferred House Type</Label>
              <Select>
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

        <Button className="w-full">Save Profile</Button>
      </div>
    </DashboardLayout>
  );
}
