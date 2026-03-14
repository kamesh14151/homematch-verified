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
  accent?: "blue" | "emerald" | "violet" | "rose";
  actions?: ReactNode;
  children?: ReactNode;
}

export function DashboardHero({
  eyebrow,
  title,
  description,
  accent = "rose",
  actions,
  children,
}: DashboardHeroProps) {
  return (
    <Card
      className={cn(
        "relative overflow-hidden rounded-[2rem] border border-border/70 bg-background/92 shadow-[0_18px_48px_-32px_rgba(91,71,56,0.28)] dark:border-white/8 dark:bg-card/92 dark:shadow-[0_30px_80px_-40px_rgba(0,0,0,0.85)]"
      )}
    >
      <div className="absolute inset-0 z-0 bg-[linear-gradient(180deg,rgba(255,252,247,0.94)_0%,rgba(250,244,236,0.9)_100%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(255,126,87,0.14),transparent_28%),linear-gradient(180deg,rgba(9,9,11,0.98)_0%,rgba(12,12,18,0.96)_100%)]"></div>

      {/* Decorative Blob */}
      <div className="absolute -top-40 -right-40 h-[400px] w-[400px] rounded-full bg-primary/10 blur-3xl z-0 pointer-events-none opacity-50 dark:bg-primary/15" />
      <div className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-amber-300/12 blur-3xl z-0 pointer-events-none opacity-30 dark:bg-amber-500/10" />

      <CardContent className="relative z-10 grid gap-6 p-7 sm:p-10 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
        <div>
          <div className="mb-4 inline-flex rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.15em] text-primary shadow-sm dark:border-primary/20 dark:bg-primary/10">
            {eyebrow}
          </div>
          <h1 className="max-w-2xl text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-[34px] dark:text-white">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-muted-foreground dark:text-zinc-300/90">
            {description}
          </p>
          {actions ? (
            <div className="mt-8 flex flex-wrap gap-3">{actions}</div>
          ) : null}
        </div>
        {children ? (
          <div className="rounded-3xl border border-border/70 bg-background/70 p-6 shadow-sm backdrop-blur-md dark:border-white/8 dark:bg-zinc-900/80 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
            {children}
          </div>
        ) : null}
      </CardContent>
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

export function DashboardPanel({
  title,
  description,
  actionLabel,
  actionTo,
  children,
  className,
}: DashboardPanelProps) {
  return (
    <Card
      className={cn(
        "rounded-[2rem] border border-border/70 bg-background/92 shadow-[0_18px_48px_-34px_rgba(91,71,56,0.24)] dark:border-white/8 dark:bg-zinc-950/88 dark:shadow-[0_30px_80px_-48px_rgba(0,0,0,0.9)]",
        className
      )}
    >
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 px-7 pt-7 pb-5">
        <div>
          <CardTitle className="text-[20px] font-bold tracking-tight text-foreground dark:text-white">
            {title}
          </CardTitle>
          {description ? (
            <p className="mt-1.5 text-[15px] font-medium text-muted-foreground dark:text-zinc-400">
              {description}
            </p>
          ) : null}
        </div>
        {actionLabel && actionTo ? (
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="gap-1.5 rounded-full font-semibold text-muted-foreground hover:bg-secondary hover:text-foreground dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white"
          >
            <Link to={actionTo}>
              {actionLabel} <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        ) : null}
      </CardHeader>
      <CardContent className="px-7 pb-7">{children}</CardContent>
    </Card>
  );
}

interface MiniInsightProps {
  icon: LucideIcon;
  title: string;
  value: string;
  tone?: "blue" | "green" | "amber" | "rose" | "slate";
}

const toneClasses = {
  blue: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 border-blue-100 dark:border-blue-500/20",
  green:
    "bg-success/10 text-success dark:bg-success/15 dark:text-success border-success/20 dark:border-success/20",
  amber:
    "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 border-amber-100 dark:border-amber-500/20",
  rose: "bg-primary/10 text-primary dark:bg-primary/12 dark:text-primary border-primary/20 dark:border-primary/20",
  slate:
    "bg-secondary text-slate-600 dark:bg-zinc-800/80 dark:text-zinc-300 border-border/70 dark:border-zinc-700/80",
};

export function MiniInsight({
  icon: Icon,
  title,
  value,
  tone = "slate",
}: MiniInsightProps) {
  return (
    <div className="group flex items-center gap-4 rounded-3xl border border-border/70 bg-background/88 p-4 shadow-sm transition-all hover:border-border dark:border-white/8 dark:bg-zinc-900/72 dark:hover:border-white/15 dark:hover:bg-zinc-900/90">
      <div
        className={cn(
          "flex h-12 w-12 shrink-0 items-center justify-center rounded-[1.2rem] border transition-transform group-hover:scale-105",
          toneClasses[tone]
        )}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground dark:text-zinc-400">
          {title}
        </p>
        <p className="mt-0.5 text-[17px] font-bold tracking-tight text-foreground dark:text-white">
          {value}
        </p>
      </div>
    </div>
  );
}
