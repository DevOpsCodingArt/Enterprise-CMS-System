"use client";

import React, { useState } from "react";
import { Plus, CheckCircle2, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockDb, RbacRole } from "@/mock/db";
import { cn } from "@/lib/utils";

export function RbacRolesTab() {
  const [rolesList, setRolesList] = useState<RbacRole[]>(mockDb.roles);
  const [selectedRole, setSelectedRole] = useState<RbacRole>(mockDb.roles[0]);
  const [isCreateRoleOpen, setIsCreateRoleOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleDesc, setNewRoleDesc] = useState("");

  const permissionCategories = [
    {
      group: "💬 Helpdesk & Live Chat",
      permissions: [
        { key: "chat.view", label: "View Active Chat Queues" },
        { key: "chat.reply", label: "Send Public Replies to Subscribers" },
        { key: "chat.internal_notes", label: "Create & View Confidential Staff Notes" },
        { key: "chat.transfer", label: "Transfer Chats Between Staff" },
        { key: "chat.close", label: "Close & Resolve Conversations" },
      ],
    },
    {
      group: "🎫 Trouble Tickets & Dispatch",
      permissions: [
        { key: "tickets.view", label: "View All Tickets" },
        { key: "tickets.create", label: "Create New Trouble Tickets" },
        { key: "tickets.assign", label: "Assign Work Orders to Tech Vans" },
        { key: "tickets.resolve", label: "Mark Tickets Resolved & Spliced" },
      ],
    },
    {
      group: "👥 Subscribers & CRM",
      permissions: [
        { key: "customers.view", label: "View Subscriber Directory" },
        { key: "customers.create", label: "Provision New Subscribers" },
        { key: "customers.edit", label: "Modify KYC & Package Details" },
        { key: "customers.freeze", label: "Temporary Account Freeze" },
        { key: "customers.suspend", label: "Suspend for Non-Payment" },
      ],
    },
    {
      group: "📡 Network Telemetry (OSS / SmartOLT)",
      permissions: [
        { key: "noc.view_telemetry", label: "View GPON OLT Optical Telemetry" },
        { key: "noc.reboot_onu", label: "TR-069 Remote Router Reboot" },
        { key: "noc.reset_pppoe", label: "Reset / Kick Radius PPPoE Sessions" },
        { key: "noc.broadcast_outage", label: "Trigger Area Outage Broadcasts" },
      ],
    },
    {
      group: "💳 Billing, Recovery & Accounts (BSS)",
      permissions: [
        { key: "billing.view_invoices", label: "View Billing Invoices" },
        { key: "billing.generate_invoices", label: "Generate Monthly Billing Cycle" },
        { key: "billing.collect_cash", label: "Counter Cash Collection" },
        { key: "billing.doorstep_recovery", label: "Doorstep Staff Field Recovery Wallet" },
        { key: "accounts.view_ledger", label: "View General Ledger & Net Profit" },
      ],
    },
  ];

  const handleTogglePermission = (permKey: string) => {
    if (selectedRole.isSystem && selectedRole.id === "role-owner") {
      alert("Company Owner (Super-Admin) role retains permanent unrestricted root permissions.");
      return;
    }

    const hasPerm = selectedRole.permissions.includes(permKey) || selectedRole.permissions.includes("*");
    let updatedPerms: string[];

    if (hasPerm) {
      updatedPerms = selectedRole.permissions.filter((p) => p !== permKey && p !== "*");
    } else {
      updatedPerms = [...selectedRole.permissions, permKey];
    }

    const updatedRole = { ...selectedRole, permissions: updatedPerms };
    setSelectedRole(updatedRole);
    setRolesList(rolesList.map((r) => (r.id === updatedRole.id ? updatedRole : r)));
  };

  const handleAddRole = (e: React.FormEvent) => {
    e.preventDefault();
    const newRole: RbacRole = {
      id: `role-${Date.now()}`,
      name: newRoleName || "Custom Role",
      description: newRoleDesc || "Custom operational role",
      isSystem: false,
      activeUsersCount: 0,
      scope: "branch_only",
      permissions: ["chat.view", "tickets.view", "customers.view"],
    };

    setRolesList([...rolesList, newRole]);
    setSelectedRole(newRole);
    setIsCreateRoleOpen(false);
    setNewRoleName("");
    setNewRoleDesc("");
  };

  return (
    <div className="flex h-full w-full overflow-hidden border-0">
      {/* Roles Selector Sidebar */}
      <div className="w-80 h-full border-r border-border bg-card p-3 space-y-3 shrink-0 flex flex-col">
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <span className="font-heading font-bold text-xs uppercase text-muted-foreground">
            Configured Roles ({rolesList.length})
          </span>
          <Button size="sm" onClick={() => setIsCreateRoleOpen(true)}>
            <Plus className="h-3 w-3 mr-1" /> Add Role
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-1.5 custom-scrollbar">
          {rolesList.map((role) => {
            const isSelected = selectedRole.id === role.id;
            return (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role)}
                className={cn(
                  "w-full text-left p-3 rounded-xl border transition-all cursor-pointer",
                  isSelected
                    ? "bg-primary/10 border-primary/40 shadow-2xs"
                    : "bg-muted/20 border-border/70 hover:bg-muted/50"
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-heading font-bold text-xs text-foreground truncate">
                    {role.name}
                  </span>
                  {role.isSystem && (
                    <Badge variant="secondary" className="text-[9.5px] py-0 px-1 font-mono">
                      System
                    </Badge>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground leading-tight line-clamp-2">
                  {role.description}
                </p>
                <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1.5 mt-1.5 border-t border-border/60 font-mono">
                  <span>{role.activeUsersCount} Active Users</span>
                  <span className="font-bold text-primary">{role.scope === "company_wide" ? "Company-Wide" : "Branch Scoped"}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Granular Permission Checkboxes Grid */}
      <div className="flex-1 h-full bg-card p-6 space-y-6 overflow-y-auto custom-scrollbar">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div>
            <h2 className="font-heading font-bold text-base text-foreground">
              {selectedRole.name} Permissions Matrix
            </h2>
            <p className="text-xs text-muted-foreground">{selectedRole.description}</p>
          </div>
          <Badge variant={selectedRole.scope === "company_wide" ? "info" : "secondary"}>
            {selectedRole.scope === "company_wide" ? "Company-Wide Root Scope" : "Assigned Branch Only"}
          </Badge>
        </div>

        <div className="space-y-5">
          {permissionCategories.map((cat) => (
            <div key={cat.group} className="space-y-2.5 p-4 rounded-xl bg-muted/20 border border-border">
              <h3 className="font-heading font-bold text-xs text-foreground uppercase tracking-wider">
                {cat.group}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                {cat.permissions.map((p) => {
                  const isChecked =
                    selectedRole.permissions.includes(p.key) || selectedRole.permissions.includes("*");

                  return (
                    <label
                      key={p.key}
                      onClick={() => handleTogglePermission(p.key)}
                      className={cn(
                        "flex items-center gap-2.5 p-2.5 rounded-lg border transition-all cursor-pointer",
                        isChecked
                          ? "bg-primary/10 border-primary/40 text-foreground font-medium"
                          : "bg-card border-border text-muted-foreground hover:bg-muted/40"
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => { }}
                        className="rounded border-border text-primary focus:ring-primary h-4 w-4"
                      />
                      <span className="text-xs leading-tight">{p.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CREATE ROLE MODAL */}
      {isCreateRoleOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-card rounded-2xl border border-border shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="font-heading font-bold text-base text-foreground">Create Custom RBAC Role</h3>
              <button onClick={() => setIsCreateRoleOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAddRole} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-muted-foreground mb-1">Role Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Billing Auditor"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  className="w-full bg-muted/30 rounded-lg p-2 border border-border text-foreground"
                />
              </div>
              <div>
                <label className="block font-bold text-muted-foreground mb-1">Role Description</label>
                <textarea
                  required
                  placeholder="Describe operational responsibilities..."
                  value={newRoleDesc}
                  onChange={(e) => setNewRoleDesc(e.target.value)}
                  className="w-full bg-muted/30 rounded-lg p-2 border border-border text-foreground h-20"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsCreateRoleOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="flex-1">
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Create Role
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
