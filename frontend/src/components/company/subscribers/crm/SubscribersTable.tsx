"use client";

import React from "react";
import { Unplug, RotateCcw } from "lucide-react";
import { SubscriberRecord } from "@/mock/db";
import { Tooltip } from "@/components/ui/tooltip";

export interface ColumnItem {
  id: string;
  label: string;
  visible: boolean;
}

export function SubscribersTable({
  subscribers,
  selectedIds,
  onToggleSelectAll,
  onToggleSelectRow,
  onSelectSubscriber,
  onDisconnect,
  onRestart,
  columns,
}: {
  subscribers: SubscriberRecord[];
  selectedIds: string[];
  onToggleSelectAll: () => void;
  onToggleSelectRow: (id: string) => void;
  onSelectSubscriber: (sub: SubscriberRecord) => void;
  onDisconnect: (sub: SubscriberRecord) => void;
  onRestart: (sub: SubscriberRecord) => void;
  columns: ColumnItem[];
}) {
  const activeColumns = columns.filter((c) => c.visible);

  const renderCellContent = (colId: string, sub: SubscriberRecord) => {
    switch (colId) {
      case "profileStatus":
        return (
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
              sub.status === "active"
                ? "bg-success/10 text-success border border-success/20"
                : "bg-destructive/10 text-destructive border border-destructive/20"
            }`}
          >
            {sub.status === "active" ? "ACTIVE" : "SUSPENDED"}
          </span>
        );
      case "connectionStatus":
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-success/10 text-success border border-success/20">
            ONLINE
          </span>
        );
      case "uptime":
        return <span className="font-mono text-muted-foreground">28d 14h</span>;
      case "ipAddress":
        return <span className="font-mono text-muted-foreground">{sub.staticIp || "103.14.22.84"}</span>;
      case "macAddress":
        return <span className="font-mono text-muted-foreground">{sub.macAddress || "48:57:02:9B:2F:10"}</span>;
      case "routerModel":
        return <span className="text-muted-foreground">Huawei HG8145V5</span>;
      case "balance":
        return (
          <span className="font-mono font-bold text-foreground">
            Rs. {(sub.ledgerBalancePkr || 0).toLocaleString()}
          </span>
        );
      case "package":
        return <span className="font-bold text-primary">{sub.packageName}</span>;
      case "expirationDate":
        return <span className="font-mono font-bold text-success">{sub.opticalRxDbm || -18.4} dBm</span>;
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 border border-border rounded-xl bg-card shadow-xs overflow-hidden flex flex-col min-h-0">
      <div className="overflow-auto custom-scrollbar flex-1">
        <table className="w-full text-left text-xs whitespace-nowrap">
          <thead className="bg-muted/60 border-b border-border sticky top-0 z-10 backdrop-blur-xs uppercase font-mono text-[10.5px] font-bold text-muted-foreground tracking-wider">
            <tr>
              <th className="p-3 w-8">
                <input
                  type="checkbox"
                  checked={subscribers.length > 0 && selectedIds.length === subscribers.length}
                  onChange={onToggleSelectAll}
                  className="rounded border-border accent-primary cursor-pointer"
                />
              </th>
              <th className="px-3 py-2.5">ID</th>
              <th className="px-3 py-2.5">Actions</th>
              <th className="px-3 py-2.5">Subscriber</th>
              {activeColumns.map((col) => (
                <th
                  key={col.id}
                  className={`px-3 py-2.5 ${
                    ["profileStatus", "connectionStatus"].includes(col.id) ? "text-center" : ""
                  } ${col.id === "balance" ? "text-right" : ""}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {subscribers.length === 0 ? (
              <tr>
                <td colSpan={4 + activeColumns.length} className="px-4 py-8 text-center text-muted-foreground font-mono">
                  No subscribers found matching your criteria.
                </td>
              </tr>
            ) : (
              subscribers.map((sub) => {
                const isSelected = selectedIds.includes(sub.id);
                return (
                  <tr
                    key={sub.id}
                    onClick={() => onSelectSubscriber(sub)}
                    className={`hover:bg-muted/40 transition-colors cursor-pointer ${
                      isSelected ? "bg-primary/10 font-medium" : ""
                    }`}
                  >
                    <td className="p-3 w-8" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleSelectRow(sub.id)}
                        className="rounded border-border accent-primary cursor-pointer"
                      />
                    </td>
                    <td className="px-3 py-2 font-mono font-bold text-primary">{sub.customerCode}</td>
                    <td className="px-3 py-2" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-1.5">
                        <Tooltip content="Disconnect Session" position="top">
                          <button
                            type="button"
                            onClick={() => onDisconnect(sub)}
                            className="p-1 text-destructive hover:bg-destructive/10 rounded transition-colors cursor-pointer"
                          >
                            <Unplug size={14} />
                          </button>
                        </Tooltip>
                        <Tooltip content="Restart ONT" position="top">
                          <button
                            type="button"
                            onClick={() => onRestart(sub)}
                            className="p-1 text-success hover:bg-success/10 rounded transition-colors cursor-pointer"
                          >
                            <RotateCcw size={14} />
                          </button>
                        </Tooltip>
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex flex-col">
                        <span className="font-bold text-foreground hover:text-primary transition-colors">
                          {sub.fullName}
                        </span>
                        <span className="text-[11px] text-muted-foreground font-mono">
                          {sub.pppoeUsername}
                        </span>
                      </div>
                    </td>

                    {activeColumns.map((col) => (
                      <td
                        key={col.id}
                        className={`px-3 py-2 ${
                          ["profileStatus", "connectionStatus"].includes(col.id) ? "text-center" : ""
                        } ${col.id === "balance" ? "text-right" : ""}`}
                      >
                        {renderCellContent(col.id, sub)}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      <div className="px-4 py-2 border-t border-border bg-muted/20 flex justify-between items-center text-xs font-mono text-muted-foreground">
        <span>Showing {subscribers.length} total subscribers</span>
        <span className="text-[10px]">Click any row to open Customer 360° Profile</span>
      </div>
    </div>
  );
}
