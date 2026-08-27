"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Bell,
  Sun,
  Moon,
  Shield,
  Command,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Tooltip } from "@/components/ui/tooltip";
import { useAuthStore } from "@/stores/useAuthStore";
import { NotificationDrawer } from "@/components/notifications/NotificationDrawer";

export function Topbar({
  onOpenNotificationCenter,
}: {
  onOpenNotificationCenter?: () => void;
}) {
  const { user, company } = useAuthStore();
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);

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
    <>
      <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-border bg-card/90 backdrop-blur-md px-4 md:px-6 transition-colors">
        {/* 1. Left: Company Identity Banner */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex flex-col">
            <span className="font-heading font-extrabold text-sm text-foreground tracking-tight truncate">
              {company?.name || "Prime Networks (Pvt) Ltd"}
            </span>
            <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
              Company Owner Command Suite
            </span>
          </div>
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

        {/* 3. Right: Incident Notification Drawer Trigger, Theme Toggle & Owner Profile */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Notifications Drawer Trigger */}
          <Tooltip content="Incident & Alert Stream">
            <button
              onClick={() => setIsNotificationDrawerOpen(true)}
              className="relative rounded-lg p-2 text-muted-foreground hover:bg-card-subtle hover:text-foreground transition-colors cursor-pointer border border-transparent hover:border-border"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2 rounded-full bg-destructive ring-2 ring-card animate-pulse" />
            </button>
          </Tooltip>

          {/* Theme Switcher (Light / Dark) */}
          <Tooltip content={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
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

          {/* Company Owner Profile Display */}
          <div className="flex items-center gap-3 border-l border-border pl-3.5 py-0.5">
            <Avatar name={user?.name || "Tariq Mehmood"} presence="online" size="md" />
            <div className="hidden sm:flex flex-col text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-foreground">
                  {user?.name || "Tariq Mehmood"}
                </span>
                <Badge variant="success" className="text-[8px] py-0 px-1 font-mono uppercase">
                  OWNER
                </Badge>
              </div>
              <span className="font-mono text-[10px] text-muted-foreground">
                Company Owner (CEO)
              </span>
            </div>
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
