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
          "flex items-center justify-center rounded-[16px] ring-1 shadow-sm",
          compact ? "h-9 w-9" : "h-10 w-10",
          isDark
            ? "bg-white/8 ring-white/10"
            : "bg-primary/8 ring-primary/10"
        )}
      >
        <img
          src="/1000130925-Photoroom.png"
          alt="RentVerify"
          className={cn(
            compact ? "h-7 w-7 rounded-md" : "h-8 w-8 rounded-lg",
            "object-contain mix-blend-multiply dark:mix-blend-normal"
          )}
        />
      </div>

      <div className="leading-none">
        <span
          className={cn(
            "block font-bunderon text-[1.45rem] lowercase tracking-[0.01em]",
            isDark ? "text-white" : "text-slate-900 dark:text-white"
          )}
        >
          <span>rent</span>
          <span className="font-medium text-primary">verify</span>
        </span>
        {showTagline && (
          <span
            className={cn(
              "mt-1 block text-[10px] font-bold uppercase tracking-[0.25em]",
              isDark ? "text-white/60" : "text-slate-500 dark:text-zinc-400"
            )}
          >
            Verified Rental Stays
          </span>
        )}
      </div>
    </div>
  );
}
