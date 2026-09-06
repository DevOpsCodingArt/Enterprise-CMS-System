"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Shield,
  ShieldCheck,
  Plus,
  CheckCircle2,
  X,
  Search,
  UserCheck,
  Users,
  Key,
  RotateCcw,
  Lock,
  Sparkles,
  Filter,
  Check,
  SlidersHorizontal,
  AlertTriangle,
  ChevronRight,
  Layers,
  Save,
  CheckSquare,
  Square,
  Building2,
  Phone,
  Mail,
  Briefcase,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import type { RbacRole, StaffUserRecord } from "@/types/telecom-entities.types";
import { telecomService } from "@/services/telecom.service";
import { cn } from "@/lib/utils";

// Comprehensive telecom operational permission categories
export const PERMISSION_CATEGORIES = [
  {
    group: "💬 Helpdesk & Live Chat",
    description: "Omnichannel customer messaging, agent transfers, and live triage",
    permissions: [
      { key: "chat.view", label: "View Active Chat Queues", description: "Access subscriber live support streams" },
      { key: "chat.reply", label: "Send Public Replies", description: "Send official messages to subscribers" },
      { key: "chat.internal_notes", label: "Confidential Staff Notes", description: "Internal staff remarks not visible to subscribers" },
      { key: "chat.transfer", label: "Transfer Chats Between Staff", description: "Escalate or reassign chats to other departments" },
      { key: "chat.close", label: "Close & Resolve Conversations", description: "Mark support conversations as closed" },
    ],
  },
  {
    group: "🎫 Trouble Tickets & Dispatch",
    description: "Fiber cut work orders, technician dispatches, and SLA escalation",
    permissions: [
      { key: "tickets.view", label: "View All Trouble Tickets", description: "Read-only access to customer tickets" },
      { key: "tickets.create", label: "Create New Trouble Tickets", description: "Log fiber faults and equipment failure tickets" },
      { key: "tickets.assign", label: "Assign Work Orders to Tech Vans", description: "Dispatch field vans to splice fiber cuts" },
      { key: "tickets.resolve", label: "Mark Tickets Resolved & Spliced", description: "Confirm OTDR resolution and close ticket" },
    ],
  },
  {
    group: "👥 Subscribers & CRM",
    description: "Customer lifecycle, KYC profiles, and service provisioning",
    permissions: [
      { key: "customers.view", label: "View Subscriber Directory", description: "Browse customer accounts and profile data" },
      { key: "customers.create", label: "Provision New Subscribers", description: "Onboard new customer connection records" },
      { key: "customers.edit", label: "Modify KYC & Package Details", description: "Edit address, tariff speed, and contact info" },
      { key: "customers.freeze", label: "Temporary Account Freeze", description: "Halt billing temporarily during subscriber vacation" },
      { key: "customers.suspend", label: "Suspend for Non-Payment", description: "Block radius session for overdue accounts" },
    ],
  },
  {
    group: "📡 Network Telemetry (OSS / SmartOLT)",
    description: "GPON OLT telemetry, optical levels, and PPPoE session control",
    permissions: [
      { key: "noc.view_telemetry", label: "View GPON OLT Optical Telemetry", description: "Check optical power (dBm), attenuation, and uptime" },
      { key: "noc.reboot_onu", label: "TR-069 Remote Router Reboot", description: "Send remote reboot command to subscriber ONT" },
      { key: "noc.reset_pppoe", label: "Reset / Kick Radius PPPoE Sessions", description: "Terminate active PPPoE interface to force renew" },
      { key: "noc.broadcast_outage", label: "Trigger Area Outage Broadcasts", description: "Send SMS/push alert to all users on affected PON port" },
    ],
  },
  {
    group: "💳 Billing, Recovery & Accounts (BSS)",
    description: "Invoicing cycles, doorstep cash collections, and ledger audits",
    permissions: [
      { key: "billing.view_invoices", label: "View Billing Invoices", description: "Inspect customer invoices and transaction receipts" },
      { key: "billing.generate_invoices", label: "Generate Monthly Billing Cycle", description: "Trigger automated monthly recurring billing run" },
      { key: "billing.collect_cash", label: "Counter Cash Collection", description: "Accept cash payments at regional branch counter" },
      { key: "billing.doorstep_recovery", label: "Doorstep Field Recovery Wallet", description: "Collect payments in the field via rider wallet" },
      { key: "accounts.view_ledger", label: "View General Ledger & Net Profit", description: "Executive financial statements and revenue reports" },
    ],
  },
  {
    group: "👷 Workforce, Shifts & Field",
    description: "Staff rosters, technician mobile tasks, and inventory access",
    permissions: [
      { key: "staff.view", label: "View Workforce & Shift Rosters", description: "View staff directory and operational schedules" },
      { key: "shifts.assign", label: "Assign Shifts & On-Call Duties", description: "Schedule morning, evening, and night shifts" },
      { key: "attendance.view", label: "View Attendance & GPS Check-ins", description: "Inspect biometric clock-ins and geofenced punch-ins" },
      { key: "tasks.view_assigned", label: "View Mobile Work Orders", description: "Field technician mobile task view" },
      { key: "inventory.view", label: "View Central & Van Inventory Stock", description: "Track drop cables, ONUs, and splice trays" },
    ],
  },
  {
    group: "🛡️ Governance, Security & Audit",
    description: "Immutable compliance logs, security streams, and policy management",
    permissions: [
      { key: "audit.view_logs", label: "View Immutable Audit Trails", description: "Inspect user action logs and system access events" },
      { key: "audit.export_compliance", label: "Export Regulatory Compliance Logs", description: "Generate PTA and compliance compliance archives" },
      { key: "reports.view_all", label: "View Comprehensive Executive BI", description: "Access high-level telecom performance metrics" },
    ],
  },
];

