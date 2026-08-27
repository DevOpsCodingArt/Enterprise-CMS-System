"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  Filter,
  Columns,
  LayoutGrid,
  List,
  MapPin,
  Plus,
  RefreshCw,
  Info,
  X,
  RotateCcw,
  Unplug,
  Check,
  GripVertical,
} from "lucide-react";
import { mockDb, SubscriberRecord } from "@/mock/db";
import { SubscribersMetricsRibbon } from "./SubscribersMetricsRibbon";
import { Customer360ProfileView } from "./profile/Customer360ProfileView";
import { AddSubscriberModal } from "./AddSubscriberModal";
import { SubscribersMapView } from "./SubscribersMapView";
import { SubscribersGridView } from "./SubscribersGridView";
import { Tooltip } from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/toast";

export interface ColumnItem {
  id: string;
  label: string;
  visible: boolean;
}

export function SubscribersDirectoryView() {
  const toast = useToast();
  const [subscribers, setSubscribers] = useState<SubscriberRecord[]>(mockDb.subscribers);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"Standard" | "Grid" | "Map">("Standard");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Popover States
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSearchInfoOpen, setIsSearchInfoOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Selected Subscriber for Customer 360 view
  const [selectedSubscriber, setSelectedSubscriber] = useState<SubscriberRecord | null>(null);

  // Filters State
  const [filters, setFilters] = useState<{
    profileStatus: string[];
    connection: string[];
    financial: string[];
    expiration: string[];
    settings: string[];
  }>({
    profileStatus: [],
    connection: [],
    financial: [],
    expiration: [],
    settings: [],
  });

  // Manage Columns State
  const [columns, setColumns] = useState<ColumnItem[]>([
    { id: "profileStatus", label: "Profile Status", visible: true },
    { id: "connectionStatus", label: "Connection Status", visible: true },
    { id: "uptime", label: "Uptime", visible: false },
    { id: "ipAddress", label: "IP Address", visible: true },
    { id: "macAddress", label: "MAC Address", visible: false },
    { id: "routerModel", label: "Router Model", visible: false },
    { id: "balance", label: "Balance", visible: true },
    { id: "package", label: "Package", visible: true },
    { id: "expirationDate", label: "Expiration", visible: true },
  ]);

  const filterRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);
  const searchInfoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setIsSettingsOpen(false);
      }
      if (searchInfoRef.current && !searchInfoRef.current.contains(event.target as Node)) {
        setIsSearchInfoOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const totalActiveFilters = Object.values(filters).flat().length;
  const hasActiveFilters = totalActiveFilters > 0;

  const toggleFilter = (category: keyof typeof filters, value: string) => {
    setFilters((prev) => {
      const current = prev[category];
      const exists = current.includes(value);
      return {
        ...prev,
        [category]: exists ? current.filter((v) => v !== value) : [...current, value],
      };
    });
  };

  const clearAllFilters = () => {
    setFilters({
      profileStatus: [],
      connection: [],
      financial: [],
      expiration: [],
      settings: [],
    });
  };

  const handleSyncLegacy = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      toast.success("Legacy Sync Completed", "Synchronized subscriber records from radius database.");
    }, 1200);
  };

  const handleDisconnect = (sub: SubscriberRecord) => {
    toast.warning("Radius Session Terminated", `CoA disconnect packet sent for ${sub.pppoeUsername}.`);
  };

  const handleRestart = (sub: SubscriberRecord) => {
    toast.success("ONT Reboot Triggered", `Restart packet sent to ${sub.fullName} (${sub.customerCode}).`);
  };

  const handleToggleSelectAll = () => {
    if (selectedIds.length === filteredSubscribers.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredSubscribers.map((s) => s.id));
    }
  };

  const handleToggleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Filtered subscribers
  const q = searchQuery.toLowerCase().trim();
  const filteredSubscribers = subscribers.filter((sub) => {
    // 1. Search Query
    const matchesSearch =
      !q ||
      sub.fullName.toLowerCase().includes(q) ||
      sub.customerCode.toLowerCase().includes(q) ||
      sub.phone.includes(q) ||
      sub.pppoeUsername.toLowerCase().includes(q) ||
      (sub.staticIp && sub.staticIp.includes(q)) ||
      sub.address.toLowerCase().includes(q);

    // 2. Profile Status Filter
    const matchesStatus =
      filters.profileStatus.length === 0 ||
      (filters.profileStatus.includes("Active") && sub.status === "active") ||
      (filters.profileStatus.includes("Suspended") && sub.status === "suspended_unpaid") ||
      (filters.profileStatus.includes("Frozen") && sub.status === "frozen") ||
      (filters.profileStatus.includes("Terminated") && sub.status === "terminated");

    // 3. Financials Filter
    const matchesFinancial =
      filters.financial.length === 0 ||
      (filters.financial.includes("Pending Dues") && sub.ledgerBalancePkr > 0) ||
      (filters.financial.includes("Fully Paid") && sub.ledgerBalancePkr <= 0);

    return matchesSearch && matchesStatus && matchesFinancial;
  });

  const activeColumns = columns.filter((c) => c.visible);

  return (
    <div className="h-full w-full overflow-y-auto p-4 md:p-6 space-y-4 custom-scrollbar flex flex-col min-h-0">
      {/* 1. Metrics Summary Ribbon */}
      <SubscribersMetricsRibbon
        metrics={{
          uptime: "28d 14h",
          totalGB: 12500,
          usedGB: 4180,
          remainingGB: 8320,
          balance: "45,200",
          due: "12,500",
          tickets: 4,
        }}
      />

      {/* 2. Top Title & Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-foreground tracking-tight">All Subscribers</h1>
            <div className="relative flex items-center" ref={searchInfoRef}>
              <button
                type="button"
                onClick={() => setIsSearchInfoOpen(!isSearchInfoOpen)}
                className="text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                title="Search Instructions"
              >
                <Info size={16} />
              </button>

              {isSearchInfoOpen && (
                <div className="absolute top-full mt-2 left-0 w-[480px] max-w-[90vw] bg-card border border-border rounded-xl shadow-2xl p-5 z-50 animate-in fade-in zoom-in-95">
                  <div className="flex justify-between items-center mb-4 pb-2 border-b border-border">
                    <h4 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                      <Search size={14} className="text-primary" /> Advanced Search Guide
                    </h4>
                    <button
                      type="button"
                      onClick={() => setIsSearchInfoOpen(false)}
                      className="text-muted-foreground hover:text-foreground rounded p-1"
                    >
                      <X size={14} />
                    </button>
                  </div>

                  <div className="space-y-4 text-xs">
                    <div>
                      <h5 className="font-mono text-[10px] uppercase font-bold text-muted-foreground mb-2">
                        Basics Syntax
                      </h5>
                      <div className="space-y-1.5">
                        <div className="flex items-start gap-2">
                          <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-[11px]">Ali</code>
                          <p className="text-muted-foreground">Type text to search across names, usernames, and phones.</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <code className="bg-primary/10 text-primary px-1.5 py-0.5 rounded font-mono text-[11px]">
                            &quot;Dr. Bilal&quot;
                          </code>
                          <p className="text-muted-foreground">Use quotes for exact phrase matching.</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h5 className="font-mono text-[10px] uppercase font-bold text-muted-foreground mb-2">
                        Field Specific Filters
                      </h5>
                      <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                        <div className="p-2 rounded bg-muted/40 border border-border flex items-center gap-1.5">
                          <span className="text-primary font-bold">code:PK-84920</span>
                        </div>
                        <div className="p-2 rounded bg-muted/40 border border-border flex items-center gap-1.5">
                          <span className="text-primary font-bold">user:ali_f10</span>
                        </div>
                        <div className="p-2 rounded bg-muted/40 border border-border flex items-center gap-1.5">
                          <span className="text-primary font-bold">phone:0300</span>
                        </div>
                        <div className="p-2 rounded bg-muted/40 border border-border flex items-center gap-1.5">
                          <span className="text-primary font-bold">cnic:37405</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Manage and view all customer connections & 360° telemetry.</p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Tooltip content="Sync with Radius Server" position="bottom">
            <button
              type="button"
              onClick={handleSyncLegacy}
              disabled={isSyncing}
              className="flex items-center justify-center w-9 h-9 bg-card border border-border rounded-lg text-muted-foreground hover:text-primary hover:bg-muted transition-colors disabled:opacity-50 shadow-xs cursor-pointer"
            >
              <RefreshCw size={15} className={isSyncing ? "animate-spin text-primary" : ""} />
            </button>
          </Tooltip>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 transition-colors shadow-xs cursor-pointer"
          >
            <Plus size={15} /> Add Subscriber
          </button>
        </div>
      </div>

      {/* 3. Control & Toolbar Box */}
      <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-3 bg-card p-2.5 border border-border rounded-xl shadow-xs shrink-0 relative z-20">
        {/* Left Side: Filter and View Toggles */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Advanced Filter Popover Trigger */}
          <div className="relative" ref={filterRef}>
            <button
              type="button"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                isFilterOpen || hasActiveFilters
                  ? "bg-primary/10 text-primary border-primary/30"
                  : "text-muted-foreground bg-muted/40 border-border hover:bg-muted"
              }`}
            >
              <div className="relative flex items-center justify-center">
                <Filter size={14} className={isFilterOpen || hasActiveFilters ? "text-primary" : "text-muted-foreground"} />
                {hasActiveFilters && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
                )}
              </div>
              Filter {hasActiveFilters && `(${totalActiveFilters})`}
            </button>

            {isFilterOpen && (
              <div className="absolute top-full mt-2 left-0 w-80 bg-card border border-border rounded-xl shadow-2xl p-4 z-50 space-y-4 animate-in fade-in zoom-in-95">
                <div className="flex justify-between items-center pb-2 border-b border-border">
                  <h4 className="font-bold text-xs text-foreground uppercase tracking-wider">Advanced Filters</h4>
                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={clearAllFilters}
                      className="text-[11px] font-semibold text-primary hover:underline cursor-pointer"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                <div className="space-y-3.5 max-h-72 overflow-y-auto custom-scrollbar pr-1 text-xs">
                  {/* Profile Status */}
                  <div>
                    <h5 className="text-[10px] font-mono font-bold text-muted-foreground uppercase mb-1.5">
                      Profile Status
                    </h5>
                    <div className="flex flex-wrap gap-1.5">
                      {["Active", "Suspended", "Frozen", "Terminated"].map((status) => {
                        const isSelected = filters.profileStatus.includes(status);
                        return (
                          <button
                            key={status}
                            type="button"
                            onClick={() => toggleFilter("profileStatus", status)}
                            className={`px-2.5 py-1 rounded text-xs font-mono font-semibold transition-colors cursor-pointer ${
                              isSelected
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted/40 text-foreground border border-border hover:bg-muted"
                            }`}
                          >
                            {status}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Financials */}
                  <div>
                    <h5 className="text-[10px] font-mono font-bold text-muted-foreground uppercase mb-1.5">
                      Financials
                    </h5>
                    <div className="flex flex-wrap gap-1.5">
                      {["Pending Dues", "Fully Paid"].map((fin) => {
                        const isSelected = filters.financial.includes(fin);
                        return (
                          <button
                            key={fin}
                            type="button"
                            onClick={() => toggleFilter("financial", fin)}
                            className={`px-2.5 py-1 rounded text-xs font-mono font-semibold transition-colors cursor-pointer ${
                              isSelected
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted/40 text-foreground border border-border hover:bg-muted"
                            }`}
                          >
                            {fin}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* View Mode Buttons */}
          <div className="flex items-center bg-muted/50 p-1 rounded-lg border border-border">
            <button
              type="button"
              onClick={() => setViewMode("Standard")}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-colors flex items-center gap-1.5 cursor-pointer ${
                viewMode === "Standard"
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <List size={13} /> Standard View
            </button>
            <button
              type="button"
              onClick={() => setViewMode("Grid")}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 cursor-pointer ${
                viewMode === "Grid"
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <LayoutGrid size={13} /> Grid View
            </button>
            <button
              type="button"
              onClick={() => setViewMode("Map")}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 cursor-pointer ${
                viewMode === "Map"
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <MapPin size={13} /> Map View
            </button>
          </div>
        </div>

        {/* Right Side: Search & Manage Columns */}
        <div className="flex items-center gap-2.5">
          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-2.5 top-2.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Quick find ID or Username..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-background border border-border rounded-lg pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all font-mono"
            />
          </div>

          <div className="relative" ref={settingsRef}>
            <button
              type="button"
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                isSettingsOpen ? "bg-primary/10 text-primary border-primary/30" : "bg-muted/40 border-border text-muted-foreground hover:bg-muted"
              }`}
            >
              <Columns size={14} />
              <span>Columns</span>
            </button>

            {isSettingsOpen && (
              <div className="absolute top-full mt-2 right-0 w-64 bg-card border border-border rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95">
                <div className="px-3.5 py-2.5 bg-muted/40 border-b border-border flex justify-between items-center text-xs">
                  <h4 className="font-bold text-foreground uppercase tracking-wider">Manage Columns</h4>
                  <span className="text-[10px] font-mono text-muted-foreground">
                    {activeColumns.length} visible
                  </span>
                </div>
                <div className="p-2 max-h-60 overflow-y-auto space-y-1 text-xs custom-scrollbar">
                  {columns.map((col, idx) => (
                    <div
                      key={col.id}
                      onClick={() => {
                        const newCols = [...columns];
                        newCols[idx].visible = !newCols[idx].visible;
                        setColumns(newCols);
                      }}
                      className={`flex justify-between items-center px-2.5 py-1.5 rounded-md cursor-pointer transition-colors ${
                        col.visible ? "bg-primary/10 text-primary font-semibold" : "hover:bg-muted text-muted-foreground"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <GripVertical size={13} className="text-muted-foreground/60" />
                        <span>{col.label}</span>
                      </div>
                      <div
                        className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${
                          col.visible ? "bg-primary border-primary text-primary-foreground" : "border-border bg-card"
                        }`}
                      >
                        {col.visible && <Check size={10} />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. Active View Rendering */}
      <div className="flex-1 min-h-0 flex flex-col">
        {viewMode === "Standard" && (
          <div className="flex-1 border border-border rounded-xl bg-card shadow-xs overflow-hidden flex flex-col min-h-0">
            <div className="overflow-auto custom-scrollbar flex-1">
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead className="bg-muted/60 border-b border-border sticky top-0 z-10 backdrop-blur-sm uppercase font-mono text-[10.5px] font-bold text-muted-foreground tracking-wider">
                  <tr>
                    <th className="p-3 w-8">
                      <input
                        type="checkbox"
                        checked={
                          filteredSubscribers.length > 0 &&
                          selectedIds.length === filteredSubscribers.length
                        }
                        onChange={handleToggleSelectAll}
                        className="rounded border-border accent-primary cursor-pointer"
                      />
                    </th>
                    <th className="px-3 py-2.5">ID</th>
                    <th className="px-3 py-2.5">Actions</th>
                    <th className="px-3 py-2.5">Subscriber</th>
                    {columns.find((c) => c.id === "profileStatus")?.visible && (
                      <th className="px-3 py-2.5 text-center">Profile Status</th>
                    )}
                    {columns.find((c) => c.id === "connectionStatus")?.visible && (
                      <th className="px-3 py-2.5 text-center">Session</th>
                    )}
                    {columns.find((c) => c.id === "ipAddress")?.visible && (
                      <th className="px-3 py-2.5">IP Address</th>
                    )}
                    {columns.find((c) => c.id === "package")?.visible && (
                      <th className="px-3 py-2.5">Package</th>
                    )}
                    {columns.find((c) => c.id === "balance")?.visible && (
                      <th className="px-3 py-2.5 text-right">Balance</th>
                    )}
                    {columns.find((c) => c.id === "expirationDate")?.visible && (
                      <th className="px-3 py-2.5">Optical Rx</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredSubscribers.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="px-4 py-8 text-center text-muted-foreground font-mono">
                        No subscribers found matching your criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredSubscribers.map((sub) => {
                      const isSelected = selectedIds.includes(sub.id);
                      return (
                        <tr
                          key={sub.id}
                          onClick={() => setSelectedSubscriber(sub)}
                          className={`hover:bg-muted/40 transition-colors cursor-pointer ${
                            isSelected ? "bg-primary/10 font-medium" : ""
                          }`}
                        >
                          <td className="p-3 w-8" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleToggleSelectRow(sub.id)}
                              className="rounded border-border accent-primary cursor-pointer"
                            />
                          </td>
                          <td className="px-3 py-2 font-mono font-bold text-primary">{sub.customerCode}</td>
                          <td className="px-3 py-2" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center gap-1.5">
                              <Tooltip content="Disconnect Session" position="top">
                                <button
                                  type="button"
                                  onClick={() => handleDisconnect(sub)}
                                  className="p-1 text-destructive hover:bg-destructive/10 rounded transition-colors cursor-pointer"
                                >
                                  <Unplug size={14} />
                                </button>
                              </Tooltip>
                              <Tooltip content="Restart ONT" position="top">
                                <button
                                  type="button"
                                  onClick={() => handleRestart(sub)}
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
                          {columns.find((c) => c.id === "profileStatus")?.visible && (
                            <td className="px-3 py-2 text-center">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                                  sub.status === "active"
                                    ? "bg-success/10 text-success border border-success/20"
                                    : "bg-destructive/10 text-destructive border border-destructive/20"
                                }`}
                              >
                                {sub.status === "active" ? "ACTIVE" : "SUSPENDED"}
                              </span>
                            </td>
                          )}
                          {columns.find((c) => c.id === "connectionStatus")?.visible && (
                            <td className="px-3 py-2 text-center">
                              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-success/10 text-success border border-success/20">
                                ONLINE
                              </span>
                            </td>
                          )}
                          {columns.find((c) => c.id === "ipAddress")?.visible && (
                            <td className="px-3 py-2 font-mono text-muted-foreground">
                              {sub.staticIp || "103.14.22.84"}
                            </td>
                          )}
                          {columns.find((c) => c.id === "package")?.visible && (
                            <td className="px-3 py-2 font-medium text-foreground">
                              <span className="text-primary font-bold">{sub.packageName}</span>
                            </td>
                          )}
                          {columns.find((c) => c.id === "balance")?.visible && (
                            <td className="px-3 py-2 text-right font-mono font-bold text-foreground">
                              Rs. {(sub.ledgerBalancePkr || 0).toLocaleString()}
                            </td>
                          )}
                          {columns.find((c) => c.id === "expirationDate")?.visible && (
                            <td className="px-3 py-2 font-mono font-bold text-success">
                              {sub.opticalRxDbm || -18.4} dBm
                            </td>
                          )}
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-2 border-t border-border bg-muted/20 flex justify-between items-center text-xs font-mono text-muted-foreground">
              <span>Showing {filteredSubscribers.length} total subscribers</span>
              <span className="text-[10px]">Click any row to open full Customer 360° Profile</span>
            </div>
          </div>
        )}

        {viewMode === "Grid" && (
          <SubscribersGridView
            subscribers={filteredSubscribers}
            onSelectSubscriber={(sub) => setSelectedSubscriber(sub)}
            onDisconnect={handleDisconnect}
            onRestart={handleRestart}
          />
        )}

        {viewMode === "Map" && (
          <SubscribersMapView
            subscribers={filteredSubscribers}
            onSelectSubscriber={(sub) => setSelectedSubscriber(sub)}
          />
        )}
      </div>

      {/* 5. Modals */}
      {selectedSubscriber && (
        <Customer360ProfileView
          subscriber={selectedSubscriber}
          onClose={() => setSelectedSubscriber(null)}
        />
      )}

      <AddSubscriberModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={(newSub) => {
          setSubscribers((prev) => [newSub, ...prev]);
        }}
      />
    </div>
  );
}
