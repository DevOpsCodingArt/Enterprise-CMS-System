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

  // Synchronize with documentElement dark class
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
    { label: "🏢 All 20 Branches (Consolidated)", value: "all" },
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
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-border bg-card/90 backdrop-blur-xs px-4 md:px-6">
      {/* Left: Tenant Branding & Branch Selector */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-primary shrink-0" />
          <span className="font-heading font-extrabold text-sm text-foreground tracking-tight hidden sm:inline">
            {company?.name || "Prime Networks"}
          </span>
        </div>

        <span className="text-border-subtle hidden sm:inline">|</span>

        {/* Branch Selector */}
        <DropdownMenu
          items={branchOptions}
          value={selectedBranchId || "all"}
          onSelect={(val) => {
            selectBranch(val === "all" ? null : val);
            const branchName = val === "all" ? "All Branches" : branches.find((b) => b.id === val)?.name;
            toast.info("Branch Switched", `Active scope filtered to: ${branchName}`);
          }}
          className="w-56 md:w-64"
        />
      </div>

      {/* Center: Global Search Bar */}
      <div className="hidden lg:flex items-center max-w-xs w-full">
        <div className="relative flex items-center w-full">
          <Search className="absolute left-3 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Quick search subscriber, ONU, ticket... (Ctrl+K)"
            className="h-9 w-full rounded-md border border-input bg-card-subtle pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>
      </div>

      {/* Right: Telemetry Status, Notifications, Theme & Profile */}
      <div className="flex items-center gap-2.5">
        {/* Real-time Connection Status Badge */}
        <Tooltip content={isDegraded ? "Real-time socket offline. Operating in resilient REST polling mode." : "WebSocket connected to live telemetry gateway."}>
          <Badge
            variant={isDegraded ? "warning" : "success"}
            hasPulse
            className="text-[10px] py-1 px-2.5 cursor-help"
          >
            {isDegraded ? "🟡 DEGRADED" : "🟢 LIVE WS"}
          </Badge>
        </Tooltip>

        {/* Notifications Tray */}
        <Tooltip content="Recent Operational Alerts">
          <button
            onClick={() => toast.info("NOC Radar Alert", "All 20 branch gateways are operating normally.")}
            className="relative rounded-md p-2 text-muted-foreground hover:bg-card-subtle hover:text-foreground transition-colors cursor-pointer"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1 right-1 flex h-2 w-2 rounded-full bg-primary" />
          </button>
        </Tooltip>

        {/* Theme Toggle (Light / Dark Mode) */}
        <Tooltip content={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleTheme}
            className="gap-1.5 font-mono text-xs h-9 px-3"
          >
            {isDarkMode ? <Sun className="h-3.5 w-3.5 text-warning" /> : <Moon className="h-3.5 w-3.5 text-primary" />}
            <span className="hidden md:inline">{isDarkMode ? "Light" : "Dark"}</span>
          </Button>
        </Tooltip>

        {/* Role Switcher Dropdown */}
        <DropdownMenu
          items={roleOptions}
          value={user?.role}
          onSelect={(val) => {
            switchDemoRole(val as UserRole);
            toast.info("Persona Switched", `Switched to ${val.replace(/_/g, " ").toUpperCase()}`);
          }}
          className="w-44 hidden md:inline-block"
        />

        {/* User Avatar */}
        <Avatar name={user?.name || "Admin"} presence="online" size="md" />
      </div>
    </header>
  );
}
