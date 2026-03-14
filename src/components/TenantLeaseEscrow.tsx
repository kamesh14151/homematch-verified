import React, { useMemo } from "react";
import { DownloadCloud, KeyRound, CalendarDays, WalletCards, ShieldBan } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

// Mock data to simulate an active lease agreement & escrow status
export function TenantLeaseEscrow() {
  return (
    <Card className="rounded-xl border border-border bg-card shadow-sm w-full">
      <CardHeader className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4">
        <div>
          <div className="flex items-center gap-3">
            <CardTitle className="text-xl font-bold">Active Lease Agreement</CardTitle>
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
              Active
            </Badge>
          </div>
          <CardDescription className="mt-1.5">
            Jubilee Hills, Hyderabad (3 BHK)
          </CardDescription>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <DownloadCloud className="h-4 w-4" />
          Download Lease PDF
        </Button>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" /> Start Date
            </p>
            <p className="font-semibold">01 Nov 2023</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" /> End Date
            </p>
            <p className="font-semibold">31 Oct 2024</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
              <WalletCards className="h-4 w-4" /> Monthly Rent
            </p>
            <p className="font-semibold">₹ 34,000</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
              <KeyRound className="h-4 w-4" /> Owner
            </p>
            <p className="font-semibold">Ramesh Reddy</p>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-slate-50 dark:bg-slate-900/50 p-5 mt-4">
          <div className="flex items-center gap-2 mb-3">
            <ShieldBan className="h-5 w-5 text-primary" />
            <h4 className="font-semibold text-foreground">Secure Escrow Deposit</h4>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
            <div>
              <p className="text-2xl font-bold">₹ 1,02,000</p>
              <p className="text-sm text-muted-foreground">3 Months Security Deposit</p>
            </div>
            <div className="text-right">
              <Badge variant="secondary" className="bg-primary/10 text-primary border-transparent">Protected Status: Active</Badge>
            </div>
          </div>
          
          <div className="space-y-1.5 mt-4">
             <div className="flex justify-between text-xs text-muted-foreground">
                <span>Lease Completion Progress</span>
                <span>45%</span>
             </div>
             <Progress value={45} className="h-2 w-full" />
          </div>
          
          <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
            Your deposit is securely held in an escrow account. It will be released back to your designated 
            bank account within 7 days of lease termination and successful property handover, 
            deducting any mutually agreed damages.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
