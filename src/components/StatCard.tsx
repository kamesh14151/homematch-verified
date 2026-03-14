import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
}: StatCardProps) {
  return (
    <Card className="overflow-hidden rounded-3xl border border-border/70 bg-background/92 shadow-[0_18px_48px_-34px_rgba(91,71,56,0.24)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_48px_-28px_rgba(91,71,56,0.3)] dark:border-white/8 dark:bg-zinc-950/88 dark:shadow-[0_30px_80px_-48px_rgba(0,0,0,0.88)]">
      <CardContent className="relative p-7">
        <div className="relative flex items-start justify-between gap-4">
          <div className="space-y-3">
            <p className="text-[13px] font-bold uppercase tracking-[0.15em] text-muted-foreground dark:text-zinc-400">
              {title}
            </p>
            <p className="text-[42px] font-bold leading-none tracking-tight text-foreground dark:text-white">
              {value}
            </p>
            {description && (
              <p className="max-w-[16rem] text-[15px] font-medium leading-relaxed text-muted-foreground dark:text-zinc-300/85">
                {description}
              </p>
            )}
            {trend && (
              <div className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-bold text-primary shadow-sm dark:border-primary/20 dark:bg-primary/12 dark:text-primary">
                {trend}
              </div>
            )}
          </div>
          <div className="flex h-16 w-16 items-center justify-center rounded-[1.2rem] border border-border/70 bg-secondary shadow-sm dark:border-white/8 dark:bg-zinc-800/90 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
            <Icon className="h-7 w-7 text-foreground dark:text-zinc-200" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
