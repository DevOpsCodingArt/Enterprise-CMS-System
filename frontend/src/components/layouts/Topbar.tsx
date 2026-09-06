"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search,
  Bell,
  Sun,
  Moon,
  Shield,
  Command,
  LogOut,
  ChevronDown,
  User,
  Zap,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Tooltip } from "@/components/ui/tooltip";
import { SmartSearchInput } from "@/components/ui/shared/SmartSearchInput";
import { useAuthStore } from "@/stores/useAuthStore";
import { NotificationDrawer } from "@/components/notifications/NotificationDrawer";
import { DEMO_USERS, DemoUserCredential, getRoleHomeRoute, getRoleDisplayName } from "@/config/role-routing";
import { mockDb } from "@/mock/db";
import { useToast } from "@/components/ui/toast";

import { useTheme } from "@/hooks/useTheme";

export function Topbar({
  onOpenNotificationCenter,
}: {
  onOpenNotificationCenter?: () => void;
  isSidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
}) {
  const router = useRouter();
  const toast = useToast();
  const { user, company, setAuth, logout } = useAuthStore();
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { isDark: isDarkMode, toggleTheme } = useTheme();

  // Close profile menu when clicking outside
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
    const mockJwt = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(
      JSON.stringify({
        id: userProfile.id,
        email: persona.email,
        role: persona.role,
        role_code: persona.role,
        permissions: userProfile.permissions || ["*"],
        exp: Math.floor(Date.now() / 1000) + 86400,
      })
    )}.mock-signature`;
    setAuth(userProfile, mockDb.tenantCompany, mockJwt, "mock-jwt-refresh-token");
    document.cookie = `prime_access_token=${mockJwt}; path=/; max-age=86400; SameSite=Lax`;
    setIsProfileMenuOpen(false);
    toast.success("Switched Persona", `Active as ${persona.name} (${persona.badgeLabel})`);
    router.push(persona.homeRoute);
  };

  const handleLogout = () => {
    logout();
    document.cookie = "prime_access_token=; path=/; max-age=0;";
    setIsProfileMenuOpen(false);
    toast.info("Logged Out", "You have been signed out of your console.");
    router.push("/");
  };

  return (
    <>
      <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-border bg-card/90 backdrop-blur-md px-4 md:px-6 transition-colors">
        {/* 1. Left: Company Identity Banner */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex flex-col">
            <span className="font-heading font-extrabold text-sm text-foreground tracking-tight truncate">
              {company?.name || "Prime Networks (Pvt) Ltd"}
            </span>
            <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
              Company Operations Suite
            </span>
          </div>
        </div>

        {/* 2. Center: Global Search Bar */}
        <div className="hidden md:flex items-center max-w-sm w-full mx-4">
          <SmartSearchInput
            value=""
            onChange={() => {}}
            placeholder="Search subscribers, OLT, tickets... (Ctrl+K)"
            size="sm"
          />
        </div>

        {/* 3. Right: Incident Notification Drawer Trigger, Theme Toggle & Owner Profile */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Notifications Drawer Trigger */}
          <Tooltip content="Incident & Alert Stream" position="bottom">
            <button
              onClick={() => setIsNotificationDrawerOpen(true)}
              className="relative rounded-lg p-2 text-muted-foreground hover:bg-card-subtle hover:text-foreground transition-colors cursor-pointer border border-transparent hover:border-border"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2 rounded-full bg-destructive ring-2 ring-card animate-pulse" />
            </button>
          </Tooltip>

          {/* Theme Switcher (Light / Dark) */}
          <Tooltip content={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"} position="bottom">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleTheme}
              className="h-9 w-9 p-0 font-mono text-xs shadow-xs rounded-lg cursor-pointer"
            >
              {isDarkMode ? (
                <Sun className="h-4 w-4 text-warning" />
              ) : (
                <Moon className="h-4 w-4 text-primary" />
              )}
            </Button>
          </Tooltip>

          {/* User Profile & Role Switcher Dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-2.5 border-l border-border pl-3.5 py-0.5 hover:opacity-80 transition-opacity cursor-pointer select-none text-left"
            >
              <Avatar name={user?.name || "Eng. Moiz Ahmad"} presence="online" size="md" />
              <div className="hidden sm:flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-foreground truncate max-w-[130px]">
                    {user?.name || "Eng. Moiz Ahmad"}
                  </span>
                  <Badge variant="success" className="text-[8px] py-0 px-1 font-mono uppercase">
                    {user?.role ? user.role.split("_")[0] : "ACTIVE"}
                  </Badge>
                </div>
                <span className="font-mono text-[10px] text-muted-foreground truncate max-w-[150px]">
                  {getRoleDisplayName(user?.role)}
                </span>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground hidden sm:block ml-0.5" />
            </button>

            {/* Profile & Switcher Menu */}
            {isProfileMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-card border border-border rounded-xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 space-y-2">
                {/* Header User Card */}
                <div className="p-2.5 rounded-lg bg-muted/40 border border-border/60 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground truncate">{user?.name}</span>
                    <Badge variant="info" className="text-[9px] py-0 px-1 font-mono">
                      {user?.role?.toUpperCase()}
                    </Badge>
                  </div>
                  <span className="font-mono text-[10px] text-muted-foreground block truncate">
                    {user?.email || "owner@primenetworks.pk"}
                  </span>
                </div>

                {/* Quick Persona Switcher Section */}
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

                {/* Gateway & Logout Actions */}
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

      {/* Incident & Alert Stream Flyout Drawer */}
      <NotificationDrawer
        isOpen={isNotificationDrawerOpen}
        onClose={() => setIsNotificationDrawerOpen(false)}
        onOpenNotificationCenter={onOpenNotificationCenter}
      />
    </>
  );
}
