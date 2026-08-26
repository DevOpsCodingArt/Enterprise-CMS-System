"use client";

import React, { useState } from "react";
import {
  Building2,
  Users,
  DollarSign,
  Activity,
  Plus,
  ShieldCheck,
  TrendingUp,
  Server,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TenantProvisioningTable } from "@/components/platform/TenantProvisioningTable";
import { ClusterHealthRadar } from "@/components/platform/ClusterHealthRadar";
import { TenantProvisioningModal } from "@/components/platform/TenantProvisioningModal";

export default function PlatformDashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* 1. SaaS KPI Metric Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-card border-border shadow-xs hover:border-primary/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              Total ISP Tenants
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
              Managed Subscribers
            </span>
            <Badge variant="info" className="text-[9px] py-0 px-1.5 font-mono">
              GLOBAL FLEET
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
            Across Pakistan & MENA
          </span>
        </Card>

        <Card className="p-4 bg-card border-border shadow-xs hover:border-primary/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              Monthly Recurring (MRR)
            </span>
            <Badge variant="success" className="text-[9px] py-0 px-1.5 font-mono">
              PROFITABLE
            </Badge>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="font-heading font-extrabold text-2xl text-foreground">
              $142,500
            </span>
            <span className="text-[11px] font-mono text-muted-foreground">
              ARR: $1.71M
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

      {/* 2. Multi-Tenant Provisioning & Management Table */}
      <TenantProvisioningTable onOpenProvisionModal={() => setIsModalOpen(true)} />

      {/* 3. Global Infrastructure Telemetry Radar */}
      <ClusterHealthRadar />

      {/* Provisioning Wizard Modal */}
      <TenantProvisioningModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
