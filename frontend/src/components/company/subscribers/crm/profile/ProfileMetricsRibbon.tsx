"use client";

import React from "react";
import { Clock, HardDrive, Download, Upload, DollarSign, FileText, Ticket } from "lucide-react";
import type { SubscriberRecord } from "@/types/telecom-entities.types";

export function ProfileMetricsRibbon({
  subscriber,
  diagnostics,
}: {
  subscriber: SubscriberRecord;
  diagnostics?: any;
}) {
  const ticketsCount = diagnostics?.recentTickets
    ? diagnostics.recentTickets.filter((t: any) => t.status !== "closed").length
    : 1;

  const dueAmount = subscriber.ledgerBalancePkr || 0;

  const cards = [
    {
      label: "Online Uptime",
      value: subscriber.status === "active" ? "Live" : "Offline",
      unit: subscriber.status === "active" ? "Active" : "Inactive",
      icon: Clock,
      color: subscriber.status === "active" ? "text-success" : "text-muted-foreground",
      bg: subscriber.status === "active" ? "bg-success/10" : "bg-muted/10",
    },
    {
      label: "Optical Signal",
      value: `${diagnostics?.telemetry?.opticalHealth?.rxDbm || subscriber.opticalRxDbm || "-27.80"}`,
      unit: "dBm",
      icon: HardDrive,
      color: (Number(diagnostics?.telemetry?.opticalHealth?.rxDbm || subscriber.opticalRxDbm) < -27) ? "text-destructive" : "text-success",
      bg: (Number(diagnostics?.telemetry?.opticalHealth?.rxDbm || subscriber.opticalRxDbm) < -27) ? "bg-destructive/10" : "bg-success/10",
    },
    {
      label: "Speed Profile",
      value: diagnostics?.billing?.packageSpeed || subscriber.packageName?.split(" ")[0] || "30",
      unit: "Mbps",
      icon: Upload,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Package Tier",
      value: subscriber.packageName || diagnostics?.billing?.packageName || "Fiber Starter",
      unit: "",
      icon: Download,
      color: "text-info",
      bg: "bg-info/10",
    },
    {
      label: "Ledger Balance",
      value: `Rs. ${(subscriber.ledgerBalancePkr || 0).toLocaleString()}`,
      unit: "",
      icon: DollarSign,
      color: dueAmount <= 0 ? "text-success" : "text-warning",
      bg: dueAmount <= 0 ? "bg-success/10" : "bg-warning/10",
      highlight: "balance",
    },
    {
      label: "Monthly Bill",
      value: `Rs. ${Number(diagnostics?.billing?.monthlyBilling || subscriber.monthlyFeePkr || 2500).toLocaleString()}`,
      unit: "",
      icon: FileText,
      color: "text-foreground",
      bg: "bg-muted/20",
      highlight: "monthly",
    },
    {
      label: "Trouble Tickets",
      value: String(ticketsCount),
      unit: "Active",
      icon: Ticket,
      color: ticketsCount > 0 ? "text-destructive" : "text-success",
      bg: ticketsCount > 0 ? "bg-destructive/10" : "bg-success/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
      {cards.map((card, i) => (
        <div
          key={i}
          className="bg-card border border-border rounded-xl shadow-xs p-3.5 flex flex-col justify-between hover:border-primary/40 transition-colors"
        >
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-mono uppercase font-bold text-muted-foreground tracking-wider">
              {card.label}
            </span>
            <div className={`p-1.5 rounded-lg ${card.bg}`}>
              <card.icon className={`w-3.5 h-3.5 ${card.color}`} />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span
              className={`text-lg font-mono font-bold ${
                card.highlight === "balance"
                  ? "text-success"
                  : card.highlight === "due" && subscriber.ledgerBalancePkr > 0
                  ? "text-destructive"
                  : "text-foreground"
              }`}
            >
              {card.value}
            </span>
            {card.unit && (
              <span className="text-[10.5px] font-mono text-muted-foreground font-semibold">
                {card.unit}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
