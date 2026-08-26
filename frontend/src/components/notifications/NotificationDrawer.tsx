"use client";

import React, { useState } from "react";
import {
  Bell,
  X,
  AlertTriangle,
  CheckCircle2,
  Radio,
  CreditCard,
  Ticket,
  Clock,
  Shield,
  Trash2,
  ExternalLink,
  CheckCheck,
} from "lucide-react";
import {
  Drawer,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerContent,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  category: "outage" | "billing" | "ticket" | "sla" | "security";
  priority: "critical" | "high" | "normal" | "low";
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
}

export function NotificationDrawer({
  isOpen,
  onClose,
  onOpenNotificationCenter,
}: {
  isOpen: boolean;
  onClose: () => void;
  onOpenNotificationCenter?: () => void;
}) {
  const toast = useToast();

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "notif-01",
      title: "Critical Fiber Cut Detected",
      message: "Splitter #4 on OLT-ISB-CORE-01 (Port 0/2/4) lost optical signal. 42 subscribers affected in Blue Area Sector.",
      category: "outage",
      priority: "critical",
      timestamp: "5 mins ago",
      isRead: false,
    },
    {
      id: "notif-02",
      title: "SLA Escalation — Ticket #TK-8842",
      message: "Trouble ticket #TK-8842 has been pending for > 2 hours without field technician arrival. Escalated to Branch Manager.",
      category: "sla",
      priority: "high",
      timestamp: "18 mins ago",
      isRead: false,
    },
    {
      id: "notif-03",
      title: "High-Value Enterprise Payment Verified",
      message: "NOC Accounts received PKR 240,000 via 1Link 1Bill from Corporate Subscriber 'TechSol Pvt Ltd'.",
      category: "billing",
      priority: "normal",
      timestamp: "45 mins ago",
      isRead: false,
    },
    {
      id: "notif-04",
      title: "New Role Permission Assigned",
      message: "Company Owner updated 'Helpdesk Lead' permission set with chat.export and tickets.delete.",
      category: "security",
      priority: "normal",
      timestamp: "2 hours ago",
      isRead: true,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    toast.success("Notifications Cleared", "All notifications marked as read.");
  };

  const handleDismiss = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const getIcon = (category: NotificationItem["category"]) => {
    switch (category) {
      case "outage":
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case "sla":
        return <Clock className="h-4 w-4 text-warning" />;
      case "billing":
        return <CreditCard className="h-4 w-4 text-success" />;
      case "security":
        return <Shield className="h-4 w-4 text-primary" />;
      default:
        return <Ticket className="h-4 w-4 text-info" />;
    }
  };

  return (
    <Drawer isOpen={isOpen} onClose={onClose} side="right" size="md">
      <DrawerHeader className="p-4 border-b border-border bg-card-subtle/50 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold">
            <Bell className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <DrawerTitle className="text-sm font-heading font-bold">
                Company Incident & Alert Stream
              </DrawerTitle>
              {unreadCount > 0 && (
                <Badge variant="destructive" className="text-[10px] py-0 px-1 font-mono">
                  {unreadCount} NEW
                </Badge>
              )}
            </div>
            <DrawerDescription className="text-xs">
              Live notifications across NOC, Billing, Tickets, and SLA alerts.
            </DrawerDescription>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              className="h-7 text-[11px] gap-1 text-muted-foreground hover:text-foreground cursor-pointer"
              title="Mark all as read"
            >
              <CheckCheck className="h-3 w-3" />
              <span className="hidden sm:inline">Mark Read</span>
            </Button>
          )}
        </div>
      </DrawerHeader>

      <DrawerContent className="p-0 space-y-0 overflow-y-auto divide-y divide-border-subtle">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-xs space-y-2">
            <CheckCircle2 className="h-8 w-8 mx-auto text-success/60" />
            <p className="font-bold text-foreground">All Clear!</p>
            <p>No active incidents or unread notifications at this time.</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 transition-colors hover:bg-card-subtle/60 flex items-start justify-between gap-3 ${
                !notif.isRead ? "bg-primary/5 border-l-2 border-primary" : ""
              }`}
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-card border border-border shrink-0 shadow-2xs">
                  {getIcon(notif.category)}
                </div>

                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-heading font-bold text-xs text-foreground">
                      {notif.title}
                    </span>
                    {notif.priority === "critical" && (
                      <Badge variant="destructive" className="text-[9px] py-0 px-1 font-mono uppercase">
                        CRITICAL
                      </Badge>
                    )}
                    {notif.priority === "high" && (
                      <Badge variant="warning" className="text-[9px] py-0 px-1 font-mono uppercase">
                        HIGH
                      </Badge>
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {notif.message}
                  </p>

                  <span className="text-[10px] font-mono text-muted-foreground block pt-0.5">
                    {notif.timestamp}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleDismiss(notif.id)}
                className="text-muted-foreground hover:text-destructive p-1 rounded transition-colors shrink-0 cursor-pointer"
                title="Dismiss"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))
        )}
      </DrawerContent>

      <DrawerFooter className="p-3 border-t border-border bg-card-subtle/50 flex flex-row items-center justify-between">
        <span className="text-[11px] font-mono text-muted-foreground">
          {notifications.length} Total Alerts Logged
        </span>

        <Button
          variant="primary"
          size="sm"
          onClick={() => {
            onClose();
            if (onOpenNotificationCenter) {
              onOpenNotificationCenter();
            } else {
              toast.info("Notification Center", "Opening comprehensive company alert history...");
            }
          }}
          className="text-xs font-bold gap-1 cursor-pointer"
        >
          <span>View All in Notification Center</span>
          <ExternalLink className="h-3 w-3" />
        </Button>
      </DrawerFooter>
    </Drawer>
  );
}
