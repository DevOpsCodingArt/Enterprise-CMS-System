"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Tooltip } from "@/components/ui/tooltip";
import { SmartSearchInput } from "@/components/ui/shared/SmartSearchInput";
import { useAuthStore } from "@/stores/useAuthStore";
import { DEMO_USERS, DemoUserCredential, getRoleDisplayName } from "@/config/role-routing";
import { mockDb } from "@/mock/db";
import { useToast } from "@/components/ui/toast";

import { useTheme } from "@/hooks/useTheme";

export function PlatformTopbar({
  isSidebarCollapsed,
  onToggleSidebar,
}: {
  isSidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
} = {}) {
  const router = useRouter();
  const toast = useToast();
  const { user, setAuth, logout } = useAuthStore();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { isDark: isDarkMode, toggleTheme } = useTheme();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSwitchPersona = (persona: DemoUserCredential) => {
    const userProfile = mockDb.users[persona.role as keyof typeof mockDb.users] || mockDb.users.company_owner;
    setAuth(userProfile, mockDb.tenantCompany, "mock-jwt-token-prime-one", "mock-jwt-refresh-token");
    document.cookie = `prime_access_token=mock-jwt-token-prime-one; path=/; max-age=86400; SameSite=Lax`;
    setIsProfileMenuOpen(false);
    toast.success("Switched Persona", `Active as ${persona.name} (${persona.badgeLabel})`);
    router.push(persona.homeRoute);
  };

  const handleLogout = () => {
    logout();
    document.cookie = "prime_access_token=; path=/; max-age=0;";
    setIsProfileMenuOpen(false);
    toast.info("Logged Out", "Signed out of Platform Master Console.");
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-border bg-card/90 backdrop-blur-md px-3 md:px-6 transition-colors">
      {/* 1. Left: Environment & Back to Gateway */}
      <div className="flex items-center gap-2.5">
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

      {/* 3. Right: Cluster SLA Pill, Theme Toggle, Profile Menu */}
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
            className="h-8 px-2.5 font-mono text-xs shadow-xs cursor-pointer"
          >
            {isDarkMode ? (
              <Sun className="h-3.5 w-3.5 text-warning" />
            ) : (
              <Moon className="h-3.5 w-3.5 text-primary" />
            )}
          </Button>
        </Tooltip>

        {/* Profile Dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center gap-2 border-l border-border pl-3 hover:opacity-80 transition-opacity cursor-pointer select-none text-left"
          >
            <Avatar name={user?.name || "Platform Super Admin"} presence="online" size="sm" />
            <div className="hidden lg:flex flex-col">
              <span className="text-xs font-bold text-foreground leading-tight">
                {user?.name || "Root Admin"}
              </span>
              <span className="font-mono text-[9px] text-muted-foreground uppercase">
                {getRoleDisplayName(user?.role) || "Super-Admin"}
              </span>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground hidden sm:block ml-0.5" />
          </button>

          {/* Profile & Switcher Dropdown */}
          {isProfileMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-72 bg-card border border-border rounded-xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 space-y-2">
              <div className="p-2.5 rounded-lg bg-muted/40 border border-border/60 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground truncate">{user?.name || "Root Admin"}</span>
                  <Badge variant="destructive" className="text-[9px] py-0 px-1 font-mono">
                    SUPER-ADMIN
                  </Badge>
                </div>
                <span className="font-mono text-[10px] text-muted-foreground block truncate">
                  {user?.email || "admin@primeone.io"}
                </span>
              </div>

              {/* Fast Persona Switcher */}
              <div className="space-y-1">
                <div className="px-2 py-1 text-[9.5px] font-mono font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <Zap className="h-3 w-3 text-warning" /> Switch Persona (Demo Mode)
                </div>
                <div className="max-h-48 overflow-y-auto custom-scrollbar space-y-0.5">
                  {DEMO_USERS.map((persona) => {
                    const isActive = user?.role?.toLowerCase() === persona.role.toLowerCase();
                    return (
                      <button
                        key={persona.email}
                        type="button"
                        onClick={() => handleSwitchPersona(persona)}
                        className={`w-full px-2 py-1.5 rounded-lg text-left text-xs transition-colors flex items-center justify-between cursor-pointer ${
                          isActive
                            ? "bg-primary/15 text-primary font-bold"
                            : "text-foreground hover:bg-muted"
                        }`}
                      >
                        <div className="flex flex-col min-w-0">
                          <span className="truncate">{persona.name}</span>
                          <span className="font-mono text-[9px] text-muted-foreground truncate">{persona.badgeLabel}</span>
                        </div>
                        {isActive && <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-1 border-t border-border space-y-1">
                <Link
                  href="/"
                  onClick={() => setIsProfileMenuOpen(false)}
                  className="w-full px-2 py-1.5 rounded-lg text-xs text-foreground hover:bg-muted transition-colors flex items-center justify-between cursor-pointer"
                >
                  <span>Universal Landing Page</span>
                  <ExternalLink className="h-3 w-3 text-muted-foreground" />
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full px-2 py-1.5 rounded-lg text-xs text-destructive hover:bg-destructive/10 transition-colors flex items-center justify-between cursor-pointer font-medium"
                >
                  <span>Sign Out</span>
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
