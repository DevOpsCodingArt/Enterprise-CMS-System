"use client";

import React, { useState } from "react";
import { Search, DollarSign } from "lucide-react";
import { SubscriberRecord } from "@/mock/db";

export function LedgersTab({ subscriber }: { subscriber: SubscriberRecord }) {
  const [searchTerm, setSearchTerm] = useState("");

  const ledgers = [
    {
      id: "LED-10492",
      trxId: "TRX-98214-PK",
      type: "Payment (Credit)",
      refId: "INV-2026-0812",
      amount: subscriber.monthlyFeePkr,
      isCredit: true,
      balance: 0,
      actionBy: "Online Gateway (JazzCash)",
      createdAt: "2026-08-01 10:24:15 AM",
    },
    {
      id: "LED-10491",
      trxId: "SYS-BILL-08",
      type: "Monthly Bill (Debit)",
      refId: "INV-2026-0812",
      amount: subscriber.monthlyFeePkr,
      isCredit: false,
      balance: subscriber.monthlyFeePkr,
      actionBy: "System (Auto Billing Cycle)",
      createdAt: "2026-08-01 12:00:00 AM",
    },
    {
      id: "LED-09842",
      trxId: "TRX-87123-PK",
      type: "Payment (Credit)",
      refId: "INV-2026-0708",
      amount: subscriber.monthlyFeePkr,
      isCredit: true,
      balance: 0,
      actionBy: "Online Gateway (Easypaisa)",
      createdAt: "2026-07-01 09:15:45 AM",
    },
    {
      id: "LED-09841",
      trxId: "SYS-BILL-07",
      type: "Monthly Bill (Debit)",
      refId: "INV-2026-0708",
      amount: subscriber.monthlyFeePkr,
      isCredit: false,
      balance: subscriber.monthlyFeePkr,
      actionBy: "System (Auto Billing Cycle)",
      createdAt: "2026-07-01 12:00:00 AM",
    },
    {
      id: "LED-08201",
      trxId: "TRX-76012-PK",
      type: "Setup & Deposit (Credit)",
      refId: "INV-2026-0604",
      amount: 5000 + subscriber.monthlyFeePkr,
      isCredit: true,
      balance: 0,
      actionBy: "Staff (Ali NOC Lead)",
      createdAt: "2026-06-01 11:46:00 AM",
    },
  ];

  const filteredLedgers = ledgers.filter(
    (l) =>
      l.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.trxId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.refId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-card rounded-xl border border-border shadow-xs overflow-hidden">
      {/* Header Actions */}
      <div className="p-4 border-b border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-muted/20">
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-primary" />
          <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-foreground">
            Financial Ledger Statement
          </h4>
        </div>

        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-2.5 top-2.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search Trx ID, Ref ID, Type..."
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
              <th className="px-4 py-3">Ledger ID</th>
              <th className="px-4 py-3">Transaction ID</th>
              <th className="px-4 py-3">Entry Type</th>
              <th className="px-4 py-3">Reference ID</th>
              <th className="px-4 py-3 text-right">Debit (PKR)</th>
              <th className="px-4 py-3 text-right">Credit (PKR)</th>
              <th className="px-4 py-3 text-right">Running Balance</th>
              <th className="px-4 py-3">Action By</th>
              <th className="px-4 py-3">Created At</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {filteredLedgers.map((l) => (
              <tr key={l.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 font-medium text-foreground">{l.id}</td>
                <td className="px-4 py-3 text-primary font-bold">{l.trxId}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      l.isCredit
                        ? "bg-success/10 text-success border border-success/20"
                        : "bg-warning/10 text-warning border border-warning/20"
                    }`}
                  >
                    {l.type}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{l.refId}</td>
                <td className="px-4 py-3 text-right font-bold text-destructive">
                  {!l.isCredit ? `Rs. ${l.amount.toLocaleString()}` : "-"}
                </td>
                <td className="px-4 py-3 text-right font-bold text-success">
                  {l.isCredit ? `Rs. ${l.amount.toLocaleString()}` : "-"}
                </td>
                <td className="px-4 py-3 text-right font-bold text-foreground">
                  Rs. {l.balance.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{l.actionBy}</td>
                <td className="px-4 py-3 text-muted-foreground">{l.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
