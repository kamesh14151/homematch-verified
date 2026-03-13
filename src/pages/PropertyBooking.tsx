import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  ClipboardList,
  CreditCard,
  Loader2,
  MapPin,
  ShieldCheck,
  ShoppingCart,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

// ─── Types ───────────────────────────────────────────────────────────────────
type PropertyData = {
  id: string;
  title: string;
  address: string;
  rent: number;
  houseType: string;
  images: string[];
  landlordId: string;
};

type TenantDetails = {
  name: string;
  email: string;
  phone: string;
  city: string;
  occupation: string;
  familySize: string;
  moveInDate: string;
  message: string;
};

// ─── Step Definitions ────────────────────────────────────────────────────────
const STEPS = [
  { number: 1, Icon: ShoppingCart, label: "Booking Info", sub: "Property Details, Payment Info & Refund Info" },
  { number: 2, Icon: UserPlus, label: "Add Tenant Details", sub: "Name, Contact, City, Email, etc." },
  { number: 3, Icon: CreditCard, label: "Payment", sub: "Choose your payment options." },
  { number: 4, Icon: ClipboardList, label: "Review & Proceed", sub: "Review your application & payment summary." },
];

const PAYMENT_METHODS = [
  { id: "upi", label: "UPI", sub: "GPay, PhonePe, Paytm, BHIM", icon: "⚡" },
  { id: "netbanking", label: "Net Banking", sub: "All major banks supported", icon: "🏦" },
  { id: "card", label: "Credit / Debit Card", sub: "Visa, Mastercard, RuPay", icon: "💳" },
  { id: "emi", label: "EMI", sub: "No-cost EMI on select cards", icon: "📆" },
];

