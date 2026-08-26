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

export function TenantProvisioningModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const toast = useToast();
  const [companyName, setCompanyName] = useState("");
  const [subdomain, setSubdomain] = useState("");
  const [branchesQuota, setBranchesQuota] = useState("20");
  const [subscribersQuota, setSubscribersQuota] = useState("150000");
  const [adminEmail, setAdminEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) return;

    toast.success(
      "Tenant Provisioned",
      `New instance for "${companyName}" (${subdomain}.primeone.io) has been created.`
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
