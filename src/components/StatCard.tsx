import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: string;
}

export function StatCard({ title, value, icon: Icon, description, trend }: StatCardProps) {
  return (
    <Card className="overflow-hidden border-[#dfe5ef] bg-white shadow-[0_6px_18px_rgba(0,51,102,0.08)] transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(0,51,102,0.12)] dark:border-[#24476b] dark:bg-card">
      <CardContent className="relative p-6">
        <div className="relative flex items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-brand-text-muted dark:text-muted-foreground">{title}</p>
            <p className="text-[42px] font-semibold leading-none tracking-tight text-brand-primary dark:text-primary">{value}</p>
            {description && <p className="max-w-[16rem] text-[14px] leading-6 text-brand-text-muted dark:text-muted-foreground">{description}</p>}
            {trend && <div className="inline-flex rounded-full bg-[#fff8dc] px-2.5 py-1 text-xs font-semibold text-[#7d6408] dark:bg-[#3e320d] dark:text-[#f1c40f]">{trend}</div>}
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e9f1f9] ring-1 ring-[#d9e3ef] dark:bg-[#1b3652] dark:ring-[#25486b]">
            <Icon className="h-6 w-6 text-[#003366] dark:text-[#f1c40f]" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