// ─── Step Indicator ───────────────────────────────────────────────────────────
function StepIndicator({ current }: { current: number }) {
  return (
    <div className="border-b bg-card">
      <div className="container mx-auto px-4">
        <div className="flex items-start gap-0 overflow-x-auto py-5">
          {STEPS.map((step, idx) => {
            const done = current > step.number;
            const active = current === step.number;
            const { Icon } = step;
            return (
              <div key={step.number} className="flex flex-1 items-center">
                <div className="flex min-w-0 shrink-0 flex-col items-center sm:flex-row sm:items-start sm:gap-3">
                  <div
                    className={[
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold transition-all",
                      done ? "border-[#3A7AFE] bg-[#3A7AFE] text-white" :
                        active ? "border-[#3A7AFE] bg-[#3A7AFE]/10 text-[#3A7AFE]" :
                          "border-muted-foreground/30 bg-muted text-muted-foreground",
                    ].join(" ")}
                  >
                    {done ? <Check className="h-5 w-5" /> : <Icon className="h-4 w-4" />}
                  </div>
                  <div className="mt-2 hidden text-center sm:mt-0 sm:block sm:text-left">
                    <p className={["text-sm font-semibold leading-tight", active || done ? "text-foreground" : "text-muted-foreground"].join(" ")}>
                      {step.number}. {step.label}
                    </p>
                    <p className="mt-0.5 hidden text-xs leading-snug text-muted-foreground lg:block">{step.sub}</p>
                  </div>
                </div>
                {idx < STEPS.length - 1 && (
                  <div className={["mx-2 h-0.5 flex-1", done ? "bg-[#3A7AFE]" : "bg-border"].join(" ")} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Payment Sidebar ──────────────────────────────────────────────────────────
function PaymentSidebar({
  property,
  advance,
  step,
  loading,
  onContinue,
}: {
  property: PropertyData;
  advance: number;
  step: number;
  loading: boolean;
  onContinue: () => void;
}) {
  const deposit = Math.round(property.rent * 0.5);
  const total = property.rent + deposit;
  const balanceDue = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 10);
    return d.toLocaleDateString("en-IN");
  }, []);

  return (
    <Card className="lg:sticky lg:top-20 overflow-hidden">
      <div className="border-b bg-muted/30 px-5 py-4">
        <h3 className="text-lg font-bold">Payment Details</h3>
      </div>
      <CardContent className="space-y-4 p-5">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Base package cost</span>
          <span className="font-semibold">Rs. {property.rent.toLocaleString("en-IN")}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Security deposit</span>
          <span className="font-semibold">Rs. {deposit.toLocaleString("en-IN")}</span>
        </div>
        <div className="flex justify-between border-t pt-3 text-sm">
          <span className="text-muted-foreground">Est. Total</span>
          <span className="font-semibold">Rs. {total.toLocaleString("en-IN")}</span>
        </div>

        <div className="rounded-xl bg-[#3A7AFE]/8 border border-[#3A7AFE]/20 p-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Payable Total</p>
          <p className="mt-1 text-4xl font-extrabold text-[#3A7AFE]">Rs. {advance.toLocaleString("en-IN")}</p>
          <p className="mt-1 text-xs text-muted-foreground">Balance due by {balanceDue}</p>
        </div>

        <Button
          className="h-12 w-full rounded-full bg-yellow-400 text-sm font-bold text-gray-900 hover:bg-yellow-500 disabled:opacity-60"
          onClick={onContinue}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              {step < 4 ? "Continue" : "Confirm Booking"}
              <ChevronRight className="ml-1 h-4 w-4" />
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

// ─── Step 1: Booking Info ─────────────────────────────────────────────────────
function Step1({ property }: { property: PropertyData }) {
  const advance = Math.round(property.rent * 0.25);
  const balanceDue = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 10);
    return d.toLocaleDateString("en-IN");
  }, []);
  const image = property.images[0] ?? "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1400&q=80";

  return (
    <div className="space-y-5">
      <Card className="overflow-hidden">
        <div className="relative aspect-[16/7] w-full bg-muted">
          <img src={image} alt={property.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-white sm:text-2xl">{property.title}</h2>
              <p className="mt-1 flex items-center gap-1 text-sm text-white/80">
                <MapPin className="h-4 w-4" /> {property.address}
              </p>
            </div>
            <div className="shrink-0 rounded-2xl bg-white/90 px-4 py-2 text-center shadow-lg backdrop-blur">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Rent</p>
              <p className="text-lg font-bold text-[#3A7AFE]">Rs.&nbsp;{property.rent.toLocaleString("en-IN")}</p>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="border-b px-6 py-4">
            <h3 className="text-xl font-bold">Booking Policy</h3>
            <p className="mt-0.5 text-sm text-muted-foreground">Clear payment milestones for a stress-free experience.</p>
          </div>
          <div className="divide-y">
            <div className="px-6 py-5">
              <h4 className="font-semibold">Advance Payment</h4>
              <p className="mt-2 flex items-center gap-2 text-muted-foreground">
                <span className="font-bold text-yellow-500">→</span>
                Advance Payment :&nbsp;<span className="font-bold text-[#3A7AFE]">Rs. {advance.toLocaleString("en-IN")}</span>
              </p>
            </div>
            <div className="px-6 py-5">
              <h4 className="font-semibold">Refund Policy</h4>
              <p className="mt-2 flex items-center gap-2 text-muted-foreground">
                <span className="font-bold text-yellow-500">→</span>
                Advance refundable as per&nbsp;
                <span className="cursor-pointer font-medium text-[#3A7AFE] underline underline-offset-2">Cancellation Policy</span>
              </p>
            </div>
            <div className="px-6 py-5">
              <h4 className="font-semibold">Balance Payment Due</h4>
              <p className="mt-2 flex items-center gap-2 text-muted-foreground">
                <span className="font-bold text-yellow-500">→</span>
                Remaining due by&nbsp;<span className="font-bold text-[#3A7AFE]">{balanceDue}</span>.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Step 2: Tenant Details ───────────────────────────────────────────────────
function Step2({ details, onChange }: { details: TenantDetails; onChange: (d: TenantDetails) => void }) {
  const set = (k: keyof TenantDetails) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      onChange({ ...details, [k]: e.target.value });

  const labelClass = "block text-sm font-medium text-muted-foreground mb-1";

  return (
    <Card>
      <CardContent className="p-5 sm:p-6">
        <h3 className="mb-5 text-xl font-bold">Tenant Details</h3>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Full Name *</label>
            <Input placeholder="Your full name" value={details.name} onChange={set("name")} required />
          </div>
          <div>
            <label className={labelClass}>Email Address *</label>
            <Input type="email" placeholder="your@email.com" value={details.email} onChange={set("email")} required />
          </div>
          <div>
            <label className={labelClass}>Phone Number *</label>
            <Input type="tel" placeholder="+91 98765 43210" value={details.phone} onChange={set("phone")} required />
          </div>
          <div>
            <label className={labelClass}>Current City *</label>
            <Input placeholder="e.g. Chennai" value={details.city} onChange={set("city")} required />
          </div>
          <div>
            <label className={labelClass}>Occupation</label>
            <Input placeholder="e.g. Software Engineer" value={details.occupation} onChange={set("occupation")} />
          </div>
          <div>
            <label className={labelClass}>Family Size</label>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              value={details.familySize}
              onChange={set("familySize")}
            >
              <option value="">Select family size</option>
              {["1 (Single)", "2 (Couple)", "3", "4", "5+"].map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Preferred Move-in Date</label>
            <Input type="date" value={details.moveInDate} onChange={set("moveInDate")} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Message to Landlord</label>
            <textarea
              className="flex min-h-[96px] w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              placeholder="Introduce yourself and share any special requirements..."
              value={details.message}
              onChange={set("message")}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Step 3: Payment ──────────────────────────────────────────────────────────
function Step3({ selected, onSelect }: { selected: string; onSelect: (id: string) => void }) {
  return (
    <Card>
      <CardContent className="p-5 sm:p-6">
        <h3 className="mb-2 text-xl font-bold">Choose Payment Option</h3>
        <p className="mb-6 text-sm text-muted-foreground">Select how you'd like to pay the advance amount.</p>
        <div className="space-y-3">
          {PAYMENT_METHODS.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => onSelect(m.id)}
              className={[
                "flex w-full items-center gap-4 rounded-2xl border-2 px-5 py-4 text-left transition-all",
                selected === m.id
                  ? "border-[#3A7AFE] bg-[#3A7AFE]/5"
                  : "border-border hover:border-[#3A7AFE]/50 hover:bg-muted/40",
              ].join(" ")}
            >
              <span className="text-2xl">{m.icon}</span>
              <div className="flex-1">
                <p className="font-semibold">{m.label}</p>
                <p className="text-xs text-muted-foreground">{m.sub}</p>
              </div>
              <div
                className={[
                  "flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all",
                  selected === m.id ? "border-[#3A7AFE] bg-[#3A7AFE]" : "border-muted-foreground/40",
                ].join(" ")}
              >
                {selected === m.id && <div className="h-2 w-2 rounded-full bg-white" />}
              </div>
            </button>
          ))}
        </div>
        <div className="mt-6 flex items-start gap-3 rounded-2xl bg-muted/50 px-5 py-4">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
          <p className="text-sm text-muted-foreground">
            All payments are <span className="font-semibold text-foreground">100% secure</span> and encrypted. Your financial details are never shared with landlords.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Step 4: Review ───────────────────────────────────────────────────────────
function Step4({
  property,
  details,
  paymentMethod,
  advance,
}: {
  property: PropertyData;
  details: TenantDetails;
  paymentMethod: string;
  advance: number;
}) {
  const image = property.images[0] ?? "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1400&q=80";
  const methodLabel = PAYMENT_METHODS.find((m) => m.id === paymentMethod)?.label ?? paymentMethod;
  const rows: { label: string; value: string }[] = [
    { label: "Full Name", value: details.name || "—" },
    { label: "Email", value: details.email || "—" },
    { label: "Phone", value: details.phone || "—" },
    { label: "City", value: details.city || "—" },
    { label: "Occupation", value: details.occupation || "—" },
    { label: "Family Size", value: details.familySize || "—" },
    { label: "Move-in Date", value: details.moveInDate || "—" },
    { label: "Payment Method", value: methodLabel },
    { label: "Advance Payable", value: `Rs. ${advance.toLocaleString("en-IN")}` },
  ];

  return (
    <div className="space-y-5">
      <Card className="overflow-hidden">
        <div className="relative aspect-[16/6] w-full bg-muted">
          <img src={image} alt={property.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-4 left-4">
            <h2 className="text-xl font-bold text-white">{property.title}</h2>
            <p className="mt-1 flex items-center gap-1 text-sm text-white/80"><MapPin className="h-4 w-4" />{property.address}</p>
          </div>
        </div>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="border-b px-6 py-4">
            <h3 className="text-xl font-bold">Application Summary</h3>
            <p className="mt-0.5 text-sm text-muted-foreground">Please review all details before confirming.</p>
          </div>
          <div className="divide-y">
            {rows.map((r) => (
              <div key={r.label} className="flex items-center justify-between px-6 py-3.5">
                <span className="text-sm text-muted-foreground">{r.label}</span>
                <span className="text-sm font-semibold">{r.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {details.message && (
        <Card>
          <CardContent className="p-5">
            <h4 className="mb-2 text-sm font-semibold">Your Message to Landlord</h4>
            <p className="text-sm leading-relaxed text-muted-foreground">{details.message}</p>
          </CardContent>
        </Card>
      )}

      <div className="flex items-start gap-3 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 dark:border-green-900/40 dark:bg-green-950/20">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
        <p className="text-sm text-muted-foreground">
          By confirming, you agree to the <span className="cursor-pointer font-medium text-[#3A7AFE] underline underline-offset-2">Booking Terms</span> and the advance payment will be processed securely.
        </p>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function PropertyBooking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, userRole } = useAuth();
  const { toast } = useToast();

  const [property, setProperty] = useState<PropertyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [tenantDetails, setTenantDetails] = useState<TenantDetails>({
    name: "",
    email: user?.email ?? "",
    phone: "",
    city: "",
    occupation: "",
    familySize: "",
    moveInDate: "",
    message: "",
  });

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      const { data: row } = await supabase
        .from("properties")
        .select("id, title, address, rent, house_type, landlord_id")
        .eq("id", id)
        .maybeSingle();

      if (!row) { setLoading(false); return; }

      const { data: imageRows } = await supabase
        .from("property_images")
        .select("image_url, display_order")
        .eq("property_id", row.id)
        .order("display_order", { ascending: true });

      setProperty({
        id: row.id,
        title: row.title,
        address: row.address,
        rent: row.rent,
        houseType: row.house_type,
        images: imageRows?.map((r) => r.image_url) ?? [],
        landlordId: row.landlord_id,
      });
      setLoading(false);
    };
    void load();
  }, [id]);

  useEffect(() => {
    if (!user) {
      navigate(`/login?redirect=/property/${id}/book`);
    }
  }, [user, id, navigate]);

  const advance = useMemo(() => Math.round((property?.rent ?? 0) * 0.25), [property]);

  const validateStep = () => {
    if (currentStep === 2) {
      if (!tenantDetails.name.trim() || !tenantDetails.email.trim() || !tenantDetails.phone.trim() || !tenantDetails.city.trim()) {
        toast({ title: "Missing fields", description: "Please fill in Name, Email, Phone and City.", variant: "destructive" });
        return false;
      }
    }
    return true;
  };

  const handleContinue = async () => {
    if (!validateStep()) return;
    if (currentStep < 4) {
      setCurrentStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (!property || !user) return;

    if (userRole !== "tenant") {
      toast({ title: "Tenant account required", description: "Switch to a tenant account to book.", variant: "destructive" });
      return;
    }

    setSubmitting(true);

    const { data: existing } = await supabase
      .from("applications")
      .select("id")
      .eq("property_id", property.id)
      .eq("tenant_id", user.id)
      .maybeSingle();

    if (existing?.id) {
      setSubmitting(false);
      toast({ title: "Already applied", description: "You already have an active application for this property." });
      navigate(`/tenant/messages?app=${existing.id}`);
      return;
    }

    const bookingMsg = tenantDetails.message ||
      `Hi, I would like to book this property. Advance payable: Rs. ${advance.toLocaleString("en-IN")}. Payment via ${PAYMENT_METHODS.find((m) => m.id === paymentMethod)?.label}.`;

    const { data: created, error } = await supabase
      .from("applications")
      .insert({
        property_id: property.id,
        tenant_id: user.id,
        status: "pending",
        message: bookingMsg,
      })
      .select("id")
      .single();

    setSubmitting(false);

    if (error) {
      toast({ title: "Booking failed", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "Booking confirmed!", description: "Your booking request has been sent to the landlord." });
    navigate(`/tenant/messages?app=${created.id}`);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading booking details...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center">
        <h1 className="text-2xl font-bold">Property not found</h1>
        <Button asChild className="mt-4"><Link to="/">Go Home</Link></Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header bar */}
      <div className="border-b bg-card">
        <div className="container mx-auto flex h-14 items-center gap-4 px-4">
          <button
            onClick={() => currentStep > 1 ? setCurrentStep((s) => s - 1) : navigate(`/property/${id}`)}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {currentStep > 1 ? "Back" : "Back to Property"}
          </button>
          <div className="h-4 w-px bg-border" />
          <p className="truncate text-sm font-semibold">{property.title}</p>
        </div>
      </div>

      {/* Step indicator */}
      <StepIndicator current={currentStep} />

      {/* Main */}
      <div className="container mx-auto px-4 pb-20 pt-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {currentStep === 1 && <Step1 property={property} />}
            {currentStep === 2 && <Step2 details={tenantDetails} onChange={setTenantDetails} />}
            {currentStep === 3 && <Step3 selected={paymentMethod} onSelect={setPaymentMethod} />}
            {currentStep === 4 && (
              <Step4 property={property} details={tenantDetails} paymentMethod={paymentMethod} advance={advance} />
            )}
          </div>
          <div>
            <PaymentSidebar
              property={property}
              advance={advance}
              step={currentStep}
              loading={submitting}
              onContinue={handleContinue}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
