"use client";

import React, { useState } from "react";
import {
  Layers,
  Search,
  Filter,
  Plus,
  Radio,
  RefreshCw,
  Power,
  CreditCard,
  Phone,
  FileText,
  MessageSquare,
  CheckCircle2,
  AlertTriangle,
  X,
  ChevronRight,
  TrendingUp,
  Download,
  Upload,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockDb, SubscriberRecord } from "@/mock/db";
import { cn } from "@/lib/utils";

export function SubscribersDirectoryView() {
  const [subscribers, setSubscribers] = useState<SubscriberRecord[]>(mockDb.subscribers);
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "suspended_unpaid" | "frozen">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<SubscriberRecord | null>(null);
  const [active360Tab, setActive360Tab] = useState<"kyc" | "technical" | "billing" | "tickets" | "chat">("technical");
  const [isProvisionWizardOpen, setIsProvisionWizardOpen] = useState(false);

  // Wizard State
  const [wizardStep, setWizardStep] = useState(1);
  const [newCustName, setNewCustName] = useState("");
  const [newCustCnic, setNewCustCnic] = useState("");
  const [newCustPhone, setNewCustPhone] = useState("");
  const [newCustAddress, setNewCustAddress] = useState("");
  const [newCustPackage, setNewCustPackage] = useState("pkg-50m");
  const [newCustPppoe, setNewCustPppoe] = useState("");
  const [newCustOnuSerial, setNewCustOnuSerial] = useState("");

  // Table Column Visibility State
  const [columns, setColumns] = useState([
    { id: "customerCode", label: "Customer ID", visible: true },
    { id: "subscriber", label: "Subscriber & Contact", visible: true },
    { id: "package", label: "Broadband Plan", visible: true },
    { id: "pppoe", label: "PPPoE & ONU Serial", visible: true },
    { id: "ipAddress", label: "IP Address", visible: true },
    { id: "optical", label: "Optical Signal", visible: true },
    { id: "balance", label: "Ledger Balance", visible: true },
    { id: "status", label: "Status", visible: true },
  ]);
  const [isColumnDropdownOpen, setIsColumnDropdownOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  const toggleColumn = (colId: string) => {
    setColumns((prev) =>
      prev.map((c) => (c.id === colId ? { ...c, visible: !c.visible } : c))
    );
  };

  const filteredSubscribers = subscribers.filter((sub) => {
    if (statusFilter !== "all" && sub.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        sub.fullName.toLowerCase().includes(q) ||
        sub.phone.includes(q) ||
        sub.cnic.includes(q) ||
        sub.pppoeUsername.toLowerCase().includes(q) ||
        sub.customerCode.toLowerCase().includes(q) ||
        sub.onuSerial.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCreateSubscriber = (e: React.FormEvent) => {
    e.preventDefault();
    const pkg = mockDb.packages.find((p) => p.id === newCustPackage) || mockDb.packages[1];

    const newSub: SubscriberRecord = {
      id: `cus-${Date.now()}`,
      customerCode: `PK-${Math.floor(10000 + Math.random() * 90000)}`,
      fullName: newCustName || "New Subscriber",
      cnic: newCustCnic || "37405-0000000-0",
      phone: newCustPhone || "+92 300 0000000",
      whatsapp: newCustPhone || "+92 300 0000000",
      email: `${(newCustPppoe || "user").toLowerCase()}@primenetworks.pk`,
      address: newCustAddress || "Sector F-10, Islamabad",
      geoCoords: "33.6938° N, 73.0135° E",
      branchId: "br-isb-01",
      branchName: "Islamabad Core (F-10 HQ)",
      packageId: pkg.id,
      packageName: pkg.name,
      monthlyFeePkr: pkg.pricePkrMonthly,
      pppoeUsername: newCustPppoe || `user_${Date.now().toString().slice(-4)}`,
      onuSerial: newCustOnuSerial || `HWTC-${Math.floor(1000 + Math.random() * 9000)}-F10`,
      macAddress: "48:57:02:AA:BB:CC",
      oltHostname: "Huawei MA5800-X7 (ISB-F10-OLT-01)",
      oltSlotPort: "Slot 0/2 · PON-04",
      fatBoxNumber: "FAT-F10-09 (Port 4)",
      opticalRxDbm: -19.1,
      opticalStatus: "optimal",
      currentSpeedDownMbps: pkg.speedDownMbps,
      currentSpeedUpMbps: pkg.speedUpMbps,
      ledgerBalancePkr: 0,
      securityDepositPkr: 5000,
      status: "active",
      installedAt: new Date().toISOString().split("T")[0],
      billingDueDay: 1,
    };

    setSubscribers([newSub, ...subscribers]);
    setIsProvisionWizardOpen(false);
    setWizardStep(1);
    setSelectedCustomer(newSub);
  };

  return (
    <div className="h-full w-full flex flex-col overflow-hidden">
      {/* 1. 7-Card Metrics Summary Ribbon */}
      <div className="p-3.5 border-b border-border bg-card/60 backdrop-blur-xs grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 shrink-0">
        <div className="bg-card border border-border/80 rounded-xl p-3 flex flex-col justify-between shadow-2xs">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-mono uppercase text-muted-foreground">Uptime</span>
            <div className="p-1 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-1">
            <span className="text-base font-bold font-mono text-foreground">99.94%</span>
            <span className="text-[10px] text-muted-foreground ml-1">30d</span>
          </div>
        </div>

        <div className="bg-card border border-border/80 rounded-xl p-3 flex flex-col justify-between shadow-2xs">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-mono uppercase text-muted-foreground">Total Quota</span>
            <div className="p-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Layers className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-1">
            <span className="text-base font-bold font-mono text-foreground">4,820</span>
            <span className="text-[10px] text-muted-foreground ml-1">GB</span>
          </div>
        </div>

        <div className="bg-card border border-border/80 rounded-xl p-3 flex flex-col justify-between shadow-2xs">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-mono uppercase text-muted-foreground">Used Bandwidth</span>
            <div className="p-1 rounded-md bg-destructive/10 text-destructive">
              <Upload className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-1">
            <span className="text-base font-bold font-mono text-destructive">3,190</span>
            <span className="text-[10px] text-muted-foreground ml-1">GB</span>
          </div>
        </div>

        <div className="bg-card border border-border/80 rounded-xl p-3 flex flex-col justify-between shadow-2xs">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-mono uppercase text-muted-foreground">Remaining</span>
            <div className="p-1 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Download className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-1">
            <span className="text-base font-bold font-mono text-amber-600 dark:text-amber-400">1,630</span>
            <span className="text-[10px] text-muted-foreground ml-1">GB</span>
          </div>
        </div>

        <div className="bg-card border border-border/80 rounded-xl p-3 flex flex-col justify-between shadow-2xs">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-mono uppercase text-muted-foreground">Ledger Balance</span>
            <div className="p-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CreditCard className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-1">
            <span className="text-base font-bold font-mono text-emerald-600">PKR 0</span>
            <span className="text-[10px] text-muted-foreground ml-1 font-sans font-medium">Clear</span>
          </div>
        </div>

        <div className="bg-card border border-border/80 rounded-xl p-3 flex flex-col justify-between shadow-2xs">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-mono uppercase text-muted-foreground">Overdue</span>
            <div className="p-1 rounded-md bg-destructive/10 text-destructive">
              <FileText className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-1">
            <span className="text-base font-bold font-mono text-destructive">180</span>
            <span className="text-[10px] text-muted-foreground ml-1 font-sans">Subs</span>
          </div>
        </div>

        <div className="bg-card border border-border/80 rounded-xl p-3 flex flex-col justify-between shadow-2xs col-span-2 sm:col-span-1">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-mono uppercase text-muted-foreground">Open Tickets</span>
            <div className="p-1 rounded-md bg-primary/10 text-primary">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-1">
            <span className="text-base font-bold font-mono text-primary">3</span>
            <span className="text-[10px] text-muted-foreground ml-1">Active</span>
          </div>
        </div>
      </div>

      {/* 2. Top Filter & Search Bar */}
      <div className="p-3.5 border-b border-border bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2 flex-1 max-w-lg">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <input
            type="text"
            placeholder="Search by subscriber name, phone, CNIC, PPPoE user, ONU serial..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs bg-muted/30 rounded-lg px-3 py-1.5 border border-border focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg bg-muted/60 p-0.5 border border-border text-xs">
            <button
              onClick={() => setStatusFilter("all")}
              className={cn(
                "px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer",
                statusFilter === "all" ? "bg-card text-foreground font-bold shadow-2xs" : "text-muted-foreground"
              )}
            >
              All (3,420)
            </button>
            <button
              onClick={() => setStatusFilter("active")}
              className={cn(
                "px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer",
                statusFilter === "active" ? "bg-card text-emerald-600 font-bold shadow-2xs" : "text-muted-foreground"
              )}
            >
              Active (3,120)
            </button>
            <button
              onClick={() => setStatusFilter("suspended_unpaid")}
              className={cn(
                "px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer",
                statusFilter === "suspended_unpaid" ? "bg-card text-destructive font-bold shadow-2xs" : "text-muted-foreground"
              )}
            >
              Suspended (180)
            </button>
          </div>

          {/* View Switcher */}
          <div className="flex items-center rounded-lg bg-muted/60 p-0.5 border border-border text-xs">
            <button
              onClick={() => setViewMode("table")}
              className={cn(
                "px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer",
                viewMode === "table" ? "bg-card text-foreground font-bold shadow-2xs" : "text-muted-foreground"
              )}
            >
              Table
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer",
                viewMode === "grid" ? "bg-card text-foreground font-bold shadow-2xs" : "text-muted-foreground"
              )}
            >
              Cards
            </button>
          </div>

          {/* Column Visibility Customizer Dropdown */}
          <div className="relative">
            <Button
              size="sm"
              variant="outline"
              className="text-xs"
              onClick={() => setIsColumnDropdownOpen(!isColumnDropdownOpen)}
            >
              <Filter className="h-3 w-3 mr-1" /> Columns
            </Button>

            {isColumnDropdownOpen && (
              <div className="absolute right-0 mt-1 w-52 rounded-xl bg-card border border-border shadow-xl p-2.5 z-30 space-y-1.5 text-xs animate-in fade-in zoom-in-95">
                <div className="font-bold text-muted-foreground font-mono text-[10px] uppercase pb-1 border-b border-border">
                  Toggle Visible Columns
                </div>
                {columns.map((col) => (
                  <label
                    key={col.id}
                    className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-muted/40 cursor-pointer text-foreground"
                  >
                    <input
                      type="checkbox"
                      checked={col.visible}
                      onChange={() => toggleColumn(col.id)}
                      className="rounded border-border text-primary focus:ring-primary h-3.5 w-3.5"
                    />
                    <span className="text-xs font-medium">{col.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <Button size="sm" onClick={() => setIsProvisionWizardOpen(true)}>
            <Plus className="h-3.5 w-3.5 mr-1" /> Provision Subscriber
          </Button>
        </div>
      </div>

      {/* 3. Subscribers Content Area (Table or Bento Cards) */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {viewMode === "table" ? (
          <table className="w-full text-left text-xs">
            <thead className="sticky top-0 bg-muted/70 backdrop-blur-xs border-b border-border text-[11px] font-mono uppercase text-muted-foreground z-10">
              <tr>
                <th className="p-3 w-10">
                  <input type="checkbox" className="rounded border-border" />
                </th>
                {columns.find((c) => c.id === "customerCode")?.visible && <th className="p-3">Customer ID</th>}
                {columns.find((c) => c.id === "subscriber")?.visible && <th className="p-3">Subscriber & Contact</th>}
                {columns.find((c) => c.id === "package")?.visible && <th className="p-3">Broadband Plan</th>}
                {columns.find((c) => c.id === "pppoe")?.visible && <th className="p-3">PPPoE & ONU Serial</th>}
                {columns.find((c) => c.id === "ipAddress")?.visible && <th className="p-3">IP Address</th>}
                {columns.find((c) => c.id === "optical")?.visible && <th className="p-3">Optical Signal</th>}
                {columns.find((c) => c.id === "balance")?.visible && <th className="p-3">Ledger Balance</th>}
                {columns.find((c) => c.id === "status")?.visible && <th className="p-3">Status</th>}
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredSubscribers.map((sub) => (
                <tr
                  key={sub.id}
                  onClick={() => setSelectedCustomer(sub)}
                  className="hover:bg-muted/20 transition-colors cursor-pointer group"
                >
                  <td className="p-3" onClick={(e) => e.stopPropagation()}>
                    <input type="checkbox" className="rounded border-border" />
                  </td>
                  {columns.find((c) => c.id === "customerCode")?.visible && (
                    <td className="p-3 font-mono font-bold text-primary">{sub.customerCode}</td>
                  )}
                  {columns.find((c) => c.id === "subscriber")?.visible && (
                    <td className="p-3">
                      <div className="font-bold text-foreground group-hover:text-primary transition-colors">
                        {sub.fullName}
                      </div>
                      <div className="text-[11px] text-muted-foreground font-mono">{sub.phone}</div>
                    </td>
                  )}
                  {columns.find((c) => c.id === "package")?.visible && (
                    <td className="p-3">
                      <div className="font-medium text-foreground">{sub.packageName}</div>
                      <div className="text-[10px] text-muted-foreground font-mono">
                        PKR {sub.monthlyFeePkr.toLocaleString()}/mo
                      </div>
                    </td>
                  )}
                  {columns.find((c) => c.id === "pppoe")?.visible && (
                    <td className="p-3 font-mono text-[11px]">
                      <div className="font-bold text-foreground">{sub.pppoeUsername}</div>
                      <div className="text-[10px] text-muted-foreground">{sub.onuSerial}</div>
                    </td>
                  )}
                  {columns.find((c) => c.id === "ipAddress")?.visible && (
                    <td className="p-3 font-mono text-[11px] text-muted-foreground">
                      10.244.{Math.floor(Math.abs(sub.opticalRxDbm) * 5)}.{((sub.customerCode.charCodeAt(sub.customerCode.length - 1) || 10) * 7) % 200 + 10}
                    </td>
                  )}
                  {columns.find((c) => c.id === "optical")?.visible && (
                    <td className="p-3 font-mono">
                      <Badge
                        variant={sub.opticalRxDbm < -25 ? "destructive" : "success"}
                        className="text-[10px] py-0 px-1 font-mono"
                      >
                        {sub.opticalRxDbm} dBm
                      </Badge>
                    </td>
                  )}
                  {columns.find((c) => c.id === "balance")?.visible && (
                    <td className="p-3 font-mono">
                      <span
                        className={
                          sub.ledgerBalancePkr > 0 ? "text-destructive font-bold" : "text-emerald-600 font-medium"
                        }
                      >
                        {sub.ledgerBalancePkr > 0
                          ? `PKR ${sub.ledgerBalancePkr.toLocaleString()} (Due)`
                          : "PKR 0 (Clear)"}
                      </span>
                    </td>
                  )}
                  {columns.find((c) => c.id === "status")?.visible && (
                    <td className="p-3">
                      <Badge
                        variant={
                          sub.status === "active"
                            ? "success"
                            : sub.status === "suspended_unpaid"
                            ? "destructive"
                            : "secondary"
                        }
                        className="text-[10px]"
                      >
                        {sub.status === "active"
                          ? "Active"
                          : sub.status === "suspended_unpaid"
                          ? "Suspended"
                          : "Frozen"}
                      </Badge>
                    </td>
                  )}
                  <td className="p-3 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        title="Disconnect Subscriber"
                        onClick={() =>
                          alert(`Disconnecting PPPoE session for ${sub.pppoeUsername}`)
                        }
                        className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors cursor-pointer"
                      >
                        <Power className="h-3.5 w-3.5" />
                      </button>
                      <button
                        title="Restart Port / Soft Reboot"
                        onClick={() =>
                          alert(`Restarting ONU port for ${sub.customerCode}`)
                        }
                        className="p-1.5 text-muted-foreground hover:text-emerald-600 hover:bg-emerald-500/10 rounded-lg transition-colors cursor-pointer"
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                      </button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs"
                        onClick={() => setSelectedCustomer(sub)}
                      >
                        Customer 360°
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          /* Bento Cards Grid View */
          <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredSubscribers.map((sub) => (
              <div
                key={sub.id}
                onClick={() => setSelectedCustomer(sub)}
                className="p-4 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all shadow-xs space-y-3 cursor-pointer group"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-mono text-xs font-bold text-primary">{sub.customerCode}</div>
                    <h3 className="font-heading font-bold text-sm text-foreground mt-0.5 group-hover:text-primary transition-colors">
                      {sub.fullName}
                    </h3>
                    <p className="text-xs text-muted-foreground font-mono">{sub.phone}</p>
                  </div>
                  <Badge
                    variant={sub.status === "active" ? "success" : "destructive"}
                    className="text-[10px]"
                  >
                    {sub.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-muted/30 border border-border text-[11px] font-mono">
                  <div>
                    <span className="text-muted-foreground text-[10px]">Package:</span>
                    <div className="font-bold text-foreground truncate">{sub.packageName}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-[10px]">Optical RX:</span>
                    <div className={sub.opticalRxDbm < -25 ? "text-destructive font-bold" : "text-emerald-600 font-bold"}>
                      {sub.opticalRxDbm} dBm
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border text-xs">
                  <span className="font-mono font-bold text-foreground">
                    PKR {sub.monthlyFeePkr.toLocaleString()}/mo
                  </span>
                  <Button size="sm" variant="outline" className="text-xs">
                    View 360° Profile
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CUSTOMER 360° DRAWER MODAL */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-end">
          <div className="w-full max-w-2xl h-full bg-card border-l border-border shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
            {/* Drawer Topbar */}
            <div className="p-4 border-b border-border bg-muted/20 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary text-white flex items-center justify-center font-heading font-bold text-sm">
                  {selectedCustomer.fullName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-bold text-base text-foreground">
                      {selectedCustomer.fullName}
                    </span>
                    <Badge variant="secondary" className="font-mono text-xs">
                      {selectedCustomer.customerCode}
                    </Badge>
                    <Badge variant={selectedCustomer.status === "active" ? "success" : "destructive"}>
                      {selectedCustomer.status}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {selectedCustomer.packageName} · {selectedCustomer.branchName}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Quick Contact & Dispatch Action Ribbon */}
            <div className="p-3 border-b border-border bg-card flex gap-2 shrink-0">
              <a
                href={`tel:${selectedCustomer.phone}`}
                className="flex-1 py-2 px-3 bg-muted/60 hover:bg-muted border border-border rounded-lg flex items-center justify-center gap-1.5 text-xs font-bold text-foreground transition-colors"
              >
                <Phone className="h-3.5 w-3.5 text-emerald-600" /> Call ({selectedCustomer.phone})
              </a>
              <a
                href={`https://wa.me/${selectedCustomer.phone.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2 px-3 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-lg flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 transition-colors"
              >
                <MessageSquare className="h-3.5 w-3.5 text-[#25D366]" /> WhatsApp Chat
              </a>
            </div>

            {/* 360 Navigation Tabs */}
            <div className="flex border-b border-border bg-card p-1 text-xs font-medium shrink-0">
              <button
                onClick={() => setActive360Tab("technical")}
                className={cn(
                  "flex-1 py-2 rounded-lg text-center transition-colors cursor-pointer",
                  active360Tab === "technical" ? "bg-primary text-white font-bold" : "text-muted-foreground hover:bg-muted"
                )}
              >
                <Radio className="h-3.5 w-3.5 inline mr-1" /> Technical & OLT
              </button>
              <button
                onClick={() => setActive360Tab("kyc")}
                className={cn(
                  "flex-1 py-2 rounded-lg text-center transition-colors cursor-pointer",
                  active360Tab === "kyc" ? "bg-primary text-white font-bold" : "text-muted-foreground hover:bg-muted"
                )}
              >
                <Users className="h-3.5 w-3.5 inline mr-1" /> Personal KYC
              </button>
              <button
                onClick={() => setActive360Tab("billing")}
                className={cn(
                  "flex-1 py-2 rounded-lg text-center transition-colors cursor-pointer",
                  active360Tab === "billing" ? "bg-primary text-white font-bold" : "text-muted-foreground hover:bg-muted"
                )}
              >
                <CreditCard className="h-3.5 w-3.5 inline mr-1" /> Billing & Ledger
              </button>
              <button
                onClick={() => setActive360Tab("tickets")}
                className={cn(
                  "flex-1 py-2 rounded-lg text-center transition-colors cursor-pointer",
                  active360Tab === "tickets" ? "bg-primary text-white font-bold" : "text-muted-foreground hover:bg-muted"
                )}
              >
                <FileText className="h-3.5 w-3.5 inline mr-1" /> Service History
              </button>
            </div>

            {/* 360 Content Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
              {/* SUB-TAB: TECHNICAL & OLT */}
              {active360Tab === "technical" && (
                <div className="space-y-4 text-xs">
                  <div className="p-4 rounded-xl bg-muted/30 border border-border space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-heading font-bold text-xs text-foreground flex items-center gap-1.5">
                        <Radio className="h-4 w-4 text-primary" /> SmartOLT Realtime Telemetry
                      </span>
                      <Badge variant={selectedCustomer.opticalRxDbm < -25 ? "destructive" : "success"}>
                        {selectedCustomer.opticalRxDbm} dBm (RX Level)
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-[11px] font-mono">
                      <div className="p-2.5 rounded-lg bg-card border border-border">
                        <div className="text-muted-foreground">OLT Chassis:</div>
                        <div className="font-bold text-foreground mt-0.5">{selectedCustomer.oltHostname}</div>
                      </div>
                      <div className="p-2.5 rounded-lg bg-card border border-border">
                        <div className="text-muted-foreground">PON Board & Slot:</div>
                        <div className="font-bold text-foreground mt-0.5">{selectedCustomer.oltSlotPort}</div>
                      </div>
                      <div className="p-2.5 rounded-lg bg-card border border-border">
                        <div className="text-muted-foreground">GPON ONU Serial:</div>
                        <div className="font-bold text-primary mt-0.5">{selectedCustomer.onuSerial}</div>
                      </div>
                      <div className="p-2.5 rounded-lg bg-card border border-border">
                        <div className="text-muted-foreground">FAT Box / Splitter:</div>
                        <div className="font-bold text-foreground mt-0.5">{selectedCustomer.fatBoxNumber}</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-card border border-border space-y-2">
                    <div className="font-heading font-bold text-xs text-foreground">
                      MikroTik / Radius PPPoE Binding
                    </div>
                    <div className="flex justify-between font-mono">
                      <span className="text-muted-foreground">Username:</span>
                      <span className="font-bold text-primary">{selectedCustomer.pppoeUsername}</span>
                    </div>
                    <div className="flex justify-between font-mono">
                      <span className="text-muted-foreground">Assigned MAC:</span>
                      <span className="text-foreground">{selectedCustomer.macAddress}</span>
                    </div>
                    <div className="flex justify-between font-mono">
                      <span className="text-muted-foreground">Live Throughput:</span>
                      <span className="text-emerald-600 font-bold">{selectedCustomer.currentSpeedDownMbps} Mbps Down / {selectedCustomer.currentSpeedUpMbps} Mbps Up</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-card border border-border space-y-2.5">
                    <div className="font-heading font-bold text-xs text-foreground">
                      NOC Instant Action Triggers
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs justify-start"
                        onClick={() => alert(`TR-069 soft reboot signal dispatched to ONU ${selectedCustomer.onuSerial}`)}
                      >
                        <RefreshCw className="h-3.5 w-3.5 text-warning mr-1.5" /> TR-069 Router Reboot
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs justify-start"
                        onClick={() => alert(`Radius PPPoE session kicked and reset for ${selectedCustomer.pppoeUsername}`)}
                      >
                        <Power className="h-3.5 w-3.5 text-destructive mr-1.5" /> Reset PPPoE Session
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* SUB-TAB: PERSONAL KYC */}
              {active360Tab === "kyc" && (
                <div className="space-y-4 text-xs">
                  <div className="p-4 rounded-xl bg-card border border-border space-y-2.5">
                    <div className="font-heading font-bold text-xs text-foreground">
                      Subscriber Identity & Contact
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Full Name:</span>
                      <span className="font-bold text-foreground">{selectedCustomer.fullName}</span>
                    </div>
                    <div className="flex justify-between font-mono">
                      <span className="text-muted-foreground">CNIC / ID:</span>
                      <span className="font-bold text-foreground">{selectedCustomer.cnic}</span>
                    </div>
                    <div className="flex justify-between font-mono">
                      <span className="text-muted-foreground">Primary Mobile:</span>
                      <span className="text-foreground">{selectedCustomer.phone}</span>
                    </div>
                    <div className="flex justify-between font-mono">
                      <span className="text-muted-foreground">Email:</span>
                      <span className="text-foreground">{selectedCustomer.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Installation Address:</span>
                      <span className="text-foreground text-right">{selectedCustomer.address}</span>
                    </div>
                    <div className="flex justify-between font-mono text-[11px]">
                      <span className="text-muted-foreground">GPS Location:</span>
                      <span className="text-primary">{selectedCustomer.geoCoords}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* SUB-TAB: BILLING & LEDGER */}
              {active360Tab === "billing" && (
                <div className="space-y-4 text-xs">
                  <div className="p-4 rounded-xl bg-muted/30 border border-border space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Current Ledger Balance:</span>
                      <span className="font-mono font-extrabold text-base text-foreground">
                        PKR {selectedCustomer.ledgerBalancePkr.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between font-mono text-[11px]">
                      <span className="text-muted-foreground">Monthly Plan Charge:</span>
                      <span>PKR {selectedCustomer.monthlyFeePkr.toLocaleString()} / mo</span>
                    </div>
                    <div className="flex justify-between font-mono text-[11px]">
                      <span className="text-muted-foreground">Security Deposit (ONU):</span>
                      <span>PKR {selectedCustomer.securityDepositPkr.toLocaleString()} (Refundable)</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-card border border-border space-y-2">
                    <div className="font-heading font-bold text-xs text-foreground mb-1">
                      Recent Invoice History
                    </div>
                    <div className="p-2.5 rounded-lg bg-muted/20 border border-border flex items-center justify-between font-mono text-[11px]">
                      <div>
                        <div className="font-bold text-foreground">INV-2026-08-01</div>
                        <div className="text-[10px] text-muted-foreground">50M Ultra Plan · Paid</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-emerald-600">PKR 3,850</span>
                        <Button size="sm" variant="outline" onClick={() => alert("Downloading PDF invoice")}>
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SUB-TAB: SERVICE HISTORY */}
              {active360Tab === "tickets" && (
                <div className="space-y-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-card border border-border space-y-1.5">
                    <div className="flex justify-between items-center font-mono">
                      <span className="font-bold text-primary">TK-8842</span>
                      <Badge variant="destructive" className="text-[9.5px]">Critical</Badge>
                    </div>
                    <div className="font-bold text-foreground">Fiber Drop Cut / Red LOS</div>
                    <p className="text-[11px] text-muted-foreground">
                      Dispatched Splicer Usman (Van #04) with OTDR. Break detected at 65m.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* PROVISION NEW SUBSCRIBER MULTI-STEP WIZARD MODAL */}
      {isProvisionWizardOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-card rounded-2xl border border-border shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <h3 className="font-heading font-bold text-base text-foreground">
                  Provision New Fiber Subscriber
                </h3>
                <p className="text-xs text-muted-foreground">Step {wizardStep} of 3: Enter subscriber details</p>
              </div>
              <button onClick={() => setIsProvisionWizardOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubscriber} className="space-y-4 text-xs">
              {wizardStep === 1 && (
                <div className="space-y-3">
                  <div>
                    <label className="block font-bold text-muted-foreground mb-1">Full Customer Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Bilal Qureshi"
                      value={newCustName}
                      onChange={(e) => setNewCustName(e.target.value)}
                      className="w-full bg-muted/30 rounded-lg p-2 border border-border text-foreground"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-muted-foreground mb-1">CNIC / ID #</label>
                      <input
                        type="text"
                        required
                        placeholder="37405-1234567-1"
                        value={newCustCnic}
                        onChange={(e) => setNewCustCnic(e.target.value)}
                        className="w-full bg-muted/30 rounded-lg p-2 border border-border text-foreground font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-muted-foreground mb-1">Mobile Phone</label>
                      <input
                        type="text"
                        required
                        placeholder="+92 300 1234567"
                        value={newCustPhone}
                        onChange={(e) => setNewCustPhone(e.target.value)}
                        className="w-full bg-muted/30 rounded-lg p-2 border border-border text-foreground font-mono"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-bold text-muted-foreground mb-1">Installation Address</label>
                    <input
                      type="text"
                      required
                      placeholder="House #, Street #, Sector F-10/2, Islamabad"
                      value={newCustAddress}
                      onChange={(e) => setNewCustAddress(e.target.value)}
                      className="w-full bg-muted/30 rounded-lg p-2 border border-border text-foreground"
                    />
                  </div>
                  <Button type="button" size="sm" className="w-full" onClick={() => setWizardStep(2)}>
                    Next: Technical Parameters <ChevronRight className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </div>
              )}

              {wizardStep === 2 && (
                <div className="space-y-3">
                  <div>
                    <label className="block font-bold text-muted-foreground mb-1">Select Broadband Plan</label>
                    <select
                      value={newCustPackage}
                      onChange={(e) => setNewCustPackage(e.target.value)}
                      className="w-full bg-muted/30 rounded-lg p-2 border border-border text-foreground font-mono"
                    >
                      {mockDb.packages.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} - {p.speedDownMbps}M (PKR {p.pricePkrMonthly.toLocaleString()}/mo)
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-muted-foreground mb-1">PPPoE Username</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. bilal_f10"
                      value={newCustPppoe}
                      onChange={(e) => setNewCustPppoe(e.target.value)}
                      className="w-full bg-muted/30 rounded-lg p-2 border border-border text-foreground font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-muted-foreground mb-1">Hardware ONU Serial (HWTC-xxxx)</label>
                    <input
                      type="text"
                      required
                      placeholder="HWTC-9921-F104"
                      value={newCustOnuSerial}
                      onChange={(e) => setNewCustOnuSerial(e.target.value)}
                      className="w-full bg-muted/30 rounded-lg p-2 border border-border text-foreground font-mono"
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => setWizardStep(1)}>
                      Back
                    </Button>
                    <Button type="submit" size="sm" className="flex-1">
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Complete & Activate Subscriber
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
