"use client";

import React, { useState } from "react";
import { Search, KeyRound } from "lucide-react";
import { SubscriberRecord } from "@/mock/db";

export function LoginLogTab({ subscriber }: { subscriber: SubscriberRecord }) {
  const [searchTerm, setSearchTerm] = useState("");

  const logs = [
    {
      id: "RAD-881924",
      datetime: "Today 08:30:12 AM",
      username: subscriber.pppoeUsername,
      passwordMasked: "••••••••",
      reply: "Access-Accept",
      mac: subscriber.macAddress || "48:57:02:9B:2F:10",
      vendor: "Huawei Technologies",
      port: "ether2-pon4",
      nas: "10.0.0.1 (ISB-F10-CORE-01)",
      status: "success",
    },
    {
      id: "RAD-881920",
      datetime: "Today 08:30:05 AM",
      username: subscriber.pppoeUsername,
      passwordMasked: "••••••••",
      reply: "Access-Reject (Invalid Credentials)",
      mac: subscriber.macAddress || "48:57:02:9B:2F:10",
      vendor: "Huawei Technologies",
      port: "ether2-pon4",
      nas: "10.0.0.1 (ISB-F10-CORE-01)",
      status: "reject",
    },
    {
      id: "RAD-874102",
      datetime: "Yesterday 09:11:58 AM",
      username: subscriber.pppoeUsername,
      passwordMasked: "••••••••",
      reply: "Access-Accept",
      mac: subscriber.macAddress || "48:57:02:9B:2F:10",
      vendor: "Huawei Technologies",
      port: "ether2-pon4",
      nas: "10.0.0.1 (ISB-F10-CORE-01)",
      status: "success",
    },
  ];

  const filteredLogs = logs.filter(
    (l) =>
      l.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.mac.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.reply.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-card rounded-xl border border-border shadow-xs overflow-hidden">
      {/* Header Actions */}
      <div className="p-4 border-b border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-muted/20">
        <div className="flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-primary" />
          <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-foreground">
            RADIUS Authentication Attempts
          </h4>
        </div>

        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-2.5 top-2.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search reply, MAC, NAS..."
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
              <th className="px-4 py-3">Log ID</th>
              <th className="px-4 py-3">Timestamp</th>
              <th className="px-4 py-3">PPPoE Username</th>
              <th className="px-4 py-3">Password</th>
              <th className="px-4 py-3">RADIUS Reply Code</th>
              <th className="px-4 py-3">Caller MAC & Vendor</th>
              <th className="px-4 py-3">NAS Port</th>
              <th className="px-4 py-3">NAS Server Endpoint</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {filteredLogs.map((log) => (
              <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 font-medium text-foreground">{log.id}</td>
                <td className="px-4 py-3 text-muted-foreground">{log.datetime}</td>
                <td className="px-4 py-3 font-bold text-primary">{log.username}</td>
                <td className="px-4 py-3 text-muted-foreground">{log.passwordMasked}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      log.status === "success"
                        ? "bg-success/10 text-success border border-success/20"
                        : "bg-destructive/10 text-destructive border border-destructive/20"
                    }`}
                  >
                    {log.reply}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="font-bold text-foreground">{log.mac}</div>
                  <div className="text-[10px] text-muted-foreground">{log.vendor}</div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{log.port}</td>
                <td className="px-4 py-3 text-muted-foreground">{log.nas}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
