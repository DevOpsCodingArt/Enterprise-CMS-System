"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Command,
  Sun,
  Moon,
  ArrowLeft,
  Server,
  ShieldCheck,
  Zap,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Tooltip } from "@/components/ui/tooltip";
import { SmartSearchInput } from "@/components/ui/shared/SmartSearchInput";
import { useToast } from "@/components/ui/toast";

export function PlatformTopbar({
  isSidebarCollapsed,
  onToggleSidebar,
}: {
  isSidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
} = {}) {
  const isDarkMode = React.useSyncExternalStore(
    (callback) => {
      window.addEventListener("theme-change", callback);
      return () => window.removeEventListener("theme-change", callback);
    },
    () => typeof document !== "undefined" && document.documentElement.classList.contains("dark"),
    () => false
  );

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    window.dispatchEvent(new Event("theme-change"));
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-border bg-card/90 backdrop-blur-md px-3 md:px-6 transition-colors">
      {/* 1. Left: Sidebar Toggle + Environment & Back to Gateway */}
      <div className="flex items-center gap-2.5">
        {onToggleSidebar && (
          <Tooltip content={isSidebarCollapsed ? "Expand Sidebar (Ctrl+B)" : "Collapse Sidebar (Ctrl+B)"} position="bottom">
            <button
              onClick={onToggleSidebar}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground hover:bg-card-subtle hover:text-foreground transition-all cursor-pointer border border-transparent hover:border-border"
              aria-label="Toggle Sidebar"
            >
              {isSidebarCollapsed ? (
                <PanelLeftOpen className="h-4.5 w-4.5 text-primary" />
              ) : (
                <PanelLeftClose className="h-4.5 w-4.5" />
              )}
            </button>
          </Tooltip>
        )}

        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mr-1"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Gateway</span>
        </Link>

        <div className="flex items-center gap-2 rounded-lg bg-card-subtle px-2.5 py-1.5 border border-border">
          <Server className="h-3.5 w-3.5 text-primary shrink-0" />
          <span className="font-mono text-xs font-bold text-foreground">
            PROD-CLUSTER-01
          </span>
          <Badge variant="success" className="text-[9px] py-0 px-1 font-mono hidden sm:inline-flex">
            PRIMARY SHARD
          </Badge>
        </div>
      </div>

      {/* 2. Center: Global Search Bar */}
      <div className="hidden md:flex items-center max-w-sm w-full mx-4">
        <SmartSearchInput
          value=""
          onChange={() => {}}
          placeholder="Search tenants, databases, server nodes... (Ctrl+K)"
          size="sm"
        />
      </div>

      {/* 3. Right: Cluster SLA Pill, Theme Toggle, Profile */}
      <div className="flex items-center gap-3 shrink-0">
        <Tooltip content="Global Platform Uptime SLA across all ISP Tenant Shards" position="bottom">
          <Badge variant="success" hasPulse className="text-[10px] font-mono cursor-help">
            🟢 99.99% SLA
          </Badge>
        </Tooltip>

        <Tooltip content={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"} position="bottom">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleTheme}
            className="h-8 px-2.5 font-mono text-xs shadow-xs"
          >
            {isDarkMode ? (
              <Sun className="h-3.5 w-3.5 text-warning" />
            ) : (
              <Moon className="h-3.5 w-3.5 text-primary" />
            )}
          </Button>
        </Tooltip>

        <div className="flex items-center gap-2 border-l border-border pl-3">
          <Avatar name="Platform Super Admin" presence="online" size="sm" />
          <div className="hidden lg:flex flex-col">
            <span className="text-xs font-bold text-foreground leading-tight">
              Root Admin
            </span>
            <span className="font-mono text-[9px] text-muted-foreground uppercase">
              Super-Admin
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
