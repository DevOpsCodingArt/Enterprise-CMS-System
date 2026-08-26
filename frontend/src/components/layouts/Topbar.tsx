"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Building2,
  Bell,
  Sun,
  Moon,
  Shield,
  Activity,
  CheckCircle2,
  Command,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { Avatar } from "@/components/ui/avatar";
import { Tooltip } from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/toast";
import { useAuthStore } from "@/stores/useAuthStore";
import { useTenantStore } from "@/stores/useTenantStore";
import { useSocketStore } from "@/stores/useSocketStore";
import type { UserRole } from "@/types/auth.types";

export function Topbar() {
  const toast = useToast();
  const { user, company, switchDemoRole } = useAuthStore();
  const { branches, selectedBranchId, selectBranch } = useTenantStore();
  const { isDegraded } = useSocketStore();

  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setIsDarkMode(isDark);
  }, []);

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.toggle("dark");
    setIsDarkMode(isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  };

  const branchOptions = [
    { label: "🏢 All 20 Branch Offices", value: "all" },
    ...branches.map((b) => ({
      label: `📍 ${b.name} (${b.code})`,
      value: b.id,
      description: `${b.totalStaff} Staff • ${b.slaCompliancePercent}% SLA`,
    })),
  ];

  const roleOptions: { label: string; value: UserRole }[] = [
    { label: "👑 Platform Super-Admin", value: "platform_owner" },
    { label: "🏢 Company Owner (CEO)", value: "company_owner" },
    { label: "📍 Branch Manager", value: "branch_manager" },
    { label: "📡 NOC Engineer Lead", value: "noc_engineer" },
    { label: "💬 Helpdesk CSR Agent", value: "helpdesk_agent" },
    { label: "👷 Field Fiber Splicer", value: "field_engineer" },
  ];

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-border bg-card/90 backdrop-blur-md px-4 md:px-6 transition-colors">
      {/* 1. Left: Tenant Branding & Branch Selector */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex items-center gap-2 rounded-lg bg-card-subtle px-2.5 py-1.5 border border-border">
          <Building2 className="h-4 w-4 text-primary shrink-0" />
          <span className="font-heading font-bold text-xs text-foreground tracking-tight truncate max-w-[140px] sm:max-w-[200px]">
            {company?.name || "Prime Networks"}
          </span>
          <Badge variant="success" className="text-[9px] py-0 px-1.5 uppercase font-mono hidden sm:inline-flex">
            PRO
          </Badge>
        </div>

        {/* Branch Filter Dropdown */}
        <DropdownMenu
          items={branchOptions}
          value={selectedBranchId || "all"}
          onSelect={(val) => {
            selectBranch(val === "all" ? null : val);
            const branchName =
              val === "all" ? "All Branches" : branches.find((b) => b.id === val)?.name;
            toast.info("Branch Filter", `Active view set to: ${branchName}`);
          }}
          className="w-48 sm:w-56"
        />
      </div>

      {/* 2. Center: Global Search Bar */}
      <div className="hidden md:flex items-center max-w-sm w-full mx-4">
        <div className="relative flex items-center w-full group">
          <Search className="absolute left-3 h-3.5 w-3.5 text-muted-foreground group-focus-within:text-primary transition-colors pointer-events-none" />
          <input
            type="text"
            placeholder="Search subscribers, OLT, tickets... (Ctrl+K)"
            className="h-9 w-full rounded-lg border border-input bg-card-subtle pl-9 pr-12 text-xs text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all"
          />
          <div className="absolute right-2.5 flex items-center gap-0.5 rounded border border-border bg-card px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
            <Command className="h-2.5 w-2.5" />
            <span>K</span>
          </div>
        </div>
      </div>

      {/* 3. Right: Live Radar, Theme Toggle, Persona Switcher & Profile */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Live Radar Connection Badge */}
        <Tooltip content={isDegraded ? "Real-time socket offline (REST polling active)" : "Live WebSocket connected (0ms telemetry lag)"}>
          <Badge
            variant={isDegraded ? "warning" : "success"}
            hasPulse
            className="text-[10px] py-1 px-2.5 font-mono font-bold cursor-help border shadow-xs"
          >
            {isDegraded ? "🟡 DEGRADED" : "🟢 LIVE RADAR"}
          </Badge>
        </Tooltip>

        {/* Notifications Tray */}
        <Tooltip content="NOC Incident Alerts">
          <button
            onClick={() => toast.info("NOC Telemetry", "All 20 branch core routers operating normally.")}
            className="relative rounded-lg p-2 text-muted-foreground hover:bg-card-subtle hover:text-foreground transition-colors cursor-pointer border border-transparent hover:border-border"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 flex h-2 w-2 rounded-full bg-primary ring-2 ring-card" />
          </button>
        </Tooltip>

        {/* Theme Switcher (Light / Dark) */}
        <Tooltip content={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleTheme}
            className="h-9 px-3 gap-1.5 font-mono text-xs shadow-xs"
          >
            {isDarkMode ? (
              <Sun className="h-3.5 w-3.5 text-warning transition-transform hover:rotate-45" />
            ) : (
              <Moon className="h-3.5 w-3.5 text-primary transition-transform hover:-rotate-12" />
            )}
            <span className="hidden lg:inline">{isDarkMode ? "Light" : "Dark"}</span>
          </Button>
        </Tooltip>

        {/* Persona Switcher Dropdown */}
        <DropdownMenu
          items={roleOptions}
          value={user?.role}
          onSelect={(val) => {
            switchDemoRole(val as UserRole);
            toast.info("Switched Role", `Active persona: ${val.replace(/_/g, " ").toUpperCase()}`);
          }}
          className="w-44 hidden xl:inline-block"
        />

        {/* User Profile Avatar */}
        <Avatar name={user?.name || "Admin"} presence="online" size="md" />
      </div>
    </header>
  );
}
