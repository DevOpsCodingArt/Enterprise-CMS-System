"use client";

import React, { useState } from "react";
import {
  Activity,
  DollarSign,
  Users,
  Radio,
  Building2,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Shield,
  Zap,
  PhoneCall,
  Sparkles,
  CreditCard,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { useTenantStore } from "@/stores/useTenantStore";
import { useToast } from "@/components/ui/toast";

export function ExecutiveDashboardView({
  onNavigateTab,
}: {
  onNavigateTab: (tabId: string) => void;
}) {
  const toast = useToast();
  const { branches } = useTenantStore();

  const topBranches = [...branches]
    .sort((a, b) => (b.totalSubscribers || 7200) - (a.totalSubscribers || 7200))
    .slice(0, 6);

  return (
    <div className="space-y-6">
      {/* 1. Executive Operations KPI Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Subscribers */}
        <Card className="p-4 bg-card border-border shadow-xs hover:border-primary/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              Total Active Subscribers
            </span>
            <span className="flex h-2 w-2 rounded-full bg-success animate-pulse" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="font-heading font-extrabold text-2xl text-foreground">
              142,850
            </span>
            <Badge variant="success" className="font-mono text-[10px]">
              +1.8% MoM
            </Badge>
          </div>
          <span className="text-[11px] text-muted-foreground mt-1 block">
            Across 20 Operational Hubs
          </span>
        </Card>

        {/* Metric 2: Monthly Recurring Revenue (MRR) */}
        <Card className="p-4 bg-card border-border shadow-xs hover:border-primary/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              Monthly Recurring Revenue
            </span>
            <DollarSign className="h-3.5 w-3.5 text-success" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="font-heading font-extrabold text-2xl text-foreground">
              PKR 42.8M
            </span>
            <Badge variant="success" className="font-mono text-[10px]">
              +4.2% Growth
            </Badge>
          </div>
          <div className="flex justify-between items-center text-[11px] text-muted-foreground mt-1">
            <span>Collected: PKR 38.4M</span>
            <span className="font-mono text-warning">Pending: 4.4M</span>
          </div>
        </Card>

        {/* Metric 3: SmartOLT Fleet Health */}
        <Card className="p-4 bg-card border-border shadow-xs hover:border-primary/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              GPON Optical Fleet Health
            </span>
            <Badge variant="success" className="text-[9px] py-0 px-1 font-mono">
              98.4%
            </Badge>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="font-heading font-extrabold text-2xl text-foreground">
              184 / 187
            </span>
            <span className="text-[11px] font-mono text-success font-bold">
              Nodes Nominal
            </span>
          </div>
          <span className="text-[11px] text-muted-foreground mt-1 block">
            3 Active Fiber Cuts Under Repair
          </span>
        </Card>

        {/* Metric 4: 20-Branch SLA Compliance */}
        <Card className="p-4 bg-card border-border shadow-xs hover:border-primary/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              Workforce SLA Compliance
            </span>
            <Badge variant="success" className="text-[9px] py-0 px-1 font-mono">
              99.2%
            </Badge>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="font-heading font-extrabold text-2xl text-success">
              52 Staff Active
            </span>
            <span className="text-[11px] font-mono text-muted-foreground">
              Avg 1.8h ETTR
            </span>
          </div>
          <span className="text-[11px] text-muted-foreground mt-1 block">
            12 CSRs • 40 Field Technicians
          </span>
        </Card>
      </div>

      {/* 2. Executive Quick Action Command Bar */}
      <div className="flex items-center justify-between flex-wrap gap-3 p-4 rounded-xl border border-border bg-card-subtle/50">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary shrink-0" />
          <span className="text-xs font-bold text-foreground">
            Executive Quick Actions:
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigateTab("branches")}
            className="text-xs gap-1 cursor-pointer"
          >
            <Building2 className="h-3.5 w-3.5 text-primary" />
            <span>Manage 20 Branches</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigateTab("staff")}
            className="text-xs gap-1 cursor-pointer"
          >
            <Users className="h-3.5 w-3.5 text-info" />
            <span>Workforce Directory</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigateTab("rbac")}
            className="text-xs gap-1 cursor-pointer"
          >
            <Shield className="h-3.5 w-3.5 text-warning" />
            <span>Custom RBAC Matrix</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => onNavigateTab("finance")}
            className="text-xs font-bold gap-1 cursor-pointer"
          >
            <CreditCard className="h-3.5 w-3.5" />
            <span>1Link & Payment Ledger</span>
          </Button>
        </div>
      </div>

      {/* 3. Branch Performance & SLA Leaderboard Table */}
      <Card className="bg-card border-border shadow-xs">
        <CardHeader className="p-4 border-b border-border bg-card-subtle/50 flex flex-row items-center justify-between flex-wrap gap-2">
          <div>
            <CardTitle className="text-sm font-heading font-bold">
              Branch Performance & Live Operations Matrix
            </CardTitle>
            <CardDescription className="text-xs">
              Real-time telemetry, subscriber counts, SLA % and field van rosters across top operational hubs.
            </CardDescription>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigateTab("branches")}
            className="text-xs gap-1 text-primary cursor-pointer"
          >
            <span>View All 20 Branches</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Button>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Branch Office</TableHead>
                <TableHead>City / Zone</TableHead>
                <TableHead className="text-right">Active Subscribers</TableHead>
                <TableHead>Assigned Staff</TableHead>
                <TableHead>SLA Compliance</TableHead>
                <TableHead>Field Splicer Vans</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topBranches.map((b) => (
                <TableRow key={b.id} className="hover:bg-card-subtle/40 transition-colors">
                  <TableCell className="font-bold text-xs text-foreground">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span>{b.name}</span>
                      <span className="font-mono text-[10px] text-muted-foreground">({b.code})</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs font-mono text-muted-foreground">
                    {b.city}
                  </TableCell>
                  <TableCell className="font-mono font-bold text-xs text-right text-foreground">
                    {(b.totalSubscribers || 7140).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-xs font-medium">
                    {b.totalStaff} Personnel
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 rounded-full bg-card-subtle overflow-hidden border border-border-subtle">
                        <div
                          className={`h-full rounded-full ${
                            b.slaCompliancePercent >= 98
                              ? "bg-success"
                              : b.slaCompliancePercent >= 95
                              ? "bg-warning"
                              : "bg-destructive"
                          }`}
                          style={{ width: `${b.slaCompliancePercent}%` }}
                        />
                      </div>
                      <span className="font-mono text-xs font-bold text-foreground">
                        {b.slaCompliancePercent}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs font-mono text-muted-foreground">
                    VAN #01 • VAN #02
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="success" className="text-[10px] py-0 px-1.5 font-mono">
                      OPTIMAL
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
