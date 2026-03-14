import { useEffect, useMemo, useState } from "react";
import {
  Bookmark,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileText,
  IndianRupee,
  Loader2,
  MessageSquare,
  Home,
  Users,
  Search,
  UserCircle,
  X,
  XCircle,
} from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

const navItems = [
  { title: "Search Houses", url: "/tenant/dashboard", icon: Search },
  { title: "Saved Houses", url: "/tenant/saved", icon: Bookmark },
  { title: "Applications", url: "/tenant/applications", icon: FileText },
  { title: "My Bookings", url: "/tenant/bookings", icon: Home },
  { title: "Messages", url: "/tenant/messages", icon: MessageSquare },
  { title: "Profile", url: "/tenant/profile", icon: UserCircle },
];

// ─── Types ────────────────────────────────────────────────────────────────────
interface BookingRow {
  id: string;
  propertyId: string;
  amount: number;
  status: "pending" | "paid" | "cancelled";
  createdAt: string;
  propertyTitle: string;
  propertyAddress: string;
  imageUrl?: string;
}

// ─── Date Range Modal ─────────────────────────────────────────────────────────
function DateRangeModal({
  onClose,
  onConfirm,
}: {
  onClose: () => void;
  onConfirm: (start: Date | null, end: Date | null) => void;
}) {
  const today = new Date();
  const [base, setBase] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [start, setStart] = useState<Date | null>(null);
  const [end, setEnd] = useState<Date | null>(null);
  const [hover, setHover] = useState<Date | null>(null);

  const next = new Date(base.getFullYear(), base.getMonth() + 1, 1);
  const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"] as const;

  const sameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const inRange = (day: Date) => {
    const hi = end || hover;
    if (!start || !hi) return false;
    const [lo, e] = start <= hi ? [start, hi] : [hi, start];
    return day > lo && day < e;
  };

  const handleDay = (day: Date) => {
    if (!start || (start && end)) {
      setStart(day);
      setEnd(null);
    } else {
      if (day < start) {
        setEnd(start);
        setStart(day);
      } else setEnd(day);
    }
  };

  const fmt = (d: Date | null) =>
    d
      ? d.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
        })
      : "DD/MM/YY";

  const renderMonth = (year: number, month: number) => {
    const total = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const label = new Date(year, month, 1).toLocaleString("default", {
      month: "long",
    });
    const cells: (Date | null)[] = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= total; d++) cells.push(new Date(year, month, d));

    return (
      <div className="flex-1 min-w-0">
        <div className="text-center text-sm font-bold text-primary mb-3">
          {label} {year}
        </div>
        <div className="grid grid-cols-7 text-[10px] font-bold text-zinc-400 mb-1">
          {DAYS.map((d) => (
            <div key={d} className="text-center py-1">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {cells.map((day, i) => {
            if (!day) return <div key={i} />;
            const isStart = start ? sameDay(day, start) : false;
            const isEnd = end ? sameDay(day, end) : false;
            const ranged = inRange(day);
            const isToday = sameDay(day, today);
            return (
              <button
                key={i}
                type="button"
                onMouseEnter={() => start && !end && setHover(day)}
                onMouseLeave={() => setHover(null)}
                onClick={() => handleDay(day)}
                className={[
                  "relative h-9 w-full text-sm transition-colors",
                  isStart || isEnd
                    ? "bg-primary text-white rounded-full font-bold z-10"
                    : "",
                  ranged && !isStart && !isEnd
                    ? "bg-primary/10 text-primary"
                    : "",
                  !ranged && !isStart && !isEnd
                    ? "hover:bg-zinc-100 rounded-full text-zinc-700"
                    : "",
                ].join(" ")}
              >
                {day.getDate()}
                {isToday && !isStart && !isEnd && (
                  <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-success text-white" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-zinc-100 transition-colors"
        >
          <X className="w-5 h-5 text-zinc-500" />
        </button>

        {/* Header */}
        <div className="flex items-center justify-between mb-6 px-2">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-yellow-500" />
            <div>
              <p className="text-[9px] font-bold text-yellow-500 uppercase tracking-widest">
                DATE FROM
              </p>
              <p className="text-sm font-bold text-primary">{fmt(start)}</p>
            </div>
          </div>
          <div className="w-12 h-px bg-zinc-200" />
          <div className="flex items-center gap-2">
            <div className="text-right">
              <p className="text-[9px] font-bold text-yellow-500 uppercase tracking-widest">
                DATE TO
              </p>
              <p className="text-sm font-bold text-primary">{fmt(end)}</p>
            </div>
            <Calendar className="w-4 h-4 text-yellow-500" />
          </div>
        </div>

        <div className="flex items-start gap-2">
          <button
            onClick={() =>
              setBase(new Date(base.getFullYear(), base.getMonth() - 1, 1))
            }
            className="p-2 rounded-full hover:bg-zinc-100 mt-1 shrink-0"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex flex-1 gap-4 overflow-hidden">
            {renderMonth(base.getFullYear(), base.getMonth())}
            {renderMonth(next.getFullYear(), next.getMonth())}
          </div>
          <button
            onClick={() =>
              setBase(new Date(base.getFullYear(), base.getMonth() + 1, 1))
            }
            className="p-2 rounded-full hover:bg-zinc-100 mt-1 shrink-0"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-zinc-100">
          <button
            onClick={() => {
              setStart(null);
              setEnd(null);
            }}
            className="px-5 py-2.5 rounded-full text-sm font-semibold text-zinc-600 hover:bg-zinc-100 transition-colors"
          >
            Clear Dates
          </button>
          <button
            onClick={() => onConfirm(start, end)}
            className="px-6 py-2.5 rounded-full text-sm font-semibold bg-primary text-white hover:bg-primary/90 transition-colors"
          >
            Confirm Dates
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyBookings() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <svg
        width="110"
        height="120"
        viewBox="0 0 110 120"
        fill="none"
        className="mb-4"
      >
        <path
          d="M8 55L98 14L72 95L52 65L8 55Z"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        <path d="M52 65L73 46" stroke="currentColor" strokeWidth="2.2" />
        {Array.from({ length: 14 }).map((_, i) => (
          <circle
            key={i}
            cx={42 + i * 5}
            cy={87 + Math.sin((i / 13) * Math.PI) * 16}
            r="1.8"
            fill="currentColor"
            opacity={1 - i * 0.06}
          />
        ))}
      </svg>
      <p className="text-primary font-bold text-lg">No Booking Available !</p>
      <p className="text-muted-foreground text-sm mt-1">
        Future bookings will appear here
      </p>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
type FilterTab = "ALL" | "PENDING" | "PAID";

export default function MyBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterTab>("ALL");
  const [searchMode, setSearchMode] = useState<"id" | "date">("id");
  const [idQuery, setIdQuery] = useState("");
  const [dateRange, setDateRange] = useState<{
    start: Date | null;
    end: Date | null;
  }>({ start: null, end: null });
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      const { data: applications, error } = await supabase
        .from("applications")
        .select("id, property_id, status, created_at")
        .eq("tenant_id", user.id)
        .order("created_at", { ascending: false });

      if (error || !applications) {
        setLoading(false);
        return;
      }

      const propertyIds = [
        ...new Set(applications.map((item) => item.property_id)),
      ];

      const [{ data: properties }, { data: images }] = await Promise.all([
        propertyIds.length > 0
          ? supabase
              .from("properties")
              .select("id, title, address, rent, booking_hold_amount")
              .in("id", propertyIds)
          : Promise.resolve({
              data: [] as Array<{
                id: string;
                title: string;
                address: string;
                rent: number;
                booking_hold_amount: number | null;
              }>,
            }),
        propertyIds.length > 0
          ? supabase
              .from("property_images")
              .select("property_id, image_url, display_order")
              .in("property_id", propertyIds)
              .order("display_order", { ascending: true })
          : Promise.resolve({
              data: [] as Array<{
                property_id: string;
                image_url: string;
                display_order: number;
              }>,
            }),
      ]);

      const propertyMap = new Map(
        (properties ?? []).map((item) => [item.id, item])
      );
      const imageMap = new Map<string, string>();
      (images ?? []).forEach((img) => {
        if (!imageMap.has(img.property_id)) {
          imageMap.set(img.property_id, img.image_url);
        }
      });

      const mapped: BookingRow[] = applications.map((item) => {
        const property = propertyMap.get(item.property_id);
        const sourceStatus = String(item.status || "").toUpperCase();
        const normalizedStatus: BookingRow["status"] =
          sourceStatus === "APPROVED"
            ? "paid"
            : sourceStatus === "REJECTED"
            ? "cancelled"
            : "pending";

        return {
          id: item.id,
          propertyId: item.property_id,
          status: normalizedStatus,
          createdAt: item.created_at,
          amount:
            property?.booking_hold_amount ??
            Math.round((property?.rent ?? 0) * 0.25),
          propertyTitle: property?.title ?? "Property",
          propertyAddress: property?.address ?? "",
          imageUrl: imageMap.get(item.property_id),
        };
      });

      setBookings(mapped);
      setLoading(false);
    };
    void load();
  }, [user]);

  const filtered = useMemo(() => {
    let rows = bookings;
    if (filter !== "ALL")
      rows = rows.filter((b) => b.status.toUpperCase() === filter);
    if (searchMode === "id" && idQuery.trim()) {
      const q = idQuery.toLowerCase().trim();
      rows = rows.filter(
        (b) =>
          b.id.toLowerCase().includes(q) ||
          b.propertyTitle.toLowerCase().includes(q)
      );
    }
    if (searchMode === "date" && dateRange.start && dateRange.end) {
      const hi = new Date(dateRange.end);
      hi.setHours(23, 59, 59, 999);
      rows = rows.filter((b) => {
        const d = new Date(b.createdAt);
        return d >= dateRange.start! && d <= hi;
      });
    }
    return rows;
  }, [bookings, filter, searchMode, idQuery, dateRange]);

  const fmtDate = (v: string | null | undefined) =>
    v
      ? new Date(v).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "—";

  const statusVariant = (
    s: string
  ): "default" | "secondary" | "destructive" | "outline" => {
    if (s === "paid") return "default";
    if (s === "cancelled") return "destructive";
    return "secondary";
  };

  const dateRangeLabel = () => {
    if (!dateRange.start) return "MMM D, YYYY \u2013 MMM D, YYYY";
    const f = (d: Date) =>
      d.toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    return `${f(dateRange.start)} \u2013 ${
      dateRange.end ? f(dateRange.end) : "?"
    }`;
  };

  return (
    <DashboardLayout navItems={navItems} title="Tenant">
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Page header */}
        <div>
          <div className="flex items-center gap-2">
            <Home className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">My Bookings</h1>
          </div>
          <p className="text-muted-foreground text-sm mt-0.5">
            <Link to="/tenant/dashboard" className="hover:underline">
              Home
            </Link>
            <span className="mx-1.5 text-muted-foreground/50">›</span>
            <span>My Bookings</span>
          </p>
        </div>

        {/* Search card */}
        <div className="rounded-2xl bg-primary p-6 text-white">
          <h3 className="font-semibold mb-4">Search Booking</h3>
          <div className="flex items-center gap-8 mb-4">
            {[
              { value: "id" as const, label: "By Booking ID" },
              { value: "date" as const, label: "By Date Range" },
            ].map(({ value, label }) => (
              <label
                key={value}
                className="flex items-center gap-2.5 cursor-pointer select-none"
              >
                <button
                  type="button"
                  onClick={() => setSearchMode(value)}
                  className={[
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                    searchMode === value
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-white/30",
                  ].join(" ")}
                >
                  {searchMode === value && (
                    <span className="w-2 h-2 bg-white rounded-full" />
                  )}
                </button>
                <span onClick={() => setSearchMode(value)} className="text-sm">
                  {label}
                </span>
              </label>
            ))}
          </div>

          {searchMode === "id" ? (
            <div className="flex gap-2">
              <Input
                value={idQuery}
                onChange={(e) => setIdQuery(e.target.value)}
                placeholder="Enter Booking ID"
                className="border-white/20 bg-white/10 text-white placeholder:text-white/40 focus-visible:ring-primary/40"
              />
              <Button
                size="icon"
                className="shrink-0 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowPicker(true)}
              className="w-full flex items-center gap-3 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm text-white/60 hover:border-yellow-400/50 transition-colors"
            >
              <Calendar className="w-5 h-5 text-white/40 shrink-0" />
              <span className="flex-1 text-left">{dateRangeLabel()}</span>
              <ChevronRight className="w-4 h-4 text-white/30 shrink-0" />
            </button>
          )}
        </div>

        {/* Bookings list card */}
        <div className="rounded-2xl border border-border/70 bg-background/88 p-6 shadow-[0_18px_44px_-36px_rgba(91,71,56,0.22)]">
          <div className="flex items-center gap-2 mb-5 pl-3 border-l-4 border-yellow-400">
            <h2 className="font-bold text-lg">Recent Bookings</h2>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2 mb-5">
            {(["ALL", "PENDING", "PAID"] as FilterTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={[
                  "px-5 py-1.5 rounded-full text-xs font-semibold transition-all",
                  filter === tab
                    ? "bg-primary text-white"
                    : "border border-border text-muted-foreground hover:border-muted-foreground/50",
                ].join(" ")}
              >
                {tab}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
              <p className="text-muted-foreground text-sm">
                Loading your bookings…
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <EmptyBookings />
          ) : (
            <div className="space-y-4">
              {filtered.map((b) => {
                const thumb =
                  b.imageUrl ||
                  `https://picsum.photos/seed/${b.propertyId}/400/300`;
                const statusLabel =
                  b.status.charAt(0).toUpperCase() + b.status.slice(1);
                return (
                  <div
                    key={b.id}
                    className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl border border-border hover:border-primary/30 hover:shadow-sm transition-all group"
                  >
                    {/* Thumb */}
                    <div className="w-full sm:w-36 h-24 bg-muted rounded-xl overflow-hidden relative shrink-0">
                      <img
                        src={thumb}
                        alt="Property"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 space-y-1.5">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                        <div>
                          <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            {b.propertyTitle}
                          </h4>
                          {b.propertyAddress && (
                            <p className="text-xs text-muted-foreground">
                              {b.propertyAddress}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            <Calendar className="h-3 w-3" /> Booked on{" "}
                            {fmtDate(b.createdAt)}
                          </p>
                        </div>
                        <Badge
                          variant={statusVariant(b.status)}
                          className={[
                            "self-start shrink-0 flex items-center gap-1 rounded-full text-[10px] font-semibold uppercase tracking-wide",
                            b.status === "paid"
                              ? "border-success/20 bg-success/10 text-success"
                              : "",
                            b.status === "pending"
                              ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                              : "",
                            b.status === "cancelled"
                              ? "border-destructive/20 bg-destructive/10 text-destructive"
                              : "",
                          ].join(" ")}
                        >
                          {b.status === "pending" && (
                            <Clock className="h-3 w-3" />
                          )}
                          {b.status === "paid" && (
                            <CheckCircle2 className="h-3 w-3" />
                          )}
                          {b.status === "cancelled" && (
                            <XCircle className="h-3 w-3" />
                          )}
                          {statusLabel}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs font-semibold text-primary flex items-center gap-0.5">
                          <IndianRupee className="h-3.5 w-3.5" />
                          {(b.amount || 0).toLocaleString("en-IN")} paid
                        </span>
                        <span className="text-muted-foreground/40 text-xs">
                          •
                        </span>
                        <span className="text-xs text-muted-foreground font-mono">
                          #{b.id.slice(0, 8).toUpperCase()}
                        </span>
                      </div>

                      <div className="flex gap-2 pt-1">
                        <Link to={`/property/${b.propertyId}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs rounded-lg"
                          >
                            View Property
                          </Button>
                        </Link>
                        {b.status === "pending" && (
                          <Link to={`/property/${b.propertyId}/book`}>
                            <Button
                              size="sm"
                              className="h-7 text-xs rounded-lg bg-primary hover:bg-primary/90"
                            >
                              Complete Payment
                            </Button>
                          </Link>
                        )}
                        {b.status === "paid" && (
                          <Button
                            variant="secondary"
                            size="sm"
                            className="h-7 text-xs rounded-lg"
                            onClick={(e) => {
                                e.preventDefault();
                                alert("Split rent request sent to roommates!");
                            }}
                          >
                            <Users className="w-3.5 h-3.5 mr-1"/>
                            Split Rent
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {showPicker && (
        <DateRangeModal
          onClose={() => setShowPicker(false)}
          onConfirm={(s, e) => {
            setDateRange({ start: s, end: e });
            setShowPicker(false);
          }}
        />
      )}
    </DashboardLayout>
  );
}

