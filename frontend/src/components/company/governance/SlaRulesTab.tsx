"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { mockDb, SlaRule } from "@/mock/db";

export function SlaRulesTab() {
  const [slaRules] = useState<SlaRule[]>(mockDb.slaRules);

  return (
    <div className="h-full w-full flex flex-col overflow-hidden">
      {/* Top Header Bar */}
      <div className="p-3.5 border-b border-border bg-card flex items-center justify-between shrink-0">
        <div>
          <h2 className="font-heading font-bold text-sm text-foreground">
            Branch Operating Hours & Auto-Escalation SLA Engine
          </h2>
          <p className="text-xs text-muted-foreground">
            Configure shift schedules, out-of-hours bot auto-replies, and breach escalation chains.
          </p>
        </div>
        <Badge variant="success" className="text-xs font-mono">
          SLA Engine: Active
        </Badge>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {slaRules.map((sla) => (
            <div
              key={sla.id}
              className="p-4 rounded-2xl bg-card border border-border shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <span className="font-heading font-bold text-sm text-foreground">
                  {sla.priority} Priority SLA
                </span>
                <Badge
                  variant={
                    sla.priority === "Critical"
                      ? "destructive"
                      : sla.priority === "High"
                        ? "warning"
                        : "secondary"
                  }
                >
                  P{sla.priority === "Critical" ? "1" : sla.priority === "High" ? "2" : "3"}
                </Badge>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Target First Response:</span>
                  <span className="font-bold text-primary">{sla.targetFirstResponseMins} Mins</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Target Resolution:</span>
                  <span className="font-bold text-foreground">{sla.targetResolutionHours} Hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Auto-Escalate Breach:</span>
                  <span className="font-bold text-destructive">After {sla.autoEscalateAfterMins} Mins</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Escalate To:</span>
                  <span className="font-bold text-foreground">{sla.escalateToRole}</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-muted/30 border border-border text-[10.5px] text-muted-foreground font-mono">
                Channels: {sla.notifyChannels.join(" · ")}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
