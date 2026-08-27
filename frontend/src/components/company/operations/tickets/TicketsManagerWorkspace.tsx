"use client";

import React, { useState, useMemo } from "react";
import {
  Ticket,
  Search,
  ArrowRightLeft,
  CheckCircle2,
  Phone,
  MapPin,
  Clock,
  Plus,
  RefreshCw,
  ShieldCheck,
  Maximize2,
  X,
  Navigation,
  Trash2,
  User,
  Activity,
  AlertCircle,
  MessageSquare,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface TroubleTicketItem {
  id: string;
  ticketNo: string;
  customerName: string;
  phone: string;
  address: string;
  category: string;
  priority: "Critical" | "High" | "Normal" | "Low";
  status: "open" | "assigned" | "in_progress" | "resolved" | "closed";
  assignedTo: string;
  vanNo: string;
  opticalDbm: number;
  slaMinutesLeft: number;
  description: string;
  createdAt?: string;
  createdBy?: string;
  creationRemarks?: string;
  closedBy?: string;
  closingRemarks?: string;
  transferredFrom?: string;
  ettrTarget?: string;
}

export function TicketsManagerWorkspace({
  ticketsList,
  setTicketsList,
  selectedTicket,
  setSelectedTicket,
  isCreateTicketOpen,
  setIsCreateTicketOpen,
  ticketViewMode,
  setTicketViewMode,
}: {
  ticketsList: TroubleTicketItem[];
  setTicketsList: React.Dispatch<React.SetStateAction<TroubleTicketItem[]>>;
  selectedTicket: TroubleTicketItem | null;
  setSelectedTicket: (t: TroubleTicketItem | null) => void;
  isCreateTicketOpen: boolean;
  setIsCreateTicketOpen: (open: boolean) => void;
  ticketViewMode: "kanban" | "table";
  setTicketViewMode: (mode: "kanban" | "table") => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [staffFilter, setStaffFilter] = useState("All");
  const [timeSort, setTimeSort] = useState("Newest");
  const [expandedCard, setExpandedCard] = useState<"customer" | "ettr" | "assignment" | "diagnostics" | null>(null);

  // New Ticket Form State
  const [newCustName, setNewCustName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [newCategory, setNewCategory] = useState("Fiber Drop Cut / Red LOS");
  const [newPriority, setNewPriority] = useState<"Critical" | "High" | "Normal" | "Low">("High");
  const [newAssignedTo, setNewAssignedTo] = useState("Usman Ali (Van #04)");
  const [newRemarks, setNewRemarks] = useState("");

  const activeTicket = selectedTicket || ticketsList[0] || null;

  const filteredTickets = useMemo(() => {
    const result = ticketsList.filter((t) => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        !searchQuery ||
        t.ticketNo.toLowerCase().includes(q) ||
        t.customerName.toLowerCase().includes(q) ||
        t.phone.includes(q) ||
        t.category.toLowerCase().includes(q);

      const matchStatus =
        statusFilter === "All" ||
        (statusFilter === "Pending" && t.status === "open") ||
        (statusFilter === "In Progress" && (t.status === "in_progress" || t.status === "assigned")) ||
        (statusFilter === "Resolved" && t.status === "resolved") ||
        (statusFilter === "Closed" && t.status === "closed");

      const matchPriority = priorityFilter === "All" || t.priority === priorityFilter;

      const matchStaff =
        staffFilter === "All" ||
        (staffFilter === "Assigned to Me" && t.assignedTo.toLowerCase().includes("usman")) ||
        t.assignedTo === staffFilter;

      return matchSearch && matchStatus && matchPriority && matchStaff;
    });

    result.sort((a, b) => {
      return timeSort === "Newest" ? b.slaMinutesLeft - a.slaMinutesLeft : a.slaMinutesLeft - b.slaMinutesLeft;
    });

    return result;
  }, [ticketsList, searchQuery, statusFilter, priorityFilter, staffFilter, timeSort]);

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    const newTkt: TroubleTicketItem = {
      id: `tkt-${Date.now()}`,
      ticketNo: `TK-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: newCustName || "New Customer",
      phone: newPhone || "+92 300 0000000",
      address: newAddress || "Sector F-10, Islamabad",
      category: newCategory,
      priority: newPriority,
      status: "open",
      assignedTo: newAssignedTo.split(" (")[0],
      vanNo: newAssignedTo.includes("Van") ? newAssignedTo.split(" (")[1].replace(")", "") : "Bike #01",
      opticalDbm: -28.5,
      slaMinutesLeft: newPriority === "Critical" ? 45 : newPriority === "High" ? 90 : 180,
      description: newRemarks || "Ticket generated for field dispatch and fiber diagnostics.",
      createdAt: new Date().toISOString(),
      createdBy: "Eng. Moiz (NOC Dispatch)",
      creationRemarks: newRemarks || "Customer reported red LOS on ONT after road construction work.",
      ettrTarget: new Date(Date.now() + 2 * 3600 * 1000).toISOString(),
    };

    setTicketsList([newTkt, ...ticketsList]);
    setSelectedTicket(newTkt);
    setIsCreateTicketOpen(false);
    setNewCustName("");
    setNewPhone("");
    setNewAddress("");
    setNewRemarks("");
  };

  const handleDeleteTicket = (id: string) => {
    setTicketsList((prev) => prev.filter((t) => t.id !== id));
    if (selectedTicket?.id === id) {
      setSelectedTicket(ticketsList.find((t) => t.id !== id) || null);
    }
  };

  return (
    <div className="flex flex-1 h-full w-full overflow-hidden bg-background">
      {/* LEFT PANE: Filters & Dense Ticket Cards */}
      <div className="w-full md:w-[380px] lg:w-[410px] shrink-0 flex flex-col border-r border-border bg-card">
        {/* Pinned Top Filter Bar */}
        <div className="p-3.5 border-b border-border bg-card flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-bold text-base text-foreground tracking-tight">
              Manage Tickets
            </h2>
            <Button size="sm" onClick={() => setIsCreateTicketOpen(true)} className="text-xs">
              <Plus className="h-3.5 w-3.5 mr-1" /> Generate Ticket
            </Button>
          </div>

          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search tickets, customers, phones..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs"
            />
          </div>

          {/* Micro Filter Dropdowns */}
          <div className="flex flex-wrap gap-1.5 items-center text-xs">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-background border border-border rounded-md px-2 py-1 text-[11px] font-medium text-foreground focus:outline-none"
            >
              <option value="All">All Status</option>
              <option value="Pending">Open / Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-background border border-border rounded-md px-2 py-1 text-[11px] font-medium text-foreground focus:outline-none"
            >
              <option value="All">All Priority</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Normal">Normal</option>
            </select>

            <select
              value={staffFilter}
              onChange={(e) => setStaffFilter(e.target.value)}
              className="bg-background border border-border rounded-md px-2 py-1 text-[11px] font-medium text-foreground focus:outline-none"
            >
              <option value="All">All Staff</option>
              <option value="Assigned to Me">Assigned to Me</option>
            </select>

            <select
              value={timeSort}
              onChange={(e) => setTimeSort(e.target.value)}
              className="bg-background border border-border rounded-md px-2 py-1 text-[11px] font-medium text-foreground focus:outline-none ml-auto"
            >
              <option value="Newest">SLA Urgent</option>
              <option value="Oldest">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Tickets Scroll List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar divide-y divide-border bg-card">
          {filteredTickets.length === 0 ? (
            <div className="p-8 text-center text-xs text-muted-foreground">
              No tickets found matching filters.
            </div>
          ) : (
            filteredTickets.map((ticket) => {
              const isSelected = activeTicket?.id === ticket.id;
              const isExpired = ticket.slaMinutesLeft <= 0;

              return (
                <div
                  key={ticket.id}
                  onClick={() => setSelectedTicket(ticket)}
                  className={cn(
                    "p-3.5 cursor-pointer hover:bg-muted/30 transition-colors flex flex-col gap-1.5 border-l-2",
                    isSelected ? "bg-muted/50 border-l-primary" : "border-l-transparent"
                  )}
                >
                  <div className="flex justify-between items-start gap-2">
                    <div className="truncate flex-1">
                      <h3 className="font-heading font-bold text-xs text-foreground truncate">
                        {ticket.customerName}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-0.5 font-mono text-[10px] text-muted-foreground">
                        <span className="font-bold text-primary">{ticket.ticketNo}</span>
                        <span>•</span>
                        <span className="truncate">{ticket.category}</span>
                      </div>
                    </div>

                    <span
                      className={cn(
                        "shrink-0 px-2 py-0.5 rounded text-[9.5px] font-bold font-mono border",
                        ticket.priority === "Critical"
                          ? "border-destructive/30 bg-destructive/10 text-destructive"
                          : ticket.priority === "High"
                          ? "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                          : "border-border bg-muted/50 text-muted-foreground"
                      )}
                    >
                      {ticket.priority.toUpperCase()}
                    </span>
                  </div>

                  <div className="flex justify-between items-center mt-1">
                    <div className="flex items-center gap-1.5">
                      <div
                        className={cn(
                          "w-2 h-2 rounded-full",
                          ticket.status === "resolved" || ticket.status === "closed"
                            ? "bg-emerald-500"
                            : ticket.status === "in_progress"
                            ? "bg-primary"
                            : "bg-amber-500"
                        )}
                      />
                      <span className="text-[11px] font-medium text-foreground/80 capitalize">
                        {ticket.status.replace("_", " ")}
                      </span>
                    </div>

                    <div
                      className={cn(
                        "flex items-center gap-1 font-mono text-[11px] font-bold",
                        isExpired ? "text-destructive" : "text-foreground/90"
                      )}
                    >
                      {isExpired ? (
                        <>
                          <AlertCircle className="w-3.5 h-3.5 text-destructive" />
                          <span>EXPIRED</span>
                        </>
                      ) : (
                        <>
                          <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                          <span>{ticket.slaMinutesLeft}m left</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* RIGHT PANE: Detailed Ticket Workspace */}
      <div className="hidden md:flex flex-1 flex-col overflow-hidden bg-background">
        {activeTicket ? (
          <div className="flex-1 flex flex-col h-full overflow-y-auto custom-scrollbar">
            {/* Sticky Header */}
            <div className="p-4 border-b border-border bg-card flex items-center justify-between shrink-0 sticky top-0 z-10 shadow-2xs">
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-xl font-heading font-black tracking-tight text-foreground">
                    {activeTicket.ticketNo}
                  </h1>
                  <Badge
                    variant={
                      activeTicket.status === "resolved"
                        ? "success"
                        : activeTicket.status === "in_progress"
                        ? "info"
                        : "warning"
                    }
                    className="text-xs capitalize"
                  >
                    {activeTicket.status.replace("_", " ")}
                  </Badge>
                  {activeTicket.transferredFrom && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center gap-1">
                      <RefreshCw className="w-3 h-3" /> Transferred from {activeTicket.transferredFrom}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground font-medium mt-0.5">
                  {activeTicket.category} • Priority: <span className="font-bold text-foreground">{activeTicket.priority}</span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    alert(`Assigning ticket ${activeTicket.ticketNo} to field technician`)
                  }
                  className="text-xs"
                >
                  <ArrowRightLeft className="h-3 w-3 mr-1" /> Reassign
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    setTicketsList((prev) =>
                      prev.map((t) =>
                        t.id === activeTicket.id ? { ...t, status: "resolved" } : t
                      )
                    );
                    setSelectedTicket({ ...activeTicket, status: "resolved" });
                  }}
                  className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <CheckCircle2 className="h-3 w-3 mr-1" /> Mark Resolved
                </Button>
                <button
                  onClick={() => handleDeleteTicket(activeTicket.id)}
                  className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors cursor-pointer"
                  title="Delete Ticket"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Content: 4 Expandable Cards Grid */}
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Customer Profile Card */}
                <div className="p-4 rounded-xl border border-border bg-card shadow-2xs space-y-3 relative group">
                  <div className="flex items-center justify-between border-b border-border/60 pb-2">
                    <span className="text-[10px] font-mono uppercase text-muted-foreground font-bold flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-primary" /> Customer Profile
                    </span>
                    <button
                      onClick={() => setExpandedCard("customer")}
                      className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground cursor-pointer"
                      title="Expand Card"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div>
                    <h3 className="font-heading font-bold text-sm text-foreground">
                      {activeTicket.customerName}
                    </h3>
                    <p className="text-xs font-mono text-muted-foreground">{activeTicket.phone}</p>
                    <p className="text-xs text-muted-foreground mt-1 flex items-start gap-1">
                      <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
                      <span>{activeTicket.address}</span>
                    </p>
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-border/60">
                    <a
                      href={`tel:${activeTicket.phone}`}
                      className="flex-1 py-1.5 px-2 bg-muted/60 hover:bg-muted border border-border rounded-lg flex items-center justify-center gap-1 text-[11px] font-bold text-foreground transition-colors"
                    >
                      <Phone className="w-3 h-3 text-emerald-600" /> Call
                    </a>
                    <a
                      href={`https://wa.me/${activeTicket.phone.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 py-1.5 px-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-lg flex items-center justify-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 transition-colors"
                    >
                      <MessageSquare className="w-3 h-3 text-[#25D366]" /> WhatsApp
                    </a>
                  </div>
                </div>

                {/* 2. ETTR & SLA Timeline Card */}
                <div className="p-4 rounded-xl border border-border bg-card shadow-2xs space-y-3 relative group">
                  <div className="flex items-center justify-between border-b border-border/60 pb-2">
                    <span className="text-[10px] font-mono uppercase text-muted-foreground font-bold flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-500" /> ETTR SLA Timeline
                    </span>
                    <button
                      onClick={() => setExpandedCard("ettr")}
                      className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground cursor-pointer"
                      title="Expand Card"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase font-mono">Target Resolution</p>
                      <p className="font-mono font-bold text-sm text-foreground">
                        {activeTicket.slaMinutesLeft} Minutes Remaining
                      </p>
                    </div>
                    <Badge variant={activeTicket.slaMinutesLeft <= 0 ? "destructive" : "warning"}>
                      {activeTicket.slaMinutesLeft <= 0 ? "SLA Breached" : "Within SLA"}
                    </Badge>
                  </div>

                  <div className="p-2.5 rounded-lg bg-muted/40 border border-border/60 text-xs text-muted-foreground italic">
                    &quot;Initial SLA set to 2 hours based on Fiber Drop Cable cut category.&quot;
                  </div>
                </div>

                {/* 3. Assignment & Personnel Card */}
                <div className="p-4 rounded-xl border border-border bg-card shadow-2xs space-y-3 relative group">
                  <div className="flex items-center justify-between border-b border-border/60 pb-2">
                    <span className="text-[10px] font-mono uppercase text-muted-foreground font-bold flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-primary" /> Assignment Details
                    </span>
                    <button
                      onClick={() => setExpandedCard("assignment")}
                      className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground cursor-pointer"
                      title="Expand Card"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg bg-primary/5 border border-primary/20">
                    <div>
                      <p className="text-[10px] font-mono uppercase text-primary font-bold">Assigned Field Tech</p>
                      <p className="font-heading font-bold text-sm text-foreground">{activeTicket.assignedTo}</p>
                      <p className="text-[10px] text-muted-foreground font-mono">{activeTicket.vanNo}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-heading font-black text-xs">
                      {activeTicket.assignedTo.substring(0, 2).toUpperCase()}
                    </div>
                  </div>

                  <div className="text-[11px] text-muted-foreground font-mono">
                    Created By: <span className="font-bold text-foreground">{activeTicket.createdBy || "NOC Dispatcher"}</span>
                  </div>
                </div>

                {/* 4. Diagnostics & Live Telemetry Card */}
                <div className="p-4 rounded-xl border border-border bg-card shadow-2xs space-y-3 relative group">
                  <div className="flex items-center justify-between border-b border-border/60 pb-2">
                    <span className="text-[10px] font-mono uppercase text-muted-foreground font-bold flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-destructive" /> Location & Telemetry
                    </span>
                    <button
                      onClick={() => setExpandedCard("diagnostics")}
                      className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground cursor-pointer"
                      title="Expand Card"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 rounded-lg bg-muted/30 border border-border text-center">
                      <p className="text-[10px] text-muted-foreground uppercase font-mono">Optical RX</p>
                      <p className={cn("text-base font-bold font-mono", activeTicket.opticalDbm < -25 ? "text-destructive" : "text-emerald-600")}>
                        {activeTicket.opticalDbm} dBm
                      </p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-muted/30 border border-border text-center">
                      <p className="text-[10px] text-muted-foreground uppercase font-mono">ONT Status</p>
                      <p className="text-base font-bold text-destructive font-mono">LOS Alarm</p>
                    </div>
                  </div>

                  <button
                    onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=33.6938,73.0135`, "_blank")}
                    className="w-full py-1.5 bg-muted/60 hover:bg-muted border border-border rounded-lg flex items-center justify-center gap-1.5 text-xs font-bold text-foreground transition-colors cursor-pointer"
                  >
                    <Navigation className="w-3.5 h-3.5 text-primary" /> Navigate on Google Maps
                  </button>
                </div>
              </div>

              {/* Remarks and Work Log Stream */}
              <div className="p-4 rounded-xl border border-border bg-card shadow-2xs space-y-3">
                <h4 className="font-heading font-bold text-xs text-foreground uppercase tracking-wider">
                  Dispatched Fault Log & Remarks
                </h4>
                <div className="p-3 bg-muted/30 rounded-lg border border-border text-xs text-foreground leading-relaxed">
                  {activeTicket.description}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8">
            <Ticket className="w-12 h-12 opacity-20 mb-2" />
            <p className="text-sm font-medium">Select a ticket to inspect details</p>
          </div>
        )}
      </div>

      {/* EXPANDED MODAL ZOOM */}
      {expandedCard && activeTicket && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setExpandedCard(null)}
        >
          <div
            className="w-full max-w-xl bg-card border border-border rounded-2xl shadow-2xl p-6 space-y-4 animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b border-border pb-3">
              <h3 className="font-heading font-bold text-lg text-foreground capitalize">
                {expandedCard} Details - {activeTicket.ticketNo}
              </h3>
              <button
                onClick={() => setExpandedCard(null)}
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {expandedCard === "customer" && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-muted/30 border border-border space-y-2">
                  <div className="font-bold text-base text-foreground">{activeTicket.customerName}</div>
                  <div className="font-mono text-xs text-muted-foreground">{activeTicket.phone}</div>
                  <div className="text-xs text-foreground">{activeTicket.address}</div>
                </div>
                <div className="flex gap-2">
                  <a
                    href={`tel:${activeTicket.phone}`}
                    className="flex-1 py-2.5 rounded-xl bg-muted hover:bg-muted/80 border border-border font-bold text-xs flex items-center justify-center gap-1.5"
                  >
                    <Phone className="w-4 h-4 text-emerald-600" /> Dial Direct Call
                  </a>
                  <a
                    href={`https://wa.me/${activeTicket.phone.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 font-bold text-xs flex items-center justify-center gap-1.5"
                  >
                    <MessageSquare className="w-4 h-4 text-[#25D366]" /> WhatsApp Customer
                  </a>
                </div>
              </div>
            )}

            {expandedCard === "ettr" && (
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-muted/30 border border-border space-y-2">
                  <p className="text-xs font-mono uppercase text-muted-foreground">Original SLA Target</p>
                  <p className="font-mono font-bold text-lg text-foreground">
                    {activeTicket.slaMinutesLeft} Minutes Remaining
                  </p>
                  <p className="text-xs text-muted-foreground">Category: {activeTicket.category}</p>
                </div>
                <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-700 dark:text-amber-400">
                  ⚠️ Resolution is monitored by automated NOC SLA Radar. Escalation will trigger if not resolved within window.
                </div>
              </div>
            )}

            {expandedCard === "assignment" && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 space-y-2">
                  <span className="text-xs font-mono uppercase text-primary font-bold">Assigned Field Unit</span>
                  <div className="font-heading font-bold text-base text-foreground">{activeTicket.assignedTo}</div>
                  <div className="text-xs text-muted-foreground font-mono">Vehicle / Route: {activeTicket.vanNo}</div>
                </div>
                <div className="p-3 rounded-xl bg-muted/30 border border-border text-xs text-muted-foreground">
                  Ticket Created By: <span className="font-bold text-foreground">{activeTicket.createdBy || "System Dispatch"}</span>
                </div>
              </div>
            )}

            {expandedCard === "diagnostics" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-xl bg-muted/30 border border-border text-center">
                    <span className="text-xs text-muted-foreground uppercase font-mono">Optical RX</span>
                    <div className="text-xl font-bold font-mono text-destructive mt-1">{activeTicket.opticalDbm} dBm</div>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/30 border border-border text-center">
                    <span className="text-xs text-muted-foreground uppercase font-mono">ONT Status</span>
                    <div className="text-xl font-bold text-destructive font-mono mt-1">LOS / Link Down</div>
                  </div>
                </div>
                <button
                  onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=33.6938,73.0135`, "_blank")}
                  className="w-full py-2.5 bg-primary text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
                >
                  <Navigation className="w-4 h-4" /> Open In Google Maps App
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* GENERATE TICKET DRAWER MODAL */}
      {isCreateTicketOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-end animate-in fade-in">
          <div className="w-full max-w-lg h-full bg-card border-l border-border shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
            <div className="p-4 border-b border-border flex items-center justify-between bg-muted/20">
              <h3 className="font-heading font-bold text-base text-foreground">
                Generate Trouble Ticket
              </h3>
              <button
                onClick={() => setIsCreateTicketOpen(false)}
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="p-4 space-y-3.5 flex-1 overflow-y-auto custom-scrollbar">
              <div>
                <label className="text-xs font-bold text-foreground">Subscriber Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ali Hassan"
                  value={newCustName}
                  onChange={(e) => setNewCustName(e.target.value)}
                  className="mt-1 w-full text-xs bg-muted/30 rounded-lg p-2 border border-border focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-foreground">Contact Phone</label>
                <input
                  type="text"
                  required
                  placeholder="+92 300 1234567"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="mt-1 w-full text-xs bg-muted/30 rounded-lg p-2 border border-border focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-foreground">Customer Address / Area</label>
                <input
                  type="text"
                  required
                  placeholder="House 24, St 12, Sector F-10/2, Islamabad"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  className="mt-1 w-full text-xs bg-muted/30 rounded-lg p-2 border border-border focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-foreground">Fault Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="mt-1 w-full text-xs bg-muted/30 rounded-lg p-2 border border-border focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="Fiber Drop Cut / Red LOS">Fiber Cut / Red LOS</option>
                    <option value="High Optical Attenuation">High Attenuation</option>
                    <option value="Bandwidth Speed Restriction">Speed Restriction</option>
                    <option value="Wi-Fi Router Firmware Fault">Router Firmware</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-foreground">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as "Critical" | "High" | "Normal" | "Low")}
                    className="mt-1 w-full text-xs bg-muted/30 rounded-lg p-2 border border-border focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="Critical">Critical (P1)</option>
                    <option value="High">High (P2)</option>
                    <option value="Normal">Normal (P3)</option>
                    <option value="Low">Low (P4)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-foreground">Assign Field Unit</label>
                <select
                  value={newAssignedTo}
                  onChange={(e) => setNewAssignedTo(e.target.value)}
                  className="mt-1 w-full text-xs bg-muted/30 rounded-lg p-2 border border-border focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Usman Ali (Van #04)">Usman Ali (Van #04 - Splicer)</option>
                  <option value="Imran Splicer (Van #02)">Imran Splicer (Van #02)</option>
                  <option value="Bilal Hassan (Bike #02)">Bilal Hassan (Bike #02)</option>
                  <option value="Farhan NOC (Van #01)">Farhan NOC (Van #01)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-foreground">Diagnostic Remarks & Notes</label>
                <textarea
                  rows={3}
                  placeholder="Describe initial fault diagnosis, customer complaint, and suspected break..."
                  value={newRemarks}
                  onChange={(e) => setNewRemarks(e.target.value)}
                  className="mt-1 w-full text-xs bg-muted/30 rounded-lg p-2 border border-border focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="pt-2">
                <Button type="submit" className="w-full text-xs">
                  Create Ticket & Dispatch
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
