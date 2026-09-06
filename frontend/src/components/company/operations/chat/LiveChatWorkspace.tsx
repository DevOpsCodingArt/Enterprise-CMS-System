"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Ticket,
  Search,
  Send,
  Lock,
  Zap,
  Activity,
  Radio,
  RefreshCw,
  PanelRightClose,
  PanelRightOpen,
  Check,
  CheckCheck,
  Phone,
  User,
  Wifi,
  Paperclip,
  Smile,
  Shield,
  Clock,
  Sparkles,
  ChevronRight,
  AlertCircle,
  Globe,
  Smartphone,
  Play,
  Pause,
  Volume2,
  FileText,
  Image as ImageIcon,
  MoreVertical,
  Plus,
  Filter,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/toast";
import { telecomService } from "@/services/telecom.service";
import type { SubscriberRecord, CannedTemplate } from "@/types/telecom-entities.types";
import { cn } from "@/lib/utils";

interface ConversationThread {
  id: string;
  subscriber: SubscriberRecord;
  channel: "whatsapp" | "web_chat" | "mobile_app";
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  status: "open" | "unassigned" | "mine" | "resolved";
  category: "Fiber Outage" | "Billing Query" | "Speed Upgrade" | "General";
  isOnline: boolean;
}

const DEFAULT_SUBSCRIBER: SubscriberRecord = {
  id: "sub-ali-01",
  customerCode: "CUS-99482",
  fullName: "Ali Hassan",
  cnic: "61101-1234567-1",
  phone: "+92 300 1234567",
  address: "House 14-B, Street 32, Sector F-10/1, Islamabad",
  branchName: "Islamabad Core (F-10 HQ)",
  packageName: "Fiber Pro 50 Mbps",
  monthlyFeePkr: 3500,
  ledgerBalancePkr: 0,
  pppoeUsername: "ali_hassan_f10",
  opticalRxDbm: -27.4,
  opticalStatus: "warning",
  status: "active",
};

interface ChatMessage {
  id: string;
  sender: "customer" | "staff" | "system";
  senderName: string;
  content: string;
  isInternalNote: boolean;
  time: string;
  status: "sent" | "delivered" | "read";
  type?: "text" | "voice" | "system";
  audioDuration?: string;
}

