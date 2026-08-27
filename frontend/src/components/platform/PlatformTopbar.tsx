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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Tooltip } from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/toast";

export function PlatformTopbar() {
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
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-border bg-card/90 backdrop-blur-md px-4 md:px-6 transition-colors">
      {/* 1. Left: Environment & Back to Gateway */}
      <div className="flex items-center gap-3">
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
        <div className="relative flex items-center w-full group">
          <Search className="absolute left-3 h-3.5 w-3.5 text-muted-foreground group-focus-within:text-primary transition-colors pointer-events-none" />
          <input
            type="text"
            placeholder="Search tenants, databases, server nodes... (Ctrl+K)"
            className="h-9 w-full rounded-lg border border-input bg-card-subtle pl-9 pr-12 text-xs text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all"
          />
          <div className="absolute right-2.5 flex items-center gap-0.5 rounded border border-border bg-card px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
            <Command className="h-2.5 w-2.5" />
            <span>K</span>
          </div>
        </div>
      </div>

      {/* 3. Right: Cluster SLA Pill, Theme Toggle, Profile */}
      <div className="flex items-center gap-3 shrink-0">
        <Tooltip content="Global Platform Uptime SLA across all ISP Tenant Shards">
          <Badge variant="success" hasPulse className="text-[10px] font-mono cursor-help">
            🟢 99.99% SLA
          </Badge>
        </Tooltip>

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
