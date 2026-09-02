"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  badgeVariant?: "success" | "warning" | "destructive" | "info" | "secondary";
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export function PlatformSidebar({
  isCollapsed,
  onToggleCollapse,
}: {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}) {
  const pathname = usePathname();

  const navGroups: NavGroup[] = [
    {
      title: "1. FLEET OPERATIONS",
      items: [
        {
          id: "overview",
          label: "Fleet Overview",
          href: "/platform/overview",
          icon: Activity,
        },
        {
          id: "tenants",
          label: "ISP Tenants",
          href: "/platform/tenants",
          icon: Building2,
          badge: "8 Active",
          badgeVariant: "info",
        },
        {
          id: "billing",
          label: "SaaS Subscriptions",
          href: "/platform/billing",
          icon: CreditCard,
          badge: "$142.5k",
          badgeVariant: "success",
        },
      ],
    },
    {
      title: "2. INFRASTRUCTURE & NODES",
      items: [
        {
          id: "infrastructure",
          label: "Server Clusters",
          href: "/platform/infrastructure",
          icon: Server,
          badge: "4 Live",
          badgeVariant: "success",
        },
        {
          id: "telemetry",
          label: "API Telemetry",
          href: "/platform/telemetry",
          icon: Radio,
          badge: "14ms",
          badgeVariant: "secondary",
        },
      ],
    },
    {
      title: "3. GOVERNANCE & SYSTEM",
      items: [
        {
          id: "audit",
          label: "Audit Logs",
          href: "/platform/audit",
          icon: ShieldAlert,
        },
        {
          id: "settings",
          label: "Platform Settings",
          href: "/platform/settings",
          icon: Sliders,
        },
      ],
    },
  ];

  return (
    <aside
      className={cn(
        "flex flex-col h-full max-h-full border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-300 ease-in-out select-none shrink-0 z-30 overflow-hidden",
        isCollapsed ? "w-16" : "w-68"
      )}
    >
      {/* 1. Header / Master Brand */}
      <div className="flex h-16 items-center justify-between px-3.5 border-b border-sidebar-border shrink-0">
        {!isCollapsed ? (
          <Link href="/platform/overview" className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-heading font-extrabold text-sm shadow-sm shrink-0">
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
              <span className="font-mono text-[10px] uppercase tracking-wider text-sidebar-muted mt-0.5 truncate">
                SaaS Control Plane
              </span>
            </div>
          </Link>
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

      {/* 2. Grouped Navigation Menu */}
      <div className="flex-1 min-h-0 space-y-4 p-2.5 overflow-y-auto overflow-x-hidden custom-scrollbar">
        {navGroups.map((group) => (
          <div key={group.title} className="space-y-1">
            {!isCollapsed && (
              <span className="px-2.5 text-[9.5px] font-mono font-bold tracking-wider text-sidebar-muted uppercase">
                {group.title}
              </span>
            )}

            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== "/platform" && pathname.startsWith(`${item.href}/`));

              const navLink = (
                <Link
                  href={item.href}
                  className={cn(
                    "group relative flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium transition-colors cursor-pointer select-none",
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
                          className="text-[9.5px] py-0 px-1.5 font-mono font-bold shrink-0 ml-1"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                  )}
                </Link>
              );

              if (isCollapsed) {
                return (
                  <Tooltip key={item.id} content={item.label} position="right" containerClassName="w-full">
                    {navLink}
                  </Tooltip>
                );
              }

              return <div key={item.id}>{navLink}</div>;
            })}
          </div>
        ))}
      </div>

      {/* 3. Footer / Root Super-Admin Card */}
      <div className="p-2.5 border-t border-sidebar-border shrink-0">
        {!isCollapsed ? (
          <div className="flex items-center gap-2.5 rounded-lg bg-sidebar-accent p-2 border border-sidebar-border/50">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-card text-foreground font-bold text-xs shadow-xs shrink-0">
              <ShieldCheck className="h-4 w-4 text-primary" />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-bold text-sidebar-foreground truncate leading-tight">
                Platform Master
              </span>
              <span className="font-mono text-[9px] text-sidebar-muted uppercase tracking-wider truncate">
                Super-Admin (Root)
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
