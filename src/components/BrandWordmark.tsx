import { cn } from "@/lib/utils";

type BrandWordmarkProps = {
  theme?: "light" | "dark";
  showTagline?: boolean;
  compact?: boolean;
  className?: string;
};

export function BrandWordmark({
  theme = "light",
  showTagline = false,
  compact = false,
  className,
}: BrandWordmarkProps) {
  const isDark = theme === "dark";

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className={cn(
          "flex items-center justify-center rounded-2xl ring-1",
          compact ? "h-9 w-9" : "h-10 w-10",
          isDark ? "bg-white/10 ring-white/12" : "bg-[#0f2a5c]/6 ring-[#0f2a5c]/10",
        )}
      >
        <img
          src="/1000130925-Photoroom.png"
          alt="RentVerify"
          className={cn(compact ? "h-7 w-7 rounded-md" : "h-8 w-8 rounded-lg", "object-contain")}
        />
      </div>

      <div className="leading-none">
        <span
          className={cn(
            "block font-bunderon text-[1.45rem] lowercase tracking-[0.01em]",
            isDark ? "text-white" : "text-[#0f2a5c]",
          )}
        >
          <span>rent</span>
          <span className="text-[#f4c542]">verify</span>
        </span>
        {showTagline && (
          <span
            className={cn(
              "mt-1 block text-[10px] font-semibold uppercase tracking-[0.28em]",
              isDark ? "text-white/60" : "text-[#0f2a5c]/55",
            )}
          >
            Verified Rental Network
          </span>
        )}
      </div>
    </div>
  );
}