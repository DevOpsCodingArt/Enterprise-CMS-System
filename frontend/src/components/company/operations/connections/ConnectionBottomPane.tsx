"use client";

import React, { useState } from "react";
import {
  Edit3,
  Activity,
  HardHat,
  Server,
  User,
  Wallet,
  Phone,
  MessageCircle,
  Maximize2,
  X,
  ChevronDown,
  ChevronUp,
  MapPin,
  Wifi,
  Clock,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ConnectionRecordItem } from "./ConnectionsTable";
import { Tooltip } from "@/components/ui/tooltip";

export function ConnectionBottomPane({
  connection,
  onEditProfile,
}: {
  connection: ConnectionRecordItem | null;
  onEditProfile: () => void;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedCard, setExpandedCard] = useState<
    "customer" | "services" | "accounts" | "assignment" | "diagnostics" | null
  >(null);

  if (!connection) {
    return (
      <div className="h-10 border-t border-border bg-card/50 flex items-center justify-center text-muted-foreground font-mono text-xs shrink-0">
        Select a connection from the table to inspect details.
      </div>
    );
  }

  const totalAmount =
    connection.accounts.totalAmount ||
    connection.accounts.otc +
      connection.accounts.monthlyBill +
      (connection.accounts.extraCable || 0) -
      (connection.accounts.discount || 0);
  const totalPaid = connection.accounts.otcPaid + connection.accounts.monthlyBillPaid;
  const remainingBalance = totalAmount - totalPaid;

  const renderExpandedModal = () => {
    let title = "";
    let content: React.ReactNode = null;

    if (expandedCard === "customer") {
      title = "Subscriber Customer 360° Profile";
      content = (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6 text-sm"
        >
          <div className="flex items-center gap-4 border-b border-border pb-4">
            <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
              <User className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">{connection.customer.name}</h2>
              <p className="text-muted-foreground font-mono text-xs">
                CNIC: {connection.customer.cnic} • Father: {connection.customer.fatherName || "N/A"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-3.5 bg-muted/30 rounded-lg border border-border">
              <p className="text-[10px] text-muted-foreground font-mono uppercase mb-1 font-bold">Primary Mobile</p>
              <p className="font-mono text-lg text-foreground font-bold">{connection.customer.mobile}</p>
            </div>
            <div className="p-3.5 bg-muted/30 rounded-lg border border-border">
              <p className="text-[10px] text-muted-foreground font-mono uppercase mb-1 font-bold">Account Status</p>
              <span className={`inline-block px-2 py-1 rounded text-xs font-mono font-bold ${
                connection.status === "Active" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
              }`}>
                {connection.status.toUpperCase()}
              </span>
            </div>
            <div className="col-span-2 p-3.5 bg-muted/30 rounded-lg border border-border">
              <p className="text-[10px] text-muted-foreground font-mono uppercase mb-1 font-bold">Installation Address</p>
              <p className="font-medium text-sm text-foreground">{connection.customer.address}</p>
            </div>
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={() => alert(`Calling ${connection.customer.mobile}`)}
              className="flex-1 py-2.5 border border-border rounded-md flex justify-center items-center gap-2 hover:bg-muted transition-colors font-semibold cursor-pointer text-xs"
            >
              <Phone className="w-4 h-4 text-success" /> Call Customer
            </button>
            <button
              type="button"
              onClick={() =>
                window.open(
                  `https://wa.me/${connection.customer.mobile.replace(/[^0-9]/g, "")}`,
                  "_blank"
                )
              }
              className="flex-1 py-2.5 border border-border rounded-md flex justify-center items-center gap-2 hover:bg-muted transition-colors font-semibold cursor-pointer text-xs"
            >
              <MessageCircle className="w-4 h-4 text-success" /> Send WhatsApp Message
            </button>
          </div>
        </motion.div>
      );
    } else if (expandedCard === "services") {
      title = "Service & Hardware Configuration";
      content = (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6 text-sm"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 md:col-span-1 p-3.5 bg-muted/30 rounded-lg border border-border">
              <p className="text-[10px] text-muted-foreground font-mono uppercase mb-1 font-bold">Tariff Package</p>
              <p className="font-bold text-lg text-primary">{connection.services.package}</p>
            </div>
            <div className="col-span-2 md:col-span-1 p-3.5 bg-muted/30 rounded-lg border border-border">
              <p className="text-[10px] text-muted-foreground font-mono uppercase mb-1 font-bold">Operational Area</p>
              <p className="font-bold text-lg text-foreground">{connection.services.area}</p>
            </div>
            <div className="p-3.5 bg-muted/30 rounded-lg border border-border">
              <p className="text-[10px] text-muted-foreground font-mono uppercase mb-1 font-bold">PPPoE Username</p>
              <p className="font-mono text-sm font-bold text-foreground">{connection.services.username || "-"}</p>
            </div>
            <div className="p-3.5 bg-muted/30 rounded-lg border border-border">
              <p className="text-[10px] text-muted-foreground font-mono uppercase mb-1 font-bold">Medium</p>
              <p className="font-medium text-sm text-foreground">{connection.services.connectionType}</p>
            </div>
            <div className="p-3.5 bg-muted/30 rounded-lg border border-border">
              <p className="text-[10px] text-muted-foreground font-mono uppercase mb-1 font-bold">CPE Router / ONT</p>
              <p className="font-medium text-sm text-foreground">{connection.services.device || "Huawei HG8145V5"}</p>
            </div>
            <div className="p-3.5 bg-muted/30 rounded-lg border border-border">
              <p className="text-[10px] text-muted-foreground font-mono uppercase mb-1 font-bold">MAC Address</p>
              <p className="font-mono text-sm text-foreground">{connection.services.macAddress || "48:57:02:11:4A:20"}</p>
            </div>
            <div className="p-3.5 bg-muted/30 rounded-lg border border-border">
              <p className="text-[10px] text-muted-foreground font-mono uppercase mb-1 font-bold">Drop Fiber Length</p>
              <p className="font-medium text-sm text-foreground">{connection.services.fiberWire || "65m"}</p>
            </div>
            <div className="p-3.5 bg-muted/30 rounded-lg border border-border">
              <p className="text-[10px] text-muted-foreground font-mono uppercase mb-1 font-bold">Hardware Provisioned</p>
              <p className="font-medium text-sm text-foreground">
                ONU: {connection.services.onu || "Yes"} • Adapter: {connection.services.adapter || "Yes"}
              </p>
            </div>
          </div>
        </motion.div>
      );
    } else if (expandedCard === "accounts") {
      title = "Financial Accounts & Billing Ledger";
      content = (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6 text-sm"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3.5 bg-muted/30 rounded-lg border border-border">
              <p className="text-[10px] text-muted-foreground font-mono uppercase mb-1 font-bold">OTC Setup Fee</p>
              <p className="font-mono font-medium text-base text-foreground">
                Rs. {connection.accounts.otc.toLocaleString()}
              </p>
            </div>
            <div className="p-3.5 bg-muted/30 rounded-lg border border-border">
              <p className="text-[10px] text-muted-foreground font-mono uppercase mb-1 font-bold">Monthly Recurring Bill</p>
              <p className="font-mono font-medium text-base text-foreground">
                Rs. {connection.accounts.monthlyBill.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="p-4 bg-muted/50 rounded-lg border border-border space-y-2.5 font-mono text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-border/50">
              <span className="font-sans font-bold uppercase text-muted-foreground text-[11px]">Total Expected</span>
              <span className="font-bold text-sm text-foreground">Rs. {totalAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-border/50">
              <span className="font-sans font-bold uppercase text-muted-foreground text-[11px]">Amount Paid</span>
              <span className="font-bold text-sm text-success">Rs. {totalPaid.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center pt-1">
              <span className="font-sans font-bold uppercase text-muted-foreground text-[11px]">Remaining Balance</span>
              <span className="font-bold text-base text-destructive">Rs. {remainingBalance.toLocaleString()}</span>
            </div>
          </div>
        </motion.div>
      );
    } else if (expandedCard === "assignment") {
      title = "Field Splicing Work Order & Dispatch";
      content = (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6 text-sm"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-card border border-border space-y-1 shadow-xs">
              <h4 className="text-[10px] text-muted-foreground font-mono uppercase font-bold">Created & Dispatched By</h4>
              <p className="font-bold text-foreground text-base">{connection.assignment.assignedBy}</p>
              <p className="text-xs text-muted-foreground font-mono">Central NOC Desk</p>
            </div>

            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 space-y-1 shadow-xs">
              <h4 className="text-[10px] text-primary font-mono uppercase font-bold">Assigned Technician</h4>
              <p className="font-bold text-foreground text-base">{connection.assignment.assignedTo || "Unassigned"}</p>
              <p className="text-xs text-muted-foreground font-mono">Field Van Unit</p>
            </div>

            <div className="col-span-1 md:col-span-2 p-4 bg-muted/30 border border-border rounded-lg space-y-1">
              <p className="text-[10px] text-muted-foreground font-mono uppercase font-bold">
                Installation Remarks & Splicing Notes
              </p>
              <p className="text-xs text-foreground/90 italic leading-relaxed">
                &ldquo;{connection.assignment.remarks || "Standard fiber drop installation."}&rdquo;
              </p>
            </div>
          </div>
        </motion.div>
      );
    } else if (expandedCard === "diagnostics") {
      title = "Live GPON Optical Telemetry";
      content = (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6 text-sm"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-muted/30 rounded-lg border border-border">
              <p className="text-[10px] text-muted-foreground font-mono uppercase mb-1 font-bold">Optical Power Rx</p>
              <p className="font-bold text-xl text-success font-mono">
                {connection.assignment.diagnostics?.signalStrength || "-14.2 dBm"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Excellent Optical Budget</p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg border border-border">
              <p className="text-[10px] text-muted-foreground font-mono uppercase mb-1 font-bold">ONT Status</p>
              <p className="font-bold text-xl text-success">Online / Active</p>
              <p className="text-xs text-muted-foreground mt-1 font-mono">1 Gbps Full-Duplex</p>
            </div>
          </div>
        </motion.div>
      );
    }

    return (
      <AnimatePresence>
        {expandedCard && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              onClick={() => setExpandedCard(null)}
            />
            <motion.div
              layoutId={`card-${expandedCard}`}
              className="bg-card w-full max-w-2xl rounded-xl shadow-2xl border border-border overflow-hidden flex flex-col max-h-[90vh] z-10 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-5 border-b border-border bg-muted/30 shrink-0">
                <h3 className="font-black text-lg tracking-tight text-foreground">{title}</h3>
                <button
                  type="button"
                  onClick={() => setExpandedCard(null)}
                  className="p-1.5 hover:bg-muted rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">{content}</div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    );
  };

  return (
    <div
      className={`border-t border-border bg-muted/30 px-3 py-2 flex flex-col shrink-0 transition-all duration-200 ${
        isCollapsed ? "h-10 overflow-hidden" : "h-64"
      }`}
    >
      {/* Header bar */}
      <div className="flex items-center justify-between shrink-0 mb-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center gap-1.5 text-xs font-bold text-foreground hover:text-primary transition-colors cursor-pointer"
          >
            {isCollapsed ? <ChevronUp className="w-4 h-4 text-primary" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
            <span>Inspection Details</span>
          </button>
          <span className="px-2 py-0.5 bg-primary/10 text-primary font-mono text-[11px] font-bold rounded">
            {connection.id}
          </span>
          <span className="text-xs text-muted-foreground font-medium truncate max-w-[280px] hidden sm:inline">
            • {connection.customer.name} ({connection.services.package})
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-[11px] font-mono text-muted-foreground hover:text-foreground px-2 py-0.5 rounded hover:bg-muted/60 transition-colors"
          >
            {isCollapsed ? "Expand Details (5 Cards)" : "Collapse"}
          </button>
          <button
            type="button"
            onClick={onEditProfile}
            className="flex items-center gap-1.5 px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded hover:bg-primary/90 transition-colors shadow-xs cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" /> Edit Profile
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <div className="flex-1 flex gap-3 overflow-x-auto pb-1 custom-scrollbar min-h-0">
          
          {/* CARD 1: CUSTOMER */}
          <motion.div
            layoutId={expandedCard === "customer" ? undefined : "card-customer"}
            className={`w-72 shrink-0 border border-border rounded-lg bg-card p-3 shadow-xs flex flex-col justify-between group relative overflow-hidden transition-all ${
              expandedCard === "customer"
                ? "opacity-0 pointer-events-none"
                : expandedCard
                ? "opacity-50 pointer-events-none"
                : "cursor-pointer hover:border-primary/50"
            }`}
            onClick={() => !expandedCard && setExpandedCard("customer")}
          >
            <div className="flex justify-between items-center border-b border-border pb-1.5">
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-primary" />
                <h3 className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
                  Customer
                </h3>
              </div>
              <Tooltip content="Expand Profile" position="top">
                <button
                  type="button"
                  className="opacity-0 group-hover:opacity-100 p-0.5 bg-muted/50 rounded transition-all hover:bg-muted cursor-pointer"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-foreground" />
                </button>
              </Tooltip>
            </div>

            <div className="space-y-1 py-1">
              <p className="font-sans font-bold text-foreground text-sm leading-snug truncate">
                {connection.customer.name}
              </p>
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-primary font-bold">{connection.customer.mobile}</span>
                <span className="text-muted-foreground">{connection.customer.cnic}</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-tight line-clamp-2 pt-0.5">
                {connection.customer.address}
              </p>
            </div>

            <div className="flex items-center justify-between pt-1.5 border-t border-border/60">
              <span className="text-[10px] font-mono text-muted-foreground uppercase font-bold">Quick Contact:</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    alert(`Calling ${connection.customer.mobile}`);
                  }}
                  className="px-2 py-0.5 border border-border rounded text-[11px] font-medium text-success hover:bg-success/10 cursor-pointer flex items-center gap-1 transition-colors"
                >
                  <Phone className="w-3 h-3" /> Call
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(`https://wa.me/${connection.customer.mobile.replace(/[^0-9]/g, "")}`, "_blank");
                  }}
                  className="px-2 py-0.5 border border-border rounded text-[11px] font-medium text-success hover:bg-success/10 cursor-pointer flex items-center gap-1 transition-colors"
                >
                  <MessageCircle className="w-3 h-3" /> WhatsApp
                </button>
              </div>
            </div>
          </motion.div>

          {/* CARD 2: SERVICES */}
          <motion.div
            layoutId={expandedCard === "services" ? undefined : "card-services"}
            className={`w-64 shrink-0 border border-border rounded-lg bg-card p-3 shadow-xs flex flex-col justify-between group relative overflow-hidden transition-all ${
              expandedCard === "services"
                ? "opacity-0 pointer-events-none"
                : expandedCard
                ? "opacity-50 pointer-events-none"
                : "cursor-pointer hover:border-primary/50"
            }`}
            onClick={() => !expandedCard && setExpandedCard("services")}
          >
            <div className="flex justify-between items-center border-b border-border pb-1.5">
              <div className="flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-primary" />
                <h3 className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
                  Services & Hardware
                </h3>
              </div>
              <Tooltip content="Expand Configuration" position="top">
                <button
                  type="button"
                  className="opacity-0 group-hover:opacity-100 p-0.5 bg-muted/50 rounded transition-all hover:bg-muted cursor-pointer"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-foreground" />
                </button>
              </Tooltip>
            </div>

            <div className="space-y-1.5 py-1 text-xs">
              <div className="flex justify-between items-start">
                <span className="font-bold text-foreground text-sm truncate max-w-[130px]">
                  {connection.services.package}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-primary/10 text-primary font-bold">
                  {connection.services.connectionType}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1 text-[11px] font-mono text-muted-foreground">
                <div>
                  <span className="text-[9px] uppercase block text-muted-foreground/70">Area:</span>
                  <span className="text-foreground font-medium truncate block">{connection.services.area}</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase block text-muted-foreground/70">PPPoE User:</span>
                  <span className="text-foreground font-medium truncate block">{connection.services.username || "-"}</span>
                </div>
              </div>
            </div>

            <div className="pt-1.5 border-t border-border/60 flex justify-between items-center text-[10.5px] font-mono text-muted-foreground">
              <span className="truncate max-w-[120px]">CPE: {connection.services.device || "Huawei ONT"}</span>
              <span className="text-primary font-bold">{connection.services.fiberWire || "65m drop"}</span>
            </div>
          </motion.div>

          {/* CARD 3: ACCOUNTS */}
          <motion.div
            layoutId={expandedCard === "accounts" ? undefined : "card-accounts"}
            className={`w-64 shrink-0 border border-border rounded-lg bg-card p-3 shadow-xs flex flex-col justify-between group relative overflow-hidden transition-all ${
              expandedCard === "accounts"
                ? "opacity-0 pointer-events-none"
                : expandedCard
                ? "opacity-50 pointer-events-none"
                : "cursor-pointer hover:border-primary/50"
            }`}
            onClick={() => !expandedCard && setExpandedCard("accounts")}
          >
            <div className="flex justify-between items-center border-b border-border pb-1.5">
              <div className="flex items-center gap-1.5">
                <Wallet className="w-3.5 h-3.5 text-primary" />
                <h3 className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
                  Accounts & Ledger
                </h3>
              </div>
              <Tooltip content="Expand Ledger" position="top">
                <button
                  type="button"
                  className="opacity-0 group-hover:opacity-100 p-0.5 bg-muted/50 rounded transition-all hover:bg-muted cursor-pointer"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-foreground" />
                </button>
              </Tooltip>
            </div>

            <div className="space-y-1 py-1 text-xs font-mono">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-[11px]">OTC Setup:</span>
                <span className="font-bold text-foreground">Rs. {connection.accounts.otc.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-[11px]">Monthly Bill:</span>
                <span className="font-bold text-foreground">Rs. {connection.accounts.monthlyBill.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-success">
                <span className="text-[11px]">Amount Paid:</span>
                <span className="font-bold">Rs. {totalPaid.toLocaleString()}</span>
              </div>
            </div>

            <div className="pt-1.5 border-t border-border/60 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[9px] font-mono uppercase text-muted-foreground font-bold">Remaining:</span>
                <span className={`text-xs font-mono font-black ${remainingBalance > 0 ? "text-destructive" : "text-success"}`}>
                  Rs. {remainingBalance.toLocaleString()}
                </span>
              </div>
              {remainingBalance > 0 ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    alert("Opening Cash Recovery & POS Payment Entry");
                  }}
                  className="px-2.5 py-1 bg-success text-success-foreground text-[10px] font-mono font-bold rounded uppercase hover:bg-success/90 transition-colors cursor-pointer shadow-xs"
                >
                  Pay Now
                </button>
              ) : (
                <span className="px-2 py-0.5 rounded bg-success/10 text-success text-[10px] font-mono font-bold">
                  CLEARED
                </span>
              )}
            </div>
          </motion.div>

          {/* CARD 4: ASSIGNMENT */}
          <motion.div
            layoutId={expandedCard === "assignment" ? undefined : "card-assignment"}
            className={`w-60 shrink-0 border border-border rounded-lg bg-card p-3 shadow-xs flex flex-col justify-between group relative overflow-hidden transition-all ${
              expandedCard === "assignment"
                ? "opacity-0 pointer-events-none"
                : expandedCard
                ? "opacity-50 pointer-events-none"
                : "cursor-pointer hover:border-primary/50"
            }`}
            onClick={() => !expandedCard && setExpandedCard("assignment")}
          >
            <div className="flex justify-between items-center border-b border-border pb-1.5">
              <div className="flex items-center gap-1.5">
                <HardHat className="w-3.5 h-3.5 text-primary" />
                <h3 className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
                  Field Dispatch
                </h3>
              </div>
              <Tooltip content="Expand Work Order" position="top">
                <button
                  type="button"
                  className="opacity-0 group-hover:opacity-100 p-0.5 bg-muted/50 rounded transition-all hover:bg-muted cursor-pointer"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-foreground" />
                </button>
              </Tooltip>
            </div>

            <div className="space-y-1.5 py-1">
              <div>
                <span className="text-[9px] font-mono uppercase text-muted-foreground font-bold block">Assigned Technician:</span>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 border border-primary/30">
                    <span className="text-[10px] font-bold text-primary">
                      {connection.assignment.assignedTo
                        ? connection.assignment.assignedTo.substring(0, 2).toUpperCase()
                        : "UA"}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-foreground truncate">
                    {connection.assignment.assignedTo || "Unassigned"}
                  </span>
                </div>
              </div>
              <p className="text-[10.5px] text-muted-foreground italic line-clamp-1">
                &ldquo;{connection.assignment.remarks || "Splice port on nearest FAT."}&rdquo;
              </p>
            </div>

            <div className="pt-1.5 border-t border-border/60 flex justify-between items-center text-[10.5px] font-mono text-muted-foreground">
              <span>By: {connection.assignment.assignedBy}</span>
              <span className="text-foreground font-bold">NOC Active</span>
            </div>
          </motion.div>

          {/* CARD 5: LIVE DIAGNOSTICS */}
          <motion.div
            layoutId={expandedCard === "diagnostics" ? undefined : "card-diagnostics"}
            className={`w-60 shrink-0 border border-border rounded-lg bg-card p-3 shadow-xs flex flex-col justify-between group relative overflow-hidden transition-all ${
              expandedCard === "diagnostics"
                ? "opacity-0 pointer-events-none"
                : expandedCard
                ? "opacity-50 pointer-events-none"
                : "cursor-pointer hover:border-primary/50"
            }`}
            onClick={() => !expandedCard && setExpandedCard("diagnostics")}
          >
            <div className="flex justify-between items-center border-b border-border pb-1.5">
              <div className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-primary" />
                <h3 className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
                  Live Telemetry
                </h3>
              </div>
              <Tooltip content="Expand Telemetry" position="top">
                <button
                  type="button"
                  className="opacity-0 group-hover:opacity-100 p-0.5 bg-muted/50 rounded transition-all hover:bg-muted cursor-pointer"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-foreground" />
                </button>
              </Tooltip>
            </div>

            <div className="space-y-1.5 py-1 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono text-muted-foreground uppercase font-bold">Optical Power:</span>
                <span className="font-mono font-bold text-success text-sm">
                  {connection.assignment.diagnostics?.signalStrength || "-14.2 dBm"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono text-muted-foreground uppercase font-bold">ONT Status:</span>
                <span className="font-mono font-bold text-success text-xs flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
                  Online
                </span>
              </div>
              <div className="flex justify-between items-center text-[10.5px] font-mono text-muted-foreground">
                <span>Data Usage:</span>
                <span className="text-foreground font-bold">
                  {connection.assignment.diagnostics?.dataUsage || "142 GB"}
                </span>
              </div>
            </div>

            <div className="pt-1.5 border-t border-border/60 flex justify-between items-center text-[10.5px] font-mono text-muted-foreground">
              <span>Link: GPON 1 Gbps</span>
              <span className="text-success font-bold">Sync: Just now</span>
            </div>
          </motion.div>

        </div>
      )}

      {renderExpandedModal()}
    </div>
  );
}
