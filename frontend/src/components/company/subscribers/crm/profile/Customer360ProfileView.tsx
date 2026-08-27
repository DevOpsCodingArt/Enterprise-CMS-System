"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  User,
  Shield,
  CreditCard,
  Box,
  Settings,
  Activity,
  FileText,
  Clock,
  Zap,
  PowerOff,
  ShieldAlert,
  LineChart,
  Lock,
  Key,
  Link as LinkIcon,
  File,
  List,
  XCircle,
  Camera,
  Server,
  ChevronRight,
  MapPin,
  Cpu,
  Fingerprint,
  CheckCircle2,
  AlertTriangle,
  Radio,
  X,
  HardHat,
  Network,
  Download,
  Upload,
  Phone,
  MessageCircle,
  RefreshCw,
  StickyNote,
  Plus,
  MoreVertical,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SubscribersMetricsRibbon } from "../SubscribersMetricsRibbon";
import { useToast } from "@/components/ui/toast";
import { SubscriberRecord } from "@/mock/db";
import { Tooltip } from "@/components/ui/tooltip";

// Reusable DataField Component matching reference design
function DataField({
  label,
  value,
  renderValue,
  mono = false,
}: {
  label: string;
  value?: string | number | null;
  renderValue?: () => React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-border/40 last:border-0 text-xs">
      <span className="text-muted-foreground font-mono text-[11px] uppercase tracking-wider font-bold">
        {label}
      </span>
      {renderValue ? (
        renderValue()
      ) : (
        <span
          className={`font-semibold text-foreground ${
            mono ? "font-mono text-xs" : ""
          }`}
        >
          {value || "--"}
        </span>
      )}
    </div>
  );
}

