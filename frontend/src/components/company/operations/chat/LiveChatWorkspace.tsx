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
import { socketService, type NocTelemetryAlert } from "@/services/socket.service";
import type { SubscriberRecord, CannedTemplate } from "@/types/telecom-entities.types";
import { useAuthStore } from "@/stores/useAuthStore";
import { NewConversationModal } from "./NewConversationModal";
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
  const currentUser = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const [activeFilter, setActiveFilter] = useState<"all" | "unread" | "mine" | "resolved">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [customerTyping, setCustomerTyping] = useState<string | null>(null);
  const [activeTelemetryAlert, setActiveTelemetryAlert] = useState<NocTelemetryAlert | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);

  // Customer 360 / Contact Info Drawer - closed by default
  const [isCustomerHudOpen, setIsCustomerHudOpen] = useState(false);

  // Active conversation threads from PostgreSQL
  const [threads, setThreads] = useState<ConversationThread[]>([]);
  const [cannedShortcuts, setCannedShortcuts] = useState<CannedTemplate[]>([]);
  const [selectedThreadId, setSelectedThreadId] = useState<string>("");
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);

  const selectedThread = threads.find((t) => t.id === selectedThreadId) || (threads.length > 0 ? threads[0] : null);
  const selectedCustomer = selectedThread?.subscriber;

  // Active message history for current thread
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const handleConversationCreated = (conv: any) => {
    const rxSignal = conv.customerSignal != null ? Number(conv.customerSignal) : null;
    const newThread: ConversationThread = {
      id: conv.id,
      subscriber: {
        id: conv.customerId,
        customerCode: conv.customerCode || "—",
        fullName: conv.customerName || "Customer",
        cnic: conv.customerCnic || "—",
        phone: conv.customerPhone || "—",
        address:
          conv.customerAddress ||
          (conv.customerArea
            ? `${conv.customerArea}, ${conv.customerCity || "Islamabad"}`
            : conv.customerCity || "—"),
        branchName: conv.branchName || "Main Office",
        packageName: conv.customerPackage || "Fiber Broadband",
        monthlyFeePkr: Number(conv.customerMonthlyBilling) || 0,
        ledgerBalancePkr: 0,
        pppoeUsername: conv.customerUsername || "—",
        opticalRxDbm: rxSignal ?? -19.5,
        opticalStatus:
          rxSignal != null
            ? rxSignal < -25
              ? "critical"
              : rxSignal < -22
              ? "warning"
              : "optimal"
            : "optimal",
        status: "active",
        oltPonPort: conv.customerPonPort || "—",
        macAddress: conv.customerMac || "—",
        onuSerial: conv.customerMac || "—",
        currentIp: conv.customerIp || "—",
      },
      channel: conv.channel || "web_chat",
      lastMessage: conv.subject || "Customer inquiry",
      lastMessageTime: "Just now",
      unreadCount: 0,
      status: "mine",
      category:
        conv.subject?.toLowerCase().includes("optical") || conv.subject?.toLowerCase().includes("speed")
          ? "Fiber Outage"
          : conv.subject?.toLowerCase().includes("billing")
          ? "Billing Query"
          : "General",
      isOnline: true,
    };

    setThreads((prev) => {
      const exists = prev.some((t) => t.id === conv.id);
      if (exists) {
        return prev.map((t) => (t.id === conv.id ? newThread : t));
      }
      return [newThread, ...prev];
    });

    setSelectedThreadId(conv.id);
    toast.success("Chat Started", `Active conversation opened with ${conv.customerName || "subscriber"}.`);
    setTimeout(() => {
      chatInputRef.current?.focus();
    }, 150);
  };

  // 1. Initial Data Fetch (Conversations & Canned Shortcuts)
  useEffect(() => {
    setIsLoading(true);
    telecomService.chat
      .getConversations()
      .then((dbConvs) => {
        if (dbConvs && dbConvs.length > 0) {
          const liveThreads: ConversationThread[] = dbConvs.map((c: any, idx: number) => {
            const rxSignal = c.customerSignal != null ? Number(c.customerSignal) : null;
            return {
              id: c.id,
              subscriber: {
                id: c.customerId || `sub-${idx}`,
                customerCode: c.customerCode || "—",
                fullName: c.customerName || "Subscriber",
                cnic: c.customerCnic || "—",
                phone: c.customerPhone || "—",
                address: c.customerAddress || (c.customerArea ? `${c.customerArea}, ${c.customerCity || "Islamabad"}` : (c.customerCity || "—")),
                branchName: c.branchName || "Main Office",
                packageName: c.customerPackage || "Fiber Broadband",
                monthlyFeePkr: Number(c.customerMonthlyBilling) || 0,
                ledgerBalancePkr: 0,
                pppoeUsername: c.customerUsername || "—",
                opticalRxDbm: rxSignal ?? -19.5,
                opticalStatus:
                  rxSignal != null
                    ? rxSignal < -25
                      ? "critical"
                      : rxSignal < -22
                      ? "warning"
                      : "optimal"
                    : "optimal",
                status: "active",
                oltPonPort: c.customerPonPort || "—",
                macAddress: c.customerMac || "—",
                onuSerial: c.customerMac || "—",
                currentIp: c.customerIp || "—",
              },
              channel: c.channel || (c.metadata?.channel) || "web_chat",
              lastMessage: c.subject || "Customer inquiry",
              lastMessageTime: new Date(c.lastMessageAt || c.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
              unreadCount: c.unreadCountStaff || 0,
              status: "mine",
              category: c.subject?.toLowerCase().includes("attenuation") || c.subject?.toLowerCase().includes("speed") || c.subject?.toLowerCase().includes("loss")
                ? "Fiber Outage"
                : c.subject?.toLowerCase().includes("billing") || c.subject?.toLowerCase().includes("invoice")
                ? "Billing Query"
                : c.subject?.toLowerCase().includes("upgrade")
                ? "Speed Upgrade"
                : "General",
              isOnline: true,
            };
          });
          setThreads(liveThreads);
          setSelectedThreadId((prev) => prev || liveThreads[0].id);
        } else {
          setThreads([]);
        }
      })
      .catch((err) => console.error("Failed to load conversations in chat:", err))
      .finally(() => setIsLoading(false));

    telecomService.governance
      .getCannedShortcuts()
      .then((shortcuts) => {
        if (shortcuts && shortcuts.length > 0) {
          setCannedShortcuts(shortcuts);
        }
      })
      .catch((err) => console.error("Failed to load canned shortcuts in chat:", err));
  }, []);

  // 2. Real-Time WebSocket Connection & Message Stream
  useEffect(() => {
    if (accessToken) {
      socketService.connect(accessToken);
    }
  }, [accessToken]);

  useEffect(() => {
    if (!selectedThreadId) return;

    if (accessToken) {
      socketService.connect(accessToken);
    }
    socketService.joinConversation(selectedThreadId);

    // Fetch message history for selected conversation
    telecomService.chat
      .getMessages(selectedThreadId)
      .then((dbMsgs) => {
        if (dbMsgs && dbMsgs.length > 0) {
          const formatted: ChatMessage[] = dbMsgs.map((m: any) => ({
            id: m.id,
            sender: m.senderType === "customer" ? "customer" : m.senderType === "system" ? "system" : "staff",
            senderName: m.senderName || (m.senderType === "customer" ? (selectedCustomer?.fullName || "Customer") : (currentUser?.name || "Support Staff")),
            content: m.content || "",
            isInternalNote: Boolean(m.isInternalNote),
            time: new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            status: m.status || "delivered",
            type: m.messageType || "text",
          }));
          setMessages(formatted);
        } else {
          setMessages([]);
        }
      })
      .catch((err) => console.error("Failed to load messages:", err));

    // Listen to incoming messages
    const unsubMsg = socketService.onNewMessage((msg) => {
      if (msg.conversationId === selectedThreadId) {
        setMessages((prev) => {
          if (prev.some((existing) => existing.id === msg.id)) return prev;
          return [
            ...prev,
            {
              id: msg.id,
              sender: msg.senderType === "customer" ? "customer" : msg.senderType === "system" ? "system" : "staff",
              senderName: msg.senderName || (msg.senderType === "customer" ? "Customer" : "Support Agent"),
              content: msg.content,
              isInternalNote: Boolean(msg.isInternalNote),
              time: new Date(msg.createdAt || Date.now()).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
              status: msg.status || "delivered",
              type: msg.messageType || "text",
            },
          ];
        });
      }

      // Update thread lastMessage snippet in sidebar
      setThreads((prev) =>
        prev.map((t) =>
          t.id === msg.conversationId
            ? { ...t, lastMessage: msg.content, lastMessageTime: "Just now" }
            : t
        )
      );
    });

    // Listen for customer typing indicator
    const unsubTyping = socketService.onTyping((data) => {
      if (data.conversationId === selectedThreadId) {
        setCustomerTyping(data.isTyping ? data.userName || "Customer" : null);
      }
    });

    // Listen for NOC telemetry alerts
    const unsubAlert = socketService.onTelemetryAlert((alert) => {
      setActiveTelemetryAlert(alert);
      toast.warning("NOC Fiber Telemetry Alert", alert.message);
    });

    return () => {
      socketService.leaveConversation(selectedThreadId);
      unsubMsg();
      unsubTyping();
      unsubAlert();
    };
  }, [selectedThreadId]);

  const handleSendMessage = async () => {
    if (!chatInput.trim() || !selectedThreadId) return;
    const content = chatInput.trim();
    setChatInput("");
    socketService.sendTyping(selectedThreadId, false);

    const staffDisplayName = currentUser?.name || "Support Operations";
    const optimisticMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "staff",
      senderName: isInternalNote ? `${staffDisplayName} (Private Note)` : staffDisplayName,
      content,
      isInternalNote,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "sent",
      type: "text",
    };

    setMessages((prev) => [...prev, optimisticMsg]);

    const payload = {
      conversationId: selectedThreadId,
      content,
      isInternalNote,
      messageType: "text" as const,
      senderType: "staff" as const,
      senderName: staffDisplayName,
    };

    try {
      if (socketService.isConnected()) {
        await socketService.sendMessage(payload);
      } else {
        await telecomService.chat.sendMessage(payload);
      }
    } catch (err) {
      console.warn("Socket send failed, falling back to REST API:", err);
      try {
        await telecomService.chat.sendMessage(payload);
      } catch (restErr) {
        console.error("Failed to send message via both socket and REST:", restErr);
        toast.error("Delivery Failed", "Could not send message. Please check your connection.");
      }
    }
  };

  const handleCannedInsert = (template?: string) => {
    if (!template || !selectedCustomer) return;
    setChatInput(template.replace("{{optical_signal}}", selectedCustomer.opticalRxDbm != null ? `${selectedCustomer.opticalRxDbm}` : "N/A"));
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
              {(currentUser?.name || "S").charAt(0).toUpperCase()}
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-success ring-2 ring-card" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-extrabold text-sm text-foreground leading-tight">
                Chats Desk
              </span>
              <span className="text-[10px] text-muted-foreground font-mono">
                {currentUser?.name || "Support Lead"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Tooltip content="New Conversation" position="bottom">
              <button
                onClick={() => setIsNewChatModalOpen(true)}
                className="p-2 rounded-xl text-muted-foreground hover:bg-card-subtle hover:text-foreground transition-colors cursor-pointer"
                aria-label="Start new customer chat"
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
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-48 p-6 text-center text-xs text-muted-foreground space-y-2">
              <RefreshCw className="h-4 w-4 animate-spin text-primary" />
              <span>Loading conversations...</span>
            </div>
          ) : filteredThreads.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 p-6 text-center text-xs text-muted-foreground space-y-1">
              <p className="font-bold text-foreground">No conversations found</p>
              <p className="text-[11px]">Customer inquiries will appear here.</p>
            </div>
          ) : (
            filteredThreads.map((thread) => {
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
            })
          )}
        </div>
      </div>

      {/* ======================================================================= */}
      {/* COLUMN 2: WhatsApp / Telegram Chat Area (Center)                         */}
      {/* ======================================================================= */}
      <div className="flex-1 flex flex-col h-full bg-card-subtle/20 min-w-0 overflow-hidden relative">
        {!selectedThread || !selectedCustomer ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-card-subtle/10 space-y-3">
            <div className="h-14 w-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-glow-primary/20">
              <MessageSquare className="h-7 w-7" />
            </div>
            <div className="space-y-1 max-w-sm">
              <h3 className="font-heading font-extrabold text-sm text-foreground">
                {isLoading ? "Loading Conversations..." : "No Active Conversation"}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {isLoading
                  ? "Connecting to telecom gateway and fetching conversation threads..."
                  : "Select a subscriber conversation from the sidebar to view live chats and optical telemetry."}
              </p>
            </div>
          </div>
        ) : (
          <>
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
                    {selectedThread.isOnline ? "online" : "last seen recently"}
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

        {/* Real-time NOC Telemetry Alert Banner */}
        <AnimatePresence>
          {activeTelemetryAlert && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-destructive/15 border-b border-destructive/30 px-4 py-2.5 flex items-center justify-between text-xs text-destructive-foreground z-10 shrink-0"
            >
              <div className="flex items-center gap-2.5">
                <span className="flex h-2 w-2 rounded-full bg-destructive animate-ping" />
                <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
                <div>
                  <span className="font-bold text-destructive">NOC Optical Alert: </span>
                  <span className="text-foreground">{activeTelemetryAlert.message}</span>
                  <span className="ml-2 font-mono text-[10px] text-muted-foreground">
                    ({activeTelemetryAlert.oltHostname} · {activeTelemetryAlert.ponPort} · {activeTelemetryAlert.dropDbm} dBm)
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="destructive"
                  className="h-7 text-[10px] font-mono px-2.5 rounded-lg"
                  onClick={() => {
                    handleCannedInsert("Dear subscriber, our NOC system detected an optical power attenuation ({{optical_signal}} dBm). A technician has been notified.");
                  }}
                >
                  Send Customer Notice
                </Button>
                <button
                  onClick={() => setActiveTelemetryAlert(null)}
                  className="text-muted-foreground hover:text-foreground text-xs p-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
          {/* Customer Typing Indicator */}
          {customerTyping && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground italic px-2 py-1 animate-pulse">
              <span className="flex gap-1 items-center">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" />
              </span>
              <span>{customerTyping} is typing...</span>
            </div>
          )}
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
              ref={chatInputRef}
              type="text"
              placeholder={
                isInternalNote
                  ? "Type confidential internal note..."
                  : "Type a message or press '/' for quick replies..."
              }
              value={chatInput}
              onChange={(e) => {
                setChatInput(e.target.value);
                socketService.sendTyping(selectedThreadId, e.target.value.length > 0);
              }}
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
        </>
      )}
    </div>

      {/* ======================================================================= */}
      {/* COLUMN 3: Telegram-Style Contact & NOC Profile Drawer (Right, 340px)    */}
      {/* ======================================================================= */}
      <AnimatePresence initial={false}>
        {isCustomerHudOpen && selectedCustomer && (
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
                variant={selectedCustomer.opticalRxDbm != null && selectedCustomer.opticalRxDbm < -25 ? "destructive" : "success"}
                className="text-[10px] font-mono font-bold"
              >
                {selectedCustomer.opticalRxDbm != null ? `${selectedCustomer.opticalRxDbm} dBm` : "N/A"}
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
                      selectedCustomer.opticalRxDbm != null && selectedCustomer.opticalRxDbm < -25 ? "text-destructive" : "text-success"
                    )}
                  >
                    {selectedCustomer.opticalRxDbm != null ? `${selectedCustomer.opticalRxDbm} dBm` : "N/A"}
                  </div>
                  <div className="text-[10px] font-medium text-muted-foreground">
                    Nominal Target: -15.0 to -24.0 dBm
                  </div>
                </div>

                <div className="space-y-1.5 text-[11px] text-muted-foreground font-mono">
                  <div className="flex justify-between">
                    <span>OLT Chassis:</span>
                    <span className="font-bold text-foreground">
                      {selectedCustomer.branchName ? `${selectedCustomer.branchName} OLT` : "Core OLT"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>PON Port:</span>
                    <span className="font-bold text-foreground">{selectedCustomer.oltPonPort || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ONU MAC:</span>
                    <span className="font-bold text-foreground">{selectedCustomer.macAddress || selectedCustomer.onuSerial || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Current IP:</span>
                    <span className="font-bold text-foreground">{selectedCustomer.currentIp || "—"}</span>
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
                  <span className="font-mono font-bold text-foreground">
                    PKR {(selectedCustomer.monthlyFeePkr || 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-muted-foreground">Ledger Balance:</span>
                  <span className="font-mono font-bold text-success">
                    PKR {(selectedCustomer.ledgerBalancePkr || 0).toLocaleString()} (Current)
                  </span>
                </div>
              </div>

              {/* Quick Remote NOC Actions */}
              <div className="space-y-2 pt-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-xs rounded-xl cursor-pointer"
                  onClick={() =>
                    toast.success("TR-069 Reboot Dispatched", `Soft reboot signal sent to ONU ${selectedCustomer.onuSerial || selectedCustomer.macAddress || "device"}`)
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

      {/* Start New Conversation Modal */}
      <NewConversationModal
        isOpen={isNewChatModalOpen}
        onClose={() => setIsNewChatModalOpen(false)}
        onConversationCreated={handleConversationCreated}
      />
    </div>
  );
}
