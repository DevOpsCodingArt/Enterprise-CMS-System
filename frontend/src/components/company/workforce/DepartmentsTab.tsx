"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockDb, DepartmentRecord } from "@/mock/db";

export function DepartmentsTab() {
  const [departmentList] = useState<DepartmentRecord[]>(mockDb.departments);

  return (
    <div className="h-full w-full flex flex-col overflow-hidden">
      {/* Top Header Bar */}
      <div className="p-3.5 border-b border-border bg-card flex items-center justify-between shrink-0">
        <div>
          <h2 className="font-heading font-bold text-sm text-foreground">
            Organizational Departments & Escalation Hierarchy
          </h2>
          <p className="text-xs text-muted-foreground">
            Configure operational divisions, department heads, and automated ticket escalation paths.
          </p>
        </div>
        <Button size="sm" onClick={() => alert("Open Add Department Modal")}>
          <Plus className="h-3.5 w-3.5 mr-1" /> Add Department
        </Button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {departmentList.map((dept) => (
            <div
              key={dept.id}
              className="p-4 rounded-2xl bg-card border border-border hover:border-primary/40 transition-all shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: dept.color }}
                  />
                  <span className="font-mono font-bold text-xs text-primary">{dept.code}</span>
                </div>
                <Badge variant="secondary" className="text-[10px] font-mono">
                  {dept.headcount} Members
                </Badge>
              </div>

              <div>
                <h3 className="font-heading font-bold text-sm text-foreground">{dept.name}</h3>
                <div className="text-xs text-muted-foreground mt-0.5">
                  Lead: <span className="font-bold text-foreground">{dept.leadName}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border text-[11px] font-mono">
                <div className="p-2 rounded-lg bg-muted/30">
                  <div className="text-muted-foreground text-[10px]">Active Jobs</div>
                  <div className="font-bold text-foreground mt-0.5">{dept.activeTickets} Tickets</div>
                </div>
                <div className="p-2 rounded-lg bg-muted/30">
                  <div className="text-muted-foreground text-[10px]">SLA Target</div>
                  <div className="font-bold text-emerald-600 mt-0.5">{dept.slaTargetHours}h Turnaround</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
