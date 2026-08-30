"use client";

import React from "react";
import { Clock, HardDrive, Download, Upload, DollarSign, FileText, Ticket } from "lucide-react";
import { SubscriberRecord } from "@/mock/db";

export function ProfileMetricsRibbon({ subscriber }: { subscriber: SubscriberRecord }) {
  const cards = [
    {
      label: "Online Uptime",
      value: "28d 14h",
      unit: "Live",
      icon: Clock,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Total Quota",
      value: "1,000",
      unit: "GB",
      icon: HardDrive,
      color: "text-success",
      bg: "bg-success/10",
    },
    {
      label: "Data Used",
      value: "342",
      unit: "GB",
      icon: Upload,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Remaining",
      value: "658",
      unit: "GB",
      icon: Download,
      color: "text-warning",
      bg: "bg-warning/10",
    },
    {
      label: "Ledger Balance",
      value: `Rs. ${(subscriber.ledgerBalancePkr || 0).toLocaleString()}`,
      unit: "",
      icon: DollarSign,
      color: "text-success",
      bg: "bg-success/10",
      highlight: "balance",
    },
    {
      label: "Billing Due",
      value: subscriber.ledgerBalancePkr > 0 ? `Rs. ${subscriber.ledgerBalancePkr.toLocaleString()}` : "Rs. 0",
      unit: "",
      icon: FileText,
      color: "text-destructive",
      bg: "bg-destructive/10",
      highlight: "due",
    },
    {
      label: "Trouble Tickets",
      value: "1",
      unit: "Open",
      icon: Ticket,
      color: "text-info",
      bg: "bg-info/10",
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
