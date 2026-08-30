"use client";

import React, { useState } from "react";
import { List, Plus, Trash2 } from "lucide-react";
import { SubscriberRecord } from "@/mock/db";
import { useToast } from "@/components/ui/toast";

export function AttributesTab({ subscriber }: { subscriber: SubscriberRecord }) {
  const toast = useToast();
  const [attributes, setAttributes] = useState([
    {
      id: "attr-01",
      name: "Mikrotik-Rate-Limit",
      value: "50M/50M 0/0 0/0 0/0 8 20M/20M",
      type: "RADIUS Check Item",
      target: "NAS-ISB-CORE-01",
    },
    {
      id: "attr-02",
      name: "Framed-Pool",
      value: "pool_residential_dhcp",
      type: "RADIUS Reply Item",
      target: "BRAS Gateway",
    },
    {
      id: "attr-03",
      name: "Acct-Interim-Interval",
      value: "300",
      type: "Accounting Telemetry",
      target: "FreeRADIUS Daemon",
    },
  ]);

  const handleAdd = () => {
    const name = window.prompt("Enter RADIUS Attribute Name (e.g. Mikrotik-Group):");
    const val = window.prompt("Enter Attribute Value:");
    if (name && val) {
      setAttributes((prev) => [
        ...prev,
        {
          id: `attr-0${prev.length + 1}`,
          name,
          value: val,
          type: "Custom VSA",
          target: "Core NAS",
        },
      ]);
      toast.success("Attribute Added", `Custom attribute ${name} linked.`);
    }
  };

  const handleRemove = (id: string, name: string) => {
    setAttributes((prev) => prev.filter((a) => a.id !== id));
    toast.warning("Attribute Removed", `${name} removed from dictionary.`);
  };

  return (
    <div className="bg-card rounded-xl border border-border shadow-xs overflow-hidden">
      <div className="p-4 border-b border-border flex justify-between items-center bg-muted/20">
        <div className="flex items-center gap-2">
          <List className="w-4 h-4 text-primary" />
          <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-foreground">
            Custom RADIUS User Attributes & VSA Tags
          </h4>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-xs cursor-pointer"
        >
          <Plus size={14} /> Add Attribute
        </button>
      </div>

      <div className="overflow-x-auto relative max-h-[500px]">
        <table className="w-full text-xs text-left whitespace-nowrap font-mono">
          <thead className="text-[10px] text-muted-foreground uppercase bg-muted/50 border-b border-border font-bold tracking-wider sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3">Attribute Name</th>
              <th className="px-4 py-3">Vendor / Dictionary Type</th>
              <th className="px-4 py-3">Assigned Value</th>
              <th className="px-4 py-3">Target Endpoint</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {attributes.map((attr) => (
              <tr key={attr.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 font-bold text-primary">{attr.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{attr.type}</td>
                <td className="px-4 py-3 text-foreground font-semibold bg-muted/30 rounded">{attr.value}</td>
                <td className="px-4 py-3 text-muted-foreground">{attr.target}</td>
                <td className="px-4 py-3 text-center">
                  <button
                    type="button"
                    onClick={() => handleRemove(attr.id, attr.name)}
                    className="p-1 text-destructive hover:bg-destructive/10 rounded transition-colors cursor-pointer"
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