// Reusable DataCard Component with crisp box styling
function DataCard({
  title,
  icon: Icon,
  children,
  badge,
}: {
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  badge?: React.ReactNode;
}) {
  return (
    <div className="p-5 rounded-lg bg-card border border-border space-y-3 shadow-xs hover:border-primary/40 transition-colors">
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="h-4 w-4 text-primary" />}
          <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-foreground">
            {title}
          </h3>
        </div>
        {badge}
      </div>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

export function Customer360ProfileView({
  subscriber,
  onClose,
}: {
  subscriber: SubscriberRecord;
  onClose: () => void;
}) {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<string>("Profile");
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const [isFabOpen, setIsFabOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const splitRef = useRef<HTMLDivElement>(null);
  const fabRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (splitRef.current && !splitRef.current.contains(event.target as Node)) {
        setIsActionsOpen(false);
      }
      if (fabRef.current && !fabRef.current.contains(event.target as Node)) {
        setIsFabOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const tabs = [
    "Profile",
    "Activities",
    "Ledgers",
    "Invoices",
    "Session Log",
    "Tickets",
    "Login Log",
    "MAC Address",
    "Reports",
    "Services",
    "Documents",
    "CoA Logs",
  ];

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      toast.success("Profile Synced", "Subscriber profile synced with RADIUS backend.");
    }, 1200);
  };

  const handleAction = (label: string) => {
    toast.success("Action Executed", `${label} triggered for ${subscriber.fullName}.`);
    setIsActionsOpen(false);
    setIsFabOpen(false);
  };

  const handlePhotoClick = () => fileInputRef.current?.click();
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      toast.success("Photo Updated", "Subscriber profile photo updated.");
    }
  };

  const handleAddNote = () => {
    const note = window.prompt("Add a quick note for this subscriber:");
    if (note) toast.success("Note Saved", "Note saved successfully to subscriber logs.");
  };

  const networkFabActions = [
    { icon: ShieldAlert, label: "Disable Network", variant: "danger" },
    { icon: XCircle, label: "Disable Profile", variant: "danger" },
    { icon: PowerOff, label: "Disconnect Session", variant: "danger" },
    { icon: Server, label: "Box / POP Info", variant: "default" },
    { icon: Settings, label: "Service Settings", variant: "default" },
    { icon: LineChart, label: "Live Optical Graph", variant: "default" },
    { icon: RefreshCw, label: "Migrate Node", variant: "default" },
    { icon: Zap, label: "Activate Connection", variant: "primary" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-background/80 backdrop-blur-xs"
      />

      {/* Main Modal Box Window */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 8 }}
        className="relative w-full max-w-6xl h-[92vh] bg-card border border-border rounded-xl shadow-2xl z-10 flex flex-col overflow-hidden"
      >
        {/* Top Breadcrumb & Close Bar */}
        <div className="px-6 py-3 border-b border-border bg-muted/20 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
            <span className="hover:text-primary cursor-pointer" onClick={onClose}>
              Subscribers
            </span>
            <ChevronRight size={13} />
            <span className="font-bold text-foreground">{subscriber.fullName}</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Live Telemetry Linked
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 hover:bg-muted text-muted-foreground hover:text-foreground rounded transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Profile Header Box */}
        <div className="p-6 border-b border-border bg-card flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 shrink-0 relative z-30">
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center relative group cursor-pointer shrink-0"
              onClick={handlePhotoClick}
            >
              <span className="text-2xl font-black text-primary font-heading">
                {subscriber.fullName.charAt(0)}
              </span>
              <div className="absolute inset-0 bg-background/80 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-5 h-5 text-primary" />
              </div>
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-success ring-2 ring-card" />
              <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} accept="image/*" className="hidden" />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-foreground">
                  {subscriber.fullName}
                </h1>
                <span className="text-xs text-muted-foreground font-mono">
                  ({subscriber.pppoeUsername})
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-primary/10 text-primary border border-primary/20">
                  {subscriber.customerCode}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-success/10 text-success border border-success/20">
                  ONLINE
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-success/10 text-success border border-success/20">
                  ACTIVE PROFILE
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-muted text-muted-foreground border border-border">
                  {subscriber.packageName}
                </span>
              </div>
            </div>
          </div>

          {/* Action Area */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center bg-muted/40 border border-border p-1 rounded-lg">
              <Tooltip content="Sync Profile" position="top">
                <button
                  type="button"
                  onClick={handleSync}
                  disabled={isSyncing}
                  className="p-1.5 text-muted-foreground hover:text-primary hover:bg-card rounded transition-colors cursor-pointer"
                >
                  <RefreshCw size={15} className={isSyncing ? "animate-spin text-primary" : ""} />
                </button>
              </Tooltip>
              <div className="w-[1px] h-4 bg-border mx-1" />
              <Tooltip content="Add Quick Note" position="top">
                <button
                  type="button"
                  onClick={handleAddNote}
                  className="p-1.5 text-muted-foreground hover:text-primary hover:bg-card rounded transition-colors cursor-pointer"
                >
                  <StickyNote size={15} />
                </button>
              </Tooltip>
            </div>

            <button
              type="button"
              onClick={() => handleAction("Edit Profile")}
              className="px-3 py-1.5 bg-card border border-border text-foreground hover:bg-muted font-bold text-xs rounded-lg transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <User size={14} className="text-primary" /> Edit Profile
            </button>

            <button
              type="button"
              onClick={() => handleAction("Add Payment")}
              className="px-3 py-1.5 bg-success text-success-foreground hover:bg-success/90 font-bold text-xs rounded-lg transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus size={14} /> Balance
            </button>

            <div className="relative" ref={splitRef}>
              <button
                type="button"
                onClick={() => setIsActionsOpen(!isActionsOpen)}
                className="p-1.5 bg-muted/40 hover:bg-muted border border-border text-muted-foreground hover:text-foreground rounded-lg transition-colors cursor-pointer"
              >
                <MoreVertical size={16} />
              </button>

              {isActionsOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-card border border-border rounded-xl shadow-2xl py-2 z-50 text-xs animate-in fade-in zoom-in-95">
                  <div className="px-3 py-1.5 text-[10px] font-mono uppercase font-bold text-muted-foreground border-b border-border mb-1">
                    Account & Security
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAction("Change Password")}
                    className="w-full text-left px-3 py-1.5 hover:bg-muted flex items-center gap-2 font-medium"
                  >
                    <Lock size={13} className="text-muted-foreground" /> Change Password
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAction("Generate Login Link")}
                    className="w-full text-left px-3 py-1.5 hover:bg-muted flex items-center gap-2 font-medium"
                  >
                    <LinkIcon size={13} className="text-muted-foreground" /> Generate Login Link
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAction("Custom Attributes")}
                    className="w-full text-left px-3 py-1.5 hover:bg-muted flex items-center gap-2 font-medium"
                  >
                    <List size={13} className="text-muted-foreground" /> Custom Attributes
                  </button>
                  <div className="px-3 py-1.5 text-[10px] font-mono uppercase font-bold text-muted-foreground border-y border-border my-1">
                    Billing & Invoicing
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAction("Generate Invoice")}
                    className="w-full text-left px-3 py-1.5 hover:bg-muted flex items-center gap-2 font-medium"
                  >
                    <FileText size={13} className="text-muted-foreground" /> Generate New Invoice
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAction("Add Grace Period")}
                    className="w-full text-left px-3 py-1.5 hover:bg-muted flex items-center gap-2 font-medium"
                  >
                    <Clock size={13} className="text-muted-foreground" /> Add Grace Period
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 12 Tabs Navigation Bar */}
        <div className="flex items-center gap-1 border-b border-border bg-muted/30 px-6 py-2 overflow-x-auto custom-scrollbar shrink-0">
          {tabs.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? "bg-card text-foreground font-bold shadow-xs border border-border"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-background/50 relative">
          
          {/* TAB 1: PROFILE GRID */}
          {activeTab === "Profile" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Card 1: Personal Information */}
              <DataCard title="Personal Information" icon={User}>
                <DataField label="Full Name" value={subscriber.fullName} />
                <DataField label="PPPoE Username" value={subscriber.pppoeUsername} mono />
                <DataField label="CNIC / ID" value={subscriber.cnic} mono />
                <DataField label="Mobile Phone" value={subscriber.phone} mono />
                <DataField label="Email Address" value={subscriber.email} />
                <DataField label="Physical Address" value={subscriber.address} />
              </DataCard>

              {/* Card 2: Company & Branch */}
              <DataCard title="Company & ISP Branch" icon={Box}>
                <DataField label="ISP Tenant" value="Prime One Networks" />
                <DataField label="Operating Branch" value={subscriber.branchName} />
                <DataField label="Salesperson" value="Ali NOC Lead" />
                <DataField label="Provisioned Date" value={subscriber.installedAt} mono />
              </DataCard>

              {/* Card 3: Connection Info */}
              <DataCard title="Connection Parameters" icon={Network}>
                <DataField
                  label="Profile Status"
                  renderValue={() => (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-success/10 text-success border border-success/20">
                      ACTIVE
                    </span>
                  )}
                />
                <DataField label="Medium" value="FTTH Fiber Drop" />
                <DataField
                  label="Session State"
                  renderValue={() => (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-success/10 text-success border border-success/20">
                      ONLINE
                    </span>
                  )}
                />
                <DataField label="Framed IP" value={subscriber.staticIp || "103.14.22.84"} mono />
                <DataField label="Hardware MAC" value={subscriber.macAddress || "48:57:02:9B:2F:10"} mono />
                <DataField label="Core NAS Server" value="ISB-F10-CCR2004-CORE" mono />
              </DataCard>

              {/* Card 4: Package Information */}
              <DataCard title="Package Information" icon={Radio}>
                <DataField label="Tariff Plan" value={subscriber.packageName} />
                <DataField label="Speed Profile" value="50 Mbps Symmetric" mono />
                <DataField label="Monthly Bill" value={`Rs. ${subscriber.monthlyFeePkr.toLocaleString()}`} mono />
                <DataField label="Billing Due Day" value={`Day ${subscriber.billingDueDay} of month`} mono />
              </DataCard>

              {/* Card 5: Service Settings */}
              <DataCard title="Service Settings" icon={Settings}>
                <DataField
                  label="SMS Invoices"
                  renderValue={() => <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-success/10 text-success border border-success/20">Enabled</span>}
                />
                <DataField
                  label="WhatsApp Receipts"
                  renderValue={() => <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-success/10 text-success border border-success/20">Enabled</span>}
                />
                <DataField
                  label="Auto MAC Lock"
                  renderValue={() => <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-success/10 text-success border border-success/20">Locked</span>}
                />
                <DataField
                  label="Auto Renew Policy"
                  renderValue={() => <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-success/10 text-success border border-success/20">Enabled</span>}
                />
              </DataCard>

              {/* Card 6: Technical OLT & Optical Details */}
              <DataCard title="Technical OLT Details" icon={Cpu}>
                <DataField label="Core OLT Node" value={subscriber.oltHostname} mono />
                <DataField label="GPON Slot / Port" value={subscriber.oltSlotPort} mono />
                <DataField label="FAT Drop Box" value={subscriber.fatBoxNumber} mono />
                <DataField label="ONT Modem SN" value={subscriber.onuSerial} mono />
                <DataField
                  label="Optical Rx Power"
                  renderValue={() => (
                    <span className="font-mono font-bold text-success">
                      {subscriber.opticalRxDbm || -18.4} dBm
                    </span>
                  )}
                />
              </DataCard>
            </div>
          )}

          {/* TAB 2: ACTIVITIES */}
          {activeTab === "Activities" && (
            <div className="p-5 rounded-lg bg-card border border-border space-y-4 shadow-xs">
              <h3 className="font-heading font-bold text-sm text-foreground">
                Subscriber Event Audit Log
              </h3>
              <div className="space-y-3 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-px before:bg-border pl-8">
                <div className="relative space-y-1">
                  <div className="absolute -left-[29px] top-1 h-3 w-3 rounded-full bg-primary ring-4 ring-card" />
                  <span className="text-[11px] font-mono text-muted-foreground">Today at 10:45 AM • By System</span>
                  <p className="font-bold text-foreground">MikroTik CoA disconnect sent. Rate limit refreshed.</p>
                </div>
                <div className="relative space-y-1">
                  <div className="absolute -left-[29px] top-1 h-3 w-3 rounded-full bg-success ring-4 ring-card" />
                  <span className="text-[11px] font-mono text-muted-foreground">May 20, 2026 • By Admin_NOC</span>
                  <p className="font-bold text-foreground">Monthly invoice payment of Rs. 3,500 recorded.</p>
                </div>
                <div className="relative space-y-1">
                  <div className="absolute -left-[29px] top-1 h-3 w-3 rounded-full bg-primary ring-4 ring-card" />
                  <span className="text-[11px] font-mono text-muted-foreground">May 10, 2026 • By Splicer Team</span>
                  <p className="font-bold text-foreground">FTTH fiber drop installed & validated with -18.4 dBm.</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: LEDGERS */}
          {activeTab === "Ledgers" && (
            <div className="p-5 rounded-lg bg-card border border-border space-y-4 shadow-xs">
              <h3 className="font-heading font-bold text-sm text-foreground">Financial Ledger Statement</h3>
              <table className="w-full text-left font-mono text-xs">
                <thead className="border-b border-border text-muted-foreground uppercase text-[10px]">
                  <tr>
                    <th className="py-2">Date</th>
                    <th>Transaction / Description</th>
                    <th>Debit (PKR)</th>
                    <th>Credit (PKR)</th>
                    <th className="text-right">Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  <tr>
                    <td className="py-2.5">2026-05-20</td>
                    <td className="font-sans font-medium">Monthly Renewal Payment (Online)</td>
                    <td>-</td>
                    <td className="text-success font-bold">Rs. 3,500</td>
                    <td className="text-right font-bold">Rs. 0.00</td>
                  </tr>
                  <tr>
                    <td className="py-2.5">2026-05-18</td>
                    <td className="font-sans font-medium">Invoice #INV-2026-9812 Billed</td>
                    <td className="text-destructive font-bold">Rs. 3,500</td>
                    <td>-</td>
                    <td className="text-right font-bold text-destructive">Rs. 3,500</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 4: INVOICES */}
          {activeTab === "Invoices" && (
            <div className="p-5 rounded-lg bg-card border border-border space-y-4 shadow-xs">
              <h3 className="font-heading font-bold text-sm text-foreground">Monthly Invoices & Receipts</h3>
              <table className="w-full text-left text-xs font-mono">
                <thead className="border-b border-border text-muted-foreground uppercase text-[10px]">
                  <tr>
                    <th className="py-2">Invoice ID</th>
                    <th>Service Plan</th>
                    <th>Billing Cycle</th>
                    <th>Amount (PKR)</th>
                    <th>Status</th>
                    <th className="text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  <tr>
                    <td className="py-2.5 font-bold text-primary">INV-2026-9812</td>
                    <td className="font-sans font-medium">{subscriber.packageName}</td>
                    <td>May 2026</td>
                    <td className="font-bold">Rs. 3,500</td>
                    <td>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-success/10 text-success border border-success/20">
                        PAID
                      </span>
                    </td>
                    <td className="text-right">
                      <button
                        type="button"
                        onClick={() => toast.success("PDF Generated", "Invoice PDF downloaded.")}
                        className="px-2 py-1 text-[11px] font-bold text-primary hover:bg-muted rounded transition-colors cursor-pointer"
                      >
                        Download PDF
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 5: SESSION LOG */}
          {activeTab === "Session Log" && (
            <div className="p-5 rounded-lg bg-card border border-border space-y-4 shadow-xs">
              <h3 className="font-heading font-bold text-sm text-foreground">Radius PPPoE Live Sessions</h3>
              <table className="w-full text-left font-mono text-xs">
                <thead className="border-b border-border text-muted-foreground uppercase text-[10px]">
                  <tr>
                    <th className="py-2">Start Time</th>
                    <th>Framed IP</th>
                    <th>Caller MAC</th>
                    <th>Uploaded</th>
                    <th>Downloaded</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  <tr>
                    <td className="py-2.5">Today 08:30 AM</td>
                    <td className="font-bold text-primary">{subscriber.staticIp || "103.14.22.84"}</td>
                    <td>{subscriber.macAddress || "48:8A:FE:91:22:1A"}</td>
                    <td>14.2 GB</td>
                    <td>88.6 GB</td>
                    <td className="font-bold">102.8 GB</td>
                    <td>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-success/10 text-success border border-success/20">
                        ONLINE
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 6: TICKETS */}
          {activeTab === "Tickets" && (
            <div className="p-5 rounded-lg bg-card border border-border space-y-4 shadow-xs">
              <h3 className="font-heading font-bold text-sm text-foreground">Customer Complaint Tickets</h3>
              <div className="p-3 bg-muted/20 border border-border rounded flex items-center justify-between">
                <div>
                  <span className="font-bold text-foreground font-mono">TK-99482</span>
                  <span className="text-xs text-muted-foreground block">High Attenuation / Red LOS</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-warning/10 text-warning border border-warning/20">
                  IN PROGRESS
                </span>
              </div>
            </div>
          )}

          {/* TAB 7: LOGIN LOG */}
          {activeTab === "Login Log" && (
            <div className="p-5 rounded-lg bg-card border border-border space-y-4 shadow-xs">
              <h3 className="font-heading font-bold text-sm text-foreground">RADIUS Authentication Attempts</h3>
              <table className="w-full text-left font-mono text-xs">
                <thead className="border-b border-border text-muted-foreground uppercase text-[10px]">
                  <tr>
                    <th className="py-2">Timestamp</th>
                    <th>NAS IP Address</th>
                    <th>Caller MAC</th>
                    <th>Reply Code</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  <tr>
                    <td className="py-2.5">Today 08:30:12 AM</td>
                    <td>10.0.0.1 (NAS-ISB-CORE-01)</td>
                    <td>{subscriber.macAddress || "48:8A:FE:91:22:1A"}</td>
                    <td>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-success/10 text-success border border-success/20">
                        Access-Accept
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 8: MAC ADDRESS */}
          {activeTab === "MAC Address" && (
            <div className="p-5 rounded-lg bg-card border border-border space-y-4 shadow-xs">
              <h3 className="font-heading font-bold text-sm text-foreground">Physical MAC Binding & Lock</h3>
              <div className="p-4 bg-muted/20 border border-border rounded flex items-center justify-between font-mono">
                <div>
                  <span className="font-bold text-sm text-foreground">{subscriber.macAddress || "48:8A:FE:91:22:1A"}</span>
                  <span className="text-xs text-muted-foreground block">Device: Huawei Technologies Co., Ltd</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-success/10 text-success border border-success/20">
                  MAC LOCKED
                </span>
              </div>
            </div>
          )}

          {/* TAB 9: REPORTS */}
          {activeTab === "Reports" && (
            <div className="p-5 rounded-lg bg-card border border-border space-y-4 shadow-xs">
              <h3 className="font-heading font-bold text-sm text-foreground">Bandwidth Traffic Analytics</h3>
              <div className="p-8 text-center bg-muted/20 border border-border rounded font-mono">
                <LineChart className="h-10 w-10 text-primary mx-auto mb-2 opacity-60" />
                <p className="font-bold text-foreground">24-Hour Real-Time Optical & Traffic Graphs</p>
                <p className="text-xs text-muted-foreground mt-1">Sustained peak: 48.2 Mbps Download / 32.1 Mbps Upload</p>
              </div>
            </div>
          )}

          {/* TAB 10: SERVICES */}
          {activeTab === "Services" && (
            <div className="p-5 rounded-lg bg-card border border-border space-y-4 shadow-xs">
              <h3 className="font-heading font-bold text-sm text-foreground">Active Subscribed Services</h3>
              <div className="p-4 bg-muted/20 border border-border rounded flex items-center justify-between">
                <div>
                  <span className="font-bold text-sm text-foreground">{subscriber.packageName}</span>
                  <span className="text-xs text-muted-foreground font-mono block">50 Mbps Symmetric Unlimited FTTH</span>
                </div>
                <span className="font-mono font-bold text-primary">Rs. {(subscriber.monthlyFeePkr || 3500).toLocaleString()}/mo</span>
              </div>
            </div>
          )}

          {/* TAB 11: DOCUMENTS */}
          {activeTab === "Documents" && (
            <div className="p-5 rounded-lg bg-card border border-border space-y-4 shadow-xs">
              <h3 className="font-heading font-bold text-sm text-foreground">Subscriber KYC Scans & Documents</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono">
                <div className="p-3 bg-muted/20 border border-border rounded flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <span>CNIC_Front_Scan.pdf</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] border border-border bg-muted text-muted-foreground">
                    Verified
                  </span>
                </div>
                <div className="p-3 bg-muted/20 border border-border rounded flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <span>Signed_Agreement.pdf</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] border border-border bg-muted text-muted-foreground">
                    Verified
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 12: COA LOGS */}
          {activeTab === "CoA Logs" && (
            <div className="p-5 rounded-lg bg-card border border-border space-y-4 shadow-xs">
              <h3 className="font-heading font-bold text-sm text-foreground">Change of Authorization (CoA) Logs</h3>
              <table className="w-full text-left font-mono text-xs">
                <thead className="border-b border-border text-muted-foreground uppercase text-[10px]">
                  <tr>
                    <th className="py-2">Timestamp</th>
                    <th>Request Type</th>
                    <th>NAS Endpoint</th>
                    <th>Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  <tr>
                    <td className="py-2.5">Today 10:45:00 AM</td>
                    <td>Disconnect-Request (PoD)</td>
                    <td>10.0.0.1:3799</td>
                    <td>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-success/10 text-success border border-success/20">
                        ACK (Success)
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* SPEED DIAL (FAB) for Network & Connection Actions */}
        <div className="absolute bottom-6 right-6 z-40 flex flex-col items-end gap-2" ref={fabRef}>
          <AnimatePresence>
            {isFabOpen && (
              <motion.div
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={{
                  visible: { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
                  hidden: { transition: { staggerChildren: 0.03, staggerDirection: 1 } },
                }}
                className="flex flex-col items-end gap-1.5 mb-2"
              >
                {networkFabActions.map((item) => (
                  <motion.button
                    key={item.label}
                    variants={{
                      hidden: { opacity: 0, y: 10, scale: 0.8 },
                      visible: { opacity: 1, y: 0, scale: 1 },
                    }}
                    onClick={() => handleAction(item.label)}
                    className="flex items-center gap-2 group cursor-pointer"
                  >
                    <span className="px-2.5 py-1 bg-card border border-border text-foreground text-xs font-bold rounded-md shadow-md opacity-90 group-hover:opacity-100 transition-opacity">
                      {item.label}
                    </span>
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 ${
                        item.variant === "danger"
                          ? "bg-destructive text-destructive-foreground"
                          : item.variant === "primary"
                          ? "bg-primary text-primary-foreground"
                          : "bg-card border border-border text-foreground"
                      }`}
                    >
                      <item.icon size={16} />
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="button"
            onClick={() => setIsFabOpen(!isFabOpen)}
            className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground shadow-xl hover:bg-primary/90 transition-all cursor-pointer"
          >
            <motion.div
              animate={{ rotate: isFabOpen ? 90 : 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              {isFabOpen ? <X size={20} /> : <Settings size={20} />}
            </motion.div>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
