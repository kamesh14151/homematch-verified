import { ShieldCheck, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface VerifiedBadgeProps {
  type?: "property" | "user" | "landlord";
  className?: string;
  showText?: boolean;
}

export function VerifiedBadge({ type = "user", className, showText = false }: VerifiedBadgeProps) {
  const getBadgeDetails = () => {
    switch (type) {
      case "property":
        return {
          icon: <ShieldCheck className="h-4 w-4 text-emerald-500" />,
          text: "Verified Listing",
          tooltip: "This property has been physically verified by our team.",
          bgClass: "bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-400",
        };
      case "landlord":
        return {
          icon: <CheckCircle2 className="h-4 w-4 text-blue-500" />,
          text: "Verified Identity",
          tooltip: "This landlord has completed KYC and background checks.",
          bgClass: "bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-400",
        };
      case "user":
      default:
        return {
          icon: <CheckCircle2 className="h-4 w-4 text-indigo-500" />,
          text: "Verified Tenant",
          tooltip: "Identity successfully verified via official documents.",
          bgClass: "bg-indigo-500/10 border-indigo-500/20 text-indigo-700 dark:text-indigo-400",
        };
    }
  };

  const { icon, text, tooltip, bgClass } = getBadgeDetails();

  const BadgeContent = (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-semibold transition-colors",
        bgClass,
        className
      )}
    >
      {icon}
      {showText && <span>{text}</span>}
    </div>
  );

  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          {BadgeContent}
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-sm">{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
