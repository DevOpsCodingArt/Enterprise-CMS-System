"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { mockDb, AttendanceRecord } from "@/mock/db";

export function AttendanceTrackerTab() {
  const [attendanceList] = useState<AttendanceRecord[]>(mockDb.attendance);

  return (
    <div className="h-full w-full flex flex-col overflow-hidden">
      {/* Top Header Bar */}
      <div className="p-3.5 border-b border-border bg-card flex items-center justify-between shrink-0">
        <div>
          <h2 className="font-heading font-bold text-sm text-foreground">
            Staff Biometric & Geofenced Mobile Attendance & Overtime Tracker
          </h2>
          <p className="text-xs text-muted-foreground">
            Daily clock-in logs, late arrivals, and emergency night fiber restoration overtime (1.5x / 2.0x rates).
          </p>
        </div>
        <Badge variant="success" className="text-xs font-mono">
          Today: 98% Present
        </Badge>
      </div>

      {/* Table Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <table className="w-full text-left text-xs">
          <thead className="sticky top-0 bg-muted/70 backdrop-blur-xs border-b border-border text-[11px] font-mono uppercase text-muted-foreground z-10">
            <tr>
              <th className="p-3">Staff Member</th>
              <th className="p-3">Department</th>
              <th className="p-3">Clock-In Time</th>
              <th className="p-3">Method</th>
              <th className="p-3">Late Status</th>
              <th className="p-3">Overtime Logged</th>
              <th className="p-3">Attendance Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {attendanceList.map((att) => (
              <tr key={att.id} className="hover:bg-muted/20 transition-colors">
                <td className="p-3 font-bold text-foreground">{att.staffName}</td>
                <td className="p-3 text-muted-foreground">{att.department}</td>
                <td className="p-3 font-mono font-bold text-primary">{att.clockIn}</td>
                <td className="p-3">
                  <Badge variant="secondary" className="text-[10px]">
                    {att.checkInMethod === "geofenced_mobile" ? "📱 Mobile GPS Geofence" : "🏢 Office Biometric"}
                  </Badge>
                </td>
                <td className="p-3 font-mono">
                  {att.isLate ? (
                    <span className="text-destructive font-bold">Late (12 mins)</span>
                  ) : (
                    <span className="text-success">On Time</span>
                  )}
                </td>
                <td className="p-3 font-mono">
                  {att.overtimeHours > 0 ? (
                    <span className="text-warning font-bold">
                      {att.overtimeHours} hrs ({att.overtimeRateMultiplier}x OT Rate)
                    </span>
                  ) : (
                    <span className="text-muted-foreground">0 hrs</span>
                  )}
                </td>
                <td className="p-3">
                  <Badge variant="success" className="text-[10px]">
                    Present
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
