"use client";

import React, { useState } from "react";
import { Search, Download, FileText } from "lucide-react";
import { SubscriberRecord } from "@/mock/db";
import { useToast } from "@/components/ui/toast";
import { Tooltip } from "@/components/ui/tooltip";

export function InvoicesTab({ subscriber }: { subscriber: SubscriberRecord }) {
  const toast = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  const invoices = [
    {
      id: "INV-2026-0812",
      trxId: "TRX-98214-PK",
      status: "Paid",
      username: subscriber.pppoeUsername,
      salesperson: "Ali NOC Lead",
      package: subscriber.packageName,
      discount: 0,
      basePrice: subscriber.monthlyFeePkr,
      extraFee: 0,
      total: subscriber.monthlyFeePkr,
      by: "Online Portal / JazzCash",
      createdAt: "2026-08-01 10:24:00 AM",
    },
    {
      id: "INV-2026-0708",
      trxId: "TRX-87123-PK",
      status: "Paid",
      username: subscriber.pppoeUsername,
      salesperson: "Ali NOC Lead",
      package: subscriber.packageName,
      discount: 0,
      basePrice: subscriber.monthlyFeePkr,
      extraFee: 0,
      total: subscriber.monthlyFeePkr,
      by: "Easypaisa Direct",
      createdAt: "2026-07-01 09:15:30 AM",
    },
    {
      id: "INV-2026-0604",
      trxId: "TRX-76012-PK",
      status: "Paid",
      username: subscriber.pppoeUsername,
      salesperson: "Ali NOC Lead",
      package: subscriber.packageName,
      discount: 0,
      basePrice: subscriber.monthlyFeePkr,
      extraFee: 5000, // OTC Setup Fee
      total: subscriber.monthlyFeePkr + 5000,
      by: "Cash Collection / Staff",
      createdAt: "2026-06-01 11:45:00 AM",
    },
  ];

  const filteredInvoices = invoices.filter(
    (inv) =>
      inv.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.trxId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.package.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownload = (id: string) => {
    toast.success("Invoice Downloaded", `Tax Invoice PDF for ${id} downloaded successfully.`);
  };

  return (
    <div className="bg-card rounded-xl border border-border shadow-xs overflow-hidden">
      {/* Header Actions */}
      <div className="p-4 border-b border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-muted/20">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" />
          <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-foreground">
            Billed Invoices & Tax Receipts
          </h4>
        </div>

        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-2.5 top-2.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search invoice ID, Trx ID..."
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
              <th className="px-4 py-3">Invoice ID</th>
              <th className="px-4 py-3">Transaction ID</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Tariff Plan</th>
              <th className="px-4 py-3 text-right">Discount</th>
              <th className="px-4 py-3 text-right">Base Price</th>
              <th className="px-4 py-3 text-right">Setup / Extra</th>
              <th className="px-4 py-3 text-right">Total Bill</th>
              <th className="px-4 py-3">Payment Channel</th>
              <th className="px-4 py-3">Created At</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {filteredInvoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 font-bold text-primary">{inv.id}</td>
                <td className="px-4 py-3 text-muted-foreground">{inv.trxId}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-success/10 text-success border border-success/20">
                    {inv.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-foreground font-semibold">{inv.package}</td>
                <td className="px-4 py-3 text-right text-muted-foreground">Rs. {inv.discount.toLocaleString()}</td>
                <td className="px-4 py-3 text-right text-muted-foreground">Rs. {inv.basePrice.toLocaleString()}</td>
                <td className="px-4 py-3 text-right text-muted-foreground">Rs. {inv.extraFee.toLocaleString()}</td>
                <td className="px-4 py-3 text-right font-bold text-foreground">Rs. {inv.total.toLocaleString()}</td>
                <td className="px-4 py-3 text-muted-foreground">{inv.by}</td>
                <td className="px-4 py-3 text-muted-foreground">{inv.createdAt}</td>
                <td className="px-4 py-3 text-center">
                  <Tooltip content="Download PDF" position="top">
                    <button
                      type="button"
                      onClick={() => handleDownload(inv.id)}
                      className="p-1.5 text-primary hover:bg-primary/10 rounded-md transition-colors cursor-pointer inline-flex"
                    >
                      <Download size={14} />
                    </button>
                  </Tooltip>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
