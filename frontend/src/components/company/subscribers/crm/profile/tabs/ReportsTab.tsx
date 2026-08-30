"use client";

import React from "react";
import { Calendar, FileText, DollarSign } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { SubscriberRecord } from "@/mock/db";

export function ReportsTab({ subscriber }: { subscriber: SubscriberRecord }) {
  const invoiceStats = [
    { label: "This Week", value: "Rs. 0.00", icon: Calendar },
    { label: "This Month", value: `Rs. ${subscriber.monthlyFeePkr.toLocaleString()}`, icon: Calendar },
    { label: "Last Month", value: `Rs. ${subscriber.monthlyFeePkr.toLocaleString()}`, icon: Calendar },
    { label: "This Year", value: `Rs. ${(subscriber.monthlyFeePkr * 8).toLocaleString()}`, icon: Calendar },
    { label: "Total Lifetime", value: `Rs. ${(subscriber.monthlyFeePkr * 18).toLocaleString()}`, icon: FileText, isTotal: true },
  ];

  const paymentStats = [
    { label: "This Week", value: "Rs. 0.00", icon: Calendar },
    { label: "This Month", value: `Rs. ${subscriber.monthlyFeePkr.toLocaleString()}`, icon: Calendar },
    { label: "Last Month", value: `Rs. ${subscriber.monthlyFeePkr.toLocaleString()}`, icon: Calendar },
    { label: "This Year", value: `Rs. ${(subscriber.monthlyFeePkr * 8).toLocaleString()}`, icon: Calendar },
    { label: "Total Received", value: `Rs. ${(subscriber.monthlyFeePkr * 18).toLocaleString()}`, icon: DollarSign, isTotal: true },
  ];

  const invoiceChartData = [
    { name: "Jan", value: 3850 },
    { name: "Feb", value: 3850 },
    { name: "Mar", value: 3850 },
    { name: "Apr", value: 3850 },
    { name: "May", value: 3850 },
    { name: "Jun", value: 3850 },
    { name: "Jul", value: 3850 },
    { name: "Aug", value: 3850 },
  ];

  const paymentChartData = [
    { name: "Jan", value: 3850 },
    { name: "Feb", value: 3850 },
    { name: "Mar", value: 3850 },
    { name: "Apr", value: 3850 },
    { name: "May", value: 3850 },
    { name: "Jun", value: 3850 },
    { name: "Jul", value: 3850 },
    { name: "Aug", value: 3850 },
  ];

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border p-2.5 rounded-lg shadow-md flex flex-col gap-0.5">
          <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase">{label}</span>
          <span className="text-xs font-mono font-bold text-primary">
            Rs. {Number(payload[0].value).toLocaleString()}
          </span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Invoices Chart */}
        <div className="bg-card rounded-xl border border-border p-5 shadow-xs flex flex-col">
          <h4 className="text-xs font-bold font-mono uppercase text-foreground mb-4">Invoices Billed Trend</h4>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={invoiceChartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "var(--muted-foreground)", fontWeight: 600 }}
                  dy={8}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "var(--muted-foreground)", fontWeight: 600 }}
                  tickFormatter={(value) => `${value / 1000}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="var(--primary)"
                  strokeWidth={2.5}
                  dot={{ r: 3.5, fill: "var(--primary)", strokeWidth: 0 }}
                  activeDot={{ r: 5, fill: "var(--primary)", stroke: "var(--card)", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payments Chart */}
        <div className="bg-card rounded-xl border border-border p-5 shadow-xs flex flex-col">
          <h4 className="text-xs font-bold font-mono uppercase text-foreground mb-4">Payments Cleared Trend</h4>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={paymentChartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "var(--muted-foreground)", fontWeight: 600 }}
                  dy={8}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "var(--muted-foreground)", fontWeight: 600 }}
                  tickFormatter={(value) => `${value / 1000}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="var(--success)"
                  strokeWidth={2.5}
                  dot={{ r: 3.5, fill: "var(--success)", strokeWidth: 0 }}
                  activeDot={{ r: 5, fill: "var(--success)", stroke: "var(--card)", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Stats Metric Rows */}
      <div className="space-y-4">
        {/* Invoice Stats Row */}
        <div>
          <h5 className="text-[11px] font-mono uppercase font-bold text-muted-foreground mb-2">
            Invoicing Breakdown
          </h5>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {invoiceStats.map((stat) => (
              <div
                key={stat.label}
                className={`p-3.5 rounded-lg border flex flex-col justify-between ${
                  stat.isTotal
                    ? "bg-primary/10 border-primary/30"
                    : "bg-card border-border"
                }`}
              >
                <div className="flex justify-between items-center text-muted-foreground">
                  <span className="text-[10px] font-mono uppercase font-bold">{stat.label}</span>
                  <stat.icon size={13} className={stat.isTotal ? "text-primary" : "text-muted-foreground"} />
                </div>
                <span className={`text-sm font-mono font-bold mt-2 ${stat.isTotal ? "text-primary" : "text-foreground"}`}>
                  {stat.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Stats Row */}
        <div>
          <h5 className="text-[11px] font-mono uppercase font-bold text-muted-foreground mb-2">
            Collections & Receipts Breakdown
          </h5>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {paymentStats.map((stat) => (
              <div
                key={stat.label}
                className={`p-3.5 rounded-lg border flex flex-col justify-between ${
                  stat.isTotal
                    ? "bg-success/10 border-success/30"
                    : "bg-card border-border"
                }`}
              >
                <div className="flex justify-between items-center text-muted-foreground">
                  <span className="text-[10px] font-mono uppercase font-bold">{stat.label}</span>
                  <stat.icon size={13} className={stat.isTotal ? "text-success" : "text-muted-foreground"} />
                </div>
                <span className={`text-sm font-mono font-bold mt-2 ${stat.isTotal ? "text-success" : "text-foreground"}`}>
                  {stat.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
