"use client";

import React, { useState } from "react";
import {
  Send,
  Radio,
  Users,
  Search,
  Plus,
  ArrowRight,
  ExternalLink,
  Shield,
  Activity,
  Layers,
  Wrench,
  CheckCircle2,
  RefreshCw,
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
import { t } from "@/lib/i18n";

export default function Home() {
  const toast = useToast();
  const { user } = useAuthStore();
  const { branches, selectedBranchId } = useTenantStore();
  const { conversations, activeConversationId, messages, addMessage, setActiveConversationId } = useChatStore();

  // Navigation State
  const [activeTab, setActiveTab] = useState("desk");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Dialog & Drawer States
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);
  const [isCustomerDrawerOpen, setIsCustomerDrawerOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<TroubleTicket | null>(null);

  const [inputText, setInputText] = useState("");

  const activeMessages = activeConversationId ? messages[activeConversationId] || [] : [];
  const activeConv = conversations.find((c) => c.id === activeConversationId);

  // Filter branches and tickets based on active branch selector from Topbar
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
    toast.success("Message dispatched", "Sent to customer channel.");
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground font-body">
      {/* 1. Left Collapsible Sidebar */}
      <SidebarNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* 2. Main View Area */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        {/* Topbar Header */}
        <Topbar />

        {/* Dynamic Workspace Container */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {/* TAB 1: PRIME DESK WORKSPACE */}
          {activeTab === "desk" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-heading font-extrabold text-foreground tracking-tight">
                    Prime Desk — Multi-Channel Command Center
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Live customer inquiries with integrated optical diagnostics and instant ticket escalation.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsCustomerDrawerOpen(true)}
                    className="gap-1.5"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span>Customer 360° Drawer</span>
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* Left: Conversations Queue */}
                <Card className="lg:col-span-4 flex flex-col h-[600px]">
                  <CardHeader className="p-4 pb-2 border-b border-border-subtle">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xs uppercase tracking-wider font-mono">
                        Active Queue
                      </CardTitle>
                      <Badge variant="secondary">{conversations.length} Inquiries</Badge>
                    </div>
                    <Input
                      prefixIcon={<Search className="h-3.5 w-3.5" />}
                      placeholder="Search subscriber, phone, PPPoE..."
                      className="mt-2 text-xs"
                    />
                  </CardHeader>

                  <CardContent className="p-2 overflow-y-auto flex-1 divide-y divide-border-subtle">
                    {conversations.map((conv) => (
                      <div
                        key={conv.id}
                        onClick={() => setActiveConversationId(conv.id)}
                        className={`p-3 rounded-md cursor-pointer transition-colors ${
                          conv.id === activeConversationId
                            ? "bg-primary/10 border-l-4 border-primary"
                            : "hover:bg-card-subtle"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Avatar name={conv.customerName} size="sm" presence="online" />
                            <div>
                              <p className="text-xs font-bold text-foreground leading-tight">
                                {conv.customerName}
                              </p>
                              <span className="font-mono text-[10px] text-muted-foreground">
                                {conv.pppoeUsername}
                              </span>
                            </div>
                          </div>
                          {conv.opticalRxDbm && conv.opticalRxDbm < -24 && (
                            <Badge variant="destructive" className="text-[9px] py-0 px-1.5">
                              {conv.opticalRxDbm} dBm
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2 line-clamp-1">
                          {conv.lastMessage}
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Middle: Active Chat Timeline */}
                <Card className="lg:col-span-5 flex flex-col h-[600px]">
                  <CardHeader className="p-4 py-3 border-b border-border-subtle flex flex-row items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={activeConv?.customerName || "Customer"} size="md" presence="online" />
                      <div>
                        <CardTitle className="text-sm">{activeConv?.customerName}</CardTitle>
                        <span className="font-mono text-[11px] text-muted-foreground">
                          {activeConv?.branchName} • WhatsApp Channel
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Tooltip content="Transfer chat to another department">
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
                          onClick={() => toast.success("Chat Closed", "Outcome code: Resolved remotely.")}
                          className="h-8 text-xs"
                        >
                          Close
                        </Button>
                      </Tooltip>
                    </div>
                  </CardHeader>

                  <CardContent className="p-4 overflow-y-auto flex-1 space-y-3 bg-card-subtle/50">
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
                          <div className="w-full bg-warning/10 border border-warning/30 rounded-md p-2 text-center text-xs font-mono text-warning">
                            {msg.content}
                          </div>
                        ) : msg.isPrivateNote ? (
                          <div className="w-full bg-amber-500/10 border border-amber-500/30 rounded-md p-2 text-xs font-mono text-amber-500">
                            {msg.content}
                          </div>
                        ) : (
                          <div
                            className={`max-w-[85%] rounded-lg p-3 text-xs leading-relaxed ${
                              msg.senderRole === "agent"
                                ? "bg-primary text-primary-foreground shadow-xs"
                                : "bg-card border border-border text-foreground shadow-xs"
                            }`}
                          >
                            <p>{msg.content}</p>
                            <span className="block text-[10px] mt-1 opacity-70 text-right font-mono">
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

                  <CardFooter className="p-3 border-t border-border-subtle bg-card">
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

                {/* Right: Embedded Customer 360 Card */}
                <Card className="lg:col-span-3 flex flex-col h-[600px]">
                  <CardHeader className="p-4 pb-2 border-b border-border-subtle flex flex-row items-center justify-between">
                    <CardTitle className="text-xs uppercase tracking-wider font-mono">
                      Diagnostics Preview
                    </CardTitle>
                    <Badge variant="outline" className="text-[9px]">
                      LIVE
                    </Badge>
                  </CardHeader>
                  <CardContent className="p-4 space-y-4 text-xs">
                    <div className="space-y-1">
                      <span className="text-muted-foreground font-mono">Package Plan</span>
                      <p className="font-bold text-foreground">Fiber Pro (50 Mbps Unlimited)</p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-muted-foreground font-mono">SmartOLT Optical Power</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="destructive" className="font-mono">
                          -27.4 dBm (CRITICAL)
                        </Badge>
                        <span className="text-[11px] text-muted-foreground">GPON 0/2/4</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-muted-foreground font-mono">MikroTik PPPoE Session</span>
                      <p className="font-mono text-foreground font-medium">
                        IP: 103.14.22.84 • Uptime: 4d 12h
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-muted-foreground font-mono">Assigned Branch Hub</span>
                      <p className="font-medium text-foreground">Islamabad Blue Area (HQ)</p>
                    </div>

                    <div className="pt-2 border-t border-border-subtle space-y-2">
                      <Button
                        variant="primary"
                        size="sm"
                        className="w-full"
                        onClick={() =>
                          toast.success("Dispatched Splicer", "Ticket created and assigned to Van #04.")
                        }
                      >
                        🚀 Dispatch Splicer
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => toast.info("Port Reset", "SmartOLT ONU reboot signal dispatched.")}
                      >
                        🔄 Reboot ONU
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* TAB 2: TROUBLE TICKETS */}
          {activeTab === "tickets" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-heading font-extrabold text-foreground tracking-tight">
                    Trouble Tickets & Dispatch Operations
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    SLA-monitored complaints with field dispatch routing and photo verification.
                  </p>
                </div>
                <Button variant="primary" size="sm" className="gap-1.5">
                  <Plus className="h-3.5 w-3.5" /> Lodge Trouble Ticket
                </Button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ticket #</TableHead>
                    <TableHead>Subscriber & Account</TableHead>
                    <TableHead>Branch Hub</TableHead>
                    <TableHead>Complaint Category</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Assigned Field Engineers</TableHead>
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
                          className="h-7 text-xs px-2"
                        >
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* TAB 3: NOC RADAR */}
          {activeTab === "noc" && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-heading font-extrabold text-foreground tracking-tight">
                  NOC Fleet Telemetry & Optical Power Matrix
                </h2>
                <p className="text-xs text-muted-foreground">
                  Continuous optical signal diagnostics polled across Huawei MA5800, ZTE C300, and FiberHome OLTs.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-4 space-y-1">
                  <span className="text-xs font-mono text-muted-foreground uppercase">
                    Huawei MA5800 Core
                  </span>
                  <p className="text-2xl font-bold font-mono text-foreground">99.98%</p>
                  <Badge variant="success" className="text-[10px]">
                    0 CRC ERRORS
                  </Badge>
                </Card>
                <Card className="p-4 space-y-1">
                  <span className="text-xs font-mono text-muted-foreground uppercase">
                    ZTE C300 Metro Hub
                  </span>
                  <p className="text-2xl font-bold font-mono text-foreground">1,420 ONUs</p>
                  <Badge variant="warning" className="text-[10px]">
                    2 HIGH ATTN
                  </Badge>
                </Card>
                <Card className="p-4 space-y-1">
                  <span className="text-xs font-mono text-muted-foreground uppercase">
                    FiberHome AN5516
                  </span>
                  <p className="text-2xl font-bold font-mono text-foreground">-17.2 dBm</p>
                  <Badge variant="success" className="text-[10px]">
                    OPTIMAL RX
                  </Badge>
                </Card>
                <Card className="p-4 space-y-1">
                  <span className="text-xs font-mono text-muted-foreground uppercase">
                    FreeRADIUS Auth Latency
                  </span>
                  <p className="text-2xl font-bold font-mono text-foreground">3.8 ms</p>
                  <Badge variant="info" className="text-[10px]">
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
                    <TableHead>Board Temperature</TableHead>
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
                      <TableCell className="font-mono text-primary">{olt.onuSerial}</TableCell>
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

          {/* TAB 4: 20-BRANCH MATRIX */}
          {activeTab === "branches" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-heading font-extrabold text-foreground tracking-tight">
                    20-Branch Operational Matrix
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Branch offices, field staff headcount, and localized subnet allocations from mockDb.
                  </p>
                </div>
                <Button variant="primary" size="sm">
                  <Plus className="h-3.5 w-3.5" /> Add Branch
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

          {/* TAB 5: ATOMIC UI COMPONENT LAB */}
          {activeTab === "components" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-heading font-extrabold text-foreground tracking-tight">
                  Atomic UI Component Library
                </h2>
                <p className="text-xs text-muted-foreground">
                  100% tokenized primitives adhering to the ColorHunt design system and WCAG AAA compliance in both Light and Dark modes.
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
                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border-subtle">
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
            {selectedTicket ? `Ticket ${selectedTicket.ticketNo} Details` : "Customer 360° Deep Diagnostics"}
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
