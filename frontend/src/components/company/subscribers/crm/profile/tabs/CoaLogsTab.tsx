"use client";

import React, { useState } from "react";
import { Search, Zap } from "lucide-react";
import { SubscriberRecord } from "@/mock/db";

export function CoaLogsTab({ subscriber }: { subscriber: SubscriberRecord }) {
  const [searchTerm, setSearchTerm] = useState("");

  const formatDescription = (text: string) => {
    if (!text) return "";
    return text.split(/(#\d+|#TK-\d+|#INV-\d+)/g).map((part, index) => {
      if (part.startsWith("#")) {
        return (
          <strong key={index} className="text-primary font-bold">
            {part}
          </strong>
        );
      }
      return part;
    });
  };

  const logs = [
    {
      id: "COA-49021",
      causer: "System (Auto Rate Limit Refresh)",
      description: "Sent MikroTik CoA Disconnect-Request (PoD) on invoice #INV-2026-0812 payment clear.",
      datetime: "Today 10:45:00 AM",
    },
    {
      id: "COA-48190",
      causer: "Admin_NOC (Ali Lead)",
      description: "CoA Rate-Limit attribute Mikrotik-Rate-Limit=50M/50M pushed to NAS-ISB-CORE-01.",
      datetime: "2026-08-20 03:12:44 PM",
    },
    {
      id: "COA-47201",
      causer: "System (Grace Period Expiry)",
      description: "Session disconnected and fallback profile assigned due to ticket #TK-8842 testing.",
      datetime: "2026-08-15 12:00:01 AM",
    },
  ];

  const filteredLogs = logs.filter(
    (l) =>
      l.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.causer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-card rounded-xl border border-border shadow-xs overflow-hidden">
      {/* Header Actions */}
      <div className="p-4 border-b border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-muted/20">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-primary" />
          <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-foreground">
            Change of Authorization (CoA) Logs
          </h4>
        </div>

        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-2.5 top-2.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search CoA description, causer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary font-mono text-foreground"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto relative max-h-[500px]">
        <table className="w-full text-xs text-left whitespace-nowrap font-mono">
          <thead className="text-[10px] text-muted-foreground uppercase bg-muted/50 border-b border-border font-bold tracking-wider sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3">CoA ID</th>
              <th className="px-4 py-3">Causer / Triggered By</th>
              <th className="px-4 py-3">Event Description & Attributes</th>
              <th className="px-4 py-3">Execution Datetime</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {filteredLogs.map((log) => (
              <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 font-medium text-foreground">{log.id}</td>
                <td className="px-4 py-3 text-primary font-bold">{log.causer}</td>
                <td className="px-4 py-3 text-foreground font-sans font-medium">
                  {formatDescription(log.description)}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{log.datetime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
