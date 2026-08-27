"use client";

import React, { useState } from "react";
import {
  Ticket,
  Search,
  Send,
  Lock,
  Zap,
  Activity,
  Radio,
  RefreshCw,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockDb, SubscriberRecord } from "@/mock/db";
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

export function LiveChatWorkspace() {
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
  );
}
