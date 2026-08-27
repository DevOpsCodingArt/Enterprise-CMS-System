"use client";

import React from "react";
import { Clock, HardDrive, Upload, Download, DollarSign, FileText, Ticket } from "lucide-react";

export interface SubscriberMetricsData {
  uptime?: string;
  totalGB?: number;
  usedGB?: number;
  remainingGB?: number;
  balance?: string | number;
  due?: string | number;
  tickets?: number;
}

export function SubscribersMetricsRibbon({
  metrics = {
    uptime: "28d 14h",
    totalGB: 1000,
    usedGB: 342,
    remainingGB: 658,
    balance: "0.00",
    due: "0",
    tickets: 1,
  },
}: {
  metrics?: SubscriberMetricsData;
}) {
  const cards = [
    {
      label: "Online Uptime",
      value: metrics.uptime || "28d 14h",
      icon: Clock,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Total",
      value: `${metrics.totalGB || 1000}`,
      unit: "GB",
      icon: HardDrive,
      color: "text-success",
      bg: "bg-success/10",
    },
    {
      label: "Used",
      value: `${metrics.usedGB || 342}`,
      unit: "GB",
      icon: Upload,
      color: "text-destructive",
      bg: "bg-destructive/10",
    },
    {
      label: "Remaining",
      value: `${metrics.remainingGB || 658}`,
      unit: "GB",
      icon: Download,
      color: "text-warning",
      bg: "bg-warning/10",
    },
    {
      label: "Balance",
      value: typeof metrics.balance === "number" ? metrics.balance.toLocaleString() : metrics.balance,
      icon: DollarSign,
      color: "text-success",
      bg: "bg-success/10",
      highlight: "balance",
    },
    {
      label: "Due",
      value: typeof metrics.due === "number" ? metrics.due.toLocaleString() : metrics.due,
      icon: FileText,
      color: "text-destructive",
      bg: "bg-destructive/10",
      highlight: "due",
    },
    {
      label: "Tickets",
      value: metrics.tickets !== undefined ? `${metrics.tickets}` : "0",
      icon: Ticket,
      color: "text-info",
      bg: "bg-info/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
      {cards.map((card, i) => (
        <div
          key={i}
          className="bg-card border border-border rounded-md shadow-sm p-4 flex flex-col justify-between"
        >
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-medium text-muted-foreground">{card.label}</span>
            <div className={`p-1.5 rounded-full ${card.bg}`}>
              <card.icon className={`w-3.5 h-3.5 ${card.color}`} />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span
              className={`text-xl font-bold ${
                card.highlight === "balance"
                  ? "text-success"
                  : card.highlight === "due"
                  ? "text-destructive"
                  : "text-foreground"
              }`}
            >
              {card.value}
            </span>
            {card.unit && <span className="text-xs text-muted-foreground font-medium">{card.unit}</span>}
          </div>
        </div>
      ))}
    </div>
  );
}
