"use client";

import React, { useState } from "react";
import {
  MessageSquare,
  Ticket,
  PlusCircle,
  Users,
  Layers,
  Radio,
  Navigation,
  AlertTriangle,
  Cpu,
  Scroll,
  ArrowLeftRight,
  FileText,
  CreditCard,
  Wallet,
  DollarSign,
  Building,
  UserCheck,
  Clock,
  Timer,
  CheckSquare,
  Building2,
  BarChart3,
  Shield,
  Sliders,
  Zap,
  Calendar,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  MapPin,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip } from "@/components/ui/tooltip";
import { useAuthStore } from "@/stores/useAuthStore";
import { cn } from "@/lib/utils";

export interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  badgeVariant?: "success" | "warning" | "destructive" | "info" | "secondary";
}

export interface NavGroup {
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
  const { user, company } = useAuthStore();
  const [selectedBranch, setSelectedBranch] = useState("Islamabad Core (F-10)");

  const navGroups: NavGroup[] = [
    {
      title: "1. OPERATIONS DESK",
      items: [
        {
          id: "desk",
          label: "Live Chat Desk",
          icon: MessageSquare,
          badge: "3 Live",
          badgeVariant: "success",
        },
        {
          id: "tickets",
          label: "Trouble Tickets & Jobs",
          icon: Ticket,
          badge: "5 Open",
          badgeVariant: "destructive",
        },
        {
          id: "connections",
          label: "New Connections Pipeline",
          icon: PlusCircle,
          badge: "2 New",
          badgeVariant: "info",
        },
      ],
    },
    {
      title: "2. SUBSCRIBERS (CRM)",
      items: [
        {
          id: "customers",
          label: "Active Directory (3,420)",
          icon: Users,
          badge: "3.4k",
          badgeVariant: "secondary",
        },
        {
          id: "packages",
          label: "Tariff Packages & Speeds",
          icon: Layers,
        },
      ],
    },
    {
      title: "3. WORKFORCE, HR & SHIFTS",
      items: [
        {
          id: "departments",
          label: "Departments (7 Depts)",
          icon: Building,
        },
        {
          id: "staff",
          label: "Staff Directory (52)",
          icon: UserCheck,
          badge: "52",
          badgeVariant: "secondary",
        },
        {
          id: "shifts",
          label: "Shift Rosters (24/7 NOC)",
          icon: Clock,
        },
        {
          id: "attendance",
          label: "Attendance & Overtime",
          icon: Timer,
        },
        {
          id: "tasks",
          label: "Task Allocation Board",
          icon: CheckSquare,
        },
      ],
    },
    {
      title: "4. GOVERNANCE & SETTINGS",
      items: [
        {
          id: "roles",
          label: "RBAC Rights Matrix",
          icon: Sliders,
        },
        {
          id: "canned",
          label: "Canned Slash Shortcuts",
          icon: Zap,
        },
        {
          id: "sla",
          label: "Working Hours & SLA Rules",
          icon: Calendar,
        },
        {
          id: "profile",
          label: "Company Profile & Tax",
          icon: Settings,
        },
      ],
    },
  ];

  return (
    <aside
      className={cn(
        "flex flex-col h-full max-h-full border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-300 select-none shrink-0 z-30 overflow-hidden",
        isCollapsed ? "w-16" : "w-68"
      )}
    >
      {/* 1. Header / Brand Mark */}
      <div className="flex h-16 items-center justify-between px-3.5 border-b border-sidebar-border shrink-0">
        {!isCollapsed ? (
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-heading font-extrabold text-sm shadow-sm shrink-0">
              P1
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-bold text-sm leading-none text-sidebar-foreground truncate">
                  Prime Networks
                </span>
                <span className="flex h-1.5 w-1.5 rounded-full bg-success animate-pulse shrink-0" />
              </div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-sidebar-muted mt-0.5 truncate">
                ISP Command Center
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

      {/* 2. Active Branch Switcher (Removed per user request) */}

      {/* 3. Grouped Navigation Items (Smooth Scrolling) */}
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
              const isActive = activeTab === item.id;

              const navButton = (
                <button
                  onClick={() => onTabChange(item.id)}
                  className={cn(
                    "group relative flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium transition-colors cursor-pointer",
                    isActive
                      ? "bg-primary/10 text-primary font-bold border border-primary/20 shadow-2xs"
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
        ))}
      </div>

      {/* 4. Footer / User Profile Card */}
      <div className="p-2.5 border-t border-sidebar-border shrink-0">
        {!isCollapsed ? (
          <div className="flex items-center gap-2.5 rounded-lg bg-sidebar-accent p-2 border border-sidebar-border/50">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-card text-foreground font-bold text-xs shadow-2xs shrink-0">
              <Shield className="h-4 w-4 text-primary" />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-bold text-sidebar-foreground truncate leading-tight">
                {user?.name || "Eng. Moiz Ahmad"}
              </span>
              <span className="font-mono text-[9px] text-sidebar-muted uppercase tracking-wider truncate">
                Company Owner (CEO)
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
