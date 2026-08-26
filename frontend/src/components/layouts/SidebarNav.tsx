"use client";

import React, { useState, useEffect } from "react";
import {
  MessageSquare,
  Ticket,
  Radio,
  Building2,
  Package,
  Users,
  Shield,
  Layers,
  ChevronLeft,
  ChevronRight,
  Activity,
  Zap,
  Boxes,
  Sliders,
  LifeBuoy,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip } from "@/components/ui/tooltip";
import { useAuthStore } from "@/stores/useAuthStore";
import { useChatStore } from "@/stores/useChatStore";
import { mockDb } from "@/mock/db";
import { cn } from "@/lib/utils";

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  permission?: string;
  badge?: string | number;
  badgeVariant?: "success" | "warning" | "destructive" | "info" | "secondary";
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

export function SidebarNav({
  activeTab,
  onTabChange,
  isCollapsed,
  onToggleCollapse,
}: {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}) {
  const [isMounted, setIsMounted] = useState(false);
  const { user, can } = useAuthStore();
  const { conversations } = useChatStore();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const openTicketsCount = mockDb.tickets.filter((t) => t.status !== "Closed").length;
  const activeChatsCount = conversations.filter(
    (c) => c.status === "active" || c.status === "waiting"
  ).length;

  const navGroups: NavGroup[] = [
    {
      title: "OPERATIONS",
      items: [
        {
          id: "overview",
          label: "Command Overview",
          icon: Activity,
        },
        {
          id: "desk",
          label: "Prime Desk",
          icon: MessageSquare,
          permission: "chat.view",
          badge: activeChatsCount > 0 ? activeChatsCount : undefined,
          badgeVariant: "info",
        },
        {
          id: "tickets",
          label: "Trouble Tickets",
          icon: Ticket,
          permission: "tickets.view",
          badge: openTicketsCount > 0 ? openTicketsCount : undefined,
          badgeVariant: "warning",
        },
        {
          id: "noc",
          label: "NOC Radar",
          icon: Radio,
          permission: "noc.view",
          badge: "LIVE",
          badgeVariant: "success",
        },
      ],
    },
    {
      title: "INFRASTRUCTURE",
      items: [
        {
          id: "branches",
          label: "20 Branch Hubs",
          icon: Building2,
          permission: "branch.view",
          badge: 20,
          badgeVariant: "secondary",
        },
      ],
    },
    {
      title: "SYSTEM",
      items: [
        {
          id: "rbac",
          label: "RBAC Permissions",
          icon: Sliders,
          permission: "user.manage_permissions",
        },
      ],
    },
  ];

  return (
    <aside
      className={cn(
        "flex flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-300 select-none shrink-0 z-30",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* 1. Header / Brand Mark */}
      <div className="flex h-16 items-center justify-between px-3.5 border-b border-sidebar-border">
        {!isCollapsed ? (
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-heading font-extrabold text-sm shadow-sm">
              P1
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-bold text-sm leading-none text-sidebar-foreground">
                  Prime One
                </span>
                <span className="flex h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
              </div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-sidebar-muted mt-0.5">
                Telecom OS
              </span>
            </div>
          </div>
        ) : (
          <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-heading font-extrabold text-sm shadow-sm">
            P1
          </div>
        )}

        <button
          onClick={onToggleCollapse}
          className={cn(
            "rounded-md p-1.5 text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors cursor-pointer",
            isCollapsed && "hidden"
          )}
          title="Collapse Sidebar"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      </div>

      {/* 2. Grouped Navigation Items */}
      <div className="flex-1 space-y-4 p-2.5 overflow-y-auto">
        {navGroups.map((group) => {
          const filteredItems = group.items.filter((item) => {
            if (!isMounted) return true; // Server-client parity during initial hydration
            return !item.permission || can(item.permission);
          });
          if (filteredItems.length === 0) return null;

          return (
            <div key={group.title} className="space-y-1">
              {!isCollapsed && (
                <span className="px-2.5 text-[10px] font-mono font-bold tracking-wider text-sidebar-muted uppercase">
                  {group.title}
                </span>
              )}

              {filteredItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                const navButton = (
                  <button
                    onClick={() => onTabChange(item.id)}
                    className={cn(
                      "group relative flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-xs font-medium transition-colors cursor-pointer",
                      isActive
                        ? "bg-primary/10 text-primary font-bold border border-primary/20"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      isCollapsed && "justify-center px-0 h-10"
                    )}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-primary" />
                    )}

                    <Icon
                      className={cn(
                        "h-4 w-4 shrink-0 transition-transform group-hover:scale-105",
                        isActive
                          ? "text-primary"
                          : "text-sidebar-muted group-hover:text-sidebar-foreground"
                      )}
                    />

                    {!isCollapsed && (
                      <div className="flex flex-1 items-center justify-between overflow-hidden">
                        <span className="truncate">{item.label}</span>
                        {item.badge && (
                          <Badge
                            variant={item.badgeVariant}
                            className="text-[10px] py-0 px-1.5 font-mono font-bold shrink-0"
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </div>
                    )}
                  </button>
                );

                if (isCollapsed) {
                  return (
                    <Tooltip key={item.id} content={item.label} position="right" className="w-full">
                      {navButton}
                    </Tooltip>
                  );
                }

                return <div key={item.id}>{navButton}</div>;
              })}
            </div>
          );
        })}
      </div>

      {/* 3. Footer / User Profile Card */}
      <div className="p-2.5 border-t border-sidebar-border">
        {!isCollapsed ? (
          <div className="flex items-center gap-2.5 rounded-lg bg-sidebar-accent p-2 border border-sidebar-border/50">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-card text-foreground font-bold text-xs shadow-xs shrink-0">
              <Shield className="h-3.5 w-3.5 text-primary" />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-bold text-sidebar-foreground truncate leading-tight">
                {user?.name}
              </span>
              <span className="font-mono text-[9px] text-sidebar-muted uppercase tracking-wider truncate">
                {user?.role.replace(/_/g, " ")}
              </span>
            </div>
          </div>
        ) : (
          <button
            onClick={onToggleCollapse}
            className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors cursor-pointer"
            title="Expand Sidebar"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </aside>
  );
}
