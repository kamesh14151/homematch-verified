import { useEffect, useState } from "react";
import { Building2, Home, PlusCircle, ListChecks, MessageSquare, UserCircle } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const navItems = [
  { title: "Overview", url: "/landlord/dashboard", icon: Home },
  { title: "Add Property", url: "/landlord/add-property", icon: PlusCircle },
  { title: "My Listings", url: "/landlord/listings", icon: Building2 },
  { title: "Tenant Requests", url: "/landlord/requests", icon: ListChecks },
  { title: "Messages", url: "/landlord/messages", icon: MessageSquare },
  { title: "Profile", url: "/landlord/profile", icon: UserCircle },
];

type PincodeResult = {
  city: string;
  area: string;
  pincode: string;
  district: string;
  state: string;
};

type SuggestionOption = {
  label: string;
  record: PincodeResult;
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

const parsePincodeCsv = (csvText: string): PincodeResult[] => {
  const lines = csvText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length <= 1) return [];

  const headers = parseCsvLine(lines[0]).map((header) => header.toLowerCase());
  const getIndex = (name: string) => headers.findIndex((header) => header === name.toLowerCase());

  const cityIndex = getIndex("City");
  const areaIndex = getIndex("Area");
  const pincodeIndex = getIndex("Pincode");
  const districtIndex = getIndex("District");
  const stateIndex = getIndex("State");

  if ([cityIndex, areaIndex, pincodeIndex, districtIndex, stateIndex].some((index) => index === -1)) {
    return [];
  }

  return lines.slice(1).map((line) => {
    const cols = parseCsvLine(line);
    return {
      city: cols[cityIndex] ?? "",
      area: cols[areaIndex] ?? "",
      pincode: (cols[pincodeIndex] ?? "").replace(/\D/g, "").slice(0, 6),
      district: cols[districtIndex] ?? "",
      state: cols[stateIndex] ?? "",
    };
  }).filter((item) => item.pincode.length > 0);
};

const toKey = (record: PincodeResult) => `${record.pincode}|${record.area}|${record.city}|${record.district}|${record.state}`;

const dedupeBy = (records: PincodeResult[]) => {
  const map = new Map<string, PincodeResult>();
  records.forEach((record) => {
    const key = toKey(record);
    if (!map.has(key)) map.set(key, record);
  });
  return Array.from(map.values());
};

const recordLabel = (record: PincodeResult) =>
  `${record.pincode} - ${record.area}, ${record.city}, ${record.district}, ${record.state}`;

