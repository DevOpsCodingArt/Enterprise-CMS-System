"use client";

import React from "react";
import {
  Building2,
  Users,
  DollarSign,
  Activity,
  ArrowUpRight,
  TrendingUp,
  Server,
  Zap,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { initialTenants } from "./TenantProvisioningTable";
import { ClusterHealthRadar } from "./ClusterHealthRadar";

export function PlatformOverviewView({
  onNavigateTab,
}: {
  onNavigateTab: (tab: "tenants" | "billing" | "infrastructure") => void;
}) {
  return (
    <div className="space-y-6">
      {/* 1. SaaS Executive KPI Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-card border-border shadow-xs hover:border-primary/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              Active ISP Tenants
            </span>
            <span className="flex h-2 w-2 rounded-full bg-success animate-pulse" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="font-heading font-extrabold text-2xl text-foreground">
              8 Companies
            </span>
            <Badge variant="success" className="font-mono text-[10px]">
              +2 ONBOARDING
            </Badge>
          </div>
          <span className="text-[11px] text-muted-foreground mt-1 block">
            51 Active Branch Hubs Total
          </span>
        </Card>

        <Card className="p-4 bg-card border-border shadow-xs hover:border-primary/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              Global Subscribers Fleet
            </span>
            <Badge variant="info" className="text-[9px] py-0 px-1.5 font-mono">
              ALL TENANTS
            </Badge>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="font-heading font-extrabold text-2xl text-foreground">
              480,200
            </span>
            <span className="text-[11px] font-mono text-success font-bold">
              +14.2% MoM
            </span>
          </div>
          <span className="text-[11px] text-muted-foreground mt-1 block">
            Across 5 Core DB Shards
          </span>
        </Card>

        <Card className="p-4 bg-card border-border shadow-xs hover:border-primary/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              Monthly SaaS MRR
            </span>
            <Badge variant="success" className="text-[9px] py-0 px-1.5 font-mono">
              $1.71M ARR
            </Badge>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="font-heading font-extrabold text-2xl text-foreground">
              $142,500
            </span>
            <span className="text-[11px] font-mono text-muted-foreground">
              +12.4% vs last qtr
            </span>
          </div>
          <span className="text-[11px] text-muted-foreground mt-1 block">
            SaaS Licensing & Telemetry Tier
          </span>
        </Card>

        <Card className="p-4 bg-card border-border shadow-xs hover:border-primary/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              Global API Latency
            </span>
            <Badge variant="success" className="text-[9px] py-0 px-1.5 font-mono">
              0 BREACH
            </Badge>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="font-heading font-extrabold text-2xl text-success">
              14.2 ms
            </span>
            <span className="text-[11px] font-mono text-muted-foreground">
              p99: 38ms
            </span>
          </div>
          <span className="text-[11px] text-muted-foreground mt-1 block">
            Cloudflare Edge + Redis Cluster
          </span>
        </Card>
      </div>

      {/* 2. 2-Column Bento Grid: Tenant Capacity + Real-Time Platform Events */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Top ISP Tenant Quotas & Utilization */}
        <Card className="lg:col-span-7 flex flex-col shadow-xs">
          <CardHeader className="p-4 border-b border-border bg-card-subtle/50 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-heading font-bold">
                Tenant License Capacity & Usage
              </CardTitle>
              <CardDescription className="text-xs">
                Subscriber quotas and branch allocations across active ISP companies.
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigateTab("tenants")}
              className="text-xs gap-1"
            >
              <span>View All</span>
              <ArrowUpRight className="h-3 w-3" />
            </Button>
          </CardHeader>

          <CardContent className="p-4 space-y-4">
            {initialTenants.slice(0, 4).map((t) => {
              const usagePercent = Math.round((t.subscribersCount / t.subscribersQuota) * 100);
              return (
                <div key={t.id} className="space-y-1.5 p-3 rounded-lg border border-border bg-card-subtle/30">
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground">{t.name}</span>
                      <Badge variant="secondary" className="font-mono text-[9px]">
                        {t.tier}
                      </Badge>
                    </div>
                    <span className="font-mono font-bold text-foreground">
                      {t.subscribersCount.toLocaleString()} / {t.subscribersQuota.toLocaleString()} Subscriptions ({usagePercent}%)
                    </span>
                  </div>

                  <div className="w-full bg-card rounded-full h-2 overflow-hidden border border-border">
                    <div
                      className={`h-full ${
                        usagePercent > 90 ? "bg-amber-500" : "bg-primary"
                      }`}
                      style={{ width: `${usagePercent}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-[11px] text-muted-foreground font-mono">
                    <span>{t.branchesCount} Branches Active</span>
                    <span>${t.mrr.toLocaleString()}/mo</span>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Right: Platform Events & Cluster Health */}
        <Card className="lg:col-span-5 flex flex-col shadow-xs">
          <CardHeader className="p-4 border-b border-border bg-card-subtle/50 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-heading font-bold">
                Live Platform Security & Events
              </CardTitle>
              <CardDescription className="text-xs">
                Real-time multi-tenant event stream.
              </CardDescription>
            </div>
            <Badge variant="success" hasPulse className="text-[9px] font-mono">
              LIVE STREAM
            </Badge>
          </CardHeader>

          <CardContent className="p-4 space-y-3">
            <div className="p-2.5 rounded-lg border border-border bg-card-subtle/40 space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-foreground">
                  Tenant Provisioned: FiberLink
                </span>
                <span className="text-[10px] font-mono text-muted-foreground">
                  12m ago
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Database shard DB-SHARD-02 allocated with 15 branch quotas.
              </p>
            </div>

            <div className="p-2.5 rounded-lg border border-border bg-card-subtle/40 space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-foreground">
                  Redis Cluster Auto-Rebalanced
                </span>
                <span className="text-[10px] font-mono text-muted-foreground">
                  45m ago
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Socket.io room traffic migrated across 4 gateway nodes. 0 dropped frames.
              </p>
            </div>

            <div className="p-2.5 rounded-lg border border-border bg-card-subtle/40 space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-foreground">
                  SaaS Invoice Settled: Prime Networks
                </span>
                <span className="text-[10px] font-mono text-muted-foreground">
                  2h ago
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Monthly enterprise license of $4,850 credited via automated wire.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3. Server Cluster Health Radar */}
      <ClusterHealthRadar />
    </div>
  );
}
