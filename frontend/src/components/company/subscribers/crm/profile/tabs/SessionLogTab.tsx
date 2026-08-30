"use client";

import React, { useState, useMemo } from "react";
import { Search, X, Maximize2, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { SubscriberRecord } from "@/mock/db";

// Helper to format bytes
const formatBytes = (bytes: number, decimals = 2) => {
  if (!bytes || bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

// Helper to format seconds to h m s
const formatUptime = (seconds: number) => {
  if (!seconds) return "0s";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${h}h ${m}m ${s}s`;
};

// Static chart data for the preview cards
const dailyData = Array.from({ length: 24 }, (_, i) => ({
  time: `${String(i).padStart(2, "0")}:00`,
  usage: Number((((i * 17) % 15) * 0.1 + 0.2).toFixed(2)),
}));

const monthlyData = Array.from({ length: 30 }, (_, i) => ({
  day: String(i + 1),
  usage: Number((((i * 23) % 25) * 0.2 + 2.5).toFixed(2)),
}));

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Generator for the detailed modal graphs
const generateDetailedData = (points: number, labelType: "hour" | "day" | "week" | "month") => {
  return Array.from({ length: points }, (_, i) => {
    let label = "";
    if (labelType === "hour") {
      label = `${String(i % 24).padStart(2, "0")}:00`;
    } else if (labelType === "day") {
      label = `Day ${i + 1}`;
    } else if (labelType === "week") {
      label = `Week ${i + 1}`;
    } else if (labelType === "month") {
      label = monthNames[i % 12];
    }
    return {
      time: label,
      upload: Number((((i * 7) % 12) * 0.15 + 0.1).toFixed(2)),
      download: Number((((i * 19) % 30) * 0.25 + 1.2).toFixed(2)),
    };
  });
};

interface SessionRecord {
  id: string;
  username: string;
  message: string;
  login: string;
  logoff: string;
  uptimeSeconds: number;
  mac: string;
  vendor: string;
  nas: string;
  ip: string;
  uploadBytes: number;
  downloadBytes: number;
}

export function SessionLogTab({ subscriber }: { subscriber: SubscriberRecord }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedChart, setExpandedChart] = useState<"daily" | "monthly" | null>(null);
  const [dailyFilter, setDailyFilter] = useState("24h");
  const [monthlyFilter, setMonthlyFilter] = useState("30d");
  const [customDate, setCustomDate] = useState("2026-08-30");

  const dailyTotal = dailyData.reduce((sum, item) => sum + item.usage, 0).toFixed(2);
  const monthlyTotal = monthlyData.reduce((sum, item) => sum + item.usage, 0).toFixed(2);

  const mockSessions: SessionRecord[] = [
    {
      id: "sess-994812",
      username: subscriber.pppoeUsername,
      message: "User-Request / Active Session",
      login: "Today 08:30:14 AM",
      logoff: "Active (Current)",
      uptimeSeconds: 28840,
      mac: subscriber.macAddress || "48:57:02:9B:2F:10",
      vendor: "Huawei Technologies",
      nas: "10.0.0.1 (NAS-ISB-CORE-01)",
      ip: subscriber.staticIp || "103.14.22.84",
      uploadBytes: 15247182900,
      downloadBytes: 95147182900,
    },
    {
      id: "sess-994109",
      username: subscriber.pppoeUsername,
      message: "NAS-Reboot",
      login: "Yesterday 09:12:00 AM",
      logoff: "Yesterday 11:58:30 PM",
      uptimeSeconds: 53190,
      mac: subscriber.macAddress || "48:57:02:9B:2F:10",
      vendor: "Huawei Technologies",
      nas: "10.0.0.1 (NAS-ISB-CORE-01)",
      ip: subscriber.staticIp || "103.14.22.84",
      uploadBytes: 24190812900,
      downloadBytes: 142190812900,
    },
    {
      id: "sess-989201",
      username: subscriber.pppoeUsername,
      message: "Lost-Carrier / Fiber Drop Blip",
      login: "2026-08-25 10:00:00 AM",
      logoff: "2026-08-25 04:30:15 PM",
      uptimeSeconds: 23415,
      mac: subscriber.macAddress || "48:57:02:9B:2F:10",
      vendor: "Huawei Technologies",
      nas: "10.0.0.1 (NAS-ISB-CORE-01)",
      ip: subscriber.staticIp || "103.14.22.84",
      uploadBytes: 8120000000,
      downloadBytes: 42100000000,
    },
  ];

  const filteredSessions = mockSessions.filter(
    (sess) =>
      sess.mac.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sess.ip.includes(searchTerm) ||
      sess.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const detailedChartData = useMemo(() => {
    if (!expandedChart) return { data: [], options: [], active: "", setter: () => {} };

    if (expandedChart === "daily") {
      const options: Array<{ value: string; label: string; points: number; type: "hour" | "day" }> = [
        { value: "24h", label: "Last 24 Hours", points: 24, type: "hour" },
        { value: "1w", label: "Last 1 Week", points: 7, type: "day" },
        { value: "2w", label: "Last 2 Weeks", points: 14, type: "day" },
        { value: "4w", label: "Last 4 Weeks", points: 28, type: "day" },
        { value: "custom", label: "Custom Date", points: 24, type: "hour" },
      ];
      const opt = options.find((o) => o.value === dailyFilter) || options[0];
      return {
        data: generateDetailedData(opt.points, opt.type),
        options,
        active: dailyFilter,
        setter: (v: string) => setDailyFilter(v),
      };
    } else {
      const options: Array<{ value: string; label: string; points: number; type: "day" | "week" | "month" }> = [
        { value: "30d", label: "Last 30 Days", points: 30, type: "day" },
        { value: "12w", label: "Last 12 Weeks", points: 12, type: "week" },
        { value: "6m", label: "Last 6 Months", points: 6, type: "month" },
        { value: "12m", label: "Last 12 Months", points: 12, type: "month" },
        { value: "all", label: "Since Connection Start", points: 24, type: "month" },
      ];
      const opt = options.find((o) => o.value === monthlyFilter) || options[0];
      return {
        data: generateDetailedData(opt.points, opt.type),
        options,
        active: monthlyFilter,
        setter: (v: string) => setMonthlyFilter(v),
      };
    }
  }, [expandedChart, dailyFilter, monthlyFilter, customDate]);

  return (
    <div className="space-y-6 relative">
      {/* BW Usage Graphs (Clickable Preview Cards) */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Daily Chart Card */}
        <div
          onClick={() => setExpandedChart("daily")}
          className="bg-card rounded-xl border border-border p-5 shadow-xs flex flex-col h-[300px] relative overflow-hidden transition-all cursor-pointer hover:border-primary/50 group"
        >
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-xs font-bold font-mono uppercase text-foreground">
              BW Usage (Last 24 Hours) <span className="text-primary font-bold">- {dailyTotal} GB</span>
            </h4>
            <div className="p-1.5 bg-muted rounded-lg text-muted-foreground group-hover:text-primary transition-colors">
              <Maximize2 size={14} />
            </div>
          </div>

          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradDay" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                <XAxis
                  dataKey="time"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "var(--muted-foreground)", fontWeight: 600 }}
                  minTickGap={30}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "var(--muted-foreground)", fontWeight: 600 }}
                  tickFormatter={(val) => val.toFixed(1)}
                  dx={-10}
                />
                <Area
                  type="monotone"
                  dataKey="usage"
                  stroke="var(--primary)"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#gradDay)"
                  activeDot={{ r: 5, strokeWidth: 0, fill: "var(--primary)" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Chart Card */}
        <div
          onClick={() => setExpandedChart("monthly")}
          className="bg-card rounded-xl border border-border p-5 shadow-xs flex flex-col h-[300px] relative overflow-hidden transition-all cursor-pointer hover:border-primary/50 group"
        >
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-xs font-bold font-mono uppercase text-foreground">
              BW Usage (Last 30 Days) <span className="text-primary font-bold">- {monthlyTotal} GB</span>
            </h4>
            <div className="p-1.5 bg-muted rounded-lg text-muted-foreground group-hover:text-primary transition-colors">
              <Maximize2 size={14} />
            </div>
          </div>

          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradMonth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "var(--muted-foreground)", fontWeight: 600 }}
                  minTickGap={30}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "var(--muted-foreground)", fontWeight: 600 }}
                  tickFormatter={(val) => val.toFixed(1)}
                  dx={-10}
                />
                <Area
                  type="monotone"
                  dataKey="usage"
                  stroke="var(--primary)"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#gradMonth)"
                  activeDot={{ r: 5, strokeWidth: 0, fill: "var(--primary)" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Expanded Modal Overlay */}
      <AnimatePresence>
        {expandedChart && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/80 backdrop-blur-xs"
              onClick={() => setExpandedChart(null)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="relative bg-card border border-border rounded-xl shadow-2xl w-full max-w-5xl h-[80vh] flex flex-col overflow-hidden z-10"
            >
              <div className="p-5 border-b border-border flex flex-col sm:flex-row justify-between items-start sm:items-center bg-muted/40 gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Activity size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">
                      {expandedChart === "daily" ? "Short-Term Bandwidth Analysis" : "Long-Term Bandwidth Analysis"}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Detailed upload vs download bandwidth telemetry
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                  {expandedChart === "daily" && detailedChartData.active === "custom" && (
                    <input
                      type="date"
                      value={customDate}
                      onChange={(e) => setCustomDate(e.target.value)}
                      className="px-3 py-1.5 text-xs bg-card border border-border rounded-lg focus:outline-none focus:border-primary font-mono text-foreground"
                    />
                  )}

                  <select
                    value={detailedChartData.active}
                    onChange={(e) => detailedChartData.setter(e.target.value)}
                    className="px-3 py-1.5 text-xs bg-card border border-border rounded-lg focus:outline-none focus:border-primary font-semibold text-foreground"
                  >
                    {detailedChartData.options.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setExpandedChart(null)}
                    className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              <div className="flex-1 p-6 bg-card min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={detailedChartData.data} margin={{ top: 20, right: 30, left: -10, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                    <XAxis
                      dataKey="time"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: "var(--muted-foreground)", fontWeight: 600 }}
                      dy={10}
                      minTickGap={20}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: "var(--muted-foreground)", fontWeight: 600 }}
                      dx={-10}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        borderColor: "var(--border)",
                        borderRadius: "8px",
                        fontWeight: "bold",
                        fontSize: "12px",
                      }}
                    />
                    <Legend
                      verticalAlign="top"
                      height={36}
                      iconType="circle"
                      wrapperStyle={{ fontWeight: 600, fontSize: "12px" }}
                    />
                    <Line
                      type="monotone"
                      name="Download (GB)"
                      dataKey="download"
                      stroke="var(--primary)"
                      strokeWidth={2.5}
                      dot={false}
                      activeDot={{ r: 5, strokeWidth: 0 }}
                    />
                    <Line
                      type="monotone"
                      name="Upload (GB)"
                      dataKey="upload"
                      stroke="var(--success)"
                      strokeWidth={2.5}
                      dot={false}
                      activeDot={{ r: 5, strokeWidth: 0 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Session Log Table */}
      <div className="bg-card rounded-xl border border-border shadow-xs overflow-hidden">
        <div className="p-4 border-b border-border flex justify-between items-center bg-muted/20">
          <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-foreground">
            RADIUS PPPoE Session History
          </h4>

          <div className="relative w-64">
            <Search size={14} className="absolute left-2.5 top-2.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by IP, MAC, ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary font-mono text-foreground"
            />
          </div>
        </div>

        <div className="overflow-x-auto relative max-h-[500px]">
          <table className="w-full text-xs text-left whitespace-nowrap font-mono">
            <thead className="text-[10px] text-muted-foreground uppercase bg-muted/50 border-b border-border font-bold tracking-wider sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3">Session ID</th>
                <th className="px-4 py-3">Username</th>
                <th className="px-4 py-3">Terminate Cause</th>
                <th className="px-4 py-3">Start Time</th>
                <th className="px-4 py-3">Stop Time</th>
                <th className="px-4 py-3">Uptime</th>
                <th className="px-4 py-3">Caller MAC</th>
                <th className="px-4 py-3">Framed IP</th>
                <th className="px-4 py-3 text-right">Upload</th>
                <th className="px-4 py-3 text-right">Download</th>
                <th className="px-4 py-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredSessions.map((sess) => (
                <tr key={sess.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-bold text-primary">{sess.id}</td>
                  <td className="px-4 py-3 text-foreground font-semibold">{sess.username}</td>
                  <td className="px-4 py-3 text-muted-foreground">{sess.message}</td>
                  <td className="px-4 py-3 text-muted-foreground">{sess.login}</td>
                  <td className="px-4 py-3 text-muted-foreground">{sess.logoff}</td>
                  <td className="px-4 py-3 text-foreground font-semibold">{formatUptime(sess.uptimeSeconds)}</td>
                  <td className="px-4 py-3">
                    <div className="font-bold text-foreground">{sess.mac}</div>
                    <div className="text-[10px] text-muted-foreground">{sess.vendor}</div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{sess.ip}</td>
                  <td className="px-4 py-3 text-right text-muted-foreground">{formatBytes(sess.uploadBytes)}</td>
                  <td className="px-4 py-3 text-right text-muted-foreground">{formatBytes(sess.downloadBytes)}</td>
                  <td className="px-4 py-3 text-right font-bold text-primary">
                    {formatBytes(sess.uploadBytes + sess.downloadBytes)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