export default function AddProperty() {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [dataset, setDataset] = useState<PincodeResult[]>([]);
  const [pincodeOptions, setPincodeOptions] = useState<SuggestionOption[]>([]);
  const [areaOptions, setAreaOptions] = useState<SuggestionOption[]>([]);
  const [cityOptions, setCityOptions] = useState<SuggestionOption[]>([]);
  const [districtOptions, setDistrictOptions] = useState<SuggestionOption[]>([]);
  const [stateOptions, setStateOptions] = useState<SuggestionOption[]>([]);
  const [showPincodeDropdown, setShowPincodeDropdown] = useState(false);
  const [showAreaDropdown, setShowAreaDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showDistrictDropdown, setShowDistrictDropdown] = useState(false);
  const [showStateDropdown, setShowStateDropdown] = useState(false);

  const [form, setForm] = useState({
    title: "",
    addressLine: "",
    area: "",
    city: "",
    district: "",
    state: "",
    pincode: "",
    rent: "",
    securityDepositAmount: "",
    bookingHoldAmount: "",
    houseType: "",
    propertyType: "",
    bedrooms: "",
    bathrooms: "",
    superBuiltupArea: "",
    furnishing: "",
    listedBy: "Owner",
    floorNo: "",
    totalFloors: "",
    parkingSlots: "",
    facing: "",
    projectName: "",
    maintenance: "",
    ebBillNumber: "",
    description: "",
    videoUrl: "",
    waterSupply: false,
    separateMeter: false,
    parkingFacility: false,
  });

  const updateField = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((previous) => ({ ...previous, [key]: value }));
  };

  const applyRecordToLocationFields = (record: PincodeResult) => {
    updateField("pincode", record.pincode);
    updateField("area", record.area);
    updateField("city", record.city);
    updateField("district", record.district);
    updateField("state", record.state);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch("/data/India_pincode.csv");
        const csvText = await response.text();
        setDataset(parsePincodeCsv(csvText));
      } catch {
        setDataset([]);
      }
    };

    void loadData();
  }, []);

  useEffect(() => {
    const q = form.pincode.trim();
    if (q.length < 1) {
      setPincodeOptions([]);
      return;
    }
    const matches = dedupeBy(dataset.filter((item) => item.pincode.startsWith(q))).slice(0, 50);
    setPincodeOptions(matches.map((record) => ({ label: recordLabel(record), record })));
  }, [dataset, form.pincode]);

  useEffect(() => {
    const q = form.area.trim().toLowerCase();
    if (q.length < 1) {
      setAreaOptions([]);
      return;
    }
    const matches = dedupeBy(dataset.filter((item) => item.area.toLowerCase().includes(q))).slice(0, 50);
    setAreaOptions(matches.map((record) => ({ label: recordLabel(record), record })));
  }, [dataset, form.area]);

  useEffect(() => {
    const q = form.city.trim().toLowerCase();
    if (q.length < 1) {
      setCityOptions([]);
      return;
    }
    const matches = dedupeBy(dataset.filter((item) => item.city.toLowerCase().includes(q))).slice(0, 50);
    setCityOptions(matches.map((record) => ({ label: recordLabel(record), record })));
  }, [dataset, form.city]);

  useEffect(() => {
    const q = form.district.trim().toLowerCase();
    if (q.length < 1) {
      setDistrictOptions([]);
      return;
    }
    const matches = dedupeBy(dataset.filter((item) => item.district.toLowerCase().includes(q))).slice(0, 50);
    setDistrictOptions(matches.map((record) => ({ label: recordLabel(record), record })));
  }, [dataset, form.district]);

  useEffect(() => {
    const q = form.state.trim().toLowerCase();
    if (q.length < 1) {
      setStateOptions([]);
      return;
    }
    const matches = dedupeBy(dataset.filter((item) => item.state.toLowerCase().includes(q))).slice(0, 50);
    setStateOptions(matches.map((record) => ({ label: recordLabel(record), record })));
  }, [dataset, form.state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ title: "Please log in", description: "Login as landlord to publish property.", variant: "destructive" });
      return;
    }

    const { data: landlordProfile, error: landlordError } = await supabase
      .from("landlords")
      .select("pan_verified")
      .eq("user_id", user.id)
      .maybeSingle();

    if (landlordError) {
      toast({ title: "Verification check failed", description: landlordError.message, variant: "destructive" });
      return;
    }

    if (!landlordProfile?.pan_verified) {
      toast({
        title: "PAN verification required",
        description: "Verify PAN in your profile before publishing a property.",
        variant: "destructive",
      });
      navigate("/landlord/profile");
      return;
    }

    const composedAddress = [form.addressLine, form.area, form.city, form.district, form.state, form.pincode]
      .map((item) => item.trim())
      .filter(Boolean)
      .join(", ");

    if (!form.title || !composedAddress || !form.rent || !form.houseType || !form.securityDepositAmount || !form.bookingHoldAmount) {
      toast({ title: "Missing required details", description: "Please fill title, location details, rent, booking prices and house type.", variant: "destructive" });
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from("properties")
      .insert({
        landlord_id: user.id,
        title: form.title,
        address: composedAddress,
        pincode: form.pincode || null,
        rent: Number(form.rent),
        security_deposit_amount: Number(form.securityDepositAmount),
        booking_hold_amount: Number(form.bookingHoldAmount),
        house_type: form.houseType,
        eb_bill_number: form.ebBillNumber || null,
        description: form.description || null,
        video_url: form.videoUrl || null,
        water_supply: form.waterSupply,
        separate_meter: form.separateMeter,
        parking: form.parkingFacility,
        property_type: form.propertyType || null,
        bedrooms: form.bedrooms ? Number(form.bedrooms) : null,
        bathrooms: form.bathrooms ? Number(form.bathrooms) : null,
        super_builtup_area: form.superBuiltupArea ? Number(form.superBuiltupArea) : null,
        furnishing: form.furnishing || null,
        listed_by: form.listedBy || null,
        floor_no: form.floorNo ? Number(form.floorNo) : null,
        total_floors: form.totalFloors ? Number(form.totalFloors) : null,
        parking_slots: form.parkingSlots ? Number(form.parkingSlots) : null,
        facing: form.facing || null,
        project_name: form.projectName || null,
        maintenance_amount: form.maintenance ? Number(form.maintenance) : null,
      })
      .select("id")
      .single();

    if (error) {
      toast({ title: "Publish failed", description: error.message, variant: "destructive" });
      setLoading(false);
      return;
    }

    if (imageFiles.length > 0) {
      const uploadResults = await Promise.all(
        imageFiles.map(async (file, index) => {
          const cleanFileName = file.name.replace(/\s+/g, "-").toLowerCase();
          const filePath = `${user.id}/${data.id}/${Date.now()}-${index}-${cleanFileName}`;
          const { error: uploadError } = await supabase.storage
            .from("property-images")
            .upload(filePath, file, { upsert: false });

          if (uploadError) {
            return { success: false as const, error: uploadError.message };
          }

          const { data: publicUrlData } = supabase.storage.from("property-images").getPublicUrl(filePath);
          return {
            success: true as const,
            imageUrl: publicUrlData.publicUrl,
            displayOrder: index,
          };
        })
      );

      const successfulUploads = uploadResults.filter((item) => item.success);
      if (successfulUploads.length > 0) {
        const { error: imagesInsertError } = await supabase.from("property_images").insert(
          successfulUploads.map((item) => ({
            property_id: data.id,
            image_url: item.imageUrl,
            display_order: item.displayOrder,
          }))
        );

        if (imagesInsertError) {
          toast({ title: "Image save warning", description: imagesInsertError.message, variant: "destructive" });
        }
      }
    }

    toast({ title: "Property published", description: "Your listing is now live." });
    setLoading(false);
    navigate(`/property/${data.id}`);
  };

  return (
    <DashboardLayout navItems={navItems} title="Landlord">
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Add New Property</h1>
          <p className="text-muted-foreground">Fill in the details to list your property</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Property Details</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label>Property Title</Label>
                  <Input
                    placeholder="Rental for 2BHK Gated Community Apartment"
                    value={form.title}
                    onChange={(event) => updateField("title", event.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Address Line</Label>
                  <Textarea
                    placeholder="House / street / landmark"
                    value={form.addressLine}
                    onChange={(event) => updateField("addressLine", event.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Area</Label>
                  <div className="relative">
                    <Input
                      placeholder="Type area and select"
                      value={form.area}
                      onChange={(event) => {
                        updateField("area", event.target.value);
                        setShowAreaDropdown(true);
                      }}
                      onFocus={() => setShowAreaDropdown(true)}
                      onBlur={() => setTimeout(() => setShowAreaDropdown(false), 120)}
                    />
                    {showAreaDropdown && form.area.trim().length >= 1 && (
                      <div className="absolute z-20 mt-1 max-h-52 w-full overflow-y-auto rounded-md border bg-background shadow-md">
                        {areaOptions.length > 0 ? (
                          areaOptions.map((option, index) => (
                            <button
                              key={`${option.record.pincode}-${option.record.area}-${index}`}
                              type="button"
                              className="block w-full border-b px-3 py-2 text-left text-sm hover:bg-accent last:border-b-0"
                              onMouseDown={(event) => event.preventDefault()}
                              onClick={() => {
                                applyRecordToLocationFields(option.record);
                                setShowAreaDropdown(false);
                              }}
                            >
                              {option.label}
                            </button>
                          ))
                        ) : (
                          <div className="px-3 py-2 text-sm text-muted-foreground">No matching areas found</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>City</Label>
                  <div className="relative">
                    <Input
                      placeholder="Type city and select"
                      value={form.city}
                      onChange={(event) => {
                        updateField("city", event.target.value);
                        setShowCityDropdown(true);
                      }}
                      onFocus={() => setShowCityDropdown(true)}
                      onBlur={() => setTimeout(() => setShowCityDropdown(false), 120)}
                    />
                    {showCityDropdown && form.city.trim().length >= 1 && (
                      <div className="absolute z-20 mt-1 max-h-52 w-full overflow-y-auto rounded-md border bg-background shadow-md">
                        {cityOptions.length > 0 ? (
                          cityOptions.map((option, index) => (
                            <button
                              key={`${option.record.pincode}-${option.record.city}-${index}`}
                              type="button"
                              className="block w-full border-b px-3 py-2 text-left text-sm hover:bg-accent last:border-b-0"
                              onMouseDown={(event) => event.preventDefault()}
                              onClick={() => {
                                applyRecordToLocationFields(option.record);
                                setShowCityDropdown(false);
                              }}
                            >
                              {option.label}
                            </button>
                          ))
                        ) : (
                          <div className="px-3 py-2 text-sm text-muted-foreground">No matching cities found</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>District</Label>
                  <div className="relative">
                    <Input
                      placeholder="Type district and select"
                      value={form.district}
                      onChange={(event) => {
                        updateField("district", event.target.value);
                        setShowDistrictDropdown(true);
                      }}
                      onFocus={() => setShowDistrictDropdown(true)}
                      onBlur={() => setTimeout(() => setShowDistrictDropdown(false), 120)}
                    />
                    {showDistrictDropdown && form.district.trim().length >= 1 && (
                      <div className="absolute z-20 mt-1 max-h-52 w-full overflow-y-auto rounded-md border bg-background shadow-md">
                        {districtOptions.length > 0 ? (
                          districtOptions.map((option, index) => (
                            <button
                              key={`${option.record.pincode}-${option.record.district}-${index}`}
                              type="button"
                              className="block w-full border-b px-3 py-2 text-left text-sm hover:bg-accent last:border-b-0"
                              onMouseDown={(event) => event.preventDefault()}
                              onClick={() => {
                                applyRecordToLocationFields(option.record);
                                setShowDistrictDropdown(false);
                              }}
                            >
                              {option.label}
                            </button>
                          ))
                        ) : (
                          <div className="px-3 py-2 text-sm text-muted-foreground">No matching districts found</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>State</Label>
                  <div className="relative">
                    <Input
                      placeholder="Type state and select"
                      value={form.state}
                      onChange={(event) => {
                        updateField("state", event.target.value);
                        setShowStateDropdown(true);
                      }}
                      onFocus={() => setShowStateDropdown(true)}
                      onBlur={() => setTimeout(() => setShowStateDropdown(false), 120)}
                    />
                    {showStateDropdown && form.state.trim().length >= 1 && (
                      <div className="absolute z-20 mt-1 max-h-52 w-full overflow-y-auto rounded-md border bg-background shadow-md">
                        {stateOptions.length > 0 ? (
                          stateOptions.map((option, index) => (
                            <button
                              key={`${option.record.pincode}-${option.record.state}-${index}`}
                              type="button"
                              className="block w-full border-b px-3 py-2 text-left text-sm hover:bg-accent last:border-b-0"
                              onMouseDown={(event) => event.preventDefault()}
                              onClick={() => {
                                applyRecordToLocationFields(option.record);
                                setShowStateDropdown(false);
                              }}
                            >
                              {option.label}
                            </button>
                          ))
                        ) : (
                          <div className="px-3 py-2 text-sm text-muted-foreground">No matching states found</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>PIN Code</Label>
                  <div className="relative">
                    <Input
                      placeholder="Type 63... and select"
                      value={form.pincode}
                      onChange={(event) => {
                        updateField("pincode", event.target.value.replace(/\D/g, "").slice(0, 6));
                        setShowPincodeDropdown(true);
                      }}
                      onFocus={() => setShowPincodeDropdown(true)}
                      onBlur={() => setTimeout(() => setShowPincodeDropdown(false), 120)}
                      inputMode="numeric"
                      pattern="[0-9]{6}"
                    />
                    {showPincodeDropdown && form.pincode.trim().length >= 2 && (
                      <div className="absolute z-20 mt-1 max-h-52 w-full overflow-y-auto rounded-md border bg-background shadow-md">
                        {pincodeOptions.length > 0 ? (
                          pincodeOptions.map((option, index) => (
                            <button
                              key={`${option.record.pincode}-${index}`}
                              type="button"
                              className="block w-full border-b px-3 py-2 text-left text-sm hover:bg-accent last:border-b-0"
                              onMouseDown={(event) => event.preventDefault()}
                              onClick={() => {
                                applyRecordToLocationFields(option.record);
                                setShowPincodeDropdown(false);
                              }}
                            >
                              {option.label}
                            </button>
                          ))
                        ) : (
                          <div className="px-3 py-2 text-sm text-muted-foreground">No matching PIN codes found</div>
                        )}
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">Type any starting digits (e.g. 63) to see matching India PIN codes</p>
                </div>
                <div className="space-y-2">
                  <Label>Monthly Rent (₹)</Label>
                  <Input
                    type="number"
                    placeholder="15000"
                    value={form.rent}
                    onChange={(event) => updateField("rent", event.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Security Deposit (₹)</Label>
                  <Input
                    type="number"
                    placeholder="30000"
                    value={form.securityDepositAmount}
                    onChange={(event) => updateField("securityDepositAmount", event.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Booking Hold Amount (₹)</Label>
                  <Input
                    type="number"
                    placeholder="5000"
                    value={form.bookingHoldAmount}
                    onChange={(event) => updateField("bookingHoldAmount", event.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">This is the exact upfront amount tenants see on the booking page.</p>
                </div>
                <div className="space-y-2">
                  <Label>House Type</Label>
                  <Select value={form.houseType} onValueChange={(value) => updateField("houseType", value)}>
                    <SelectTrigger><SelectValue placeholder="Select BHK" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1 BHK">1 BHK</SelectItem>
                      <SelectItem value="2 BHK">2 BHK</SelectItem>
                      <SelectItem value="3 BHK">3 BHK</SelectItem>
                      <SelectItem value="4 BHK">4 BHK</SelectItem>
                      <SelectItem value="4+ BHK">4+ BHK</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select value={form.propertyType} onValueChange={(value) => updateField("propertyType", value)}>
                    <SelectTrigger><SelectValue placeholder="Select property type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Flats / Apartments">Flats / Apartments</SelectItem>
                      <SelectItem value="Independent House / Villa">Independent House / Villa</SelectItem>
                      <SelectItem value="Builder Floor">Builder Floor</SelectItem>
                      <SelectItem value="Studio Apartment">Studio Apartment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Bedrooms</Label>
                  <Select value={form.bedrooms} onValueChange={(value) => updateField("bedrooms", value)}>
                    <SelectTrigger><SelectValue placeholder="Select bedrooms" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="4">4</SelectItem>
                      <SelectItem value="5">5+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Bathrooms</Label>
                  <Select value={form.bathrooms} onValueChange={(value) => updateField("bathrooms", value)}>
                    <SelectTrigger><SelectValue placeholder="Select bathrooms" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="4">4+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Super Built-up Area (sqft)</Label>
                  <Input
                    type="number"
                    placeholder="900"
                    value={form.superBuiltupArea}
                    onChange={(event) => updateField("superBuiltupArea", event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Furnishing</Label>
                  <Select value={form.furnishing} onValueChange={(value) => updateField("furnishing", value)}>
                    <SelectTrigger><SelectValue placeholder="Select furnishing" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Unfurnished">Unfurnished</SelectItem>
                      <SelectItem value="Semi-Furnished">Semi-Furnished</SelectItem>
                      <SelectItem value="Fully Furnished">Fully Furnished</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Listed By</Label>
                  <Select value={form.listedBy} onValueChange={(value) => updateField("listedBy", value)}>
                    <SelectTrigger><SelectValue placeholder="Select owner type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Owner">Owner</SelectItem>
                      <SelectItem value="Builder">Builder</SelectItem>
                      <SelectItem value="Agent">Agent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Floor No</Label>
                  <Input
                    type="number"
                    placeholder="1"
                    value={form.floorNo}
                    onChange={(event) => updateField("floorNo", event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Total Floors</Label>
                  <Input
                    type="number"
                    placeholder="5"
                    value={form.totalFloors}
                    onChange={(event) => updateField("totalFloors", event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Parking Slots</Label>
                  <Input
                    type="number"
                    placeholder="2"
                    value={form.parkingSlots}
                    onChange={(event) => updateField("parkingSlots", event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Facing</Label>
                  <Select value={form.facing} onValueChange={(value) => updateField("facing", value)}>
                    <SelectTrigger><SelectValue placeholder="Select facing" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="North">North</SelectItem>
                      <SelectItem value="South">South</SelectItem>
                      <SelectItem value="East">East</SelectItem>
                      <SelectItem value="West">West</SelectItem>
                      <SelectItem value="North-East">North-East</SelectItem>
                      <SelectItem value="North-West">North-West</SelectItem>
                      <SelectItem value="South-East">South-East</SelectItem>
                      <SelectItem value="South-West">South-West</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Project Name</Label>
                  <Input
                    placeholder="Mahaveer Palace"
                    value={form.projectName}
                    onChange={(event) => updateField("projectName", event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Maintenance (₹ / month)</Label>
                  <Input
                    type="number"
                    placeholder="2000"
                    value={form.maintenance}
                    onChange={(event) => updateField("maintenance", event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>EB Bill Number</Label>
                  <Input
                    placeholder="Electricity board bill number"
                    value={form.ebBillNumber}
                    onChange={(event) => updateField("ebBillNumber", event.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Description & Facilities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Describe the property, neighborhood, nearby facilities..."
                    rows={4}
                    value={form.description}
                    onChange={(event) => updateField("description", event.target.value)}
                  />
                </div>
                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="water" checked={form.waterSupply} onCheckedChange={(checked) => updateField("waterSupply", !!checked)} />
                    <Label htmlFor="water">Water Supply</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="meter" checked={form.separateMeter} onCheckedChange={(checked) => updateField("separateMeter", !!checked)} />
                    <Label htmlFor="meter">Separate Electricity Meter</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="parking" checked={form.parkingFacility} onCheckedChange={(checked) => updateField("parkingFacility", !!checked)} />
                    <Label htmlFor="parking">Parking Available</Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Media</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Property Images</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(event) => setImageFiles(Array.from(event.target.files ?? []))}
                  />
                  <p className="text-xs text-muted-foreground">
                    Upload up to 10 images (JPG, PNG). Selected: {imageFiles.length}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Video URL</Label>
                  <Input
                    placeholder="https://youtube.com/watch?v=..."
                    value={form.videoUrl}
                    onChange={(event) => updateField("videoUrl", event.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">YouTube or direct video link</p>
                </div>
              </CardContent>
            </Card>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Publishing..." : "Publish Property"}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