// All distinct flat keys
const ALL_PERMISSION_KEYS = PERMISSION_CATEGORIES.flatMap((c) => c.permissions.map((p) => p.key));

const DEFAULT_ROLE: RbacRole = {
  id: "role-owner",
  name: "Company Owner / Super-Admin",
  description: "Full root access across all operational divisions",
  isSystem: true,
  activeUsersCount: 1,
  scope: "company_wide",
  permissions: ["*"],
};

export function RbacRolesTab() {
  const toast = useToast();

  // Role Templates State
  const [rolesList, setRolesList] = useState<RbacRole[]>([
    {
      id: "role-owner",
      name: "Company Owner / Super-Admin",
      description: "Full root access across all operational divisions",
      isSystem: true,
      activeUsersCount: 1,
      scope: "company_wide",
      permissions: ["*"],
    },
    {
      id: "role-helpdesk",
      name: "Helpdesk Agent (L1/L2)",
      description: "Customer triage, ticket logging, and public live chat support",
      isSystem: true,
      activeUsersCount: 4,
      scope: "company_wide",
      permissions: ["chat.view", "chat.reply", "chat.close", "tickets.view", "tickets.create", "customers.view"],
    },
    {
      id: "role-noc",
      name: "NOC & Core Optical Engineer",
      description: "SmartOLT GPON diagnostics, optical power alarms, and backbone outages",
      isSystem: true,
      activeUsersCount: 2,
      scope: "company_wide",
      permissions: ["noc.view_telemetry", "noc.reboot_onu", "noc.reset_pppoe", "noc.broadcast_outage", "tickets.view", "tickets.create", "tickets.assign", "tickets.resolve"],
    },
  ]);

  // Staff Members State
  const [staffList, setStaffList] = useState<StaffUserRecord[]>([]);

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      telecomService.governance.getRoles().catch(() => []),
      telecomService.workforce.getStaff().catch(() => []),
    ]).then(([roles, staff]) => {
      if (!isMounted) return;
      if (roles && roles.length > 0) {
        setRolesList(roles);
        setSelectedTemplateForEdit(roles[0]);
      }
      if (staff && staff.length > 0) {
        setStaffList(
          staff.map((s) => {
            const matchedRole = (roles || []).find((r) => r.id === s.roleId);
            const rolePerms = matchedRole ? matchedRole.permissions : [];
            return {
              ...s,
              customPermissions: s.customPermissions || (rolePerms.includes("*") ? ["*"] : rolePerms),
            };
          })
        );
        setSelectedStaffId(staff[0].id);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Selected Staff Member
  const [selectedStaffId, setSelectedStaffId] = useState<string>(staffList[0]?.id || "");
  const selectedStaff = useMemo(
    () => staffList.find((s) => s.id === selectedStaffId) || staffList[0],
    [staffList, selectedStaffId]
  );

  // Search and Filter State for Staff
  const [staffSearchQuery, setStaffSearchQuery] = useState("");
  const [selectedDepartmentFilter, setSelectedDepartmentFilter] = useState<string>("all");

  // Pop-up Modal State: Role Templates Manager
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [selectedTemplateForEdit, setSelectedTemplateForEdit] = useState<RbacRole>(DEFAULT_ROLE);
  const [isCreateRoleModalOpen, setIsCreateRoleModalOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleDesc, setNewRoleDesc] = useState("");
  const [newRoleScope, setNewRoleScope] = useState<"company_wide" | "branch_only">("branch_only");

  // Distinct departments for filter
  const departments = useMemo(() => {
    const set = new Set<string>();
    staffList.forEach((s) => {
      if (s.department) set.add(s.department);
    });
    return Array.from(set);
  }, [staffList]);

  // Filtered staff list
  const filteredStaff = useMemo(() => {
    return staffList.filter((staff) => {
      const matchesSearch =
        !staffSearchQuery.trim() ||
        staff.name.toLowerCase().includes(staffSearchQuery.toLowerCase()) ||
        staff.email.toLowerCase().includes(staffSearchQuery.toLowerCase()) ||
        staff.department.toLowerCase().includes(staffSearchQuery.toLowerCase()) ||
        staff.designation.toLowerCase().includes(staffSearchQuery.toLowerCase()) ||
        (staff.roleName || "").toLowerCase().includes(staffSearchQuery.toLowerCase());

      const matchesDept =
        selectedDepartmentFilter === "all" || staff.department === selectedDepartmentFilter;

      return matchesSearch && matchesDept;
    });
  }, [staffList, staffSearchQuery, selectedDepartmentFilter]);

  // Check if selected staff is Root / Owner
  const isRootOwner = selectedStaff?.roleId === "role-owner";

  // Check if selected staff has custom overrides vs standard template
  const currentAssignedRole = useMemo(
    () => rolesList.find((r) => r.id === selectedStaff?.roleId),
    [rolesList, selectedStaff]
  );

  const hasCustomOverrides = useMemo(() => {
    if (!selectedStaff || !currentAssignedRole) return false;
    if (isRootOwner) return false;

    const templatePerms = currentAssignedRole.permissions;
    const staffPerms = selectedStaff.customPermissions || [];

    if (templatePerms.includes("*") && staffPerms.includes("*")) return false;
    if (templatePerms.length !== staffPerms.length) return true;

    const sortedTemplate = [...templatePerms].sort();
    const sortedStaff = [...staffPerms].sort();
    return sortedTemplate.some((p, idx) => p !== sortedStaff[idx]);
  }, [selectedStaff, currentAssignedRole, isRootOwner]);

  // Staff permission toggle handler
  const handleToggleStaffPermission = (permKey: string) => {
    if (isRootOwner) {
      toast.warning("Root Protection", "Company Owner maintains unrestricted root privileges (*).");
      return;
    }

    if (!selectedStaff) return;

    const currentPerms = selectedStaff.customPermissions || [];
    let updatedPerms: string[];

    if (currentPerms.includes("*")) {
      // If it previously had wildcard, expand all except this toggled one
      updatedPerms = ALL_PERMISSION_KEYS.filter((p) => p !== permKey);
    } else if (currentPerms.includes(permKey)) {
      updatedPerms = currentPerms.filter((p) => p !== permKey);
    } else {
      updatedPerms = [...currentPerms, permKey];
    }

    const updatedStaff: StaffUserRecord = {
      ...selectedStaff,
      customPermissions: updatedPerms,
    };

    setStaffList(staffList.map((s) => (s.id === updatedStaff.id ? updatedStaff : s)));
  };

  // Quick-apply role template to the selected staff member
  const handleApplyRoleTemplate = (roleId: string) => {
    if (!selectedStaff) return;
    const targetRole = rolesList.find((r) => r.id === roleId);
    if (!targetRole) return;

    const updatedStaff: StaffUserRecord = {
      ...selectedStaff,
      roleId: targetRole.id,
      roleName: targetRole.name,
      customPermissions: targetRole.permissions.includes("*") ? ["*"] : [...targetRole.permissions],
    };

    setStaffList(staffList.map((s) => (s.id === updatedStaff.id ? updatedStaff : s)));
    toast.success(
      "Role Template Applied",
      `Applied "${targetRole.name}" template rights to ${selectedStaff.name}.`
    );
  };

  // Reset staff permissions to current role template defaults
  const handleResetToTemplate = () => {
    if (!selectedStaff || !currentAssignedRole) return;

    const updatedStaff: StaffUserRecord = {
      ...selectedStaff,
      customPermissions: currentAssignedRole.permissions.includes("*")
        ? ["*"]
        : [...currentAssignedRole.permissions],
    };

    setStaffList(staffList.map((s) => (s.id === updatedStaff.id ? updatedStaff : s)));
    toast.info(
      "Permissions Reset",
      `Reset ${selectedStaff.name}'s permissions to "${currentAssignedRole.name}" baseline.`
    );
  };

  // Grant all permissions in a specific category
  const handleToggleCategoryAll = (categoryGroup: string, grant: boolean) => {
    if (isRootOwner) return;
    if (!selectedStaff) return;

    const cat = PERMISSION_CATEGORIES.find((c) => c.group === categoryGroup);
    if (!cat) return;

    const catKeys = cat.permissions.map((p) => p.key);
    const currentPerms = selectedStaff.customPermissions?.includes("*")
      ? [...ALL_PERMISSION_KEYS]
      : [...(selectedStaff.customPermissions || [])];

    let updatedPerms: string[];
    if (grant) {
      // Add all missing keys from this category
      const toAdd = catKeys.filter((k) => !currentPerms.includes(k));
      updatedPerms = [...currentPerms, ...toAdd];
    } else {
      // Remove all keys from this category
      updatedPerms = currentPerms.filter((k) => !catKeys.includes(k));
    }

    const updatedStaff: StaffUserRecord = {
      ...selectedStaff,
      customPermissions: updatedPerms,
    };

    setStaffList(staffList.map((s) => (s.id === updatedStaff.id ? updatedStaff : s)));
  };

  // Save Staff Rights
  const handleSaveStaffRights = () => {
    if (!selectedStaff) return;
    toast.success(
      "Permissions Saved",
      `Active security privileges updated for ${selectedStaff.name} (${selectedStaff.roleName}).`
    );
  };

  // Template Modal: Toggle Template Permission
  const handleToggleTemplatePermission = (permKey: string) => {
    if (selectedTemplateForEdit.id === "role-owner") {
      toast.warning("Root Protection", "Owner template retains root unrestricted wildcard.");
      return;
    }

    const hasPerm =
      selectedTemplateForEdit.permissions.includes(permKey) ||
      selectedTemplateForEdit.permissions.includes("*");

    let updatedPerms: string[];
    if (hasPerm) {
      updatedPerms = selectedTemplateForEdit.permissions.filter((p) => p !== permKey && p !== "*");
    } else {
      updatedPerms = [...selectedTemplateForEdit.permissions, permKey];
    }

    const updatedRole: RbacRole = { ...selectedTemplateForEdit, permissions: updatedPerms };
    setSelectedTemplateForEdit(updatedRole);
    setRolesList(rolesList.map((r) => (r.id === updatedRole.id ? updatedRole : r)));
  };

  // Template Modal: Add New Role Template
  const handleCreateNewRoleTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName.trim()) return;

    const newTemplate: RbacRole = {
      id: `role-${Date.now()}`,
      name: newRoleName.trim(),
      description: newRoleDesc.trim() || "Custom operational role template",
      isSystem: false,
      activeUsersCount: 0,
      scope: newRoleScope,
      permissions: ["chat.view", "tickets.view", "customers.view"],
    };

    const updatedRoles = [...rolesList, newTemplate];
    setRolesList(updatedRoles);
    setSelectedTemplateForEdit(newTemplate);
    setIsCreateRoleModalOpen(false);
    setNewRoleName("");
    setNewRoleDesc("");
    toast.success("Role Template Created", `New template "${newTemplate.name}" is now ready for quick-assign.`);
  };

  return (
    <div className="flex flex-col h-full w-full overflow-hidden bg-background">
      {/* TOP BAR: Title, Stats, and "Manage Role Templates" Modal Trigger */}
      <div className="flex items-center justify-between px-6 py-3.5 border-b border-border bg-card/60 backdrop-blur-xs shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-2xs">
            <UserCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading font-bold text-base text-foreground tracking-tight">
                Staff Rights & Access Control (RBAC)
              </h1>
              <Badge variant="outline" className="text-[11px] font-mono py-0 px-2 bg-muted/40">
                {staffList.length} Active Staff
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Directly assign and fine-tune operational permissions per staff member, or quick-apply role templates.
            </p>
          </div>
        </div>

        {/* Action: Open Role Templates Modal */}
        <div className="flex items-center gap-2">
          <Button
            onClick={() => {
              setSelectedTemplateForEdit(rolesList[0] || DEFAULT_ROLE);
              setIsTemplateModalOpen(true);
            }}
            variant="outline"
            className="h-9 px-3.5 gap-2 border-primary/30 hover:border-primary/60 hover:bg-primary/5 text-primary text-xs font-medium rounded-xl shadow-2xs cursor-pointer"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span>Manage Role Templates ({rolesList.length})</span>
          </Button>

          <Button
            onClick={handleSaveStaffRights}
            className="h-9 px-4 gap-1.5 text-xs font-medium rounded-xl shadow-sm cursor-pointer"
          >
            <Save className="h-4 w-4" />
            <span>Save Staff Rights</span>
          </Button>
        </div>
      </div>

      {/* MAIN TWO-COLUMN WORKSPACE */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT COLUMN: STAFF DIRECTORY LIST */}
        <div className="w-80 md:w-96 h-full border-r border-border bg-card flex flex-col shrink-0">
          {/* Search & Filter Bar */}
          <div className="p-3 border-b border-border space-y-2 bg-muted/10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                value={staffSearchQuery}
                onChange={(e) => setStaffSearchQuery(e.target.value)}
                placeholder="Search staff by name, email, or role..."
                className="w-full pl-8.5 pr-3 py-1.5 text-xs rounded-lg bg-background border border-border focus:outline-none focus:ring-1 focus:ring-primary text-foreground placeholder:text-muted-foreground"
              />
              {staffSearchQuery && (
                <button
                  onClick={() => setStaffSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Department Filter Pills */}
            <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar pb-1 text-[10.5px]">
              <button
                onClick={() => setSelectedDepartmentFilter("all")}
                className={cn(
                  "px-2 py-0.5 rounded-md font-medium whitespace-nowrap transition-colors cursor-pointer",
                  selectedDepartmentFilter === "all"
                    ? "bg-primary text-primary-foreground font-bold"
                    : "bg-muted/40 text-muted-foreground hover:bg-muted"
                )}
              >
                All ({staffList.length})
              </button>
              {departments.map((dept) => {
                const count = staffList.filter((s) => s.department === dept).length;
                const isSelected = selectedDepartmentFilter === dept;
                // Short name for pills
                const shortDept = dept.split("&")[0].split("(")[0].trim();
                return (
                  <button
                    key={dept}
                    onClick={() => setSelectedDepartmentFilter(dept)}
                    className={cn(
                      "px-2 py-0.5 rounded-md font-medium whitespace-nowrap transition-colors cursor-pointer",
                      isSelected
                        ? "bg-primary text-primary-foreground font-bold"
                        : "bg-muted/40 text-muted-foreground hover:bg-muted"
                    )}
                  >
                    {shortDept} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Staff List Cards */}
          <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5 custom-scrollbar">
            {filteredStaff.length === 0 ? (
              <div className="text-center py-12 px-4 space-y-2">
                <Users className="h-8 w-8 text-muted-foreground/40 mx-auto" />
                <p className="text-xs font-semibold text-muted-foreground">No staff members found</p>
                <p className="text-[11px] text-muted-foreground/70">
                  Try adjusting your search query or department filter.
                </p>
              </div>
            ) : (
              filteredStaff.map((staff) => {
                const isSelected = selectedStaff?.id === staff.id;
                const isOwner = staff.roleId === "role-owner";
                const staffPerms = staff.customPermissions || [];
                const activePermsCount = staffPerms.includes("*")
                  ? ALL_PERMISSION_KEYS.length
                  : staffPerms.length;

                // Status dot color
                const statusColors: Record<string, string> = {
                  online: "bg-emerald-500",
                  shift: "bg-blue-500",
                  field: "bg-amber-500",
                  off_duty: "bg-slate-400",
                  on_leave: "bg-rose-400",
                };

                return (
                  <button
                    key={staff.id}
                    onClick={() => setSelectedStaffId(staff.id)}
                    className={cn(
                      "w-full text-left p-3 rounded-xl border transition-all cursor-pointer relative group",
                      isSelected
                        ? "bg-primary/10 border-primary/50 shadow-sm"
                        : "bg-card hover:bg-muted/40 border-border/70"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        {/* Avatar / Status */}
                        <div className="relative shrink-0">
                          <div
                            className={cn(
                              "h-9 w-9 rounded-full flex items-center justify-center font-bold text-xs",
                              isSelected
                                ? "bg-primary text-primary-foreground shadow-2xs"
                                : "bg-muted text-muted-foreground"
                            )}
                          >
                            {staff.name
                              .split(" ")
                              .map((n) => n[0])
                              .slice(0, 2)
                              .join("")}
                          </div>
                          <span
                            className={cn(
                              "absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full ring-2 ring-card",
                              statusColors[staff.status] || "bg-emerald-500"
                            )}
                            title={`Status: ${staff.status}`}
                          />
                        </div>

                        {/* Name and Designation */}
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-heading font-bold text-xs text-foreground truncate">
                              {staff.name}
                            </span>
                            {isOwner && (
                              <Badge variant="secondary" className="text-[9px] py-0 px-1 font-mono font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20">
                                ROOT
                              </Badge>
                            )}
                          </div>
                          <p className="text-[11px] text-muted-foreground truncate leading-tight">
                            {staff.designation}
                          </p>
                        </div>
                      </div>

                      <ChevronRight
                        className={cn(
                          "h-4 w-4 shrink-0 transition-transform",
                          isSelected ? "text-primary translate-x-0.5" : "text-muted-foreground/40 group-hover:text-muted-foreground"
                        )}
                      />
                    </div>

                    {/* Role Badge and Rights Count */}
                    <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-border/50 text-[10.5px]">
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[10px] py-0 px-1.5 font-medium truncate max-w-[170px]",
                          isOwner ? "border-amber-500/30 text-amber-600 dark:text-amber-400" : "bg-muted/40"
                        )}
                      >
                        {staff.roleName}
                      </Badge>
                      <span className="font-mono text-[10px] text-muted-foreground flex items-center gap-1">
                        <Key className="h-3 w-3 text-primary/70" />
                        {isOwner ? "All (Wildcard)" : `${activePermsCount} rights`}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: SELECTED STAFF RIGHTS & PERMISSION MATRIX */}
        <div className="flex-1 h-full bg-card/40 flex flex-col overflow-hidden">
          {selectedStaff ? (
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              {/* STAFF HEADER & QUICK-ASSIGN TEMPLATE BAR */}
              <div className="p-5 border-b border-border bg-card space-y-4 shrink-0 shadow-2xs">
                {/* Staff Details & Basic Info */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-sm text-primary shadow-sm">
                      {selectedStaff.name
                        .split(" ")
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("")}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="font-heading font-bold text-lg text-foreground tracking-tight">
                          {selectedStaff.name}
                        </h2>
                        <Badge variant="outline" className="text-xs font-normal">
                          {selectedStaff.department}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" /> {selectedStaff.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Building2 className="h-3 w-3" /> {selectedStaff.branchName}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Override Status Indicator */}
                  <div className="flex items-center gap-2">
                    {hasCustomOverrides ? (
                      <Badge variant="secondary" className="bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30 gap-1 py-1 px-2.5 text-xs font-semibold">
                        <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                        Custom Staff Overrides Active
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 gap-1 py-1 px-2.5 text-xs font-semibold">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                        Standard Template Presets
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Quick-Assign Template Selector Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-muted/30 border border-border">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <Layers className="h-3.5 w-3.5 text-primary" />
                      Assigned Role Template:
                    </span>
                    <select
                      value={selectedStaff.roleId}
                      onChange={(e) => handleApplyRoleTemplate(e.target.value)}
                      disabled={isRootOwner}
                      className="bg-card border border-border text-foreground text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary font-medium cursor-pointer shadow-2xs"
                    >
                      {rolesList.map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.name} {role.isSystem ? "(System)" : "(Custom)"}
                        </option>
                      ))}
                    </select>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleResetToTemplate}
                      disabled={!hasCustomOverrides || isRootOwner}
                      className="h-8 text-xs text-muted-foreground hover:text-foreground gap-1 px-2"
                      title="Reset all toggled permissions to match the assigned role template"
                    >
                      <RotateCcw className="h-3 w-3" />
                      Reset to Template
                    </Button>
                  </div>

                  {/* Quick Summary of Active Rights */}
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-muted-foreground font-mono">
                      Active Privileges:{" "}
                      <strong className="text-foreground">
                        {isRootOwner
                          ? "Root (All Wildcard)"
                          : `${selectedStaff.customPermissions?.length || 0} of ${ALL_PERMISSION_KEYS.length}`}
                      </strong>
                    </span>
                  </div>
                </div>

                {/* Root Warning if Owner */}
                {isRootOwner && (
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-300">
                    <Lock className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                    <span>
                      <strong>Root Protection Active:</strong> The Company Owner has permanent wildcard root
                      permissions (<code className="font-mono font-bold">*</code>). Rights cannot be revoked from this account.
                    </span>
                  </div>
                )}
              </div>

              {/* GRANULAR PERMISSION CATEGORIES GRID */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
                {PERMISSION_CATEGORIES.map((cat) => {
                  const catKeys = cat.permissions.map((p) => p.key);
                  const activeInCat = isRootOwner
                    ? catKeys.length
                    : catKeys.filter((k) => selectedStaff.customPermissions?.includes(k) || selectedStaff.customPermissions?.includes("*")).length;
                  const allActive = activeInCat === catKeys.length;

                  return (
                    <div
                      key={cat.group}
                      className="p-4 rounded-xl bg-card border border-border shadow-2xs space-y-3"
                    >
                      {/* Category Header */}
                      <div className="flex items-center justify-between pb-2 border-b border-border/60">
                        <div>
                          <h3 className="font-heading font-bold text-xs text-foreground tracking-wide">
                            {cat.group}
                          </h3>
                          <p className="text-[11px] text-muted-foreground">{cat.description}</p>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-mono text-muted-foreground">
                            {activeInCat}/{catKeys.length} active
                          </span>

                          {!isRootOwner && (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleToggleCategoryAll(cat.group, !allActive)}
                                className="text-[11px] font-medium text-primary hover:underline px-1.5 py-0.5 rounded cursor-pointer"
                              >
                                {allActive ? "Clear" : "Grant All"}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Permissions Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                        {cat.permissions.map((perm) => {
                          const isChecked =
                            isRootOwner ||
                            selectedStaff.customPermissions?.includes(perm.key) ||
                            selectedStaff.customPermissions?.includes("*");

                          return (
                            <div
                              key={perm.key}
                              onClick={() => !isRootOwner && handleToggleStaffPermission(perm.key)}
                              className={cn(
                                "flex items-start gap-2.5 p-2.5 rounded-lg border transition-all select-none",
                                isRootOwner ? "cursor-not-allowed opacity-90" : "cursor-pointer",
                                isChecked
                                  ? "bg-primary/10 border-primary/40 text-foreground font-medium"
                                  : "bg-muted/20 border-border/70 text-muted-foreground hover:bg-muted/40"
                              )}
                            >
                              <input
                                type="checkbox"
                                checked={!!isChecked}
                                disabled={isRootOwner}
                                readOnly
                                className="mt-0.5 rounded border-border text-primary focus:ring-primary h-4 w-4 shrink-0 pointer-events-none"
                              />
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-1">
                                  <span className={cn("text-xs leading-tight", isChecked ? "text-foreground font-bold" : "text-muted-foreground")}>
                                    {perm.label}
                                  </span>
                                  <code className="text-[9px] font-mono text-muted-foreground px-1 py-0.2 bg-muted rounded shrink-0">
                                    {perm.key}
                                  </code>
                                </div>
                                <p className="text-[10.5px] text-muted-foreground mt-0.5 leading-tight">
                                  {perm.description}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center p-8">
              <p className="text-sm text-muted-foreground">Select a staff member from the left list to inspect and edit rights.</p>
            </div>
          )}
        </div>
      </div>

      {/* POP-UP MODAL: ROLE TEMPLATES (QUICK-ASSIGN PRESETS) */}
      {isTemplateModalOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-5xl h-[85vh] bg-card rounded-2xl border border-border shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/20 shrink-0">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <SlidersHorizontal className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-foreground">
                    RBAC Role Templates (Quick-Assign Presets)
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Define baseline permissions for operational roles so you can quickly apply them to staff members.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={() => setIsCreateRoleModalOpen(true)}
                  className="h-8 text-xs gap-1 cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Create New Template</span>
                </Button>
                <button
                  onClick={() => setIsTemplateModalOpen(false)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Modal Body: Left = Template List, Right = Template Permission Matrix */}
            <div className="flex-1 flex overflow-hidden">
              {/* Template List (Left) */}
              <div className="w-72 border-r border-border bg-muted/10 p-3 space-y-1.5 overflow-y-auto custom-scrollbar shrink-0">
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider px-1">
                  Configured Presets ({rolesList.length})
                </span>
                {rolesList.map((role) => {
                  const isSelected = selectedTemplateForEdit.id === role.id;
                  return (
                    <button
                      key={role.id}
                      onClick={() => setSelectedTemplateForEdit(role)}
                      className={cn(
                        "w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer",
                        isSelected
                          ? "bg-primary/10 border-primary/50 shadow-2xs"
                          : "bg-card border-border/70 hover:bg-muted/40"
                      )}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-heading font-bold text-xs text-foreground truncate">
                          {role.name}
                        </span>
                        {role.isSystem && (
                          <Badge variant="secondary" className="text-[9px] py-0 px-1 font-mono">
                            System
                          </Badge>
                        )}
                      </div>
                      <p className="text-[10.5px] text-muted-foreground line-clamp-2 leading-tight">
                        {role.description}
                      </p>
                      <div className="flex items-center justify-between text-[9.5px] text-muted-foreground pt-1 mt-1 border-t border-border/50 font-mono">
                        <span>{role.permissions.includes("*") ? "All Wildcard" : `${role.permissions.length} rights`}</span>
                        <span className="text-primary font-medium">
                          {role.scope === "company_wide" ? "Company" : "Branch"}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Template Editor (Right) */}
              <div className="flex-1 h-full bg-card p-5 space-y-4 overflow-y-auto custom-scrollbar">
                {/* Template Info Card */}
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-heading font-bold text-base text-foreground">
                        {selectedTemplateForEdit.name}
                      </h4>
                      <Badge variant={selectedTemplateForEdit.scope === "company_wide" ? "info" : "secondary"}>
                        {selectedTemplateForEdit.scope === "company_wide" ? "Company-Wide Scope" : "Branch Scoped"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {selectedTemplateForEdit.description}
                    </p>
                  </div>
                </div>

                {/* Permission Checkboxes for Selected Template */}
                <div className="space-y-4">
                  {PERMISSION_CATEGORIES.map((cat) => (
                    <div key={cat.group} className="space-y-2 p-3.5 rounded-xl bg-muted/20 border border-border">
                      <h5 className="font-heading font-bold text-xs text-foreground uppercase tracking-wider">
                        {cat.group}
                      </h5>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                        {cat.permissions.map((p) => {
                          const isChecked =
                            selectedTemplateForEdit.permissions.includes(p.key) ||
                            selectedTemplateForEdit.permissions.includes("*");

                          return (
                            <div
                              key={p.key}
                              onClick={() => handleToggleTemplatePermission(p.key)}
                              className={cn(
                                "flex items-center gap-2.5 p-2 rounded-lg border transition-all cursor-pointer select-none",
                                isChecked
                                  ? "bg-primary/10 border-primary/40 text-foreground font-medium"
                                  : "bg-card border-border text-muted-foreground hover:bg-muted/40"
                              )}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                readOnly
                                className="rounded border-border text-primary focus:ring-primary h-3.5 w-3.5 pointer-events-none"
                              />
                              <span className="text-xs leading-tight">{p.label}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-2 px-6 py-3 border-t border-border bg-muted/20 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsTemplateModalOpen(false)}
                className="cursor-pointer"
              >
                Close Template Manager
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* SUB-MODAL: CREATE NEW ROLE TEMPLATE */}
      {isCreateRoleModalOpen && (
        <div className="fixed inset-0 z-60 bg-background/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-card rounded-2xl border border-border shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="font-heading font-bold text-base text-foreground">
                Create Custom Role Template
              </h3>
              <button
                onClick={() => setIsCreateRoleModalOpen(false)}
                className="text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCreateNewRoleTemplate} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-foreground mb-1">Template Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Billing Auditor"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  className="w-full bg-muted/30 rounded-lg p-2.5 border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block font-bold text-foreground mb-1">Operational Scope</label>
                <select
                  value={newRoleScope}
                  onChange={(e) => setNewRoleScope(e.target.value as "company_wide" | "branch_only")}
                  className="w-full bg-muted/30 rounded-lg p-2.5 border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="branch_only">Assigned Branch Only (Restricted)</option>
                  <option value="company_wide">Company-Wide (All Branches)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-foreground mb-1">Role Description</label>
                <textarea
                  required
                  placeholder="Describe duties, responsibilities, and operational scope..."
                  value={newRoleDesc}
                  onChange={(e) => setNewRoleDesc(e.target.value)}
                  className="w-full bg-muted/30 rounded-lg p-2.5 border border-border text-foreground h-20 focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsCreateRoleModalOpen(false)}
                  className="cursor-pointer"
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="flex-1 cursor-pointer">
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Create Template Preset
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
