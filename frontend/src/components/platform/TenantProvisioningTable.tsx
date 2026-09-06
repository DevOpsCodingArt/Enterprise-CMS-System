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
  Globe,
  Clock,
  CheckCircle2,
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
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tooltip } from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/toast";
import { SUPPORTED_TIMEZONES, getTimezoneAbbreviation, formatTenantDateTime } from "@/lib/timezone";

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
  timezone: string;
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
    timezone: "Asia/Karachi",
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
    adminEmail: "ops@fiberlink.net.cn",
    joinedDate: "2024-03-20",
    timezone: "Asia/Shanghai",
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
    adminEmail: "admin@netspeed.in",
    joinedDate: "2024-05-11",
    timezone: "Asia/Kolkata",
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
    adminEmail: "billing@opticwave.ae",
    joinedDate: "2024-08-01",
    timezone: "Asia/Dubai",
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
    timezone: "Asia/Karachi",
  },
];

export function TenantProvisioningTable({
  onOpenProvisionModal,
}: {
  onOpenProvisionModal: () => void;
}) {
  const toast = useToast();
  const [tenants, setTenants] = useState<TenantCompany[]>(initialTenants);

  // Edit Tenant Settings state
  const [editingTenant, setEditingTenant] = useState<TenantCompany | null>(null);
  const [editForm, setEditForm] = useState<{
    timezone: string;
    tier: "Enterprise" | "Growth" | "Starter";
    branchesQuota: number;
    subscribersQuota: number;
    status: "active" | "grace_period" | "suspended";
  }>({
    timezone: "Asia/Karachi",
    tier: "Enterprise",
    branchesQuota: 20,
    subscribersQuota: 150000,
    status: "active",
  });

  const handleOpenEdit = (tenant: TenantCompany) => {
    setEditingTenant(tenant);
    setEditForm({
      timezone: tenant.timezone || "Asia/Karachi",
      tier: tenant.tier,
      branchesQuota: tenant.branchesQuota,
      subscribersQuota: tenant.subscribersQuota,
      status: tenant.status,
    });
  };

  const handleSaveTenantSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTenant) return;

    setTenants((prev) =>
      prev.map((t) =>
        t.id === editingTenant.id
          ? {
              ...t,
              timezone: editForm.timezone,
              tier: editForm.tier,
              branchesQuota: editForm.branchesQuota,
              subscribersQuota: editForm.subscribersQuota,
              status: editForm.status,
            }
          : t
      )
    );

    toast.success(
      "Tenant Settings Updated",
      `${editingTenant.name} operational timezone set to ${editForm.timezone} (${getTimezoneAbbreviation(editForm.timezone)}).`
    );
    setEditingTenant(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h3 className="text-base font-heading font-bold text-foreground">
            Multi-Tenant ISP Companies
          </h3>
          <p className="text-xs text-muted-foreground">
            Active telecom client instances, regional operating timezones, license quotas, and branch allocations.
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
            <TableHead>Operating Timezone</TableHead>
            <TableHead>License Tier</TableHead>
            <TableHead>Branch Quota</TableHead>
            <TableHead>Subscribers Fleet</TableHead>
            <TableHead>SaaS MRR</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tenants.map((tenant) => {
            const tzMeta = SUPPORTED_TIMEZONES.find((t) => t.value === tenant.timezone) || SUPPORTED_TIMEZONES[0];

            return (
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
                  <Tooltip content={`Current Local Time: ${formatTenantDateTime(new Date(), tenant.timezone)}`}>
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-card-subtle border border-border text-xs font-mono">
                      <Globe className="h-3 w-3 text-primary" />
                      <span className="font-bold text-foreground">{tzMeta.abbr}</span>
                      <span className="text-[10px] text-muted-foreground">({tzMeta.offset})</span>
                    </div>
                  </Tooltip>
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
                    <Tooltip content="Change Timezone, Quota & License Settings">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenEdit(tenant)}
                        className="h-7 text-xs px-2"
                      >
                        <SlidersHorizontal className="h-3 w-3 mr-1" />
                        Settings
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
            );
          })}
        </TableBody>
      </Table>

      {/* PLATFORM OWNER: EDIT TENANT SETTINGS & TIMEZONE MODAL */}
      {editingTenant && (
        <Dialog isOpen={Boolean(editingTenant)} onClose={() => setEditingTenant(null)}>
          <DialogHeader>
            <DialogTitle>Configure Tenant Settings: {editingTenant.name}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveTenantSettings}>
            <DialogContent className="space-y-4">
              {/* Regional Timezone */}
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5 flex items-center gap-1.5">
                  <Globe className="h-3.5 w-3.5 text-primary" />
                  <span>Tenant Regional Timezone</span>
                </label>
                <select
                  value={editForm.timezone}
                  onChange={(e) => setEditForm({ ...editForm, timezone: e.target.value })}
                  className="w-full bg-card-subtle/50 rounded-lg p-2.5 border border-border text-foreground font-mono text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                >
                  {SUPPORTED_TIMEZONES.map((tz) => (
                    <option key={tz.value} value={tz.value} className="bg-card text-foreground">
                      {tz.label}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Adjusts the local time baseline for ticket SLA timers, ETTR countdowns, billing runs, and logs.
                </p>
              </div>

              {/* License Tier */}
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  Subscription Tier
                </label>
                <select
                  value={editForm.tier}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      tier: e.target.value as "Enterprise" | "Growth" | "Starter",
                    })
                  }
                  className="w-full bg-card-subtle/50 rounded-lg p-2 border border-border text-foreground font-mono text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                >
                  <option value="Enterprise">Enterprise</option>
                  <option value="Growth">Growth</option>
                  <option value="Starter">Starter</option>
                </select>
              </div>

              {/* Quotas */}
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Branch Offices Quota"
                  type="number"
                  value={String(editForm.branchesQuota)}
                  onChange={(e) =>
                    setEditForm({ ...editForm, branchesQuota: Number(e.target.value) || 1 })
                  }
                  isMono
                  required
                />
                <Input
                  label="Subscribers Quota"
                  type="number"
                  value={String(editForm.subscribersQuota)}
                  onChange={(e) =>
                    setEditForm({ ...editForm, subscribersQuota: Number(e.target.value) || 100 })
                  }
                  isMono
                  required
                />
              </div>

              {/* Operational Status */}
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  Tenant Operational Status
                </label>
                <select
                  value={editForm.status}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      status: e.target.value as "active" | "grace_period" | "suspended",
                    })
                  }
                  className="w-full bg-card-subtle/50 rounded-lg p-2 border border-border text-foreground font-mono text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                >
                  <option value="active">Active</option>
                  <option value="grace_period">Grace Period</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </DialogContent>

            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setEditingTenant(null)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Save Tenant Settings
              </Button>
            </DialogFooter>
          </form>
        </Dialog>
      )}
    </div>
  );
}

