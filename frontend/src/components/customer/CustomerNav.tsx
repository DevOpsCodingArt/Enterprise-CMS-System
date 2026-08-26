"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  Receipt,
  Ticket,
  Activity,
  UserCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useChatStore } from "@/stores/useChatStore";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  badgeVariant?: "success" | "warning" | "destructive" | "info" | "secondary";
}

export function CustomerNav() {
  const pathname = usePathname();
  const { messages } = useChatStore();

  const customerMessages = messages["conv-01"] || [];
  const unreadCount = customerMessages.filter(
    (m) => m.senderRole === "agent" && m.status !== "read"
  ).length;

  const navItems: NavItem[] = [
    {
      href: "/portal",
      label: "Overview",
      icon: LayoutDashboard,
    },
    {
      href: "/portal/chat",
      label: "Live Support",
      icon: MessageSquare,
      badge: unreadCount > 0 ? unreadCount : undefined,
      badgeVariant: "info",
    },
    {
      href: "/portal/tickets",
      label: "Trouble Tickets",
      icon: Ticket,
      badge: "1 Active",
      badgeVariant: "warning",
    },
    {
      href: "/portal/billing",
      label: "Billing & Invoices",
      icon: Receipt,
    },
    {
      href: "/portal/diagnostics",
      label: "Line Diagnostics",
      icon: Activity,
      badge: "LIVE",
      badgeVariant: "success",
    },
    {
      href: "/portal/profile",
      label: "My Account",
      icon: UserCheck,
    },
  ];

  return (
    <>
      {/* 1. Desktop Tab Navigation Bar — Full-Width Centered 6-Column Grid */}
      <nav className="hidden md:grid grid-cols-6 gap-1.5 w-full border border-border bg-card/80 backdrop-blur-md p-1.5 rounded-xl mb-5 shadow-xs">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex items-center justify-center gap-2 rounded-lg py-2.5 px-3 text-xs font-medium transition-all select-none text-center",
                isActive
                  ? "bg-primary text-primary-foreground font-bold shadow-xs scale-[1.01]"
                  : "text-muted-foreground hover:bg-card-subtle hover:text-foreground"
              )}
            >
              <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-primary-foreground" : "text-muted-foreground")} />
              <span className="truncate">{item.label}</span>
              {item.badge && (
                <Badge
                  variant={isActive ? "secondary" : item.badgeVariant}
                  className={cn(
                    "text-[10px] py-0 px-1.5 font-mono shrink-0",
                    isActive && "bg-primary-foreground/20 text-primary-foreground border-transparent"
                  )}
                >
                  {item.badge}
                </Badge>
              )}
            </Link>
          );
        })}
      </nav>

      {/* 2. Mobile Responsive Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-border bg-card/95 backdrop-blur-lg px-2 py-1.5 shadow-lg safe-area-bottom">
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center justify-center gap-0.5 rounded-lg py-1 px-2 text-[10px] font-medium transition-colors flex-1 text-center",
                isActive
                  ? "text-primary font-bold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="relative">
                <Icon className="h-4 w-4" />
                {item.badge && (
                  <span className="absolute -top-1 -right-2 flex h-2 w-2 rounded-full bg-primary ring-2 ring-card" />
                )}
              </div>
              <span className="truncate max-w-[60px]">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
