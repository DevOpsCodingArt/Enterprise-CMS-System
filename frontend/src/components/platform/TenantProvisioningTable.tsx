"use client";

import React, { useState } from "react";
import {
  Building2,
  Users,
  Radio,
  Layers,
  MoreVertical,
  Plus,
  ShieldCheck,
  Activity,
  SlidersHorizontal,
} from "lucide-react";
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
import { Tooltip } from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/toast";

export interface TenantCompany {
  id: string;
  name: string;
  subdomain: string;
  tier: "Enterprise" | "Growth" | "Starter";
  branchesCount: number;
  branchesQuota: number;
  subscribersCount: number;
  subscribersQuota: number;
  mrr: number;
  status: "active" | "grace_period" | "suspended";
  adminEmail: string;
  joinedDate: string;
}

export const initialTenants: TenantCompany[] = [
  {
    id: "ten-01",
    name: "Prime Networks (Pvt) Ltd",
    subdomain: "primenet.primeone.io",
    tier: "Enterprise",
    branchesCount: 20,
    branchesQuota: 20,
    subscribersCount: 142850,
    subscribersQuota: 150000,
    mrr: 4850,
    status: "active",
    adminEmail: "tariq.mehmood@primenetworks.pk",
    joinedDate: "2024-01-15",
  },
  {
    id: "ten-02",
    name: "FiberLink Telecom",
    subdomain: "fiberlink.primeone.io",
    tier: "Enterprise",
    branchesCount: 14,
    branchesQuota: 15,
    subscribersCount: 98200,
    subscribersQuota: 100000,
    mrr: 3400,
    status: "active",
    adminEmail: "ops@fiberlink.net.pk",
    joinedDate: "2024-03-20",
  },
  {
    id: "ten-03",
    name: "NetSpeed Metro Broadband",
    subdomain: "netspeed.primeone.io",
    tier: "Growth",
    branchesCount: 8,
    branchesQuota: 10,
    subscribersCount: 54100,
    subscribersQuota: 60000,
    mrr: 1950,
    status: "active",
    adminEmail: "admin@netspeed.pk",
    joinedDate: "2024-05-11",
  },
  {
    id: "ten-04",
    name: "OpticWave Communications",
    subdomain: "opticwave.primeone.io",
    tier: "Starter",
    branchesCount: 3,
    branchesQuota: 5,
    subscribersCount: 18400,
    subscribersQuota: 25000,
    mrr: 850,
    status: "grace_period",
    adminEmail: "billing@opticwave.pk",
    joinedDate: "2024-08-01",
  },
  {
    id: "ten-05",
    name: "Horizon Fiber South",
    subdomain: "horizon.primeone.io",
    tier: "Growth",
    branchesCount: 6,
    branchesQuota: 10,
    subscribersCount: 42300,
    subscribersQuota: 50000,
    mrr: 1650,
    status: "active",
    adminEmail: "director@horizonfiber.com",
    joinedDate: "2024-06-19",
  },
];

export function TenantProvisioningTable({
  onOpenProvisionModal,
}: {
  onOpenProvisionModal: () => void;
}) {
  const toast = useToast();
  const [tenants, setTenants] = useState<TenantCompany[]>(initialTenants);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h3 className="text-base font-heading font-bold text-foreground">
            Multi-Tenant ISP Companies
          </h3>
          <p className="text-xs text-muted-foreground">
            Active telecom client instances, license quotas, and branch allocations.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={onOpenProvisionModal}
          className="gap-1.5 shadow-xs"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Provision New ISP Tenant</span>
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tenant Company & Domain</TableHead>
            <TableHead>License Tier</TableHead>
            <TableHead>Branch Quota</TableHead>
            <TableHead>Subscribers Fleet</TableHead>
            <TableHead>SaaS MRR</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tenants.map((tenant) => (
            <TableRow key={tenant.id}>
              <TableCell>
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary font-heading font-extrabold text-xs shrink-0">
                    {tenant.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <span className="font-bold text-foreground text-xs block leading-tight">
                      {tenant.name}
                    </span>
                    <span className="font-mono text-[11px] text-muted-foreground block">
                      {tenant.subdomain}
                    </span>
                  </div>
                </div>
              </TableCell>

              <TableCell>
                <Badge
                  variant={
                    tenant.tier === "Enterprise"
                      ? "info"
                      : tenant.tier === "Growth"
                      ? "secondary"
                      : "outline"
                  }
                  className="font-mono"
                >
                  {tenant.tier}
                </Badge>
              </TableCell>

              <TableCell className="font-mono">
                <span className="font-bold text-foreground">
                  {tenant.branchesCount}
                </span>
                <span className="text-muted-foreground text-[11px]">
                  {" "}
                  / {tenant.branchesQuota} Hubs
                </span>
              </TableCell>

              <TableCell className="font-mono">
                <span className="font-bold text-foreground">
                  {tenant.subscribersCount.toLocaleString()}
                </span>
                <span className="text-muted-foreground text-[11px]">
                  {" "}
                  ({Math.round((tenant.subscribersCount / tenant.subscribersQuota) * 100)}%)
                </span>
              </TableCell>

              <TableCell className="font-mono font-bold text-foreground">
                ${tenant.mrr.toLocaleString()}
                <span className="text-[10px] text-muted-foreground font-normal">/mo</span>
              </TableCell>

              <TableCell>
                <Badge
                  variant={
                    tenant.status === "active"
                      ? "success"
                      : tenant.status === "grace_period"
                      ? "warning"
                      : "destructive"
                  }
                >
                  {tenant.status === "active"
                    ? "ACTIVE"
                    : tenant.status === "grace_period"
                    ? "GRACE PERIOD"
                    : "SUSPENDED"}
                </Badge>
              </TableCell>

              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1.5">
                  <Tooltip content="Edit Tenant License & Quota">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        toast.info("Tenant Settings", `Editing quota for ${tenant.name}`)
                      }
                      className="h-7 text-xs px-2"
                    >
                      <SlidersHorizontal className="h-3 w-3 mr-1" />
                      Quota
                    </Button>
                  </Tooltip>
                  <Tooltip content="Launch Tenant Dashboard View">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        toast.success("Switched Tenant Scope", `Accessing ${tenant.name} operations.`);
                        window.location.href = "/company";
                      }}
                      className="h-7 text-xs px-2.5"
                    >
                      Enter
                    </Button>
                  </Tooltip>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
