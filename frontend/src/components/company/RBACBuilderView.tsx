"use client";

import React, { useState } from "react";
import {
  Shield,
  Plus,
  Sliders,
  Check,
  X,
  MessageSquare,
  Ticket,
  DollarSign,
  Network,
  Building2,
  Users,
  FileText,
  Sparkles,
  Eye,
  Trash2,
  Lock,
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
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";

export interface CustomRole {
  id: string;
  name: string;
  description: string;
  assignedUsersCount: number;
  permissions: string[];
}

export function RBACBuilderView() {
  const toast = useToast();

  const [roles, setRoles] = useState<CustomRole[]>([
    {
      id: "role-01",
      name: "Senior Fiber Splicer (Lead)",
      description: "Field technicians authorized to calibrate optical lines, update job status, and consume van inventory.",
      assignedUsersCount: 16,
      permissions: [
        "field.view_jobs",
        "field.update_jobs",
        "field.calibrate_line",
        "inventory.view",
        "inventory.consume",
        "tickets.view",
        "tickets.resolve",
      ],
    },
    {
      id: "role-02",
      name: "Helpdesk CSR Agent",
      description: "Customer service reps handling omni-channel WhatsApp/web chat, lodging tickets, and viewing customer 360.",
      assignedUsersCount: 12,
      permissions: [
        "chat.view",
        "chat.send",
        "chat.transfer",
        "tickets.view",
        "tickets.create",
        "customers.view_360",
        "payment.submit_proof",
      ],
    },
    {
      id: "role-03",
      name: "Accounts & Billing Verification Officer",
      description: "Finance officers authorized to verify bank deposits, 1Bill transactions, and issue tax invoices.",
      assignedUsersCount: 4,
      permissions: [
        "billing.view_ledger",
        "billing.view_invoices",
        "payment.verify",
        "billing.issue_tax_cert",
        "customers.view_360",
      ],
    },
    {
      id: "role-04",
      name: "NOC Optical Engineer",
      description: "Network engineers managing SmartOLT OLT nodes, MikroTik BRAS sessions, and fiber cut broadcasts.",
      assignedUsersCount: 4,
      permissions: [
        "noc.view_radar",
        "olt.manage",
        "radius.manage",
        "tickets.view",
        "tickets.create",
        "tickets.resolve",
      ],
    },
  ]);

  const [selectedRole, setSelectedRole] = useState<CustomRole>(roles[0]);
  const [isCreateRoleModalOpen, setIsCreateRoleModalOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleDesc, setNewRoleDesc] = useState("");

  const permissionModules = [
    {
      module: "Chat & Omni-Desk",
      icon: MessageSquare,
      actions: [
        { key: "chat.view", label: "View Live Conversations" },
        { key: "chat.send", label: "Send Messages & Voice Notes" },
        { key: "chat.transfer", label: "Transfer to Other Staff" },
        { key: "chat.delete", label: "Permanently Delete Chats" },
      ],
    },
    {
      module: "Trouble Tickets",
      icon: Ticket,
      actions: [
        { key: "tickets.view", label: "View Trouble Tickets Queue" },
        { key: "tickets.create", label: "Lodge New Support Complaint" },
        { key: "tickets.resolve", label: "Mark Ticket Resolved & Calibrated" },
        { key: "tickets.delete", label: "Delete Ticket Records" },
      ],
    },
    {
      module: "Field & Splicing",
      icon: Users,
      actions: [
        { key: "field.view_jobs", label: "View Assigned Splicing Orders" },
        { key: "field.update_jobs", label: "Update Work Progress" },
        { key: "field.calibrate_line", label: "Log Optical dBm Calibration" },
        { key: "inventory.consume", label: "Deduct Van Stock Materials" },
      ],
    },
    {
      module: "Billing & Finance",
      icon: DollarSign,
      actions: [
        { key: "billing.view_ledger", label: "View 1Link Financial Ledger" },
        { key: "payment.verify", label: "Approve Unverified Payment Slips" },
        { key: "billing.issue_tax_cert", label: "Issue WHT Tax Exemption" },
      ],
    },
    {
      module: "NOC & Optical Hardware",
      icon: Network,
      actions: [
        { key: "noc.view_radar", label: "View Optical Attenuation Radar" },
        { key: "olt.manage", label: "Power-Cycle GPON OLT Ports" },
        { key: "radius.manage", label: "Reset MikroTik PPPoE Sessions" },
      ],
    },
  ];

  const handleTogglePermission = (permissionKey: string) => {
    const isGranted = selectedRole.permissions.includes(permissionKey);
    const updatedPermissions = isGranted
      ? selectedRole.permissions.filter((p) => p !== permissionKey)
      : [...selectedRole.permissions, permissionKey];

    const updatedRole = { ...selectedRole, permissions: updatedPermissions };
    setSelectedRole(updatedRole);
    setRoles((prev) => prev.map((r) => (r.id === updatedRole.id ? updatedRole : r)));
    toast.info("Permission Updated", `Role '${selectedRole.name}' permissions modified.`);
  };

  const handleCreateRole = (e: React.FormEvent) => {
    e.preventDefault();
    const newRole: CustomRole = {
      id: `role-${Date.now()}`,
      name: newRoleName,
      description: newRoleDesc,
      assignedUsersCount: 0,
      permissions: ["chat.view", "tickets.view"],
    };

    setRoles([...roles, newRole]);
    setSelectedRole(newRole);
    setIsCreateRoleModalOpen(false);
    setNewRoleName("");
    setNewRoleDesc("");
    toast.success("Custom Role Created", `Role '${newRole.name}' is now active and ready for assignment.`);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Create Role Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-heading font-extrabold text-foreground tracking-tight">
            Custom Role & Permission Matrix Builder
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Zero hardcoded roles. Define granular module and action-level capabilities that adapt the UI dynamically upon staff login.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsCreateRoleModalOpen(true)}
          className="gap-1.5 font-bold shadow-xs cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Create Custom Role</span>
        </Button>
      </div>

      {/* 2. Main 2-Column Builder Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Role List Selector */}
        <Card className="lg:col-span-4 bg-card border-border shadow-xs flex flex-col">
          <CardHeader className="p-4 border-b border-border bg-card-subtle/50">
            <CardTitle className="text-xs uppercase font-mono tracking-wider text-muted-foreground">
              Configured Custom Roles
            </CardTitle>
          </CardHeader>

          <CardContent className="p-2 space-y-1.5 flex-1 overflow-y-auto divide-y divide-border-subtle">
            {roles.map((role) => (
              <div
                key={role.id}
                onClick={() => setSelectedRole(role)}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  role.id === selectedRole.id
                    ? "bg-primary/10 border-l-4 border-primary"
                    : "hover:bg-card-subtle"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-foreground">
                    {role.name}
                  </span>
                  <Badge variant="secondary" className="font-mono text-[9px]">
                    {role.assignedUsersCount} Staff
                  </Badge>
                </div>
                <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">
                  {role.description}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Right Column: Permission Checkbox Matrix */}
        <Card className="lg:col-span-8 bg-card border-border shadow-xs flex flex-col">
          <CardHeader className="p-4 border-b border-border bg-card-subtle/50 flex flex-row items-center justify-between flex-wrap gap-2">
            <div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                <CardTitle className="text-sm font-heading font-bold">
                  {selectedRole.name} — Capabilities Matrix
                </CardTitle>
              </div>
              <CardDescription className="text-xs mt-0.5">
                Toggle capabilities to automatically filter sidebar navigation and gate backend APIs.
              </CardDescription>
            </div>

            <Badge variant="info" className="font-mono text-xs">
              {selectedRole.permissions.length} Active Permissions
            </Badge>
          </CardHeader>

          <CardContent className="p-4 space-y-6 flex-1 overflow-y-auto">
            {permissionModules.map((moduleGroup) => {
              const Icon = moduleGroup.icon;

              return (
                <div key={moduleGroup.module} className="space-y-3">
                  <div className="flex items-center gap-2 pb-1.5 border-b border-border-subtle">
                    <Icon className="h-4 w-4 text-primary" />
                    <span className="font-heading font-bold text-xs text-foreground uppercase tracking-wider">
                      {moduleGroup.module}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {moduleGroup.actions.map((action) => {
                      const isGranted = selectedRole.permissions.includes(action.key);

                      return (
                        <div
                          key={action.key}
                          onClick={() => handleTogglePermission(action.key)}
                          className={`p-3 rounded-lg border text-xs cursor-pointer transition-all flex items-center justify-between gap-2 ${
                            isGranted
                              ? "bg-primary/5 border-primary/40 ring-1 ring-primary/20 text-foreground font-semibold"
                              : "bg-card border-border text-muted-foreground hover:bg-card-subtle hover:text-foreground"
                          }`}
                        >
                          <div className="space-y-0.5 min-w-0">
                            <span className="block truncate">{action.label}</span>
                            <span className="font-mono text-[10px] text-muted-foreground block">
                              {action.key}
                            </span>
                          </div>

                          <div
                            className={`flex h-5 w-5 items-center justify-center rounded-md shrink-0 ${
                              isGranted
                                ? "bg-primary text-primary-foreground"
                                : "border border-border bg-card"
                            }`}
                          >
                            {isGranted && <Check className="h-3.5 w-3.5" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Create Custom Role Dialog */}
      <Dialog
        isOpen={isCreateRoleModalOpen}
        onClose={() => setIsCreateRoleModalOpen(false)}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <span>Create New Custom Role</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleCreateRole}>
          <DialogContent className="space-y-4">
            <Input
              label="Custom Role Title"
              placeholder="e.g. Rawalpindi Splicing Supervisor"
              value={newRoleName}
              onChange={(e) => setNewRoleName(e.target.value)}
              required
            />

            <Input
              label="Role Description"
              placeholder="e.g. Field supervisor responsible for managing splicer vans and van inventory..."
              value={newRoleDesc}
              onChange={(e) => setNewRoleDesc(e.target.value)}
              required
            />
          </DialogContent>

          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              onClick={() => setIsCreateRoleModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Custom Role
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </div>
  );
}
