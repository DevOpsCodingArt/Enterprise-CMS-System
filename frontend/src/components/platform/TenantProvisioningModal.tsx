"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { SUPPORTED_TIMEZONES } from "@/lib/timezone";
import { Globe } from "lucide-react";

export function TenantProvisioningModal({
  isOpen,
  onClose,
  onProvision,
}: {
  isOpen: boolean;
  onClose: () => void;
  onProvision?: (tenantData: {
    name: string;
    subdomain: string;
    timezone: string;
    adminEmail: string;
    branchesQuota: number;
    subscribersQuota: number;
  }) => void;
}) {
  const toast = useToast();
  const [companyName, setCompanyName] = useState("");
  const [subdomain, setSubdomain] = useState("");
  const [timezone, setTimezone] = useState("Asia/Karachi");
  const [branchesQuota, setBranchesQuota] = useState("20");
  const [subscribersQuota, setSubscribersQuota] = useState("150000");
  const [adminEmail, setAdminEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) return;

    if (onProvision) {
      onProvision({
        name: companyName,
        subdomain,
        timezone,
        adminEmail,
        branchesQuota: Number(branchesQuota) || 20,
        subscribersQuota: Number(subscribersQuota) || 150000,
      });
    }

    toast.success(
      "Tenant Provisioned",
      `New instance for "${companyName}" (${subdomain}.primeone.io) provisioned in timezone ${timezone}.`
    );
    onClose();
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <DialogHeader>
        <DialogTitle>Provision New ISP Tenant Instance</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit}>
        <DialogContent className="space-y-4">
          <Input
            label="ISP Company Legal Name"
            placeholder="e.g. NextGen Fiber Networks"
            value={companyName}
            onChange={(e) => {
              setCompanyName(e.target.value);
              setSubdomain(
                e.target.value
                  .toLowerCase()
                  .replace(/[^a-z0-9]/g, "")
                  .substring(0, 15)
              );
            }}
            required
          />

          <Input
            label="Dedicated SaaS Subdomain"
            value={subdomain}
            onChange={(e) => setSubdomain(e.target.value)}
            suffixIcon={<span className="text-xs font-mono text-muted-foreground pr-2">.primeone.io</span>}
            isMono
            placeholder="subdomain"
            required
          />

          {/* Tenant Regional Timezone */}
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5 flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5 text-primary" />
              <span>Tenant Regional Timezone</span>
            </label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full bg-card-subtle/50 rounded-lg p-2 border border-border text-foreground font-mono text-xs focus:ring-1 focus:ring-primary focus:outline-none"
            >
              {SUPPORTED_TIMEZONES.map((tz) => (
                <option key={tz.value} value={tz.value} className="bg-card text-foreground">
                  {tz.label}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-muted-foreground mt-1">
              Governs ticket SLA timers, ETTR countdowns, subscriber billing cycles, and staff shifts for this instance.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Branch Offices Quota"
              type="number"
              value={branchesQuota}
              onChange={(e) => setBranchesQuota(e.target.value)}
              isMono
              required
            />
            <Input
              label="Subscribers Limit"
              type="number"
              value={subscribersQuota}
              onChange={(e) => setSubscribersQuota(e.target.value)}
              isMono
              required
            />
          </div>

          <Input
            label="Initial Owner Admin Email"
            type="email"
            placeholder="owner@company.pk"
            value={adminEmail}
            onChange={(e) => setAdminEmail(e.target.value)}
            required
          />
        </DialogContent>

        <DialogFooter>
          <Button variant="outline" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Deploy Tenant Instance
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
