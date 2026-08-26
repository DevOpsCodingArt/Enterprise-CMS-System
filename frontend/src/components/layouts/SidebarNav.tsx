"use client";

import React from "react";
import {
  MessageSquare,
  Ticket,
  Radio,
  Users,
  Package,
  Building2,
  Settings,
  ChevronLeft,
  ChevronRight,
  Shield,
  Zap,
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
  const { user, can } = useAuthStore();
  const { conversations } = useChatStore();

  const openTicketsCount = mockDb.tickets.filter((t) => t.status !== "Closed").length;
  const activeChatsCount = conversations.filter((c) => c.status === "active" || c.status === "waiting").length;

  const navItems: NavItem[] = [
    {
      id: "desk",
      label: "Prime Desk",
      icon: MessageSquare,
      permission: "chat:read",
      badge: activeChatsCount > 0 ? activeChatsCount : undefined,
      badgeVariant: "info",
    },
    {
      id: "tickets",
      label: "Trouble Tickets",
      icon: Ticket,
      permission: "tickets:read",
      badge: openTicketsCount > 0 ? openTicketsCount : undefined,
      badgeVariant: "warning",
    },
    {
      id: "noc",
      label: "NOC Radar",
      icon: Radio,
      permission: "noc:read",
      badge: "LIVE",
      badgeVariant: "success",
    },
    {
      id: "branches",
      label: "20 Branches",
      icon: Building2,
      permission: "branches:read",
      badge: 20,
      badgeVariant: "secondary",
    },
    {
      id: "components",
      label: "UI Component Lab",
      icon: Zap,
      permission: "*",
    },
  ];

  // Filter items based on user RBAC permissions
  const accessibleItems = navItems.filter(
    (item) => !item.permission || can(item.permission)
  );

  return (
    <aside
      className={cn(
        "flex flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-300 select-none shrink-0",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Sidebar Top Section */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border">
        {!isCollapsed ? (
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-heading font-extrabold text-sm shadow-xs">
              P1
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-bold text-sm leading-none text-sidebar-foreground">
                Prime One OS
              </span>
              <span className="font-mono text-[9px] uppercase tracking-widest text-sidebar-muted mt-0.5">
                Enterprise NOC
              </span>
            </div>
          </div>
        ) : (
          <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-heading font-extrabold text-sm shadow-xs">
            P1
          </div>
        )}

        <button
          onClick={onToggleCollapse}
          className={cn(
            "rounded-md p-1.5 text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors cursor-pointer",
            isCollapsed && "hidden"
          )}
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      </div>

      {/* Navigation Menu Items */}
      <nav className="flex-1 space-y-1 p-2 overflow-y-auto">
        {accessibleItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          const buttonContent = (
            <button
              onClick={() => onTabChange(item.id)}
              className={cn(
                "group flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-xs font-medium transition-colors cursor-pointer",
                isActive
                  ? "bg-primary text-primary-foreground font-bold shadow-xs"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                isCollapsed && "justify-center px-0"
              )}
            >
              <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-primary-foreground" : "text-sidebar-muted group-hover:text-sidebar-foreground")} />
              
              {!isCollapsed && (
                <div className="flex flex-1 items-center justify-between">
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <Badge
                      variant={isActive ? "secondary" : item.badgeVariant}
                      className="text-[10px] py-0 px-1.5"
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
                {buttonContent}
              </Tooltip>
            );
          }

          return <div key={item.id}>{buttonContent}</div>;
        })}
      </nav>

      {/* Sidebar Footer User Role Pill */}
      <div className="p-3 border-t border-sidebar-border">
        {!isCollapsed ? (
          <div className="flex items-center gap-2 rounded-lg bg-sidebar-accent p-2">
            <Shield className="h-4 w-4 text-primary shrink-0" />
            <div className="flex flex-col truncate">
              <span className="text-[11px] font-bold text-sidebar-foreground truncate">
                {user?.name}
              </span>
              <span className="font-mono text-[9px] text-sidebar-muted uppercase tracking-wider">
                {user?.role.replace(/_/g, " ")}
              </span>
            </div>
          </div>
        ) : (
          <button
            onClick={onToggleCollapse}
            className="mx-auto flex h-8 w-8 items-center justify-center rounded-md text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors cursor-pointer"
            title="Expand Sidebar"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </aside>
  );
}