export function LiveChatWorkspace() {
  const toast = useToast();
  const [activeFilter, setActiveFilter] = useState<"all" | "unread" | "mine" | "resolved">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Customer 360 / Contact Info Drawer - closed by default
  const [isCustomerHudOpen, setIsCustomerHudOpen] = useState(false);

  // Realistic WhatsApp/Telegram-style conversation threads
  const [threads, setThreads] = useState<ConversationThread[]>([
    {
      id: "thread-1",
      subscriber: DEFAULT_SUBSCRIBER,
      channel: "whatsapp",
      lastMessage: "Our technician Usman is en route with OTDR meter.",
      lastMessageTime: "10:43 AM",
      unreadCount: 0,
      status: "mine",
      category: "Fiber Outage",
      isOnline: true,
    },
    {
      id: "thread-2",
      subscriber: {
        ...DEFAULT_SUBSCRIBER,
        id: "sub-farooq-02",
        customerCode: "CUS-88412",
        fullName: "Dr. Farooq Khan",
        phone: "+92 321 9876543",
        packageName: "Ultra Giga 100 Mbps",
      },
      channel: "whatsapp",
      lastMessage: "I want to upgrade my package to 100 Mbps Gigabit plan.",
      lastMessageTime: "10:20 AM",
      unreadCount: 2,
      status: "unassigned",
      category: "Speed Upgrade",
      isOnline: true,
    },
    {
      id: "thread-3",
      subscriber: {
        ...DEFAULT_SUBSCRIBER,
        id: "sub-bilal-03",
        customerCode: "CUS-77391",
        fullName: "Bilal Qureshi",
        phone: "+92 333 4567890",
        packageName: "Fiber Starter 25 Mbps",
      },
      channel: "mobile_app",
      lastMessage: "Invoice for August has been settled via JazzCash.",
      lastMessageTime: "09:15 AM",
      unreadCount: 0,
      status: "mine",
      category: "Billing Query",
      isOnline: false,
    },
    {
      id: "thread-4",
      subscriber: {
        ...DEFAULT_SUBSCRIBER,
        id: "sub-zainab-04",
        customerCode: "CUS-66280",
        fullName: "Zainab Bibi",
        phone: "+92 345 6789012",
        packageName: "Fiber Pro 50 Mbps",
      },
      channel: "web_chat",
      lastMessage: "Router reconnected successfully. Thank you for your support!",
      lastMessageTime: "Yesterday",
      unreadCount: 0,
      status: "resolved",
      category: "General",
      isOnline: false,
    },
  ]);

  const [cannedShortcuts, setCannedShortcuts] = useState<CannedTemplate[]>([]);

  useEffect(() => {
    telecomService.subscribers
      .list()
      .then((subs) => {
        if (subs && subs.length > 0) {
          setThreads((prev) =>
            prev.map((t, idx) => ({
              ...t,
              subscriber: subs[idx % subs.length] || t.subscriber,
            }))
          );
        }
      })
      .catch((err) => console.error("Failed to load subscribers in chat:", err));

    telecomService.governance
      .getCannedShortcuts()
      .then((shortcuts) => {
        if (shortcuts && shortcuts.length > 0) {
          setCannedShortcuts(shortcuts);
        }
      })
      .catch((err) => console.error("Failed to load canned shortcuts in chat:", err));
  }, []);

  const [selectedThreadId, setSelectedThreadId] = useState<string>("thread-1");
  const selectedThread = threads.find((t) => t.id === selectedThreadId) || threads[0];
  const selectedCustomer = selectedThread?.subscriber || DEFAULT_SUBSCRIBER;

  // Active message history for current thread
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-1",
      sender: "customer",
      senderName: "Ali Hassan",
      content: "Salam, my internet stopped working about 10 minutes ago and the LOS light on the optical router is blinking red.",
      isInternalNote: false,
      time: "10:40 AM",
      status: "read",
      type: "text",
    },
    {
      id: "msg-2",
      sender: "system",
      senderName: "SmartOLT Radar",
      content: "Optical RX signal dropped below nominal threshold to -27.4 dBm on Slot 0/2, PON-04 (High Attenuation detected).",
      isInternalNote: false,
      time: "10:41 AM",
      status: "read",
      type: "system",
    },
    {
      id: "msg-3",
      sender: "customer",
      senderName: "Ali Hassan",
      content: "Voice note from customer describing router lights.",
      isInternalNote: false,
      time: "10:41 AM",
      status: "read",
      type: "voice",
      audioDuration: "0:14",
    },
    {
      id: "msg-4",
      sender: "staff",
      senderName: "Eng. Moiz Ahmad",
      content: "Checked FAT-12 port 3 on pole. Field Splicer Usman (Van #04) is en route with OTDR meter.",
      isInternalNote: true,
      time: "10:42 AM",
      status: "read",
      type: "text",
    },
    {
      id: "msg-5",
      sender: "staff",
      senderName: "Eng. Moiz Ahmad (NOC)",
      content: "Walaikum Assalam Ali! We verified the optical drop on your sector. Ticket #TK-8842 has been dispatched and Splicer Usman is 4 minutes away.",
      isInternalNote: false,
      time: "10:43 AM",
      status: "delivered",
      type: "text",
    },
  ]);

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "staff",
      senderName: isInternalNote ? "Eng. Moiz Ahmad (Private Note)" : "Eng. Moiz Ahmad (NOC)",
      content: chatInput.trim(),
      isInternalNote,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "sent",
      type: "text",
    };

    setMessages((prev) => [...prev, newMsg]);
    setChatInput("");
  };

  const handleCannedInsert = (template?: string) => {
    if (!template) return;
    setChatInput(template.replace("{{optical_signal}}", `${selectedCustomer.opticalRxDbm}`));
  };

  const filteredThreads = threads.filter((t) => {
    const matchesSearch =
      t.subscriber.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.subscriber.pppoeUsername || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (activeFilter === "unread") return t.unreadCount > 0;
    if (activeFilter === "mine") return t.status === "mine";
    if (activeFilter === "resolved") return t.status === "resolved";
    return true;
  });

  return (
    <div className="flex h-full w-full bg-background overflow-hidden select-none font-body">
      {/* ======================================================================= */}
      {/* COLUMN 1: WhatsApp / Telegram Thread List (Left Sidebar — 340px)        */}
      {/* ======================================================================= */}
      <div className="flex flex-col h-full w-84 border-r border-border bg-card shrink-0 overflow-hidden z-20 shadow-ambient">
        {/* 1. Header (WhatsApp Web style) */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-border bg-card shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-heading font-extrabold text-sm shadow-xs">
              M
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-success ring-2 ring-card" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-extrabold text-sm text-foreground leading-tight">
                Chats
              </span>
              <span className="text-[10px] text-muted-foreground font-mono">
                Eng. Moiz (NOC Lead)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Tooltip content="New Conversation" position="bottom">
              <button
                onClick={() => toast.info("New Chat", "Select customer from subscriber directory.")}
                className="p-2 rounded-xl text-muted-foreground hover:bg-card-subtle hover:text-foreground transition-colors cursor-pointer"
              >
                <Plus className="h-4 w-4" />
              </button>
            </Tooltip>
          </div>
        </div>

        {/* 2. WhatsApp Search Bar */}
        <div className="p-3 border-b border-border/70 bg-card-subtle/30 shrink-0">
          <div className="relative flex items-center">
            <Search className="absolute left-3 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Search or start new chat..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-card rounded-xl border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs transition-all"
            />
          </div>
        </div>

        {/* 3. Filter Pills */}
        <div className="flex items-center gap-1.5 px-3 py-2 border-b border-border bg-card overflow-x-auto custom-scrollbar shrink-0 text-xs font-medium">
          <button
            onClick={() => setActiveFilter("all")}
            className={cn(
              "px-3 py-1 rounded-full text-[11px] transition-all cursor-pointer whitespace-nowrap",
              activeFilter === "all"
                ? "bg-primary text-primary-foreground font-bold shadow-2xs"
                : "bg-card-subtle text-muted-foreground hover:text-foreground"
            )}
          >
            All
          </button>
          <button
            onClick={() => setActiveFilter("unread")}
            className={cn(
              "px-3 py-1 rounded-full text-[11px] transition-all cursor-pointer whitespace-nowrap",
              activeFilter === "unread"
                ? "bg-primary text-primary-foreground font-bold shadow-2xs"
                : "bg-card-subtle text-muted-foreground hover:text-foreground"
            )}
          >
            Unread
          </button>
          <button
            onClick={() => setActiveFilter("mine")}
            className={cn(
              "px-3 py-1 rounded-full text-[11px] transition-all cursor-pointer whitespace-nowrap",
              activeFilter === "mine"
                ? "bg-primary text-primary-foreground font-bold shadow-2xs"
                : "bg-card-subtle text-muted-foreground hover:text-foreground"
            )}
          >
            My Chats
          </button>
          <button
            onClick={() => setActiveFilter("resolved")}
            className={cn(
              "px-3 py-1 rounded-full text-[11px] transition-all cursor-pointer whitespace-nowrap",
              activeFilter === "resolved"
                ? "bg-primary text-primary-foreground font-bold shadow-2xs"
                : "bg-card-subtle text-muted-foreground hover:text-foreground"
            )}
          >
            Resolved
          </button>
        </div>

        {/* 4. WhatsApp / Telegram Thread List */}
        <div className="flex-1 overflow-y-auto divide-y divide-border/40 custom-scrollbar">
          {filteredThreads.map((thread) => {
            const isSelected = selectedThreadId === thread.id;

            return (
              <button
                key={thread.id}
                onClick={() => setSelectedThreadId(thread.id)}
                className={cn(
                  "w-full text-left p-3.5 transition-all cursor-pointer flex items-center gap-3 relative",
                  isSelected
                    ? "bg-primary/10 border-l-4 border-primary"
                    : "hover:bg-card-hover"
                )}
              >
                {/* Avatar */}
                <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/15 text-primary font-heading font-extrabold text-sm shrink-0 border border-primary/25 shadow-2xs">
                  {thread.subscriber.fullName.charAt(0)}
                  {thread.isOnline && (
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-success ring-2 ring-card" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-heading font-bold text-xs text-foreground truncate">
                      {thread.subscriber.fullName}
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground shrink-0 ml-1">
                      {thread.lastMessageTime}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1 min-w-0 flex-1 mr-2">
                      {thread.id === "thread-1" && (
                        <CheckCheck className="h-3.5 w-3.5 text-info shrink-0" />
                      )}
                      <span className="truncate text-[11px]">{thread.lastMessage}</span>
                    </div>

                    {thread.unreadCount > 0 && (
                      <span className="flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-primary text-primary-foreground font-mono text-[9.5px] font-bold shrink-0 shadow-2xs">
                        {thread.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ======================================================================= */}
      {/* COLUMN 2: WhatsApp / Telegram Chat Area (Center)                         */}
      {/* ======================================================================= */}
      <div className="flex-1 flex flex-col h-full bg-card-subtle/20 min-w-0 overflow-hidden relative">
        {/* 1. WhatsApp Header Bar */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-border bg-card shadow-2xs shrink-0 z-10">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/15 text-primary font-heading font-extrabold text-sm shrink-0 border border-primary/25 shadow-2xs">
              {selectedCustomer.fullName.charAt(0)}
              {selectedThread.isOnline && (
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-success ring-2 ring-card" />
              )}
            </div>

            <div className="flex flex-col min-w-0">
              <span className="font-heading font-extrabold text-sm text-foreground truncate">
                {selectedCustomer.fullName}
              </span>
              <span className="text-[11px] text-success font-medium flex items-center gap-1">
                {selectedThread.isOnline ? "online" : "last seen today at 09:15 AM"}
              </span>
            </div>
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-2 shrink-0">
            <Tooltip content={`Call ${selectedCustomer.phone}`} position="bottom">
              <Button
                variant="outline"
                size="sm"
                onClick={() => toast.info("Calling Customer", `Connecting VoIP bridge to ${selectedCustomer.phone}`)}
                className="h-9 px-3 rounded-xl text-xs font-medium cursor-pointer shadow-2xs"
              >
                <Phone className="h-3.5 w-3.5 text-primary mr-1.5" />
                <span className="hidden sm:inline font-mono">{selectedCustomer.phone}</span>
              </Button>
            </Tooltip>

            <Tooltip content="Escalate to NOC Trouble Ticket" position="bottom">
              <Button
                variant="outline"
                size="sm"
                onClick={() => toast.info("Ticket Escalated", `Trouble ticket opened for ${selectedCustomer.fullName}`)}
                className="h-9 px-3 rounded-xl text-xs font-medium cursor-pointer shadow-2xs"
              >
                <Ticket className="h-3.5 w-3.5 text-warning mr-1.5" />
                <span className="hidden sm:inline">Ticket</span>
              </Button>
            </Tooltip>

            {/* Telegram-style Contact Info / NOC Toggle */}
            <Tooltip
              content={isCustomerHudOpen ? "Close Customer Profile" : "Open Customer Profile & Telemetry"}
              position="bottom"
            >
              <button
                onClick={() => setIsCustomerHudOpen(!isCustomerHudOpen)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-2xs",
                  isCustomerHudOpen
                    ? "bg-primary text-primary-foreground border-primary shadow-glow-primary"
                    : "bg-card text-foreground border-border hover:bg-card-hover hover:border-primary/40"
                )}
                aria-label="Toggle Customer Profile"
              >
                <Activity className="h-3.5 w-3.5 shrink-0" />
                <span>Profile & NOC</span>
                {isCustomerHudOpen ? (
                  <PanelRightClose className="h-3.5 w-3.5 ml-0.5" />
                ) : (
                  <PanelRightOpen className="h-3.5 w-3.5 ml-0.5 text-primary" />
                )}
              </button>
            </Tooltip>
          </div>
        </div>

        {/* 2. WhatsApp / Telegram Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3 custom-scrollbar">
          {/* Centered Date Badge */}
          <div className="flex items-center justify-center my-3">
            <span className="px-3.5 py-1 rounded-lg bg-card/90 backdrop-blur-md border border-border text-[11px] font-mono font-bold text-muted-foreground shadow-2xs uppercase tracking-wider">
              TODAY
            </span>
          </div>

          {messages.map((m) => {
            const isStaff = m.sender === "staff";
            const isSystem = m.sender === "system";

            if (isSystem) {
              return (
                <div key={m.id} className="flex justify-center my-2">
                  <div className="max-w-md w-full p-2.5 rounded-xl border border-border bg-card/90 shadow-2xs text-center space-y-0.5">
                    <div className="flex items-center justify-center gap-1.5 text-[10.5px] font-mono font-bold text-foreground">
                      <Radio className="h-3.5 w-3.5 text-primary" />
                      <span>{m.senderName}</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground font-body leading-relaxed">
                      {m.content}
                    </p>
                    <span className="text-[9.5px] font-mono text-muted-foreground block">{m.time}</span>
                  </div>
                </div>
              );
            }

            // Voice Note Message Bubble (Telegram / WhatsApp style)
            if (m.type === "voice") {
              return (
                <div
                  key={m.id}
                  className={cn(
                    "flex flex-col max-w-[70%]",
                    isStaff ? "ml-auto items-end" : "items-start"
                  )}
                >
                  <div
                    className={cn(
                      "p-3 rounded-2xl flex items-center gap-3 shadow-2xs select-none",
                      isStaff
                        ? "bg-primary text-primary-foreground rounded-tr-xs"
                        : "bg-card border border-border/80 text-foreground rounded-tl-xs"
                    )}
                  >
                    <button
                      onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                      className={cn(
                        "flex h-9 w-9 items-center justify-center rounded-full transition-transform active:scale-95 cursor-pointer shadow-xs",
                        isStaff ? "bg-primary-foreground text-primary" : "bg-primary text-primary-foreground"
                      )}
                    >
                      {isPlayingAudio ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
                    </button>

                    <div className="flex flex-col min-w-[140px] space-y-1">
                      {/* Waveform graphic */}
                      <div className="flex items-center gap-0.5 h-4">
                        {[40, 70, 30, 90, 60, 100, 45, 80, 60, 35, 90, 50, 75, 40, 65, 85].map((h, i) => (
                          <span
                            key={i}
                            style={{ height: `${h}%` }}
                            className={cn(
                              "w-1 rounded-full",
                              isStaff ? "bg-primary-foreground/70" : "bg-primary/70"
                            )}
                          />
                        ))}
                      </div>
                      <div className="flex items-center justify-between text-[10px] font-mono opacity-80">
                        <span>{m.audioDuration || "0:14"}</span>
                        <span>{m.time}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            // Standard Text / Internal Note Message Bubble
            return (
              <div
                key={m.id}
                className={cn(
                  "flex flex-col max-w-[70%]",
                  isStaff ? "ml-auto items-end" : "items-start"
                )}
              >
                <div
                  className={cn(
                    "p-3.5 rounded-2xl text-xs leading-relaxed select-text relative shadow-2xs",
                    m.isInternalNote
                      ? "bg-warning/15 border border-warning/30 text-foreground rounded-tr-xs shadow-xs"
                      : isStaff
                        ? "bg-primary text-primary-foreground rounded-tr-xs shadow-glow-primary"
                        : "bg-card border border-border/80 text-foreground rounded-tl-xs"
                  )}
                >
                  {/* Internal Note Banner Header */}
                  {m.isInternalNote && (
                    <div className="flex items-center gap-1.5 text-[10.5px] font-mono font-bold text-warning mb-1.5 pb-1 border-b border-warning/20">
                      <Lock className="h-3 w-3" />
                      <span>STAFF PRIVATE NOTE</span>
                    </div>
                  )}

                  <p className="pr-12">{m.content}</p>

                  {/* WhatsApp-style Timestamp & Delivery Ticks in bottom-right */}
                  <div
                    className={cn(
                      "flex items-center justify-end gap-1 text-[9.5px] font-mono mt-1",
                      isStaff ? "text-primary-foreground/80" : "text-muted-foreground"
                    )}
                  >
                    <span>{m.time}</span>
                    {isStaff && !m.isInternalNote && (
                      <span className="text-info font-bold">
                        {m.status === "sent" ? (
                          <Check className="inline h-3 w-3" />
                        ) : (
                          <CheckCheck className="inline h-3.5 w-3.5 text-cyan-300" />
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* 3. WhatsApp / Telegram Input Composer */}
        <div className="p-3 border-t border-border bg-card space-y-2 shrink-0 shadow-elevated z-10">
          {/* Internal Staff Note Banner (When active) */}
          {isInternalNote && (
            <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-warning/15 border border-warning/30 text-xs text-foreground font-medium animate-in fade-in-0 duration-150">
              <div className="flex items-center gap-2">
                <Lock className="h-3.5 w-3.5 text-warning shrink-0" />
                <span>Internal Note Mode (Saved to subscriber log, NOT sent to customer)</span>
              </div>
              <button
                onClick={() => setIsInternalNote(false)}
                className="text-[11px] text-warning underline hover:no-underline font-bold cursor-pointer"
              >
                Switch to Customer Reply
              </button>
            </div>
          )}

          {/* Quick Canned Shortcuts Pill Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs custom-scrollbar">
            <span className="text-[11px] text-muted-foreground flex items-center gap-1 font-mono font-bold shrink-0">
              <Zap className="h-3 w-3 text-warning" /> /
            </span>
            {cannedShortcuts.map((c) => (
              <button
                key={c.id}
                onClick={() => handleCannedInsert(c.templateText || c.body)}
                className="px-2.5 py-1 rounded-lg bg-card-subtle hover:bg-primary/10 hover:text-primary border border-border text-[10.5px] font-mono text-muted-foreground transition-all shrink-0 cursor-pointer shadow-2xs"
              >
                {c.shortcut}
              </button>
            ))}
          </div>

          {/* WhatsApp Composer Bar */}
          <div className="flex items-center gap-2">
            {/* Emoji & Attachments */}
            <div className="flex items-center gap-1 text-muted-foreground shrink-0">
              <Tooltip content="Insert Emoji" position="top">
                <button
                  type="button"
                  onClick={() => setChatInput((prev) => prev + " 👍")}
                  className="p-2 rounded-xl hover:bg-card-subtle hover:text-foreground transition-colors cursor-pointer"
                >
                  <Smile className="h-5 w-5" />
                </button>
              </Tooltip>

              <Tooltip content="Attach File / Image" position="top">
                <button
                  type="button"
                  onClick={() => toast.info("Attachment", "Select file or screenshot to upload.")}
                  className="p-2 rounded-xl hover:bg-card-subtle hover:text-foreground transition-colors cursor-pointer"
                >
                  <Paperclip className="h-5 w-5" />
                </button>
              </Tooltip>
            </div>

            {/* Lock Mode Switcher Button */}
            <Tooltip content={isInternalNote ? "Switch to Customer Reply" : "Write Confidential Staff Note"} position="top">
              <button
                type="button"
                onClick={() => setIsInternalNote(!isInternalNote)}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-xl border transition-all cursor-pointer shadow-2xs shrink-0",
                  isInternalNote
                    ? "bg-warning/20 border-warning text-warning"
                    : "bg-card-subtle border-border text-muted-foreground hover:text-foreground"
                )}
                aria-label="Toggle Staff Note"
              >
                <Lock className="h-4 w-4" />
              </button>
            </Tooltip>

            {/* Input Field */}
            <input
              type="text"
              placeholder={
                isInternalNote
                  ? "Type confidential internal note..."
                  : "Type a message or press '/' for quick replies..."
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
                "flex-1 rounded-xl border px-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none transition-all shadow-2xs",
                isInternalNote
                  ? "bg-warning/5 border-warning/40 focus:ring-1 focus:ring-warning"
                  : "bg-card border-border focus:ring-1 focus:ring-primary"
              )}
            />

            {/* Send Button */}
            <Button
              variant={isInternalNote ? "secondary" : "primary"}
              size="sm"
              onClick={handleSendMessage}
              className="h-10 px-4 rounded-xl cursor-pointer shadow-2xs"
            >
              <Send className="h-4 w-4 mr-1" />
              <span>{isInternalNote ? "Note" : "Send"}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* ======================================================================= */}
      {/* COLUMN 3: Telegram-Style Contact & NOC Profile Drawer (Right, 340px)    */}
      {/* ======================================================================= */}
      <AnimatePresence initial={false}>
        {isCustomerHudOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 340, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 35 }}
            className="flex flex-col h-full border-l border-border bg-card shrink-0 overflow-y-auto custom-scrollbar z-20 shadow-ambient"
          >
            {/* 1. Header */}
            <div className="flex h-16 items-center justify-between px-4 border-b border-border bg-card shrink-0">
              <span className="font-heading font-extrabold text-sm text-foreground">
                Contact Info
              </span>

              <Badge
                variant={selectedCustomer.opticalRxDbm < -25 ? "destructive" : "success"}
                className="text-[10px] font-mono font-bold"
              >
                {selectedCustomer.opticalRxDbm} dBm
              </Badge>
            </div>

            {/* 2. Contact Banner & Details */}
            <div className="p-4 space-y-4">
              {/* Profile Card */}
              <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-card-subtle/50 border border-border shadow-2xs space-y-2">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-heading font-extrabold text-2xl shadow-sm">
                  {selectedCustomer.fullName.charAt(0)}
                </div>
                <div className="space-y-0.5">
                  <h3 className="font-heading font-extrabold text-sm text-foreground">
                    {selectedCustomer.fullName}
                  </h3>
                  <span className="font-mono text-xs text-muted-foreground block">
                    {selectedCustomer.phone}
                  </span>
                  <span className="text-[11px] text-muted-foreground block">
                    {selectedCustomer.address}
                  </span>
                </div>
              </div>

              {/* Live Optical Signal Meter */}
              <div className="p-3.5 rounded-2xl bg-card border border-border shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-heading font-bold text-xs text-foreground flex items-center gap-1.5">
                    <Radio className="h-3.5 w-3.5 text-primary" /> Fiber RX Telemetry
                  </span>
                  <Badge variant="success" className="text-[9px] py-0 px-1 font-mono">
                    ONLINE
                  </Badge>
                </div>

                <div className="p-3 rounded-xl bg-card-subtle/50 border border-border text-center space-y-1">
                  <div className="text-[10.5px] text-muted-foreground font-medium">Optical Signal Strength</div>
                  <div
                    className={cn(
                      "font-mono font-extrabold text-2xl tracking-tight",
                      selectedCustomer.opticalRxDbm < -25 ? "text-destructive" : "text-success"
                    )}
                  >
                    {selectedCustomer.opticalRxDbm} dBm
                  </div>
                  <div className="text-[10px] font-medium text-muted-foreground">
                    Nominal Target: -15.0 to -24.0 dBm
                  </div>
                </div>

                <div className="space-y-1.5 text-[11px] text-muted-foreground font-mono">
                  <div className="flex justify-between">
                    <span>OLT Chassis:</span>
                    <span className="font-bold text-foreground">Huawei MA5800-X7</span>
                  </div>
                  <div className="flex justify-between">
                    <span>PON Port:</span>
                    <span className="font-bold text-foreground">Slot 0/2 · PON-04</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ONU Serial:</span>
                    <span className="font-bold text-foreground">{selectedCustomer.onuSerial}</span>
                  </div>
                </div>
              </div>

              {/* Account & Billing */}
              <div className="p-3.5 rounded-2xl bg-card border border-border shadow-2xs space-y-2 text-xs">
                <div className="font-heading font-bold text-xs text-foreground mb-1 flex items-center justify-between">
                  <span>Subscription Plan</span>
                  <Badge variant="secondary" className="text-[9px] py-0 px-1 font-mono">
                    {selectedCustomer.customerCode}
                  </Badge>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-muted-foreground">PPPoE ID:</span>
                  <span className="font-mono font-bold text-primary">{selectedCustomer.pppoeUsername}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-muted-foreground">Tariff Plan:</span>
                  <span className="font-bold text-foreground">{selectedCustomer.packageName}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-muted-foreground">Monthly Fee:</span>
                  <span className="font-mono font-bold text-foreground">PKR {(selectedCustomer.monthlyFeePkr || Number(selectedCustomer.monthlyBilling) || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-muted-foreground">Ledger Balance:</span>
                  <span className="font-mono font-bold text-success">PKR {selectedCustomer.ledgerBalancePkr} (Paid)</span>
                </div>
              </div>

              {/* Quick Remote NOC Actions */}
              <div className="space-y-2 pt-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-xs rounded-xl cursor-pointer"
                  onClick={() =>
                    toast.success("TR-069 Reboot Dispatched", `Soft reboot signal sent to ONU ${selectedCustomer.onuSerial}`)
                  }
                >
                  <RefreshCw className="h-3.5 w-3.5 text-warning mr-2 shrink-0" /> TR-069 Router Soft Reboot
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-xs rounded-xl cursor-pointer"
                  onClick={() =>
                    toast.info("Escalated to Dispatch", `Dispatched field splicer ticket for ${selectedCustomer.fullName}`)
                  }
                >
                  <Ticket className="h-3.5 w-3.5 text-primary mr-2 shrink-0" /> Escalate to Field Splicer
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
