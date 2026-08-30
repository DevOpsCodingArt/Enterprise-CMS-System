"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  Building2,
  CreditCard,
  Server,
  Radio,
  ShieldAlert,
  Sliders,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Zap,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export type PlatformTab =
  | "overview"
  | "tenants"
  | "billing"
  | "infrastructure"
  | "telemetry"
  | "audit"
  | "settings";

interface NavItem {
  id: PlatformTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  badgeVariant?: "success" | "warning" | "destructive" | "info" | "secondary";
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

export function PlatformSidebar({
  activeTab,
  onTabChange,
  isCollapsed,
  onToggleCollapse,
}: {
  activeTab: PlatformTab;
  onTabChange: (tab: PlatformTab) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}) {
  const navGroups: NavGroup[] = [
    {
      title: "FLEET OPERATIONS",
      items: [
        {
          id: "overview",
          label: "Fleet Overview",
          icon: Activity,
        },
        {
          id: "tenants",
          label: "ISP Tenants",
          icon: Building2,
          badge: "8 Active",
          badgeVariant: "info",
        },
        {
          id: "billing",
          label: "SaaS Subscriptions",
          icon: CreditCard,
          badge: "$142.5k",
          badgeVariant: "success",
        },
      ],
    },
    {
      title: "INFRASTRUCTURE & NODES",
      items: [
        {
          id: "infrastructure",
          label: "Server Clusters",
          icon: Server,
          badge: "4 Live",
          badgeVariant: "success",
        },
        {
          id: "telemetry",
          label: "API Telemetry",
          icon: Radio,
          badge: "14ms",
          badgeVariant: "secondary",
        },
      ],
    },
    {
      title: "GOVERNANCE & SYSTEM",
      items: [
        {
          id: "audit",
          label: "Audit Logs",
          icon: ShieldAlert,
        },
        {
          id: "settings",
          label: "Platform Settings",
          icon: Sliders,
        },
      ],
    },
  ];

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 68 : 264 }}
      transition={{ type: "spring", stiffness: 400, damping: 32 }}
      className="flex flex-col h-full max-h-full border-r border-sidebar-border bg-sidebar text-sidebar-foreground select-none shrink-0 z-30 overflow-hidden"
    >
      {/* 1. Header / Master Brand */}
      <div className="flex h-16 items-center justify-between px-3 border-b border-sidebar-border shrink-0">
        {!isCollapsed ? (
          <>
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-heading font-extrabold text-sm shadow-xs shrink-0">
                P1
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-heading font-extrabold text-sm leading-none text-sidebar-foreground truncate">
                    Prime One
                  </span>
                  <Badge variant="info" className="text-[8px] py-0 px-1 font-mono">
                    MASTER
                  </Badge>
                </div>
                <span className="font-mono text-[9.5px] uppercase tracking-wider text-sidebar-muted mt-0.5 truncate">
                  SaaS Control Plane
                </span>
              </div>
            </div>

            <Tooltip content="Collapse Sidebar (Ctrl+B)" position="bottom">
              <button
                onClick={onToggleCollapse}
                className="rounded-lg p-1.5 text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors cursor-pointer border border-transparent hover:border-sidebar-border"
                aria-label="Collapse Sidebar"
              >
                <PanelLeftClose className="h-4 w-4" />
              </button>
            </Tooltip>
          </>
        ) : (
          <div className="flex w-full items-center justify-center">
            <Tooltip content="Expand Sidebar (Ctrl+B)" position="right">
              <button
                onClick={onToggleCollapse}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all cursor-pointer shadow-2xs border border-primary/20"
                aria-label="Expand Sidebar"
              >
                <PanelLeftOpen className="h-4 w-4" />
              </button>
            </Tooltip>
          </div>
        )}
      </div>

      {/* 2. Grouped Navigation Menu */}
      <div className="flex-1 min-h-0 p-2 overflow-y-auto overflow-x-hidden custom-scrollbar space-y-3">
        {navGroups.map((group, groupIdx) => (
          <div key={group.title} className="space-y-1">
            {groupIdx > 0 && (
              <div className={cn("border-t border-sidebar-border/40 my-2", isCollapsed ? "mx-1" : "mx-2")} />
            )}

            {!isCollapsed && (
              <div className="px-2.5 py-1 text-[9.5px] font-mono font-bold tracking-wider text-sidebar-muted uppercase truncate">
                {group.title}
              </div>
            )}

            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              const navButton = (
                <button
                  onClick={() => onTabChange(item.id)}
                  className={cn(
                    "group relative flex items-center rounded-xl text-xs font-medium transition-all cursor-pointer select-none",
                    isCollapsed
                      ? "h-10 w-10 mx-auto justify-center p-0"
                      : "w-full gap-2.5 px-3 py-2 justify-start",
                    isActive
                      ? "bg-primary/15 text-primary font-bold border border-primary/25 shadow-2xs"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground border border-transparent"
                  )}
                  aria-label={item.label}
                >
                  {isActive && (
                    <motion.span
                      layoutId="platformSidebarActiveIndicator"
                      className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-primary shadow-glow-primary"
                      transition={{ type: "spring", stiffness: 450, damping: 35 }}
                    />
                  )}

                  <Icon
                    className={cn(
                      "h-4 w-4 shrink-0 transition-transform group-hover:scale-105",
                      isActive
                        ? "text-primary filter drop-shadow-xs"
                        : "text-sidebar-muted group-hover:text-sidebar-foreground"
                    )}
                  />

                  {!isCollapsed && (
                    <div className="flex flex-1 items-center justify-between overflow-hidden">
                      <span className="truncate">{item.label}</span>
                      {item.badge && (
                        <Badge
                          variant={item.badgeVariant}
                          className="text-[9px] py-0 px-1.5 font-mono font-bold shrink-0 ml-1.5"
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
                  <Tooltip
                    key={item.id}
                    content={
                      <div className="flex items-center gap-1.5">
                        <span>{item.label}</span>
                        {item.badge && (
                          <span className="text-[9px] px-1 py-0.2 rounded bg-primary/20 text-primary font-mono">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    }
                    position="right"
                    containerClassName="w-full flex justify-center"
                  >
                    {navButton}
                  </Tooltip>
                );
              }

              return <div key={item.id}>{navButton}</div>;
            })}
          </div>
        ))}
      </div>

      {/* 3. Footer / Root Super-Admin Card & Expand/Collapse Bar */}
      <div className="p-2 border-t border-sidebar-border shrink-0 bg-sidebar">
        {!isCollapsed ? (
          <div className="flex items-center justify-between gap-2 rounded-xl bg-sidebar-accent p-2 border border-sidebar-border/60">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-card text-foreground font-bold text-xs shadow-2xs shrink-0 border border-border">
                <ShieldCheck className="h-4 w-4 text-primary" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-sidebar-foreground truncate leading-tight">
                  Platform Master
                </span>
                <span className="font-mono text-[9px] text-sidebar-muted uppercase tracking-wider truncate">
                  Super Admin (Root)
                </span>
              </div>
            </div>
            <Tooltip content="Collapse Sidebar (Ctrl+B)">
              <button
                onClick={onToggleCollapse}
                className="p-1 rounded-md text-sidebar-muted hover:bg-sidebar hover:text-sidebar-foreground transition-colors cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            </Tooltip>
          </div>
        ) : (
          <Tooltip content="Expand Sidebar (Ctrl+B)" position="right" containerClassName="w-full flex justify-center">
            <button
              onClick={onToggleCollapse}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-sidebar-accent text-sidebar-foreground hover:bg-primary hover:text-primary-foreground transition-all cursor-pointer border border-sidebar-border"
              title="Expand Sidebar"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </Tooltip>
        )}
      </div>
    </motion.aside>
  );
}
