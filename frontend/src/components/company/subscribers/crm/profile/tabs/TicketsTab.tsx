"use client";

import React, { useState } from "react";
import { Search, Ticket, AlertCircle } from "lucide-react";
import { SubscriberRecord } from "@/mock/db";

export function TicketsTab({ subscriber }: { subscriber: SubscriberRecord }) {
  const [searchTerm, setSearchTerm] = useState("");

  const tickets = [
    {
      id: "TK-99482",
      title: "High Attenuation / Red LOS Alarm on Drop FAT-F10-12",
      totalReply: 4,
      priority: "Urgent",
      category: "Optical Degradation",
      status: "In Progress",
      createdAt: "Today 09:15 AM",
    },
    {
      id: "TK-98120",
      title: "ONT Power Adapter Replacement Request",
      totalReply: 2,
      priority: "Medium",
      category: "CPE Hardware",
      status: "Closed",
      createdAt: "2026-07-14 02:20 PM",
    },
    {
      id: "TK-92041",
      title: "Static IP Binding Verification for CCTV NVR",
      totalReply: 6,
      priority: "Low",
      category: "Network Configuration",
      status: "Closed",
      createdAt: "2026-06-20 11:05 AM",
    },
  ];

  const filteredTickets = tickets.filter(
    (t) =>
      t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-card rounded-xl border border-border shadow-xs overflow-hidden">
      {/* Header Actions */}
      <div className="p-4 border-b border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-muted/20">
        <div className="flex items-center gap-2">
          <Ticket className="w-4 h-4 text-primary" />
          <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-foreground">
            Customer Trouble Tickets & Complaints
          </h4>
        </div>

        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-2.5 top-2.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search tickets by ID, title..."
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
              <th className="px-4 py-3">Ticket ID</th>
              <th className="px-4 py-3">Complaint Subject</th>
              <th className="px-4 py-3 text-center">Replies</th>
              <th className="px-4 py-3">Priority</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3 text-center">Ticket Status</th>
              <th className="px-4 py-3">Created At</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {filteredTickets.map((tkt) => (
              <tr key={tkt.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 font-bold text-primary">{tkt.id}</td>
                <td className="px-4 py-3 text-foreground font-sans font-medium">{tkt.title}</td>
                <td className="px-4 py-3 text-center font-bold text-muted-foreground">{tkt.totalReply}</td>
                <td className="px-4 py-3">
                  <span
                    className={`font-bold ${
                      tkt.priority === "Urgent"
                        ? "text-destructive"
                        : tkt.priority === "Medium"
                        ? "text-warning"
                        : "text-muted-foreground"
                    }`}
                  >
                    {tkt.priority}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{tkt.category}</td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      tkt.status === "Closed"
                        ? "bg-success/10 text-success border border-success/20"
                        : "bg-warning/10 text-warning border border-warning/20"
                    }`}
                  >
                    {tkt.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{tkt.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
