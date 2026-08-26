"use client";

import React, { useState } from "react";
import {
  Send,
  Radio,
  Users,
  Search,
  Plus,
  ArrowUpRight,
  ExternalLink,
  Shield,
  Activity,
  Layers,
  Wrench,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Clock,
  Sparkles,
  Wifi,
  Filter,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerContent,
  DrawerFooter,
} from "@/components/ui/drawer";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Tooltip } from "@/components/ui/tooltip";
import { Avatar } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";

import { SidebarNav } from "@/components/layouts/SidebarNav";
import { Topbar } from "@/components/layouts/Topbar";

import { useAuthStore } from "@/stores/useAuthStore";
import { useTenantStore } from "@/stores/useTenantStore";
import { useChatStore } from "@/stores/useChatStore";
import { mockDb, TroubleTicket } from "@/mock/db";

export default function Home() {
  const toast = useToast();
  const { user } = useAuthStore();
  const { branches, selectedBranchId } = useTenantStore();
  const {
    conversations,
    activeConversationId,
    messages,
    addMessage,
    setActiveConversationId,
  } = useChatStore();

  // Navigation State
  const [activeTab, setActiveTab] = useState("overview");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Modals & Drawers
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);
  const [isCustomerDrawerOpen, setIsCustomerDrawerOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<TroubleTicket | null>(null);

  const [inputText, setInputText] = useState("");

  const activeMessages = activeConversationId ? messages[activeConversationId] || [] : [];
  const activeConv = conversations.find((c) => c.id === activeConversationId);

  // Filter based on active branch selector from Topbar
  const filteredBranches = selectedBranchId
    ? branches.filter((b) => b.id === selectedBranchId)
    : branches;

  const filteredTickets = selectedBranchId
    ? mockDb.tickets.filter((t) => t.branchId === selectedBranchId)
    : mockDb.tickets;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConversationId) return;

    addMessage(activeConversationId, {
      id: `msg-${Date.now()}`,
      conversationId: activeConversationId,
      senderId: user?.id || "usr-01",
      senderName: user?.name || "Agent",
      senderRole: "agent",
      content: inputText.trim(),
      type: "text",
      status: "sent",
      createdAt: new Date().toISOString(),
    });

    setInputText("");
    toast.success("Message dispatched", "Delivered to subscriber channel.");
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground font-body">
      {/* 1. Left Collapsible Navigation Sidebar */}
      <SidebarNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* 2. Main Command Workspace Area */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        {/* Topbar Command Header */}
        <Topbar />

        {/* Dynamic Workspace Container */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {/* Executive Telecom KPI Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4 bg-card border-border shadow-xs hover:border-primary/40 transition-colors">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                  Active Subscribers
                </span>
                <span className="flex h-2 w-2 rounded-full bg-success animate-pulse" />
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="font-heading font-extrabold text-2xl text-foreground">
                  142,850
                </span>
                <Badge variant="success" className="font-mono text-[10px]">
                  +1.4% MoM
                </Badge>
              </div>
              <span className="text-[11px] text-muted-foreground mt-1 block">
                Across 20 Operational Hubs
              </span>
            </Card>

            <Card className="p-4 bg-card border-border shadow-xs hover:border-primary/40 transition-colors">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                  Optical Health (Rx)
                </span>
                <Badge variant="info" className="text-[9px] py-0 px-1.5 font-mono">
                  -18.4 dBm
                </Badge>
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="font-heading font-extrabold text-2xl text-foreground">
                  98.4%
                </span>
                <span className="text-[11px] font-mono text-success font-bold">
                  Nominal
                </span>
              </div>
              <span className="text-[11px] text-muted-foreground mt-1 block">
                SmartOLT Fleet Diagnostics
              </span>
            </Card>

            <Card className="p-4 bg-card border-border shadow-xs hover:border-primary/40 transition-colors">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                  Inquiries Queue
                </span>
                <Badge variant="warning" className="text-[9px] py-0 px-1.5 font-mono">
                  LIVE
                </Badge>
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="font-heading font-extrabold text-2xl text-foreground">
                  {conversations.length} Active
                </span>
                <span className="text-[11px] font-mono text-warning font-bold">
                  Avg 1.4m ETTR
                </span>
              </div>
              <span className="text-[11px] text-muted-foreground mt-1 block">
                WhatsApp • App • Web Chat
              </span>
            </Card>

            <Card className="p-4 bg-card border-border shadow-xs hover:border-primary/40 transition-colors">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                  SLA Compliance
                </span>
                <Badge variant="success" className="text-[9px] py-0 px-1.5 font-mono">
                  0 BREACH
                </Badge>
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="font-heading font-extrabold text-2xl text-success">
                  99.8%
                </span>
                <span className="text-[11px] font-mono text-muted-foreground">
                  Target: 99.5%
                </span>
              </div>
              <span className="text-[11px] text-muted-foreground mt-1 block">
                ETTR Monitored Dispatch
              </span>
            </Card>
          </div>

          {/* TAB: COMMAND OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* 2-Column Bento Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left (60%): Live Helpdesk Inquiries Feed */}
                <Card className="lg:col-span-7 flex flex-col shadow-xs">
                  <CardHeader className="p-4 border-b border-border bg-card-subtle/50 flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-sm font-heading font-bold">
                        Live Subscriber Inquiries
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Omni-channel customer sessions awaiting resolution or field dispatch.
                      </CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveTab("desk")}
                      className="text-xs gap-1"
                    >
                      <span>Open Prime Desk</span>
                      <ArrowUpRight className="h-3 w-3" />
                    </Button>
                  </CardHeader>

                  <CardContent className="p-0 divide-y divide-border-subtle">
                    {conversations.map((conv) => (
                      <div
                        key={conv.id}
                        onClick={() => {
                          setActiveConversationId(conv.id);
                          setActiveTab("desk");
                        }}
                        className="p-4 hover:bg-card-subtle transition-colors cursor-pointer flex items-start justify-between gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar name={conv.customerName} size="md" presence="online" />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs text-foreground">
                                {conv.customerName}
                              </span>
                              <Badge variant="secondary" className="text-[9px] py-0 px-1 font-mono uppercase">
                                {conv.channel}
                              </Badge>
                            </div>
                            <span className="font-mono text-[11px] text-muted-foreground block">
                              {conv.pppoeUsername} • {conv.branchName}
                            </span>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                              {conv.lastMessage}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-1.5 shrink-0">
                          <span className="font-mono text-[10px] text-muted-foreground" suppressHydrationWarning>
                            {new Date(conv.lastMessageAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          {conv.opticalRxDbm && conv.opticalRxDbm < -24 ? (
                            <Badge variant="destructive" className="text-[9px] py-0 px-1.5 font-mono">
                              {conv.opticalRxDbm} dBm (LOW)
                            </Badge>
                          ) : (
                            <Badge variant="success" className="text-[9px] py-0 px-1.5 font-mono">
                              OPTIMAL
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Right (40%): Live NOC Telemetry & OLT Fleet */}
                <Card className="lg:col-span-5 flex flex-col shadow-xs">
                  <CardHeader className="p-4 border-b border-border bg-card-subtle/50 flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-sm font-heading font-bold">
                        SmartOLT Fleet Diagnostics
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Real-time optical attenuation and core router health.
                      </CardDescription>
                    </div>
                    <Badge variant="success" hasPulse className="text-[9px] font-mono">
                      POLLING 5s
                    </Badge>
                  </CardHeader>

                  <CardContent className="p-4 space-y-4">
                    {mockDb.oltFleet.map((olt, idx) => (
                      <div
                        key={idx}
                        className="rounded-lg border border-border p-3 space-y-2 bg-card-subtle/30"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Radio className="h-3.5 w-3.5 text-primary" />
                            <span className="font-mono font-bold text-xs text-foreground">
                              {olt.oltHostname}
                            </span>
                          </div>
                          <Badge
                            variant={olt.status === "optimal" ? "success" : "warning"}
                            className="text-[9px] py-0 px-1.5 font-mono uppercase"
                          >
                            {olt.status}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
                          <div className="rounded bg-card p-1.5 border border-border/60">
                            <span className="text-[10px] text-muted-foreground font-mono block">
                              Port
                            </span>
                            <span className="font-mono font-bold text-foreground text-[11px]">
                              {olt.ponPort}
                            </span>
                          </div>

                          <div className="rounded bg-card p-1.5 border border-border/60">
                            <span className="text-[10px] text-muted-foreground font-mono block">
                              Rx Power
                            </span>
                            <span
                              className={`font-mono font-bold text-[11px] ${
                                olt.rxPowerDbm < -24 ? "text-destructive" : "text-success"
                              }`}
                            >
                              {olt.rxPowerDbm} dBm
                            </span>
                          </div>

                          <div className="rounded bg-card p-1.5 border border-border/60">
                            <span className="text-[10px] text-muted-foreground font-mono block">
                              Board Temp
                            </span>
                            <span className="font-mono font-bold text-foreground text-[11px]">
                              {olt.temperatureC} °C
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Trouble Tickets & Field Dispatch Queue */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-heading font-bold text-foreground">
                      Active Trouble Tickets & Field Dispatch
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Complaints with active ETTR countdowns and assigned field engineering teams.
                    </p>
                  </div>
                  <Button variant="primary" size="sm" className="gap-1.5 shadow-xs">
                    <Plus className="h-3.5 w-3.5" /> Lodge Ticket
                  </Button>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ticket #</TableHead>
                      <TableHead>Subscriber</TableHead>
                      <TableHead>Branch Hub</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Assigned Van</TableHead>
                      <TableHead>ETTR Timer</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTickets.map((tkt) => (
                      <TableRow key={tkt.id}>
                        <TableCell className="font-mono font-bold text-primary">
                          {tkt.ticketNo}
                        </TableCell>
                        <TableCell>
                          <span className="font-bold text-foreground">{tkt.customerName}</span>
                          <span className="block text-[11px] text-muted-foreground font-mono">
                            {tkt.pppoeUsername}
                          </span>
                        </TableCell>
                        <TableCell>{tkt.branchName}</TableCell>
                        <TableCell>{tkt.category}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              tkt.priority === "Critical"
                                ? "destructive"
                                : tkt.priority === "High"
                                ? "warning"
                                : "secondary"
                            }
                          >
                            {tkt.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>{tkt.assignedEngineers.join(", ")}</TableCell>
                        <TableCell className="font-mono font-medium">{tkt.ettrHours}h ETTR</TableCell>
                        <TableCell>
                          <Badge variant="outline">{tkt.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedTicket(tkt);
                              setIsCustomerDrawerOpen(true);
                            }}
                            className="h-7 text-xs px-2.5"
                          >
                            Diagnostics
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {/* TAB: PRIME DESK (LIVE HELPDESK) */}
          {activeTab === "desk" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h2 className="text-xl font-heading font-extrabold text-foreground tracking-tight">
                    Prime Desk — 3-Column Live Workspace
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Real-time customer inquiries with integrated optical power diagnostics and instant field dispatch.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsCustomerDrawerOpen(true)}
                    className="gap-1.5 text-xs shadow-xs"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span>Customer 360° Drawer</span>
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* 1. Left Column: Conversation Queue */}
                <Card className="lg:col-span-4 flex flex-col h-[620px] shadow-sm">
                  <CardHeader className="p-3.5 pb-2.5 border-b border-border bg-card-subtle/50">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xs uppercase tracking-wider font-mono text-muted-foreground">
                        Customer Inquiries
                      </CardTitle>
                      <Badge variant="secondary" className="font-mono text-[10px]">
                        {conversations.length} Queue
                      </Badge>
                    </div>
                    <div className="relative mt-2">
                      <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                      <input
                        type="text"
                        placeholder="Filter by name, phone, PPPoE..."
                        className="h-8 w-full rounded-md border border-input bg-card pl-8 pr-2.5 text-xs text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                      />
                    </div>
                  </CardHeader>

                  <CardContent className="p-2 overflow-y-auto flex-1 divide-y divide-border-subtle">
                    {conversations.map((conv) => (
                      <div
                        key={conv.id}
                        onClick={() => setActiveConversationId(conv.id)}
                        className={`p-3 rounded-lg cursor-pointer transition-all ${
                          conv.id === activeConversationId
                            ? "bg-primary/10 border-l-4 border-primary shadow-xs"
                            : "hover:bg-card-subtle"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <Avatar name={conv.customerName} size="sm" presence="online" />
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-foreground leading-tight truncate">
                                {conv.customerName}
                              </p>
                              <span className="font-mono text-[10px] text-muted-foreground truncate block">
                                {conv.pppoeUsername}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-col items-end shrink-0 gap-1">
                            <span className="font-mono text-[10px] text-muted-foreground" suppressHydrationWarning>
                              {new Date(conv.lastMessageAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                            {conv.opticalRxDbm && conv.opticalRxDbm < -24 && (
                              <Badge variant="destructive" className="text-[9px] py-0 px-1 font-mono">
                                {conv.opticalRxDbm} dBm
                              </Badge>
                            )}
                          </div>
                        </div>

                        <p className="text-xs text-muted-foreground mt-2 line-clamp-1 leading-relaxed">
                          {conv.lastMessage}
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* 2. Middle Column: Active Live Chat Timeline */}
                <Card className="lg:col-span-5 flex flex-col h-[620px] shadow-sm">
                  <CardHeader className="p-3.5 py-3 border-b border-border bg-card-subtle/50 flex flex-row items-center justify-between">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Avatar
                        name={activeConv?.customerName || "Customer"}
                        size="md"
                        presence="online"
                      />
                      <div className="min-w-0">
                        <CardTitle className="text-sm truncate">
                          {activeConv?.customerName}
                        </CardTitle>
                        <span className="font-mono text-[11px] text-muted-foreground block truncate">
                          {activeConv?.branchName} • WhatsApp Business
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <Tooltip content="Transfer chat with mandatory reason">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsTransferDialogOpen(true)}
                          className="h-8 text-xs"
                        >
                          Transfer
                        </Button>
                      </Tooltip>
                      <Tooltip content="Close conversation with outcome note">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() =>
                            toast.success("Chat Closed", "Outcome code: Resolved remotely.")
                          }
                          className="h-8 text-xs"
                        >
                          Close
                        </Button>
                      </Tooltip>
                    </div>
                  </CardHeader>

                  <CardContent className="p-4 overflow-y-auto flex-1 space-y-3 bg-card-subtle/40">
                    {activeMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${
                          msg.senderRole === "agent"
                            ? "items-end"
                            : msg.senderRole === "system"
                            ? "items-center"
                            : "items-start"
                        }`}
                      >
                        {msg.senderRole === "system" ? (
                          <div className="w-full bg-warning/10 border border-warning/30 rounded-lg p-2.5 text-center text-xs font-mono text-warning">
                            {msg.content}
                          </div>
                        ) : msg.isPrivateNote ? (
                          <div className="w-full bg-amber-500/10 border border-amber-500/30 rounded-lg p-2.5 text-xs font-mono text-amber-500">
                            {msg.content}
                          </div>
                        ) : (
                          <div
                            className={`max-w-[85%] rounded-xl p-3 text-xs leading-relaxed shadow-xs ${
                              msg.senderRole === "agent"
                                ? "bg-primary text-primary-foreground"
                                : "bg-card border border-border text-foreground"
                            }`}
                          >
                            <p>{msg.content}</p>
                            <span className="block text-[10px] mt-1 opacity-70 text-right font-mono" suppressHydrationWarning>
                              {new Date(msg.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </CardContent>

                  <CardFooter className="p-3 border-t border-border bg-card">
                    <form onSubmit={handleSendMessage} className="flex w-full items-center gap-2">
                      <Input
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Type a message or press '/' for canned replies..."
                        className="text-xs"
                      />
                      <Button type="submit" size="sm" className="gap-1.5 shrink-0">
                        <Send className="h-3.5 w-3.5" />
                        <span>Send</span>
                      </Button>
                    </form>
                  </CardFooter>
                </Card>

                {/* 3. Right Column: Customer 360° Live Diagnostics Panel */}
                <Card className="lg:col-span-3 flex flex-col h-[620px] shadow-sm">
                  <CardHeader className="p-3.5 pb-2 border-b border-border bg-card-subtle/50 flex flex-row items-center justify-between">
                    <CardTitle className="text-xs uppercase tracking-wider font-mono text-muted-foreground">
                      Customer 360° Telemetry
                    </CardTitle>
                    <Badge variant="outline" className="text-[9px] font-mono">
                      LIVE ONU
                    </Badge>
                  </CardHeader>

                  <CardContent className="p-4 space-y-4 text-xs overflow-y-auto flex-1">
                    {/* Subscriber Plan */}
                    <div className="space-y-1">
                      <span className="text-muted-foreground font-mono text-[11px]">
                        Active Subscriber Plan
                      </span>
                      <p className="font-bold text-foreground text-sm">
                        Fiber Pro (50 Mbps Unlimited)
                      </p>
                    </div>

                    {/* Optical Power Diagnostics */}
                    <div className="space-y-1.5 rounded-lg border border-border bg-card-subtle p-3">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground font-mono text-[11px]">
                          Optical Rx Power
                        </span>
                        <Badge variant="destructive" className="font-mono text-[10px]">
                          -27.4 dBm
                        </Badge>
                      </div>

                      {/* Optical Power Gauge Bar */}
                      <div className="w-full bg-card rounded-full h-2 overflow-hidden border border-border">
                        <div className="bg-destructive h-full w-[88%]" />
                      </div>
                      <span className="text-[10px] text-destructive font-mono block">
                        GPON 0/2/4 (Splitter #4 Attenuation)
                      </span>
                    </div>

                    {/* PPPoE Session Details */}
                    <div className="space-y-1.5 rounded-lg border border-border bg-card-subtle p-3">
                      <span className="text-muted-foreground font-mono text-[11px]">
                        MikroTik Radius Session
                      </span>
                      <p className="font-mono text-foreground font-medium text-[11px]">
                        IP: 103.14.22.84
                      </p>
                      <p className="font-mono text-muted-foreground text-[11px]">
                        Uptime: 4 days 12 hours
                      </p>
                    </div>

                    {/* Branch Hub Assignment */}
                    <div className="space-y-1">
                      <span className="text-muted-foreground font-mono text-[11px]">
                        Assigned Branch Office
                      </span>
                      <p className="font-medium text-foreground">
                        Islamabad Blue Area (HQ)
                      </p>
                    </div>

                    {/* Quick Operations Actions */}
                    <div className="pt-2 border-t border-border space-y-2">
                      <Button
                        variant="primary"
                        size="sm"
                        className="w-full text-xs shadow-xs"
                        onClick={() =>
                          toast.success("Dispatched Splicer", "Ticket created & routed to Van #04.")
                        }
                      >
                        🚀 Dispatch Splicer Van
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-xs"
                        onClick={() =>
                          toast.info("ONU Reboot Signal", "SmartOLT power-cycle command sent.")
                        }
                      >
                        🔄 Remote Reboot ONU
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* TAB: TROUBLE TICKETS */}
          {activeTab === "tickets" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h2 className="text-xl font-heading font-extrabold text-foreground tracking-tight">
                    Trouble Tickets & Field Operations
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    SLA-monitored complaints with field dispatch routing and automated ETTR countdowns.
                  </p>
                </div>
                <Button variant="primary" size="sm" className="gap-1.5 shadow-xs">
                  <Plus className="h-3.5 w-3.5" /> Lodge Trouble Ticket
                </Button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ticket #</TableHead>
                    <TableHead>Subscriber & Account</TableHead>
                    <TableHead>Branch Hub</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Assigned Engineers</TableHead>
                    <TableHead>ETTR Countdown</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTickets.map((tkt) => (
                    <TableRow key={tkt.id}>
                      <TableCell className="font-mono font-bold text-primary">
                        {tkt.ticketNo}
                      </TableCell>
                      <TableCell>
                        <span className="font-bold text-foreground">{tkt.customerName}</span>
                        <span className="block text-[11px] text-muted-foreground font-mono">
                          {tkt.pppoeUsername}
                        </span>
                      </TableCell>
                      <TableCell>{tkt.branchName}</TableCell>
                      <TableCell>{tkt.category}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            tkt.priority === "Critical"
                              ? "destructive"
                              : tkt.priority === "High"
                              ? "warning"
                              : "secondary"
                          }
                        >
                          {tkt.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>{tkt.assignedEngineers.join(", ")}</TableCell>
                      <TableCell className="font-mono font-medium">{tkt.ettrHours}h ETTR</TableCell>
                      <TableCell>
                        <Badge variant="outline">{tkt.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedTicket(tkt);
                            setIsCustomerDrawerOpen(true);
                          }}
                          className="h-7 text-xs px-2.5"
                        >
                          Diagnostics
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* TAB: NOC RADAR */}
          {activeTab === "noc" && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-heading font-extrabold text-foreground tracking-tight">
                  NOC Fleet Telemetry & Optical Diagnostics
                </h2>
                <p className="text-xs text-muted-foreground">
                  Continuous optical signal diagnostics polled across Huawei MA5800, ZTE C300, and FiberHome OLTs.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                <Card className="p-4 space-y-1 shadow-xs">
                  <span className="text-xs font-mono text-muted-foreground uppercase">
                    Huawei MA5800 Core
                  </span>
                  <p className="text-2xl font-bold font-mono text-foreground">99.98%</p>
                  <Badge variant="success" className="text-[10px] font-mono">
                    0 CRC ERRORS
                  </Badge>
                </Card>
                <Card className="p-4 space-y-1 shadow-xs">
                  <span className="text-xs font-mono text-muted-foreground uppercase">
                    ZTE C300 Metro Hub
                  </span>
                  <p className="text-2xl font-bold font-mono text-foreground">1,420 ONUs</p>
                  <Badge variant="warning" className="text-[10px] font-mono">
                    2 HIGH ATTN
                  </Badge>
                </Card>
                <Card className="p-4 space-y-1 shadow-xs">
                  <span className="text-xs font-mono text-muted-foreground uppercase">
                    FiberHome AN5516
                  </span>
                  <p className="text-2xl font-bold font-mono text-foreground">-17.2 dBm</p>
                  <Badge variant="success" className="text-[10px] font-mono">
                    OPTIMAL RX
                  </Badge>
                </Card>
                <Card className="p-4 space-y-1 shadow-xs">
                  <span className="text-xs font-mono text-muted-foreground uppercase">
                    FreeRADIUS Latency
                  </span>
                  <p className="text-2xl font-bold font-mono text-foreground">3.8 ms</p>
                  <Badge variant="info" className="text-[10px] font-mono">
                    PORT 1812 UDP
                  </Badge>
                </Card>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>OLT Hostname</TableHead>
                    <TableHead>PON Interface</TableHead>
                    <TableHead>ONU Serial Number</TableHead>
                    <TableHead>Rx Optical Power</TableHead>
                    <TableHead>Tx Launch Power</TableHead>
                    <TableHead>Temperature</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockDb.oltFleet.map((olt, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-mono font-bold text-foreground">
                        {olt.oltHostname}
                      </TableCell>
                      <TableCell className="font-mono">{olt.ponPort}</TableCell>
                      <TableCell className="font-mono text-primary font-bold">{olt.onuSerial}</TableCell>
                      <TableCell className="font-mono">
                        <span className={olt.rxPowerDbm < -24 ? "text-destructive font-bold" : "text-success font-bold"}>
                          {olt.rxPowerDbm} dBm
                        </span>
                      </TableCell>
                      <TableCell className="font-mono">{olt.txPowerDbm} dBm</TableCell>
                      <TableCell className="font-mono">{olt.temperatureC} °C</TableCell>
                      <TableCell>
                        <Badge variant={olt.status === "optimal" ? "success" : "warning"}>
                          {olt.status.toUpperCase()}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* TAB: 20-BRANCH MATRIX */}
          {activeTab === "branches" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h2 className="text-xl font-heading font-extrabold text-foreground tracking-tight">
                    20-Branch Operational Matrix
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Branch offices, field staff headcount, and localized subnet allocations from mockDb.
                  </p>
                </div>
                <Button variant="primary" size="sm" className="gap-1.5 shadow-xs">
                  <Plus className="h-3.5 w-3.5" /> Add Branch Hub
                </Button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code / Branch Name</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Manager</TableHead>
                    <TableHead>Staff / Engineers</TableHead>
                    <TableHead>SLA Compliance</TableHead>
                    <TableHead>Subnets</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBranches.map((b) => (
                    <TableRow key={b.id}>
                      <TableCell>
                        <span className="font-bold text-foreground">{b.name}</span>
                        <span className="block font-mono text-[11px] text-muted-foreground">
                          {b.code}
                        </span>
                      </TableCell>
                      <TableCell>{b.city}</TableCell>
                      <TableCell>{b.managerName}</TableCell>
                      <TableCell className="font-mono">
                        {b.totalStaff} Staff / {b.totalEngineers} Engs
                      </TableCell>
                      <TableCell className="font-mono">
                        <span className="text-success font-bold">{b.slaCompliancePercent}%</span>
                      </TableCell>
                      <TableCell className="font-mono text-[11px] text-muted-foreground">
                        {b.subnets.join(", ")}
                      </TableCell>
                      <TableCell>
                        <Badge variant="success">ACTIVE</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* TAB: ATOMIC UI COMPONENT LAB */}
          {activeTab === "components" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-heading font-extrabold text-foreground tracking-tight">
                  Atomic UI Component Library
                </h2>
                <p className="text-xs text-muted-foreground">
                  100% tokenized primitives adhering to the design system in both Light and Dark modes.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Buttons Showcase */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Button Variants & Sizes</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      <Button variant="primary">Primary</Button>
                      <Button variant="secondary">Secondary</Button>
                      <Button variant="destructive">Destructive</Button>
                      <Button variant="outline">Outline</Button>
                      <Button variant="ghost">Ghost</Button>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border">
                      <Button size="sm">Small</Button>
                      <Button size="md">Medium</Button>
                      <Button size="lg">Large</Button>
                      <Button isLoading size="sm">
                        Saving
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Status Badges */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Status Badges (with Live Pulse)</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="success" hasPulse>
                        Online
                      </Badge>
                      <Badge variant="warning" hasPulse>
                        High Attenuation
                      </Badge>
                      <Badge variant="destructive" hasPulse>
                        Fiber Break
                      </Badge>
                      <Badge variant="info">412 Gbps</Badge>
                      <Badge variant="secondary">Draft</Badge>
                      <Badge variant="outline">ZL Ultra Sync</Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Avatars with Presence */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Avatars & Presence Tiers</CardTitle>
                  </CardHeader>
                  <CardContent className="flex items-center gap-3">
                    <Avatar name="Tariq Mehmood" presence="online" size="xl" />
                    <Avatar name="Fatima Noor" presence="busy" size="lg" />
                    <Avatar name="Zubair Ahmed" presence="offline" size="md" />
                    <Avatar name="Usman Ali" presence="online" size="sm" />
                  </CardContent>
                </Card>

                {/* Form Controls */}
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-sm">Form Inputs & Monospace Modes</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Subscriber PPPoE Username"
                      defaultValue="ahmed_malik_isb"
                      isMono
                      prefixIcon={<Users className="h-4 w-4" />}
                    />
                    <Input
                      label="Target Optical Power (Rx)"
                      defaultValue="-18.4 dBm"
                      isMono
                      prefixIcon={<Radio className="h-4 w-4" />}
                    />
                    <div className="sm:col-span-2">
                      <Textarea
                        label="Splicing Resolution Notes"
                        placeholder="Enter field findings..."
                        defaultValue="Re-spliced Splitter #4 core 2. Optical attenuation restored to -18.2 dBm nominal."
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Skeleton Loaders */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Structural Skeleton Loaders</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-8 w-1/2" />
                    <div className="flex gap-2">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-1.5 flex-1">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* 3. Slide-Over Customer 360° Drawer */}
      <Drawer
        isOpen={isCustomerDrawerOpen}
        onClose={() => {
          setIsCustomerDrawerOpen(false);
          setSelectedTicket(null);
        }}
        size="lg"
      >
        <DrawerHeader>
          <DrawerTitle>
            {selectedTicket
              ? `Ticket ${selectedTicket.ticketNo} Details`
              : "Customer 360° Deep Diagnostics"}
          </DrawerTitle>
          <DrawerDescription>
            {selectedTicket
              ? `Filed by ${selectedTicket.customerName} (${selectedTicket.branchName})`
              : "Live MikroTik session telemetry & SmartOLT optical attenuation logs."}
          </DrawerDescription>
        </DrawerHeader>

        <DrawerContent>
          <div className="space-y-4">
            <Card className="bg-card-subtle border-border">
              <CardContent className="p-4 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-mono">Subscriber ID:</span>
                  <span className="font-mono font-bold text-foreground">CUS-99482</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-mono">PPPoE Account:</span>
                  <span className="font-mono font-bold text-primary">ahmed_malik_isb</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-mono">Active Plan:</span>
                  <span className="font-bold text-foreground">50 Mbps Fiber Unlimited</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-mono">Current IP:</span>
                  <span className="font-mono text-foreground">103.14.22.84</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-mono">Optical Signal (Rx):</span>
                  <Badge variant="destructive" className="font-mono">
                    -27.4 dBm (CRITICAL ATTN)
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-2">
              <h4 className="text-xs font-heading font-bold uppercase tracking-wider text-foreground">
                Assigned Operations Van
              </h4>
              <p className="text-xs text-muted-foreground">
                Splicer Usman Ali (Van #04) is en route with optical fusion splicer and 1:8 splitters.
              </p>
            </div>
          </div>
        </DrawerContent>

        <DrawerFooter>
          <Button
            variant="outline"
            onClick={() => {
              setIsCustomerDrawerOpen(false);
              setSelectedTicket(null);
            }}
          >
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setIsCustomerDrawerOpen(false);
              toast.success("Action Executed", "Field engineer notified via mobile push.");
            }}
          >
            Notify Field Van
          </Button>
        </DrawerFooter>
      </Drawer>

      {/* 4. Accessible Test Modal Dialog */}
      <Dialog isOpen={isTransferDialogOpen} onClose={() => setIsTransferDialogOpen(false)}>
        <DialogHeader>
          <DialogTitle>Transfer Active Chat Session</DialogTitle>
        </DialogHeader>
        <DialogContent className="space-y-4">
          <p className="text-xs text-muted-foreground">
            Please provide a mandatory transfer reason before re-routing Subscriber{" "}
            <strong>Ahmed Malik</strong> to another department or engineer.
          </p>

          <Textarea
            label="Mandatory Transfer Reason"
            placeholder="e.g. Requires physical fiber splicing on Street 4..."
          />
        </DialogContent>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsTransferDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setIsTransferDialogOpen(false);
              toast.success("Chat Transferred", "Session transferred to Field Operations.");
            }}
          >
            Confirm Transfer
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
