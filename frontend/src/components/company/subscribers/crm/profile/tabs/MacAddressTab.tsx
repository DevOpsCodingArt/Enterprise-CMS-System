"use client";

import React, { useState } from "react";
import { Search, Trash2, Plus, ShieldCheck } from "lucide-react";
import { SubscriberRecord } from "@/mock/db";
import { useToast } from "@/components/ui/toast";
import { Tooltip } from "@/components/ui/tooltip";

export function MacAddressTab({ subscriber }: { subscriber: SubscriberRecord }) {
  const toast = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [macs, setMacs] = useState([
    {
      id: "mac-01",
      mac: subscriber.macAddress || "48:57:02:9B:2F:10",
      vendor: "Huawei Technologies Co., Ltd (ONT EchoLife HG8145V5)",
      createdBy: "System (Auto-Lock on First Auth)",
      createdAt: "2025-06-14 11:20:00 AM",
      status: "Active Bound",
    },
    {
      id: "mac-02",
      mac: "70:A8:E3:11:40:92",
      vendor: "ZTE Corporation (Legacy ZXHN F670L)",
      createdBy: "Admin_NOC (Migration Support)",
      createdAt: "2025-04-10 09:15:30 AM",
      status: "Archived",
    },
  ]);

  const handleRemove = (id: string, macStr: string) => {
    setMacs((prev) => prev.filter((m) => m.id !== id));
    toast.warning("MAC Unbound", `MAC Address ${macStr} removed from subscriber profile.`);
  };

  const handleAdd = () => {
    const newMac = window.prompt("Enter new MAC Address (Format: AA:BB:CC:DD:EE:FF):");
    if (newMac) {
      setMacs((prev) => [
        {
          id: `mac-0${prev.length + 1}`,
          mac: newMac.toUpperCase(),
          vendor: "Generic Optical Terminal",
          createdBy: "Admin_NOC",
          createdAt: new Date().toLocaleString(),
          status: "Active Bound",
        },
        ...prev,
      ]);
      toast.success("MAC Added", `Bound ${newMac} to ${subscriber.fullName}.`);
    }
  };

  const filteredMacs = macs.filter(
    (m) =>
      m.mac.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.vendor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-card rounded-xl border border-border shadow-xs overflow-hidden">
      {/* Header Actions */}
      <div className="p-4 border-b border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-muted/20">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-primary" />
          <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-foreground">
            Physical Hardware MAC Bindings
          </h4>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <div className="relative w-full sm:w-60">
            <Search size={14} className="absolute left-2.5 top-2.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search MAC, vendor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary font-mono text-foreground"
            />
          </div>

          <button
            type="button"
            onClick={handleAdd}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-xs cursor-pointer shrink-0"
          >
            <Plus size={14} /> Add MAC
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto relative max-h-[500px]">
        <table className="w-full text-xs text-left whitespace-nowrap font-mono">
          <thead className="text-[10px] text-muted-foreground uppercase bg-muted/50 border-b border-border font-bold tracking-wider sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">MAC Address & Device Vendor</th>
              <th className="px-4 py-3">Binding Type / Status</th>
              <th className="px-4 py-3">Bound By</th>
              <th className="px-4 py-3">Created Date</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {filteredMacs.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                  No MAC bindings found.
                </td>
              </tr>
            ) : (
              filteredMacs.map((m) => (
                <tr key={m.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground">{m.id}</td>
                  <td className="px-4 py-3">
                    <div className="font-bold text-foreground">{m.mac}</div>
                    <div className="text-[10.5px] text-primary font-medium">{m.vendor}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        m.status === "Active Bound"
                          ? "bg-success/10 text-success border border-success/20"
                          : "bg-muted text-muted-foreground border border-border"
                      }`}
                    >
                      {m.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{m.createdBy}</td>
                  <td className="px-4 py-3 text-muted-foreground">{m.createdAt}</td>
                  <td className="px-4 py-3 text-center">
                    <Tooltip content="Unbind MAC" position="top">
                      <button
                        type="button"
                        onClick={() => handleRemove(m.id, m.mac)}
                        className="p-1.5 text-destructive hover:bg-destructive/10 rounded-md transition-colors cursor-pointer inline-flex"
                      >
                        <Trash2 size={14} />
                      </button>
                    </Tooltip>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
