"use client";

import React, { useRef } from "react";
import { Edit3, Trash2 } from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";

export interface ConnectionRecordItem {
  id: string; // SR No (e.g. PN-2026-0401)
  date: string;
  installationDate?: string;
  ettr?: string;
  ticketNo?: string;
  customer: {
    name: string;
    fatherName?: string;
    mobile: string;
    cnic: string;
    address: string;
  };
  services: {
    package: string;
    connectionType: string;
    area: string;
    subArea?: string;
    username?: string;
    userId?: string;
    device?: string;
    macAddress?: string;
    opticalSignal?: string;
    fiberWire?: string;
    adapter?: string;
    onu?: string;
  };
  accounts: {
    otc: number;
    monthlyBill: number;
    otcPaid: number;
    monthlyBillPaid: number;
    extraCable?: number;
    discount?: number;
    totalAmount?: number;
  };
  assignment: {
    assignedTo: string;
    assignedBy: string;
    remarks?: string;
    diagnostics?: {
      signalStrength?: string;
      dataUsage?: string;
    };
  };
  status: "Pending" | "Active" | "Inactive" | "Cancelled";
}

export function ConnectionsTable({
  connections,
  selectedId,
  onSelect,
  onEdit,
  onDelete,
  onLoadMore,
  loadingMore,
}: {
  connections: ConnectionRecordItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onLoadMore?: () => void;
  loadingMore?: boolean;
}) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
      if (scrollHeight - scrollTop - clientHeight < 50) {
        if (onLoadMore) onLoadMore();
      }
    }
  };

  const formatDate = (isoStr: string) => {
    if (!isoStr) return "--------";
    const d = new Date(isoStr);
    if (isNaN(d.getTime())) return isoStr;
    return d.toLocaleString("en-GB", { month: "short", day: "numeric", year: "numeric" });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-success/10 text-success border border-success/20">
            ACTIVE
          </span>
        );
      case "Pending":
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-warning/10 text-warning border border-warning/20">
            PENDING
          </span>
        );
      case "Inactive":
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-destructive/10 text-destructive border border-destructive/20">
            INACTIVE
          </span>
        );
      case "Cancelled":
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-muted text-muted-foreground border border-border">
            CANCELLED
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold border border-border">
            {status.toUpperCase()}
          </span>
        );
    }
  };

  return (
    <div className="flex-1 p-2 md:p-3 bg-card flex flex-col min-h-0 overflow-hidden">
      <div className="flex-1 border border-border rounded-lg bg-background shadow-xs flex flex-col min-h-0 overflow-hidden">
        <div
          className="flex-1 overflow-auto custom-scrollbar"
          ref={scrollContainerRef}
          onScroll={handleScroll}
        >
          <table className="w-full text-left text-xs font-sans whitespace-nowrap">
            <thead className="bg-muted/60 border-b border-border sticky top-0 z-10 backdrop-blur-sm">
              <tr>
                <th className="px-3 py-2 font-mono font-bold text-muted-foreground text-[10px] uppercase tracking-wider">SR No</th>
                <th className="px-3 py-2 font-mono font-bold text-muted-foreground text-[10px] uppercase tracking-wider">Date</th>
                <th className="px-3 py-2 font-heading font-bold text-muted-foreground text-[10px] uppercase tracking-wider">Customer</th>
                <th className="px-3 py-2 font-mono font-bold text-muted-foreground text-[10px] uppercase tracking-wider">Mobile</th>
                <th className="px-3 py-2 font-mono font-bold text-muted-foreground text-[10px] uppercase tracking-wider">Area</th>
                <th className="px-3 py-2 font-heading font-bold text-muted-foreground text-[10px] uppercase tracking-wider">Package</th>
                <th className="px-3 py-2 font-mono font-bold text-muted-foreground text-[10px] uppercase tracking-wider text-right">Amount</th>
                <th className="px-3 py-2 font-mono font-bold text-muted-foreground text-[10px] uppercase tracking-wider text-center">Status</th>
                <th className="px-3 py-2 font-mono font-bold text-muted-foreground text-[10px] uppercase tracking-wider">Assigned Splicer</th>
                <th className="px-3 py-2 font-heading font-bold text-muted-foreground text-[10px] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {connections.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-8 text-center text-muted-foreground font-mono text-xs">
                    No connections found.
                  </td>
                </tr>
              ) : (
                connections.map((conn) => {
                  const isSelected = selectedId === conn.id;
                  const totalAmt = conn.accounts.totalAmount || (conn.accounts.otc + conn.accounts.monthlyBill);

                  return (
                    <tr
                      key={conn.id}
                      onClick={() => onSelect(conn.id)}
                      className={`hover:bg-muted/40 transition-colors cursor-pointer text-xs ${
                        isSelected ? "bg-primary/10 border-l-2 border-l-primary font-medium" : ""
                      }`}
                    >
                      <td className="px-3 py-1.5 font-mono font-bold text-primary text-[11px]">{conn.id}</td>
                      <td className="px-3 py-1.5 text-muted-foreground font-mono text-[11px]">{formatDate(conn.date)}</td>
                      <td className="px-3 py-1.5 font-bold text-foreground">{conn.customer.name}</td>
                      <td className="px-3 py-1.5 font-mono text-muted-foreground text-[11px]">{conn.customer.mobile}</td>
                      <td className="px-3 py-1.5 text-muted-foreground text-[11px] font-mono truncate max-w-[140px]">{conn.services.area}</td>
                      <td className="px-3 py-1.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-foreground">{conn.services.package}</span>
                          <span className="text-[10px] text-muted-foreground font-mono">({conn.services.connectionType})</span>
                        </div>
                      </td>
                      <td className="px-3 py-1.5 font-mono font-bold text-foreground text-right text-[11px]">
                        Rs. {totalAmt.toLocaleString()}
                      </td>
                      <td className="px-3 py-1.5 text-center">{getStatusBadge(conn.status)}</td>
                      <td className="px-3 py-1.5 text-muted-foreground font-mono text-[11px] truncate max-w-[150px]">
                        {conn.assignment.assignedTo}
                      </td>
                      <td className="px-3 py-1.5 text-right">
                        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                          <Tooltip content="Edit Connection" position="top">
                            <button
                              type="button"
                              onClick={() => onEdit(conn.id)}
                              className="p-1 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded transition-colors cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                          </Tooltip>
                          <Tooltip content="Delete Record" position="top">
                            <button
                              type="button"
                              onClick={() => onDelete(conn.id)}
                              className="p-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </Tooltip>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
              {loadingMore && (
                [...Array(3)].map((_, i) => (
                  <tr key={`skeleton-${i}`} className="animate-pulse bg-muted/10">
                    <td className="px-3 py-2"><div className="h-3 w-12 bg-muted rounded"></div></td>
                    <td className="px-3 py-2"><div className="h-3 w-16 bg-muted rounded"></div></td>
                    <td className="px-3 py-2"><div className="h-3 w-24 bg-muted rounded"></div></td>
                    <td className="px-3 py-2"><div className="h-3 w-20 bg-muted rounded"></div></td>
                    <td className="px-3 py-2"><div className="h-3 w-16 bg-muted rounded"></div></td>
                    <td className="px-3 py-2"><div className="h-3 w-20 bg-muted rounded"></div></td>
                    <td className="px-3 py-2"><div className="h-3 w-14 bg-muted rounded ml-auto"></div></td>
                    <td className="px-3 py-2"><div className="h-4 w-14 bg-muted rounded mx-auto"></div></td>
                    <td className="px-3 py-2"><div className="h-3 w-20 bg-muted rounded"></div></td>
                    <td className="px-3 py-2"><div className="h-4 w-10 bg-muted rounded ml-auto"></div></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-1.5 px-1 text-[11px] text-muted-foreground flex justify-between items-center shrink-0 font-mono">
        <span>Showing {connections.length} total connection leads</span>
        <span className="text-[10px]">Click any row to inspect details below</span>
      </div>
    </div>
  );
}
