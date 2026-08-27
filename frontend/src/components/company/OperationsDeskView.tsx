"use client";

import React, { useState } from "react";
import {
  MessageSquare,
  Ticket,
  PlusCircle,
  Search,
  Filter,
  Send,
  Lock,
  ArrowRightLeft,
  CheckCircle2,
  Zap,
  Activity,
  Phone,
  MapPin,
  Clock,
  Plus,
  Radio,
  RefreshCw,
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockDb, SubscriberRecord, NewConnectionLead } from "@/mock/db";
import { cn } from "@/lib/utils";

interface MessageItem {
  id: string;
  sender: "customer" | "staff" | "system";
  senderName: string;
  content: string;
  isInternalNote: boolean;
  time: string;
  status: "sent" | "delivered" | "read";
}

interface TroubleTicketItem {
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
}

export function OperationsDeskView({ initialSubTab = "desk" }: { initialSubTab?: string }) {
  const activeTab = initialSubTab;

  // --- 1. CHAT DESK STATE ---
  const [activeFilter, setActiveFilter] = useState<"all" | "my_chats" | "waiting" | "closed">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<SubscriberRecord>(mockDb.subscribers[0]);
  const [opticalDbm, setOpticalDbm] = useState<number>(-19.24);
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [isCustomerHudOpen, setIsCustomerHudOpen] = useState(true);

  const [messages, setMessages] = useState<MessageItem[]>([
    {
      id: "msg-1",
      sender: "customer",
      senderName: "Ali Hassan",
      content: "Salam, my router LOS light started blinking red 10 minutes ago. Link is disconnected.",
      isInternalNote: false,
      time: "10:40 AM",
      status: "read",
    },
    {
      id: "msg-2",
      sender: "system",
      senderName: "SmartOLT Radar",
      content: "⚡ Automated Diagnostic: Optical RX dropped to -27.4 dBm on Slot 0/2, PON-04 (High Attenuation).",
      isInternalNote: false,
      time: "10:41 AM",
      status: "read",
    },
    {
      id: "msg-3",
      sender: "staff",
      senderName: "Eng. Moiz (Internal Note)",
      content: "🔒 Note: Checked FAT-12 port 3 on pole. Splicer Usman (Van #04) is 4 mins away.",
      isInternalNote: true,
      time: "10:42 AM",
      status: "read",
    },
    {
      id: "msg-4",
      sender: "staff",
      senderName: "Eng. Moiz (NOC Lead)",
      content: "Walaikum Assalam Ali! We verified the optical drop. Ticket #TK-8842 has been generated and Splicer Usman (Van #04) is en route with OTDR meter.",
      isInternalNote: false,
      time: "10:43 AM",
      status: "delivered",
    },
  ]);

  // --- 2. TROUBLE TICKETS STATE ---
  const [ticketViewMode, setTicketViewMode] = useState<"kanban" | "table">("kanban");
  const [selectedTicket, setSelectedTicket] = useState<TroubleTicketItem | null>(null);
  const [isCreateTicketOpen, setIsCreateTicketOpen] = useState(false);

  const [ticketsList, setTicketsList] = useState<TroubleTicketItem[]>([
    {
      id: "tkt-01",
      ticketNo: "TK-8842",
      customerName: "Ali Hassan",
      phone: "+92 300 8594021",
      address: "House 24, St 12, Sector F-10/2, Islamabad",
      category: "Fiber Drop Cut / Red LOS",
      priority: "Critical",
      status: "in_progress",
      assignedTo: "Usman Ali",
      vanNo: "Van #04",
      opticalDbm: -27.4,
      slaMinutesLeft: 35,
      description: "Optical RX signal lost on Splitter #4. OTDR meter indicates break at 65 meters from pole.",
    },
    {
      id: "tkt-02",
      ticketNo: "TK-8841",
      customerName: "Zainab Bibi",
      phone: "+92 321 9876543",
      address: "Plaza 4, Main Blvd, Gulberg III, Lahore",
      category: "Bandwidth Speed Restriction",
      priority: "Normal",
      status: "open",
      assignedTo: "Bilal Hassan",
      vanNo: "Bike #02",
      opticalDbm: -18.2,
      slaMinutesLeft: 110,
      description: "Subscriber paid bill via 1Link. MikroTik queue rate refresh required to restore 50 Mbps.",
    },
    {
      id: "tkt-03",
      ticketNo: "TK-8840",
      customerName: "Ahmed Malik",
      phone: "+92 300 1234567",
      address: "House 112, St 35, Blue Area, Islamabad",
      category: "High Optical Attenuation",
      priority: "High",
      status: "assigned",
      assignedTo: "Imran Splicer",
      vanNo: "Van #02",
      opticalDbm: -24.8,
      slaMinutesLeft: 75,
      description: "High packet drop on PON-04. Connector cleaning and patch cord replacement required.",
    },
    {
      id: "tkt-04",
      ticketNo: "TK-8839",
      customerName: "Kamran Akmal",
      phone: "+92 333 4567890",
      address: "Block 5, Clifton, Karachi",
      category: "Wi-Fi Router Firmware Fault",
      priority: "Normal",
      status: "resolved",
      assignedTo: "Farhan NOC",
      vanNo: "Van #01",
      opticalDbm: -17.2,
      slaMinutesLeft: 0,
      description: "Dual-band 5GHz SSID broadcasting issue. TR-069 firmware re-flash completed successfully.",
    },
  ]);

  // --- 3. NEW CONNECTIONS PIPELINE STATE ---
  const [connectionsList, setConnectionsList] = useState<NewConnectionLead[]>(mockDb.newConnections);
  const [selectedLead, setSelectedLead] = useState<NewConnectionLead | null>(null);

  // Chat Actions
  const handleSendMessage = () => {
    if (!chatInput.trim()) return;

    const newMsg: MessageItem = {
      id: `msg-${Date.now()}`,
      sender: "staff",
      senderName: isInternalNote ? "Eng. Moiz (Internal Note)" : "Eng. Moiz (NOC Lead)",
      content: chatInput.trim(),
      isInternalNote,
      time: "Just now",
      status: "sent",
    };

    setMessages((prev) => [...prev, newMsg]);
    setChatInput("");
  };

  const handleCannedInsert = (template: string) => {
    setChatInput(template);
  };

  const handleToggleFiberCut = () => {
    if (opticalDbm < -25) {
      setOpticalDbm(-19.24);
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-sys-${Date.now()}`,
          sender: "system",
          senderName: "SmartOLT Radar",
          content: "✅ SMARTOLT RESTORED: Optical RX recovered to nominal -19.24 dBm. PPPoE link re-authenticated.",
          isInternalNote: false,
          time: "Just now",
          status: "read",
        },
      ]);
    } else {
      setOpticalDbm(-32.54);
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-sys-${Date.now()}`,
          sender: "system",
          senderName: "SmartOLT Radar",
          content: "🚨 SMARTOLT ALARM: Optical signal loss degraded to -32.54 dBm (Critical Fiber Cut detected).",
          isInternalNote: false,
          time: "Just now",
          status: "read",
        },
      ]);
    }
  };

  return (
    <div className="h-full w-full font-body overflow-hidden">
      {/* =========================================================================
          TAB 1: LIVE CHAT DESK (3-COLUMN WORKSPACE)
      ========================================================================= */}
      {activeTab === "desk" && (
        <div className="flex h-full w-full bg-background overflow-hidden border-0">
          {/* Col 1: Queue Inboxes (Left) */}
          <div className="w-80 border-r border-border bg-card flex flex-col shrink-0">
            <div className="p-3 border-b border-border flex items-center justify-between">
              <span className="font-heading font-bold text-xs uppercase tracking-wider text-muted-foreground">
                Inboxes & Queues
              </span>
              <Badge variant="secondary" className="text-[10px] font-mono">
                Islamabad F-10
              </Badge>
            </div>

            {/* Search */}
            <div className="p-2.5 border-b border-border/70 bg-muted/20">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search subscriber, PPPoE, phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-card rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            {/* Filter Chips */}
            <div className="grid grid-cols-4 p-1.5 border-b border-border text-[11px] font-medium text-center">
              <button
                onClick={() => setActiveFilter("all")}
                className={cn(
                  "py-1 rounded-md transition-colors",
                  activeFilter === "all" ? "bg-primary text-white font-bold" : "text-muted-foreground hover:bg-muted"
                )}
              >
                All (3)
              </button>
              <button
                onClick={() => setActiveFilter("my_chats")}
                className={cn(
                  "py-1 rounded-md transition-colors",
                  activeFilter === "my_chats" ? "bg-primary text-white font-bold" : "text-muted-foreground hover:bg-muted"
                )}
              >
                Mine (1)
              </button>
              <button
                onClick={() => setActiveFilter("waiting")}
                className={cn(
                  "py-1 rounded-md transition-colors",
                  activeFilter === "waiting" ? "bg-primary text-white font-bold" : "text-muted-foreground hover:bg-muted"
                )}
              >
                Waiting (1)
              </button>
              <button
                onClick={() => setActiveFilter("closed")}
                className={cn(
                  "py-1 rounded-md transition-colors",
                  activeFilter === "closed" ? "bg-primary text-white font-bold" : "text-muted-foreground hover:bg-muted"
                )}
              >
                Closed (1)
              </button>
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1.5 custom-scrollbar">
              {mockDb.subscribers.map((sub) => {
                const isSelected = selectedCustomer.id === sub.id;
                return (
                  <button
                    key={sub.id}
                    onClick={() => {
                      setSelectedCustomer(sub);
                      setOpticalDbm(sub.opticalRxDbm);
                    }}
                    className={cn(
                      "w-full text-left p-3 rounded-xl border transition-all cursor-pointer",
                      isSelected
                        ? "bg-primary/10 border-primary/40 shadow-2xs"
                        : "bg-card border-border/70 hover:bg-muted/40"
                    )}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-heading font-bold text-xs text-foreground truncate">
                        {sub.fullName}
                      </span>
                      <Badge
                        variant={sub.opticalRxDbm < -25 ? "destructive" : "success"}
                        className="text-[9.5px] py-0 px-1 font-mono"
                      >
                        {sub.opticalRxDbm} dBm
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                      <span className="font-mono">{sub.pppoeUsername}</span>
                      <span>50M Ultra</span>
                    </div>
                    <div className="text-[10px] text-muted-foreground/80 mt-1 truncate">
                      House 24, St 12, Sector F-10/2...
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Col 2: Active Message Stream (Center) */}
          <div className="flex-1 flex flex-col bg-muted/15 min-w-0 border-r border-border">
            {/* Topbar of active chat */}
            <div className="p-3 border-b border-border bg-card flex items-center justify-between shadow-2xs shrink-0">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xs font-heading border border-primary/20">
                  {selectedCustomer.fullName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-bold text-sm text-foreground">
                      {selectedCustomer.fullName}
                    </span>
                    <Badge variant="secondary" className="text-[10px] font-mono">
                      {selectedCustomer.customerCode}
                    </Badge>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live Session
                    </span>
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    {selectedCustomer.packageName} · {selectedCustomer.address}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => alert(`Escalated to Trouble Ticket for ${selectedCustomer.fullName}`)}
                  className="text-xs"
                >
                  <Ticket className="h-3.5 w-3.5 text-warning mr-1" /> Ticket
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsCustomerHudOpen(!isCustomerHudOpen)}
                  className="text-xs"
                >
                  <Activity className="h-3.5 w-3.5 text-primary mr-1" /> Customer 360
                </Button>
              </div>
            </div>

            {/* Message Stream */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={cn(
                    "flex flex-col max-w-[85%]",
                    m.sender === "staff" ? "ml-auto items-end" : "items-start",
                    m.sender === "system" && "mx-auto items-center max-w-[95%]"
                  )}
                >
                  <span className="text-[10px] text-muted-foreground mb-0.5 px-1 font-medium">
                    {m.senderName} · {m.time}
                  </span>

                  <div
                    className={cn(
                      "p-3 rounded-2xl text-xs leading-relaxed",
                      m.isInternalNote
                        ? "bg-warning/20 border border-warning/40 text-warning-foreground dark:text-warning rounded-tr-none font-medium shadow-2xs"
                        : m.sender === "staff"
                          ? "bg-primary text-white rounded-tr-none shadow-xs"
                          : m.sender === "system"
                            ? "bg-card border border-border text-foreground font-mono text-[11px] text-center"
                            : "bg-card border border-border text-foreground rounded-tl-none shadow-2xs"
                    )}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Composer & Slash Replies */}
            <div className="p-3 border-t border-border bg-card space-y-2 shrink-0">
              {/* Quick Canned Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs custom-scrollbar">
                <span className="text-[11px] text-muted-foreground flex items-center gap-1 font-mono font-bold">
                  <Zap className="h-3 w-3 text-warning" /> /
                </span>
                {mockDb.cannedShortcuts.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleCannedInsert(c.templateText.replace("{{optical_signal}}", `${opticalDbm}`))}
                    className="px-2 py-0.5 rounded-md bg-muted/60 hover:bg-primary/10 hover:text-primary border border-border text-[10.5px] font-mono text-muted-foreground transition-colors shrink-0 cursor-pointer"
                  >
                    {c.shortcut}
                  </button>
                ))}
              </div>

              {/* Private Staff Note Mode Banner */}
              {isInternalNote && (
                <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-warning/15 border border-warning/30 text-xs text-warning-foreground dark:text-warning font-medium">
                  <div className="flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5" />
                    <span>Internal Staff Note Mode (Visible only to NOC & Helpdesk, NOT Customer)</span>
                  </div>
                  <button
                    onClick={() => setIsInternalNote(false)}
                    className="text-[11px] underline hover:no-underline font-semibold cursor-pointer"
                  >
                    Switch to Public Reply
                  </button>
                </div>
              )}

              {/* Text Input */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsInternalNote(!isInternalNote)}
                  className={cn(
                    "p-2 rounded-lg border transition-colors cursor-pointer",
                    isInternalNote
                      ? "bg-warning/20 border-warning text-warning-foreground dark:text-warning"
                      : "bg-muted/40 border-border text-muted-foreground hover:text-foreground"
                  )}
                  title={isInternalNote ? "Switch to Customer Reply" : "Write Confidential Staff Note"}
                >
                  <Lock className="h-4 w-4" />
                </button>

                <input
                  type="text"
                  placeholder={
                    isInternalNote
                      ? "Type confidential internal note (saved to subscriber audit trail)..."
                      : "Type message or click / shortcuts above..."
                  }
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  className={cn(
                    "flex-1 rounded-lg border px-3.5 py-2 text-xs text-foreground focus:outline-none transition-all",
                    isInternalNote
                      ? "bg-warning/5 border-warning/40 focus:ring-1 focus:ring-warning"
                      : "bg-card border-border focus:ring-1 focus:ring-primary"
                  )}
                />

                <Button
                  variant={isInternalNote ? "secondary" : "primary"}
                  size="sm"
                  onClick={handleSendMessage}
                >
                  <Send className="h-3.5 w-3.5 mr-1" />
                  {isInternalNote ? "Add Note" : "Send"}
                </Button>
              </div>
            </div>
          </div>

          {/* Col 3: Customer 360 & SmartOLT HUD (Right) */}
          {isCustomerHudOpen && (
            <div className="w-84 border-l border-border bg-card flex flex-col shrink-0 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <div className="flex items-center gap-1.5">
                  <Activity className="h-4 w-4 text-primary" />
                  <span className="font-heading font-bold text-xs uppercase tracking-wider text-foreground">
                    Customer 360° NOC HUD
                  </span>
                </div>
                <Badge variant={opticalDbm < -25 ? "destructive" : "success"} className="text-[10px] font-mono">
                  {opticalDbm} dBm
                </Badge>
              </div>

              {/* Optical Power Gauge Card */}
              <div className="p-3.5 rounded-xl bg-muted/30 border border-border/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-heading font-bold text-xs text-foreground flex items-center gap-1.5">
                    <Radio className="h-3.5 w-3.5 text-primary" /> SmartOLT Optical Power
                  </span>
                  <button
                    onClick={handleToggleFiberCut}
                    className="text-[10px] text-primary hover:underline font-bold cursor-pointer"
                  >
                    Simulate {opticalDbm < -25 ? "Restore" : "Cut"}
                  </button>
                </div>

                <div className="p-2.5 rounded-lg bg-card border border-border text-center space-y-1">
                  <div className="text-[10.5px] text-muted-foreground">RX Signal Level</div>
                  <div
                    className={cn(
                      "font-mono font-extrabold text-2xl",
                      opticalDbm < -25 ? "text-destructive animate-pulse" : "text-emerald-600 dark:text-emerald-400"
                    )}
                  >
                    {opticalDbm} dBm
                  </div>
                  <div className="text-[10px] font-medium text-muted-foreground">
                    {opticalDbm < -25 ? "CRITICAL: Fiber Cut Detected" : "Nominal Optical Range (-15 to -24 dBm)"}
                  </div>
                </div>

                <div className="space-y-1 text-[11px] text-muted-foreground font-mono">
                  <div className="flex justify-between">
                    <span>Chassis:</span>
                    <span className="font-bold text-foreground">Huawei MA5800-X7</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Port:</span>
                    <span className="font-bold text-foreground">Slot 0/2 · PON-04</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ONU Serial:</span>
                    <span className="font-bold text-foreground">HWTC-98B2-F104</span>
                  </div>
                </div>
              </div>

              {/* Identity & Technical Info */}
              <div className="p-3.5 rounded-xl bg-card border border-border space-y-2 text-xs">
                <div className="font-heading font-bold text-xs text-foreground mb-1">
                  Broadband & PPPoE Binding
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-muted-foreground">PPPoE User:</span>
                  <span className="font-mono font-bold text-primary">{selectedCustomer.pppoeUsername}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-muted-foreground">Monthly Fee:</span>
                  <span className="font-mono font-bold text-foreground">PKR {selectedCustomer.monthlyFeePkr.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-muted-foreground">Ledger Balance:</span>
                  <span className="font-mono font-bold text-emerald-600">PKR {selectedCustomer.ledgerBalancePkr} (Clear)</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-muted-foreground">Phone:</span>
                  <span className="font-mono">{selectedCustomer.phone}</span>
                </div>
              </div>

              {/* Remote Actions */}
              <div className="space-y-2 pt-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-xs"
                  onClick={() => alert(`TR-069 soft reboot signal sent to ONU ${selectedCustomer.onuSerial}`)}
                >
                  <RefreshCw className="h-3.5 w-3.5 text-warning mr-2" /> TR-069 Soft Reboot Router
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-xs"
                  onClick={() => alert(`Creating linked trouble ticket for ${selectedCustomer.fullName}`)}
                >
                  <Ticket className="h-3.5 w-3.5 text-primary mr-2" /> Escalate to NOC Dispatch
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 2: TROUBLE TICKETS & JOBS
      ========================================================================= */}
      {activeTab === "tickets" && (
        <div className="h-full w-full flex flex-col overflow-hidden">
          {/* Top Filter Bar (Flush with top) */}
          <div className="p-3.5 border-b border-border bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <Search className="h-4 w-4 text-muted-foreground shrink-0" />
              <input
                type="text"
                placeholder="Search ticket #, customer name, fault category..."
                className="w-full text-xs bg-muted/30 rounded-lg px-3 py-1.5 border border-border focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center rounded-lg bg-muted/60 p-0.5 border border-border text-xs">
                <button
                  onClick={() => setTicketViewMode("kanban")}
                  className={cn(
                    "px-3 py-1 rounded-md font-medium transition-colors cursor-pointer",
                    ticketViewMode === "kanban" ? "bg-card text-foreground font-bold shadow-2xs" : "text-muted-foreground"
                  )}
                >
                  Kanban Board
                </button>
                <button
                  onClick={() => setTicketViewMode("table")}
                  className={cn(
                    "px-3 py-1 rounded-md font-medium transition-colors cursor-pointer",
                    ticketViewMode === "table" ? "bg-card text-foreground font-bold shadow-2xs" : "text-muted-foreground"
                  )}
                >
                  Dense Table
                </button>
              </div>

              <Button size="sm" onClick={() => setIsCreateTicketOpen(true)}>
                <Plus className="h-3.5 w-3.5 mr-1" /> Create Trouble Ticket
              </Button>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-4">
            {/* Kanban View */}
            {ticketViewMode === "kanban" ? (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5">
              {/* Column: Open */}
              <div className="p-3.5 rounded-2xl bg-muted/20 border border-border space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-border">
                  <span className="font-heading font-bold text-xs text-foreground uppercase">1. Open ({ticketsList.filter((t) => t.status === "open").length})</span>
                  <Badge variant="destructive" className="text-[10px] font-mono">P1 / P2</Badge>
                </div>
                <div className="space-y-2.5">
                  {ticketsList
                    .filter((t) => t.status === "open")
                    .map((ticket) => (
                      <div
                        key={ticket.id}
                        onClick={() => setSelectedTicket(ticket)}
                        className="p-3 rounded-xl bg-card border border-border hover:border-primary/50 transition-all shadow-2xs cursor-pointer space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-xs text-primary">{ticket.ticketNo}</span>
                          <Badge variant="destructive" className="text-[9.5px] py-0 px-1">{ticket.priority}</Badge>
                        </div>
                        <div className="font-heading font-bold text-xs text-foreground">{ticket.customerName}</div>
                        <div className="text-[11px] text-muted-foreground leading-tight">{ticket.category}</div>
                        <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1 border-t border-border/60 font-mono">
                          <span>SLA: {ticket.slaMinutesLeft}m left</span>
                          <span>{ticket.assignedTo}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Column: In Progress */}
              <div className="p-3.5 rounded-2xl bg-muted/20 border border-border space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-border">
                  <span className="font-heading font-bold text-xs text-foreground uppercase">2. In Progress / Dispatched ({ticketsList.filter((t) => t.status === "in_progress" || t.status === "assigned").length})</span>
                  <Badge variant="warning" className="text-[10px] font-mono">Field Ops</Badge>
                </div>
                <div className="space-y-2.5">
                  {ticketsList
                    .filter((t) => t.status === "in_progress" || t.status === "assigned")
                    .map((ticket) => (
                      <div
                        key={ticket.id}
                        onClick={() => setSelectedTicket(ticket)}
                        className="p-3 rounded-xl bg-card border border-border hover:border-primary/50 transition-all shadow-2xs cursor-pointer space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-xs text-primary">{ticket.ticketNo}</span>
                          <Badge variant="warning" className="text-[9.5px] py-0 px-1">{ticket.vanNo}</Badge>
                        </div>
                        <div className="font-heading font-bold text-xs text-foreground">{ticket.customerName}</div>
                        <div className="text-[11px] text-muted-foreground leading-tight">{ticket.category}</div>
                        <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1 border-t border-border/60 font-mono">
                          <span>{ticket.opticalDbm} dBm RX</span>
                          <span className="text-warning font-bold">{ticket.assignedTo}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Column: Resolved */}
              <div className="p-3.5 rounded-2xl bg-muted/20 border border-border space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-border">
                  <span className="font-heading font-bold text-xs text-foreground uppercase">3. Resolved ({ticketsList.filter((t) => t.status === "resolved").length})</span>
                  <Badge variant="success" className="text-[10px] font-mono">Tested</Badge>
                </div>
                <div className="space-y-2.5">
                  {ticketsList
                    .filter((t) => t.status === "resolved")
                    .map((ticket) => (
                      <div
                        key={ticket.id}
                        onClick={() => setSelectedTicket(ticket)}
                        className="p-3 rounded-xl bg-card border border-border hover:border-primary/50 transition-all shadow-2xs cursor-pointer space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-xs text-emerald-600">{ticket.ticketNo}</span>
                          <Badge variant="success" className="text-[9.5px] py-0 px-1">Fixed</Badge>
                        </div>
                        <div className="font-heading font-bold text-xs text-foreground">{ticket.customerName}</div>
                        <div className="text-[11px] text-muted-foreground leading-tight">{ticket.category}</div>
                        <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono pt-1 border-t border-border/60">
                          Optical Calibrated to -17.2 dBm
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Column: Closed */}
              <div className="p-3.5 rounded-2xl bg-muted/20 border border-border space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-border">
                  <span className="font-heading font-bold text-xs text-foreground uppercase">4. Closed (142 Archive)</span>
                  <Badge variant="secondary" className="text-[10px] font-mono">Archived</Badge>
                </div>
                <div className="p-4 text-center text-xs text-muted-foreground">
                  All resolved tickets are automatically archived after 48h subscriber confirmation.
                </div>
              </div>
            </div>
          ) : (
            /* Dense Table View */
            <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/40 border-b border-border text-[11px] font-mono uppercase text-muted-foreground">
                  <tr>
                    <th className="p-3">Ticket #</th>
                    <th className="p-3">Subscriber</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Priority</th>
                    <th className="p-3">Assigned To</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {ticketsList.map((t) => (
                    <tr key={t.id} className="hover:bg-muted/20 transition-colors">
                      <td className="p-3 font-mono font-bold text-primary">{t.ticketNo}</td>
                      <td className="p-3">
                        <div className="font-bold text-foreground">{t.customerName}</div>
                        <div className="text-[10px] text-muted-foreground font-mono">{t.phone}</div>
                      </td>
                      <td className="p-3 text-muted-foreground">{t.category}</td>
                      <td className="p-3">
                        <Badge variant={t.priority === "Critical" ? "destructive" : "warning"} className="text-[10px]">
                          {t.priority}
                        </Badge>
                      </td>
                      <td className="p-3 font-mono text-muted-foreground">{t.assignedTo} ({t.vanNo})</td>
                      <td className="p-3">
                        <Badge variant={t.status === "in_progress" ? "warning" : t.status === "resolved" ? "success" : "secondary"} className="text-[10px]">
                          {t.status}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <Button size="sm" variant="outline" onClick={() => setSelectedTicket(t)}>
                          Inspect
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: NEW CONNECTIONS PIPELINE
      ========================================================================= */}
      {activeTab === "connections" && (
        <div className="h-full w-full flex flex-col overflow-hidden">
          {/* Top Header Bar (Flush with top) */}
          <div className="p-3.5 border-b border-border bg-card flex items-center justify-between shrink-0">
            <div>
              <h2 className="font-heading font-bold text-sm text-foreground">
                Lead Intake & Fiber GIS Feasibility Pipeline
              </h2>
              <p className="text-xs text-muted-foreground">
                Track new connection inquiries from GIS verification to pole splicing and activation.
              </p>
            </div>
            <Button size="sm" onClick={() => alert("Open New Lead Feasibility Form")}>
              <Plus className="h-3.5 w-3.5 mr-1" /> New Connection Lead
            </Button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5">
            {/* Stage 1: Inquiry */}
            <div className="p-3.5 rounded-2xl bg-muted/20 border border-border space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <span className="font-heading font-bold text-xs text-foreground uppercase">1. Inquiries</span>
                <Badge variant="secondary" className="text-[10px] font-mono">1 Lead</Badge>
              </div>
              {connectionsList
                .filter((l) => l.stage === "inquiry")
                .map((lead) => (
                  <div key={lead.id} className="p-3 rounded-xl bg-card border border-border shadow-2xs space-y-2">
                    <div className="font-mono font-bold text-xs text-primary">{lead.leadNo}</div>
                    <div className="font-heading font-bold text-xs text-foreground">{lead.applicantName}</div>
                    <div className="text-[11px] text-muted-foreground">{lead.selectedPackage}</div>
                    <div className="p-2 rounded-lg bg-muted/30 border border-border/60 text-[10px] font-mono text-muted-foreground">
                      Nearest FAT: {lead.fatBoxNearest} ({lead.fatDistanceMeters}m)
                    </div>
                  </div>
                ))}
            </div>

            {/* Stage 2: Feasibility Passed */}
            <div className="p-3.5 rounded-2xl bg-muted/20 border border-border space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <span className="font-heading font-bold text-xs text-foreground uppercase">2. Feasibility OK</span>
                <Badge variant="info" className="text-[10px] font-mono">1 Lead</Badge>
              </div>
              {connectionsList
                .filter((l) => l.stage === "feasibility_passed")
                .map((lead) => (
                  <div key={lead.id} className="p-3 rounded-xl bg-card border border-border shadow-2xs space-y-2">
                    <div className="font-mono font-bold text-xs text-info">{lead.leadNo}</div>
                    <div className="font-heading font-bold text-xs text-foreground">{lead.applicantName}</div>
                    <div className="text-[11px] text-muted-foreground">{lead.selectedPackage}</div>
                    <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-mono text-emerald-700 dark:text-emerald-400">
                      ✓ FAT Distance: 40m (Port 4 OK)
                    </div>
                  </div>
                ))}
            </div>

            {/* Stage 3: Deposit Paid */}
            <div className="p-3.5 rounded-2xl bg-muted/20 border border-border space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <span className="font-heading font-bold text-xs text-foreground uppercase">3. Deposit Paid</span>
                <Badge variant="success" className="text-[10px] font-mono">PKR 5,000</Badge>
              </div>
              <div className="p-4 text-center text-xs text-muted-foreground">
                0 Pending KYC Verification
              </div>
            </div>

            {/* Stage 4: Installation Scheduled */}
            <div className="p-3.5 rounded-2xl bg-muted/20 border border-border space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <span className="font-heading font-bold text-xs text-foreground uppercase">4. Scheduled</span>
                <Badge variant="warning" className="text-[10px] font-mono">Today</Badge>
              </div>
              {connectionsList
                .filter((l) => l.stage === "installation_scheduled")
                .map((lead) => (
                  <div key={lead.id} className="p-3 rounded-xl bg-card border border-border shadow-2xs space-y-2">
                    <div className="font-mono font-bold text-xs text-warning">{lead.leadNo}</div>
                    <div className="font-heading font-bold text-xs text-foreground">{lead.applicantName}</div>
                    <div className="text-[11px] text-muted-foreground">{lead.selectedPackage}</div>
                    <div className="p-2 rounded-lg bg-warning/10 border border-warning/30 text-[10px] font-mono text-warning font-bold">
                      Assigned: {lead.assignedVan}
                    </div>
                    <Button size="sm" className="w-full text-xs" onClick={() => alert(`Activated subscriber profile for ${lead.applicantName}`)}>
                      <CheckCircle2 className="h-3 w-3 mr-1" /> Activate & Create User
                    </Button>
                  </div>
                ))}
            </div>

            {/* Stage 5: Spliced & Active */}
            <div className="p-3.5 rounded-2xl bg-muted/20 border border-border space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <span className="font-heading font-bold text-xs text-foreground uppercase">5. Activated</span>
                <Badge variant="success" className="text-[10px] font-mono">1,840 Total</Badge>
              </div>
              <div className="p-4 text-center text-xs text-emerald-600 dark:text-emerald-400 font-mono font-medium">
                ✓ 14 Activations This Week in F-10 Hub
              </div>
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
