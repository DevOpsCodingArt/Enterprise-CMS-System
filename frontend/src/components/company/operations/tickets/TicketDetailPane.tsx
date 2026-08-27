"use client";

import React, { useState } from "react";
import {
  Phone,
  MessageCircle,
  FileText,
  Send,
  User,
  RefreshCw,
  Activity,
  MapPin,
  History,
  Maximize2,
  X,
  Navigation,
  Trash2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DateTimePicker } from "@/components/ui/shared/DateTimePicker";
import { Tooltip } from "@/components/ui/shared/Tooltip";
import { ConfirmDialog } from "@/components/ui/shared/ConfirmDialog";
import { useToast } from "@/components/ui/toast";

export interface TicketNote {
  id: string;
  timestamp: string;
  author: string;
  content: string;
}

export interface EttrHistoryItem {
  timestamp: string;
  changedBy: string;
  change: string;
  reason: string;
}

export interface TransferHistoryItem {
  timestamp: string;
  transferredBy: string;
  transfer: string;
  reason: string;
}

export interface FullTroubleTicket {
  id: string;
  ticketNo: string;
  customerName: string;
  username: string;
  contact: string;
  type: string;
  priority: "Urgent" | "High" | "Normal" | "Critical" | "Low";
  status: "Pending" | "In Progress" | "Closed" | "Expired" | "open" | "assigned" | "in_progress" | "resolved" | "closed";
  assignedTo: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
  creationRemarks?: string;
  staffDetails?: {
    closedBy?: string;
    closingDate?: string;
    closingRemarks?: string;
    closing?: string;
  };
  ettr: string;
  ettrHistory?: EttrHistoryItem[];
  transferHistory?: TransferHistoryItem[];
  transferredFrom?: string;
  notes?: TicketNote[];
  opticalDbm?: number;
  ontStatus?: string;
  address: string;
  lat?: number;
  lng?: number;
  vanNo?: string;
  slaMinutesLeft?: number;
  description?: string;
}

