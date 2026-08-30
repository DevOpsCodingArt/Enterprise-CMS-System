"use client";

import React from "react";
import { Activity } from "lucide-react";
import { SubscriberRecord } from "@/mock/db";

export function ActivitiesTab({ subscriber }: { subscriber: SubscriberRecord }) {
  const activities = [
    {
      id: "act-1",
      action: "MikroTik CoA Rate-Limit Refreshed",
      description: "CoA disconnect packet sent automatically upon billing cycle renewal.",
      date: "Today",
      time: "10:45 AM",
      by: "System",
    },
    {
      id: "act-2",
      action: "Monthly Invoice Payment Cleared",
      description: `Payment of Rs. ${subscriber.monthlyFeePkr.toLocaleString()} confirmed via JazzCash gateway.`,
      date: "Aug 01, 2026",
      time: "10:24 AM",
      by: "Online Payment",
    },
    {
      id: "act-3",
      action: "Optical Power Attenuation Alert Resolved",
      description: "Field technician inspected FAT-F10-12 and cleaned SC-APC connector. Rx verified at -18.4 dBm.",
      date: "Jul 15, 2026",
      time: "03:10 PM",
      by: "Technician Hamza",
    },
    {
      id: "act-4",
      action: "FTTH Connection Drop Provisioned",
      description: "Installed Huawei ONT EchoLife, configured PPPoE profile, and linked drop fiber cable.",
      date: subscriber.installedAt || "Jun 14, 2025",
      time: "11:20 AM",
      by: "Splicer NOC Team",
    },
  ];

  return (
    <div className="bg-card rounded-xl border border-border p-6 shadow-xs">
      <h3 className="font-heading font-bold text-sm text-foreground tracking-tight mb-6">
        Subscriber Operational & Audit Event Timeline
      </h3>

      <div className="relative border-l-2 border-border ml-4 space-y-8">
        {activities.map((act) => (
          <div key={act.id} className="relative pl-8 group">
            {/* Timeline Circular Icon Node */}
            <div className="absolute -left-[17px] top-0.5 w-8 h-8 rounded-full border-2 border-card shadow-xs flex items-center justify-center bg-primary/10 text-primary group-hover:scale-110 transition-transform">
              <Activity size={14} strokeWidth={2.5} />
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
              <div>
                <h4 className="text-xs font-bold text-foreground tracking-tight">{act.action}</h4>
                <p className="text-xs text-muted-foreground mt-0.5">{act.description}</p>
              </div>
              <div className="flex flex-col sm:items-end shrink-0">
                <span className="text-xs font-mono font-bold text-foreground">{act.date}</span>
                <span className="text-[10px] font-mono text-muted-foreground uppercase">{act.time}</span>
                <div className="mt-1 text-[10px] font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20 inline-block">
                  By: {act.by}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
