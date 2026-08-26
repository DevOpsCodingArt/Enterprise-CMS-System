"use client";

import React, { useState } from "react";
import {
  Building2,
  Plus,
  Search,
  MapPin,
  Users,
  Phone,
  Radio,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Shield,
  Layers,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { useTenantStore } from "@/stores/useTenantStore";
import { useToast } from "@/components/ui/toast";

export function BranchGovernanceView() {
  const toast = useToast();
  const { branches } = useTenantStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [isAddBranchModalOpen, setIsAddBranchModalOpen] = useState(false);
  const [newBranchName, setNewBranchName] = useState("");
  const [newBranchCity, setNewBranchCity] = useState("Islamabad");
  const [newBranchCode, setNewBranchCode] = useState("");
  const [newBranchManager, setNewBranchManager] = useState("");

  const filteredBranches = branches.filter(
    (b) =>
      b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddBranch = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(
      "Branch Provisioned Successfully",
      `New operational hub '${newBranchName}' (${newBranchCode}) registered.`
    );
    setIsAddBranchModalOpen(false);
    setNewBranchName("");
    setNewBranchCode("");
    setNewBranchManager("");
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Quick Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-heading font-extrabold text-foreground tracking-tight">
            20 Operational Branch Hubs & Governance
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Centralized administration of regional ISP branch offices, local manager assignments, and GPON coverage zones.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsAddBranchModalOpen(true)}
          className="gap-1.5 font-bold shadow-xs cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Provision New Branch</span>
        </Button>
      </div>

      {/* 2. Search & Metrics Summary */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search branches by name, city, or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="secondary" className="font-mono text-xs">
            🏢 {branches.length} Total Branches
          </Badge>
          <Badge variant="success" className="font-mono text-xs">
            🟢 100% Core Online
          </Badge>
          <Badge variant="info" className="font-mono text-xs">
            👥 52 Staff Deployed
          </Badge>
        </div>
      </div>

      {/* 3. 20-Branch Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBranches.map((branch) => (
          <Card
            key={branch.id}
            className="bg-card border-border shadow-xs hover:border-primary/50 transition-all flex flex-col"
          >
            <CardHeader className="p-4 border-b border-border bg-card-subtle/40 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-xs shrink-0">
                  {branch.code.slice(0, 3)}
                </div>
                <div className="min-w-0">
                  <CardTitle className="text-xs font-heading font-bold truncate">
                    {branch.name}
                  </CardTitle>
                  <CardDescription className="text-[11px] font-mono">
                    Code: {branch.code} • {branch.city}
                  </CardDescription>
                </div>
              </div>

              <Badge variant="success" className="text-[9px] py-0 px-1 font-mono shrink-0">
                ACTIVE
              </Badge>
            </CardHeader>

            <CardContent className="p-4 space-y-3 flex-1 text-xs">
              <div className="flex justify-between py-1 border-b border-border-subtle">
                <span className="text-muted-foreground font-mono">Active Subscribers:</span>
                <span className="font-mono font-bold text-foreground">
                  {(branch.totalSubscribers || 7140).toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-border-subtle">
                <span className="text-muted-foreground font-mono">Workforce Roster:</span>
                <span className="font-bold text-foreground">
                  {branch.totalStaff} Personnel
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-border-subtle">
                <span className="text-muted-foreground font-mono">SLA Performance:</span>
                <span className="font-mono font-bold text-success">
                  {branch.slaCompliancePercent}% Nominal
                </span>
              </div>

              <div className="flex justify-between py-1">
                <span className="text-muted-foreground font-mono">OLT Metro Core:</span>
                <span className="font-mono text-[11px] text-primary font-bold">
                  OLT-{branch.code}-01
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Provision Branch Modal Dialog */}
      <Dialog
        isOpen={isAddBranchModalOpen}
        onClose={() => setIsAddBranchModalOpen(false)}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            <span>Provision New Branch Hub</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleAddBranch}>
          <DialogContent className="space-y-4">
            <Input
              label="Branch Name"
              placeholder="e.g. Islamabad F-10 Executive Hub"
              value={newBranchName}
              onChange={(e) => setNewBranchName(e.target.value)}
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="City / Region"
                value={newBranchCity}
                onChange={(e) => setNewBranchCity(e.target.value)}
                required
              />

              <Input
                label="Branch Code"
                placeholder="e.g. ISB-04"
                value={newBranchCode}
                onChange={(e) => setNewBranchCode(e.target.value)}
                required
              />
            </div>

            <Input
              label="Assigned Branch Manager Name"
              placeholder="e.g. Haris Munir (Lead Supervisor)"
              value={newBranchManager}
              onChange={(e) => setNewBranchManager(e.target.value)}
              required
            />
          </DialogContent>

          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              onClick={() => setIsAddBranchModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Register Branch Hub
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </div>
  );
}
