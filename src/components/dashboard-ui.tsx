import type { ReactNode } from "react";
import { ArrowRight, LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DashboardHeroProps {
  eyebrow: string;
  title: string;
  description: string;
  accent?: "blue" | "emerald" | "violet";
  actions?: ReactNode;
  children?: ReactNode;
}

const accentClasses = {
  blue: "from-[#003366] via-[#0b3f73] to-[#1c5187]",
  emerald: "from-[#003366] via-[#13487c] to-[#24578c]",
  violet: "from-[#003366] via-[#114277] to-[#1e5488]",
};

export function DashboardHero({ eyebrow, title, description, accent = "blue", actions, children }: DashboardHeroProps) {
  return (
    <Card className="overflow-hidden border border-[#003a73] shadow-[0_24px_60px_rgba(0,51,102,0.22)]">
      <div className={cn("relative bg-gradient-to-br", accentClasses[accent])}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "linear-gradient(to right, rgba(255,255,255,0.14) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.14) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        <CardContent className="relative grid gap-6 p-6 text-white sm:p-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
          <div>
            <div className="mb-3 inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/88">
              {eyebrow}
            </div>
            <h1 className="max-w-2xl text-3xl font-bold leading-tight sm:text-4xl">{title}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/78 sm:text-base">{description}</p>
            {actions ? <div className="mt-6 flex flex-wrap gap-3">{actions}</div> : null}
          </div>
          {children ? <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm">{children}</div> : null}
        </CardContent>
      </div>
    </Card>
  );
}

interface DashboardPanelProps {
  title: string;
  description?: string;
  actionLabel?: string;
  actionTo?: string;
  children: ReactNode;
  className?: string;
}

export function DashboardPanel({ title, description, actionLabel, actionTo, children, className }: DashboardPanelProps) {
  return (
    <Card className={cn("border-[#dfe5ef] bg-white shadow-[0_8px_22px_rgba(0,51,102,0.08)] dark:border-[#24476b] dark:bg-card", className)}>
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 pb-4">
        <div>
          <CardTitle className="text-[22px] font-semibold text-brand-primary dark:text-primary">{title}</CardTitle>
          {description ? <p className="mt-1 text-[15px] text-brand-text-muted dark:text-muted-foreground">{description}</p> : null}
        </div>
        {actionLabel && actionTo ? (
          <Button variant="ghost" size="sm" asChild className="gap-1 text-brand-primary hover:text-brand-primary-hover dark:text-primary">
            <Link to={actionTo}>{actionLabel} <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        ) : null}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

interface MiniInsightProps {
  icon: LucideIcon;
  title: string;
  value: string;
  tone?: "blue" | "green" | "amber";
}

const toneClasses = {
  blue: "bg-[#e9f1f9] text-[#003366] dark:bg-[#1b3652] dark:text-[#f1c40f]",
  green: "bg-[#e9f7ef] text-[#2f855a] dark:bg-[#1d3a30] dark:text-[#7ed9ad]",
  amber: "bg-[#fff8dc] text-[#8a6d1d] dark:bg-[#3f3210] dark:text-[#f1c40f]",
};

export function MiniInsight({ icon: Icon, title, value, tone = "blue" }: MiniInsightProps) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-[#dfe5ef] bg-white p-4 text-foreground shadow-[0_2px_10px_rgba(0,51,102,0.06)] dark:border-[#274c70] dark:bg-card">
      <div className={cn("flex h-11 w-11 items-center justify-center rounded-2xl", toneClasses[tone])}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-brand-text-muted dark:text-muted-foreground">{title}</p>
        <p className="mt-1 text-xl font-semibold text-brand-primary dark:text-primary">{value}</p>
      </div>
    </div>
  );
}