export function TicketDetailPane({
  ticket,
  onUpdate,
  onDelete,
}: {
  ticket: FullTroubleTicket | null;
  onUpdate?: (id: string, updates: Partial<FullTroubleTicket>) => void;
  onDelete?: (id: string) => void;
}) {
  const toast = useToast();
  const [expandedCard, setExpandedCard] = useState<
    "customer" | "ettr" | "transfer" | "assignment" | "diagnostics" | null
  >(null);
  const [ettrUpdate, setEttrUpdate] = useState("");
  const [closedOn, setClosedOn] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Transfer & Reopen States
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);
  const [transferData, setTransferData] = useState({ staff: "", reason: "" });
  const [isReopenDialogOpen, setIsReopenDialogOpen] = useState(false);
  const [reopenReason, setReopenReason] = useState("");
  const [newLogContent, setNewLogContent] = useState("");
  const [resolutionText, setResolutionText] = useState("");

  if (!ticket) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground bg-background h-full min-h-[400px]">
        <FileText className="w-12 h-12 mb-4 opacity-20" />
        <p className="font-sans font-medium">Select a ticket to view details</p>
      </div>
    );
  }

  const formatDate = (isoString?: string) => {
    if (!isoString) return "--------";
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return d
      .toLocaleString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
      .replace(",", "");
  };

  const isClosed = ticket.status === "Closed" || ticket.status === "closed" || ticket.status === "resolved";

  const renderExpandedModal = () => {
    let title = "";
    let content = null;

    if (expandedCard === "customer") {
      title = "Full Customer Profile";
      content = (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-4 border-b border-border pb-6">
            <div className="w-16 h-16 rounded bg-muted flex items-center justify-center shrink-0">
              <User className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-foreground">{ticket.customerName}</h2>
              <p className="text-muted-foreground font-mono">{ticket.username || "sub_pppoe_user"}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-muted/30 rounded border border-border">
              <p className="text-[10px] text-muted-foreground font-mono uppercase mb-1 font-bold">Primary Contact</p>
              <p className="font-medium text-base text-foreground">{ticket.contact || "+92 300 1234567"}</p>
            </div>
            <div className="p-3 bg-muted/30 rounded border border-border">
              <p className="text-[10px] text-muted-foreground font-mono uppercase mb-1 font-bold">Account Status</p>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-success/10 text-success border border-success/20">
                ACTIVE
              </span>
            </div>
            <div className="col-span-2 p-3 bg-muted/30 rounded border border-border">
              <p className="text-[10px] text-muted-foreground font-mono uppercase mb-1 font-bold">Address / Area</p>
              <p className="font-medium text-foreground">{ticket.address}</p>
            </div>
            <div className="p-3 bg-muted/30 rounded border border-border">
              <p className="text-[10px] text-muted-foreground font-mono uppercase mb-1 font-bold">Customer Since</p>
              <p className="font-medium text-foreground font-mono">March 2024</p>
            </div>
            <div className="p-3 bg-muted/30 rounded border border-border">
              <p className="text-[10px] text-muted-foreground font-mono uppercase mb-1 font-bold">Core NAS</p>
              <p className="font-medium text-foreground font-mono">NAS-ISB-CORE-01</p>
            </div>
          </div>
          <div className="pt-2 flex gap-3">
            <a
              href={`tel:${ticket.contact}`}
              className="flex-1 py-2.5 border border-border rounded flex justify-center items-center gap-2 hover:bg-muted transition-colors font-semibold text-xs text-foreground bg-card shadow-sm"
            >
              <Phone className="w-4 h-4 text-success" /> Call Customer
            </a>
            <a
              href={`https://wa.me/${(ticket.contact || "").replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 py-2.5 border border-border rounded flex justify-center items-center gap-2 hover:bg-muted transition-colors font-semibold text-xs text-success bg-card shadow-sm"
            >
              <MessageCircle className="w-4 h-4 text-success" /> Send WhatsApp
            </a>
          </div>
        </motion.div>
      );
    } else if (expandedCard === "ettr") {
      title = "Complete ETTR History";
      content = (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <div className="p-4 bg-muted/30 rounded border border-border flex justify-between items-center text-xs">
            <div>
              <p className="text-[10px] text-muted-foreground font-mono uppercase mb-1 font-bold">Current Target</p>
              <p className="font-bold text-base text-foreground font-mono">{formatDate(ticket.ettr)}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-muted-foreground font-mono uppercase mb-1 font-bold">Total Extensions</p>
              <p className="font-bold text-base text-foreground font-mono">
                {ticket.ettrHistory ? ticket.ettrHistory.length : 0}
              </p>
            </div>
          </div>
          <div className="pt-2">
            <h4 className="font-mono text-xs text-muted-foreground uppercase tracking-wider mb-4 border-b border-border pb-2 font-bold">
              Timeline History
            </h4>
            <div className="space-y-6 relative before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-px before:bg-border pl-8 text-xs">
              {ticket.ettrHistory && ticket.ettrHistory.length > 0 ? (
                ticket.ettrHistory.map((detail, idx) => (
                  <div key={idx} className="relative mb-6">
                    <div className="absolute -left-[30px] top-1.5 w-3 h-3 rounded-full bg-primary ring-4 ring-background"></div>
                    <p className="font-mono text-xs text-muted-foreground mb-1">
                      Extended by <span className="font-bold text-foreground">{detail.changedBy}</span>{" "}
                      <span className="float-right font-mono">
                        {new Date(detail.timestamp || Date.now()).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </p>
                    <p className="text-sm font-medium mb-1 text-foreground">{detail.change}</p>
                    <div className="p-3 bg-muted/50 rounded border border-border mt-2">
                      <p className="text-xs italic text-muted-foreground">{`"${detail.reason}"`}</p>
                    </div>
                  </div>
                ))
              ) : null}

              <div className="relative">
                <div className="absolute -left-[30px] top-1.5 w-3 h-3 rounded-full bg-muted-foreground ring-4 ring-background"></div>
                <p className="font-mono text-xs text-muted-foreground mb-1">Initial ETTR Set</p>
                <p className="text-sm font-medium text-foreground">System generated based on SLA Tier</p>
              </div>
            </div>
          </div>
        </motion.div>
      );
    } else if (expandedCard === "transfer") {
      title = "Complete Transfer History";
      content = (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <div className="pt-2">
            <h4 className="font-mono text-xs text-muted-foreground uppercase tracking-wider mb-4 border-b border-border pb-2 font-bold">
              Routing Timeline
            </h4>
            <div className="space-y-6 relative before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-px before:bg-border pl-8 text-xs">
              {ticket.transferHistory && ticket.transferHistory.length > 0 ? (
                ticket.transferHistory.map((detail, idx) => (
                  <div key={idx} className="relative mb-6">
                    <div className="absolute -left-[30px] top-1.5 w-3 h-3 rounded-full bg-warning ring-4 ring-background"></div>
                    <p className="font-mono text-xs text-muted-foreground mb-1">
                      Transferred by <span className="font-bold text-foreground">{detail.transferredBy}</span>{" "}
                      <span className="float-right font-mono">
                        {new Date(detail.timestamp || Date.now()).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </p>
                    <p className="text-sm font-medium mb-1 text-foreground">{detail.transfer}</p>
                    <div className="p-3 bg-warning/10 rounded border border-warning/20 mt-2 text-warning">
                      <p className="text-[10px] font-bold uppercase mb-1 font-mono">Reason provided:</p>
                      <p className="text-xs italic">{`"${detail.reason}"`}</p>
                    </div>
                  </div>
                ))
              ) : null}

              <div className="relative">
                <div className="absolute -left-[30px] top-1.5 w-3 h-3 rounded-full bg-muted-foreground ring-4 ring-background"></div>
                <p className="font-mono text-xs text-muted-foreground mb-1">Initial Assignment</p>
                <p className="text-sm font-medium text-foreground">
                  Assigned to <span className="font-bold">{ticket.assignedTo}</span> upon creation
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      );
    } else if (expandedCard === "assignment") {
      title = "Assignment Details";
      content = (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Created By Card */}
            <div className="relative overflow-hidden p-5 border border-border rounded-lg bg-card shadow-sm group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-400"></div>
              <h4 className="text-[10px] text-muted-foreground font-mono uppercase mb-4 tracking-widest flex items-center gap-1.5 font-bold">
                <User className="w-3.5 h-3.5" /> Created By
              </h4>

              <div className="flex flex-col h-full text-xs">
                <p className="font-bold text-foreground text-base leading-tight">{ticket.createdBy || "Admin (NOC)"}</p>
                <p className="text-xs text-muted-foreground mt-1 font-mono">{ticket.createdAt || "Recently"}</p>

                <div className="mt-4 p-3 bg-muted/30 rounded border border-border text-xs text-foreground italic flex-1 flex items-center">
                  <span className="opacity-50 mr-2 text-lg">&quot;</span>
                  {ticket.creationRemarks || "Ticket generated and assigned for field optical diagnosis and repair."}
                  <span className="opacity-50 ml-2 text-lg">&quot;</span>
                </div>
              </div>
            </div>

            {/* Closed By Card */}
            <div
              className={`relative overflow-hidden p-5 border border-border rounded-lg bg-card shadow-sm transition-opacity ${
                !isClosed && "opacity-60 saturate-50"
              }`}
            >
              <div
                className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${
                  isClosed ? "from-emerald-500 to-green-400" : "from-muted-foreground to-border"
                }`}
              ></div>
              <h4 className="text-[10px] text-muted-foreground font-mono uppercase mb-4 tracking-widest flex items-center gap-1.5 font-bold">
                <User className="w-3.5 h-3.5" /> Closed By
              </h4>

              {isClosed ? (
                <div className="flex flex-col h-full text-xs">
                  <p className="font-bold text-foreground text-base leading-tight">
                    {ticket.staffDetails?.closedBy || "Usman Ali (Lead Splicer)"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 font-mono">
                    {ticket.staffDetails?.closingDate || ticket.updatedAt || "Recently"}
                  </p>

                  <div className="mt-4 p-3 bg-success/10 rounded border border-success/20 text-xs text-foreground italic flex-1 flex items-center">
                    <span className="opacity-50 mr-2 text-lg text-success">&quot;</span>
                    {ticket.staffDetails?.closingRemarks || "Issue resolved. Optical drop re-spliced, RX: -18.4 dBm."}
                    <span className="opacity-50 ml-2 text-lg text-success">&quot;</span>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center py-8 text-xs text-muted-foreground font-bold uppercase tracking-wider bg-muted/20 rounded border border-dashed border-border">
                  Ticket is currently active
                </div>
              )}
            </div>
          </div>

          {/* Assigned To Header Banner */}
          <div className="p-4 bg-primary/10 rounded-lg border border-primary/20 flex items-center justify-between shadow-sm relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-[10px] text-primary font-mono uppercase mb-1 tracking-widest font-bold">
                Currently Assigned To
              </p>
              <p className="font-black text-xl text-foreground tracking-tight">{ticket.assignedTo}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-card flex items-center justify-center shrink-0 border-2 border-primary shadow-sm relative z-10">
              <span className="text-base font-black text-primary">
                {ticket.assignedTo.substring(0, 2).toUpperCase()}
              </span>
            </div>
          </div>
        </motion.div>
      );
    } else if (expandedCard === "diagnostics") {
      title = "Location & Live Diagnostics";
      content = (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6 text-xs"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 md:col-span-1 p-4 bg-muted/30 rounded border border-border">
              <p className="text-[10px] text-muted-foreground font-mono uppercase mb-1 font-bold">Optical Rx Power</p>
              <p className="font-bold text-xl text-destructive font-mono">
                {ticket.opticalDbm ? `${ticket.opticalDbm} dBm` : "-32.4 dBm"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Critical loss threshold breached (-27.0 dBm)</p>
            </div>
            <div className="col-span-2 md:col-span-1 p-4 bg-muted/30 rounded border border-border">
              <p className="text-[10px] text-muted-foreground font-mono uppercase mb-1 font-bold">ONT / Port Status</p>
              <p className="font-bold text-xl text-destructive font-mono">
                {ticket.ontStatus || "LOS / Offline (No Light)"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Last online session: 2 hours ago</p>
            </div>
          </div>

          <div className="pt-2">
            <h4 className="font-mono text-xs text-muted-foreground uppercase tracking-wider mb-4 border-b border-border pb-2 font-bold">
              Customer Premise Coordinates
            </h4>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded bg-muted flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-foreground text-sm leading-tight">{ticket.address}</p>
                  <p className="font-mono text-xs text-muted-foreground mt-1">
                    Lat: {ticket.lat || 33.6844} • Lng: {ticket.lng || 73.0479}
                  </p>
                </div>
                <button
                  onClick={() =>
                    window.open(
                      `https://www.google.com/maps/search/?api=1&query=${ticket.lat || 33.6844},${ticket.lng || 73.0479}`,
                      "_blank"
                    )
                  }
                  className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors rounded shadow-sm text-xs font-bold uppercase tracking-wide shrink-0 cursor-pointer"
                >
                  <Navigation className="w-4 h-4" />
                  Navigate
                </button>
              </div>

              {/* Map Canvas Preview Box */}
              <div className="w-full h-48 bg-muted/40 rounded-lg border border-border flex items-center justify-center overflow-hidden relative">
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 2px 2px, rgba(0,0,0,0.4) 1px, transparent 0)",
                    backgroundSize: "20px 20px",
                  }}
                ></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 text-center">
                  <MapPin className="w-8 h-8 text-primary animate-bounce drop-shadow-lg mx-auto" />
                  <div className="w-4 h-1 bg-black/20 rounded-full mx-auto blur-[1px]"></div>
                  <span className="text-xs font-mono font-bold text-foreground mt-2 block">
                    Drop FAT: FAT-F10-18 (85m)
                  </span>
                </div>
                <p className="text-[10px] font-mono text-muted-foreground uppercase absolute bottom-2 right-2">
                  GIS Spatial Lock Active
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      );
    }

    return (
      <AnimatePresence>
        {expandedCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
            onClick={() => setExpandedCard(null)}
          >
            <motion.div
              layoutId={`card-${expandedCard}`}
              className="bg-card w-full max-w-2xl rounded-lg shadow-2xl border border-border overflow-hidden flex flex-col max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-6 border-b border-border bg-card shrink-0">
                <h3 className="font-heading font-bold text-lg tracking-tight text-foreground">{title}</h3>
                <button
                  onClick={() => setExpandedCard(null)}
                  className="p-1.5 hover:bg-muted rounded text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">{content}</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  const handleAddNote = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newLogContent.trim()) return;

    const newNote: TicketNote = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      author: "NOC Dispatcher",
      content: newLogContent.trim(),
    };

    if (onUpdate) {
      onUpdate(ticket.id, {
        notes: [newNote, ...(ticket.notes || [])],
      });
    }

    setNewLogContent("");
    toast.success("Log Saved", "Internal engineering note recorded.");
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-hidden relative">
      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto pb-6 custom-scrollbar">
        {/* Header Toolbar */}
        <div className="p-6 border-b border-border bg-card flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sticky top-0 z-10 shadow-sm">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-heading font-black tracking-tight text-foreground">
                {ticket.ticketNo || ticket.id}
              </h1>
              <span
                className={`px-2 py-0.5 rounded text-xs font-bold font-mono border ${
                  isClosed
                    ? "border-success/30 bg-success/10 text-success"
                    : ticket.status === "Expired"
                    ? "border-destructive/30 bg-destructive/10 text-destructive"
                    : ticket.status === "Pending" || ticket.status === "open"
                    ? "border-border bg-card text-foreground"
                    : "border-primary/30 bg-primary/10 text-primary"
                }`}
              >
                {ticket.status.replace("_", " ").toUpperCase()}
              </span>
              {ticket.transferredFrom && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono border border-warning/30 bg-warning/10 text-warning flex items-center gap-1 uppercase">
                  <RefreshCw className="w-3 h-3" /> Transferred from {ticket.transferredFrom}
                </span>
              )}
            </div>
            <p className="text-muted-foreground text-sm font-medium">
              {ticket.type || "Fiber Drop Cut / Red LOS"} • Priority:{" "}
              <strong className="text-foreground font-bold">{ticket.priority}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto mt-3 md:mt-0 flex-wrap justify-end">
            <Tooltip content="Delete Ticket" position="bottom">
              <button
                onClick={() => setIsDeleteDialogOpen(true)}
                className="px-3 py-2 border border-destructive/20 text-destructive bg-destructive/10 font-semibold text-xs rounded hover:bg-destructive/20 transition-colors flex items-center justify-center shadow-sm cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </Tooltip>
            <button
              onClick={() => setIsTransferDialogOpen(true)}
              className="px-4 py-2 bg-warning text-warning-foreground font-bold text-xs rounded flex items-center justify-center gap-1.5 hover:bg-warning/90 transition-colors shadow-sm cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Transfer
            </button>
            <button
              onClick={() => {
                if (isClosed) {
                  setIsReopenDialogOpen(true);
                } else if (onUpdate) {
                  onUpdate(ticket.id, { status: "Closed", opticalDbm: -18.4 });
                  toast.success("Resolved", `Ticket ${ticket.ticketNo || ticket.id} closed.`);
                }
              }}
              className="px-4 py-2 bg-success text-success-foreground font-bold text-xs rounded flex items-center justify-center hover:bg-success/90 transition-colors shadow-sm cursor-pointer"
            >
              {isClosed ? "Reopen Ticket" : "Mark as Close"}
            </button>
          </div>
        </div>

        {/* 6-Widget Bento Grid Matching Reference with Framer Motion LayoutId */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* 1. Customer Widget */}
          <motion.div
            layoutId={expandedCard === "customer" ? undefined : "card-customer"}
            className={`border border-border rounded-lg bg-card p-4 shadow-sm flex flex-col group relative overflow-hidden transition-colors ${
              expandedCard ? "opacity-50" : "cursor-pointer hover:border-primary/50"
            }`}
            onClick={() => !expandedCard && setExpandedCard("customer")}
          >
            <div className="flex justify-between items-center border-b border-border pb-2 mb-4">
              <h3 className="font-mono text-xs text-muted-foreground uppercase tracking-wider font-bold">
                Customer
              </h3>
              <Tooltip content="Expand Customer Info" position="top">
                <div className="opacity-0 group-hover:opacity-100 p-1 bg-muted/50 rounded transition-all hover:bg-muted">
                  <Maximize2 className="w-3.5 h-3.5 text-foreground" />
                </div>
              </Tooltip>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded bg-muted flex items-center justify-center shrink-0">
                <User className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-heading font-bold text-foreground leading-tight truncate">
                  {ticket.customerName}
                </p>
                <p className="font-mono text-xs text-muted-foreground mt-1 truncate">
                  {ticket.username || "sub_pppoe_user"}
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <Tooltip content="Call Customer" position="top">
                    <a
                      href={`tel:${ticket.contact}`}
                      onClick={(e) => e.stopPropagation()}
                      className="p-1.5 border border-border rounded text-success hover:bg-success/10 cursor-pointer transition-colors bg-card"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>
                  </Tooltip>
                  <Tooltip content="WhatsApp Customer" position="top">
                    <a
                      href={`https://wa.me/${(ticket.contact || "").replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-1.5 border border-border rounded text-success hover:bg-success/10 cursor-pointer transition-colors bg-card"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                    </a>
                  </Tooltip>
                  <span className="text-xs font-mono text-muted-foreground ml-1 truncate">
                    {ticket.contact}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 2. SLA Target (ETTR) Widget */}
          <div
            className={`border border-border rounded-lg bg-card p-4 shadow-sm flex flex-col justify-between transition-opacity ${
              expandedCard ? "opacity-50" : ""
            }`}
          >
            <div>
              <h3 className="font-mono text-xs text-muted-foreground uppercase tracking-wider mb-4 border-b border-border pb-2 font-bold">
                SLA Target (ETTR)
              </h3>
              <p className="font-mono text-sm font-bold text-foreground mb-4">{formatDate(ticket.ettr)}</p>
            </div>
            <div>
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    isClosed
                      ? "bg-success"
                      : ticket.status === "Expired"
                      ? "bg-destructive"
                      : "bg-warning"
                  }`}
                  style={{ width: isClosed ? "100%" : "85%" }}
                ></div>
              </div>
              <p className="text-[10px] text-muted-foreground mt-2 text-right font-mono uppercase font-bold">
                {isClosed ? "Resolution Met" : "85% Time Elapsed"}
              </p>
            </div>
          </div>

          {/* 3. Staffing Assignment Widget */}
          <motion.div
            layoutId={expandedCard === "assignment" ? undefined : "card-assignment"}
            className={`border border-border rounded-lg bg-card p-4 shadow-sm flex flex-col group relative overflow-hidden transition-colors ${
              expandedCard ? "opacity-50" : "cursor-pointer hover:border-primary/50"
            }`}
            onClick={() => !expandedCard && setExpandedCard("assignment")}
          >
            <div className="flex justify-between items-center mb-4 border-b border-border pb-2">
              <h3 className="font-mono text-xs text-muted-foreground uppercase tracking-wider font-bold">
                Assignment
              </h3>
              <Tooltip content="Expand Assignment Info" position="top">
                <div className="opacity-0 group-hover:opacity-100 p-1 bg-muted/50 rounded transition-all hover:bg-muted">
                  <Maximize2 className="w-3.5 h-3.5 text-foreground" />
                </div>
              </Tooltip>
            </div>
            <div className="flex-1 flex flex-col gap-3 text-xs">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-[10px] text-muted-foreground font-mono uppercase mb-0.5 font-bold">Created By</p>
                  <p className="text-sm font-medium text-foreground">{ticket.createdBy || "NOC Admin"}</p>
                </div>
                {ticket.staffDetails?.closedBy && (
                  <div className="text-right">
                    <p className="text-[10px] text-muted-foreground font-mono uppercase mb-0.5 font-bold">Closed By</p>
                    <p className="text-sm font-medium text-foreground">{ticket.staffDetails.closedBy}</p>
                  </div>
                )}
              </div>

              <div>
                <p className="text-[10px] text-muted-foreground font-mono uppercase mb-1 font-bold">Assigned Technician</p>
                <div className="flex items-center gap-2 p-2 bg-primary/5 rounded border border-primary/20">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <span className="text-[10px] font-bold text-primary">
                      {ticket.assignedTo.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-foreground leading-tight">{ticket.assignedTo}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 4. Diagnostic Telemetry Widget */}
          <motion.div
            layoutId={expandedCard === "diagnostics" ? undefined : "card-diagnostics"}
            className={`border border-border rounded-lg bg-card p-4 shadow-sm flex flex-col group relative overflow-hidden transition-colors ${
              expandedCard ? "opacity-50" : "cursor-pointer hover:border-primary/50"
            }`}
            onClick={() => !expandedCard && setExpandedCard("diagnostics")}
          >
            <div className="flex justify-between items-center mb-4 border-b border-border pb-2">
              <div className="flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-muted-foreground" />
                <h3 className="font-mono text-xs text-muted-foreground uppercase tracking-wider font-bold">
                  Live Diagnostics
                </h3>
              </div>
              <Tooltip content="Expand Diagnostics" position="top">
                <div className="opacity-0 group-hover:opacity-100 p-1 bg-muted/50 rounded transition-all hover:bg-muted">
                  <Maximize2 className="w-3.5 h-3.5 text-foreground" />
                </div>
              </Tooltip>
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-[10px] text-muted-foreground font-mono uppercase mb-0.5 font-bold">Optical Power</p>
                <p className="text-sm font-bold text-destructive font-mono">{ticket.opticalDbm || -32.4} dBm</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground font-mono uppercase mb-0.5 font-bold">ONT Status</p>
                <p className="text-sm font-bold text-destructive font-mono">{ticket.ontStatus || "LOS / Offline"}</p>
              </div>
              <div className="col-span-2 flex items-center gap-2 p-2 bg-muted/50 rounded border border-border overflow-hidden">
                <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <p className="text-xs font-medium truncate text-foreground">{ticket.address}</p>
              </div>
            </div>
          </motion.div>

          {/* 5. ETTR History Widget */}
          <motion.div
            layoutId={expandedCard === "ettr" ? undefined : "card-ettr"}
            className={`border border-border rounded-lg bg-card p-4 shadow-sm flex flex-col group relative overflow-hidden transition-colors ${
              expandedCard ? "opacity-50" : "cursor-pointer hover:border-primary/50"
            }`}
            onClick={() => !expandedCard && setExpandedCard("ettr")}
          >
            <div className="flex justify-between items-center mb-4 border-b border-border pb-2">
              <div className="flex items-center gap-2">
                <History className="w-3.5 h-3.5 text-muted-foreground" />
                <h3 className="font-mono text-xs text-muted-foreground uppercase tracking-wider font-bold">
                  ETTR History
                </h3>
              </div>
              <Tooltip content="Expand ETTR History" position="top">
                <div className="opacity-0 group-hover:opacity-100 p-1 bg-muted/50 rounded transition-all hover:bg-muted">
                  <Maximize2 className="w-3.5 h-3.5 text-foreground" />
                </div>
              </Tooltip>
            </div>
            <div className="flex-1 overflow-y-auto text-xs">
              {ticket.ettrHistory && ticket.ettrHistory.length > 0 ? (
                <div className="flex flex-col gap-2 relative pl-3 before:absolute before:left-0 before:top-1.5 before:bottom-0 before:w-px before:bg-border">
                  <div className="relative">
                    <div className="absolute -left-[15px] top-1.5 w-2 h-2 rounded-full bg-primary ring-2 ring-background"></div>
                    <p className="text-[10px] font-mono text-muted-foreground mb-0.5">
                      Extended by {ticket.ettrHistory[0].changedBy}
                    </p>
                    <p className="text-xs font-medium line-clamp-2 text-foreground">{ticket.ettrHistory[0].change}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5 italic">
                      Rsn: {ticket.ettrHistory[0].reason}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic">No extensions recorded.</p>
              )}
            </div>
          </motion.div>

          {/* 6. Transfer History Widget */}
          <motion.div
            layoutId={expandedCard === "transfer" ? undefined : "card-transfer"}
            className={`border border-border rounded-lg bg-card p-4 shadow-sm flex flex-col group relative overflow-hidden transition-colors ${
              expandedCard ? "opacity-50" : "cursor-pointer hover:border-primary/50"
            }`}
            onClick={() => !expandedCard && setExpandedCard("transfer")}
          >
            <div className="flex justify-between items-center mb-4 border-b border-border pb-2">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 text-muted-foreground" />
                <h3 className="font-mono text-xs text-muted-foreground uppercase tracking-wider font-bold">
                  Transfer History
                </h3>
              </div>
              <Tooltip content="Expand Transfer History" position="top">
                <div className="opacity-0 group-hover:opacity-100 p-1 bg-muted/50 rounded transition-all hover:bg-muted">
                  <Maximize2 className="w-3.5 h-3.5 text-foreground" />
                </div>
              </Tooltip>
            </div>
            <div className="flex-1 overflow-y-auto text-xs">
              {ticket.transferHistory && ticket.transferHistory.length > 0 ? (
                <div className="flex flex-col gap-2 relative pl-3 before:absolute before:left-0 before:top-1.5 before:bottom-0 before:w-px before:bg-border">
                  <div className="relative">
                    <div className="absolute -left-[15px] top-1.5 w-2 h-2 rounded-full bg-warning ring-2 ring-background"></div>
                    <p className="text-[10px] font-mono text-muted-foreground mb-0.5">
                      Transferred by {ticket.transferHistory[0].transferredBy}
                    </p>
                    <p className="text-xs font-medium text-foreground">{ticket.transferHistory[0].transfer}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5 italic">
                      Rsn: {ticket.transferHistory[0].reason}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic">No transfers recorded.</p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Logs and Forms Area */}
        <div className={`px-6 pb-6 flex flex-col gap-6 transition-opacity ${expandedCard ? "opacity-50" : ""}`}>
          {/* Technical Log Entries & Notes Section */}
          <div className="border border-border rounded-lg bg-card shadow-sm overflow-hidden flex flex-col">
            <div className="p-3 border-b border-border bg-muted/30 flex justify-between items-center">
              <h3 className="font-mono text-xs text-muted-foreground uppercase tracking-wider font-bold">
                Technical Log Entries & Notes ({ticket.notes?.length || 0})
              </h3>
            </div>

            <div className="flex flex-col divide-y divide-border overflow-y-auto max-h-[300px] custom-scrollbar">
              {ticket.notes && ticket.notes.length > 0 ? (
                [...ticket.notes]
                  .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                  .map((note) => (
                    <div key={note.id} className="p-4 flex gap-4 text-xs">
                      <div className="shrink-0 w-24">
                        <p className="font-mono text-xs font-bold text-foreground">
                          {new Date(note.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-1 font-mono">
                          {new Date(note.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-foreground mb-1">{note.author}</p>
                        <p className="text-sm text-foreground/90 leading-relaxed">{note.content}</p>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="p-8 text-center text-sm text-muted-foreground font-mono">
                  No logs recorded yet.
                </div>
              )}
            </div>

            <form onSubmit={handleAddNote} className="p-3 border-t border-border bg-muted/10 flex gap-2">
              <input
                type="text"
                value={newLogContent}
                onChange={(e) => setNewLogContent(e.target.value)}
                placeholder="Type an internal note..."
                className="flex-1 px-3 py-2 text-xs bg-background border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary font-mono text-foreground"
              />
              <Tooltip content="Send Note" position="left">
                <button
                  type="submit"
                  disabled={!newLogContent.trim()}
                  className="p-2 bg-primary text-primary-foreground rounded hover:opacity-90 disabled:opacity-50 cursor-pointer shadow-sm"
                >
                  <Send className="w-4 h-4" />
                </button>
              </Tooltip>
            </form>
          </div>

          {/* Master Resolution Forms Panel */}
          <div className="border border-border rounded-lg bg-card p-4 shadow-sm flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wide mb-1.5 font-mono">
                  Change Priority
                </label>
                <select
                  value={ticket.priority}
                  onChange={(e) =>
                    onUpdate &&
                    onUpdate(ticket.id, {
                      priority: e.target.value as FullTroubleTicket["priority"],
                    })
                  }
                  className="w-full px-3 py-2 text-xs bg-background border border-border rounded focus:outline-none focus:border-primary font-mono text-foreground"
                >
                  <option value="Urgent">Urgent (P1)</option>
                  <option value="High">High (P2)</option>
                  <option value="Normal">Normal (P3)</option>
                </select>
              </div>
              <div>
                <DateTimePicker
                  label="Closed On"
                  value={closedOn}
                  onChange={setClosedOn}
                  placeholder="mm/dd/yyyy --:-- --"
                />
              </div>
              <div>
                <div className="flex gap-2 items-end">
                  <DateTimePicker
                    label="Change ETTR"
                    required={true}
                    value={ettrUpdate}
                    onChange={setEttrUpdate}
                    placeholder="mm/dd/yyyy --:-- --"
                    className="flex-1"
                  />
                  <button
                    onClick={() => {
                      if (ettrUpdate && onUpdate) {
                        const newHistory: EttrHistoryItem = {
                          timestamp: new Date().toISOString(),
                          changedBy: "NOC Dispatcher",
                          change: `Changed ETTR to ${new Date(ettrUpdate).toLocaleString()}`,
                          reason: "Field technician requested extension due to fiber cut location.",
                        };
                        onUpdate(ticket.id, {
                          ettr: ettrUpdate,
                          ettrHistory: [newHistory, ...(ticket.ettrHistory || [])],
                        });
                        setEttrUpdate("");
                        toast.success("ETTR Updated", "Target resolution time extended.");
                      }
                    }}
                    disabled={!ettrUpdate}
                    className="px-4 py-[9px] bg-primary text-primary-foreground font-bold text-xs rounded hover:opacity-90 transition-opacity whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm"
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wide mb-1.5 font-mono">
                Resolution / Issue Resolved Details <span className="text-destructive">*</span>
              </label>
              <textarea
                value={resolutionText}
                onChange={(e) => setResolutionText(e.target.value)}
                className="w-full p-3 text-xs bg-background border border-border rounded resize-none focus:outline-none focus:border-primary min-h-[80px] font-mono text-foreground"
                placeholder="Describe the root cause and resolution steps (e.g. Spliced loose fiber in FAT box #18)..."
              ></textarea>
            </div>
          </div>
        </div>
      </div>

      {/* Renders full modal when expandedCard is selected */}
      {renderExpandedModal()}

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={() => {
          if (onDelete) onDelete(ticket.id);
          toast.success("Ticket Deleted", `Ticket ${ticket.ticketNo || ticket.id} has been permanently deleted.`);
        }}
        title="Delete Trouble Ticket"
        description={`Are you sure you want to permanently delete ticket ${ticket.ticketNo || ticket.id}? This action cannot be undone.`}
      />

      {/* Transfer Dialog */}
      <AnimatePresence>
        {isTransferDialogOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-background/80 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 8 }}
              className="bg-card w-full max-w-md rounded-lg shadow-2xl border border-border overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-4 border-b border-border bg-card">
                <h3 className="font-heading font-bold text-base text-foreground">Transfer Trouble Ticket</h3>
                <button
                  onClick={() => setIsTransferDialogOpen(false)}
                  className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-5 space-y-4 text-xs">
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wide mb-1.5 font-mono">
                    Select Splicer / Technician
                  </label>
                  <select
                    value={transferData.staff}
                    onChange={(e) => setTransferData({ ...transferData, staff: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-background border border-border rounded focus:outline-none focus:border-primary font-mono text-foreground"
                  >
                    <option value="">Select a technician...</option>
                    <option value="Usman Ali (Lead Splicer)">Usman Ali (Lead Splicer)</option>
                    <option value="Bilal Hassan (Technician)">Bilal Hassan (Technician)</option>
                    <option value="Imran Splicer (Drop Team)">Imran Splicer (Drop Team)</option>
                    <option value="Farhan NOC (Remote Desk)">Farhan NOC (Remote Desk)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wide mb-1.5 font-mono">
                    Reason for Transfer <span className="text-destructive">*</span>
                  </label>
                  <textarea
                    value={transferData.reason}
                    onChange={(e) => setTransferData({ ...transferData, reason: e.target.value })}
                    className="w-full p-3 text-xs bg-background border border-border rounded resize-none focus:outline-none focus:border-primary min-h-[90px] text-foreground"
                    placeholder="Why is this ticket being transferred?"
                  ></textarea>
                </div>
              </div>
              <div className="p-4 border-t border-border bg-muted/20 flex justify-end gap-2">
                <button
                  onClick={() => setIsTransferDialogOpen(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-muted rounded transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (transferData.staff && transferData.reason && onUpdate) {
                      const newTransfer: TransferHistoryItem = {
                        timestamp: new Date().toISOString(),
                        transferredBy: "NOC Dispatcher",
                        transfer: `Transferred to ${transferData.staff}`,
                        reason: transferData.reason,
                      };
                      onUpdate(ticket.id, {
                        assignedTo: transferData.staff,
                        transferredFrom: ticket.assignedTo,
                        transferHistory: [newTransfer, ...(ticket.transferHistory || [])],
                      });
                      toast.success("Ticket Reassigned", `Work order transferred to ${transferData.staff}.`);
                      setIsTransferDialogOpen(false);
                      setTransferData({ staff: "", reason: "" });
                    }
                  }}
                  disabled={!transferData.staff || !transferData.reason}
                  className="px-4 py-1.5 bg-primary text-primary-foreground text-xs font-bold rounded hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm"
                >
                  Confirm Transfer
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Reopen Dialog */}
        {isReopenDialogOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-background/80 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 8 }}
              className="bg-card w-full max-w-md rounded-lg shadow-2xl border border-border overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-4 border-b border-border bg-card">
                <h3 className="font-heading font-bold text-base text-primary">Reopen Trouble Ticket</h3>
                <button
                  onClick={() => setIsReopenDialogOpen(false)}
                  className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-5 space-y-4 text-xs">
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wide mb-1.5 font-mono">
                    Reason for Reopening <span className="text-destructive">*</span>
                  </label>
                  <textarea
                    value={reopenReason}
                    onChange={(e) => setReopenReason(e.target.value)}
                    className="w-full p-3 text-xs bg-background border border-border rounded resize-none focus:outline-none focus:border-primary min-h-[90px] text-foreground"
                    placeholder="Why does this ticket need to be reopened? (e.g. Subscriber reported LOS still red)..."
                  ></textarea>
                </div>
              </div>
              <div className="p-4 border-t border-border bg-muted/20 flex justify-end gap-2">
                <button
                  onClick={() => setIsReopenDialogOpen(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-muted rounded transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (reopenReason && onUpdate) {
                      onUpdate(ticket.id, { status: "Pending" });
                      toast.warning("Ticket Reopened", "Ticket set to Pending state.");
                      setIsReopenDialogOpen(false);
                      setReopenReason("");
                    }
                  }}
                  disabled={!reopenReason}
                  className="px-4 py-1.5 bg-primary text-primary-foreground text-xs font-bold rounded hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm"
                >
                  Confirm Reopen
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
