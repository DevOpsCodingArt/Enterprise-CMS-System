"use client";

import React, { useState } from "react";
import { Plus, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockDb, ShiftRoster } from "@/mock/db";

export function ShiftRostersTab() {
  const [shiftList] = useState<ShiftRoster[]>(mockDb.shifts);

  return (
    <div className="h-full w-full flex flex-col overflow-hidden">
      {/* Top Header Bar */}
      <div className="p-3.5 border-b border-border bg-card flex items-center justify-between shrink-0">
        <div>
          <h2 className="font-heading font-bold text-sm text-foreground">
            24/7/365 Continuous Operational Shift Rosters
          </h2>
          <p className="text-xs text-muted-foreground">
            Scheduled morning, evening peak, and night NOC shift allocations with on-call emergency splicers.
          </p>
        </div>
        <Button size="sm" onClick={() => alert("Open Schedule Shift Modal")}>
          <Plus className="h-3.5 w-3.5 mr-1" /> Add Shift Roster
        </Button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {shiftList.map((shift) => (
            <div
              key={shift.id}
              className="p-4 rounded-2xl bg-card border border-border shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-warning" />
                  <span className="font-heading font-bold text-xs text-foreground uppercase">{shift.shiftName}</span>
                </div>
                <Badge variant="warning" className="text-[10px] font-mono">{shift.timeRange}</Badge>
              </div>

              <div className="space-y-2">
                <div className="text-[11px] font-bold text-muted-foreground">Assigned Active Staff ({shift.assignedStaff.length}):</div>
                <div className="flex flex-wrap gap-1.5">
                  {shift.assignedStaff.map((staffName, i) => (
                    <span key={i} className="px-2 py-1 rounded-md bg-muted/60 border border-border text-xs font-medium text-foreground">
                      {staffName}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-muted/30 border border-border/80 space-y-1 text-xs">
                <div className="text-[10.5px] font-bold text-primary">On-Call Standby Splicers:</div>
                <div className="text-[11px] text-muted-foreground font-mono">
                  {shift.onCallStandby.join(", ")}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
