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
  Wrench,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Clock,
  Sparkles,
  Wifi,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Drawer,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerContent,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Avatar } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/toast";
import { useAuthStore } from "@/stores/useAuthStore";
import { useTenantStore } from "@/stores/useTenantStore";
import { useChatStore } from "@/stores/useChatStore";
import { mockDb, TroubleTicket } from "@/mock/db";
import { PrimeDeskWorkspace } from "@/components/chat/PrimeDeskWorkspace";
import { RBACMatrix } from "@/components/admin/RBACMatrix";

export default function CompanyDashboardPage() {
  const toast = useToast();
  const { user } = useAuthStore();
  const { branches, selectedBranchId } = useTenantStore();
  const { conversations, setActiveConversationId } = useChatStore();

  const [activeTab, setActiveTab] = useState<
    "overview" | "desk" | "tickets" | "noc" | "branches" | "rbac"
  >("overview");
  const [isCustomerDrawerOpen, setIsCustomerDrawerOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<TroubleTicket | null>(null);

  const filteredBranches = selectedBranchId
    ? branches.filter((b) => b.id === selectedBranchId)
    : branches;

  const filteredTickets = selectedBranchId
    ? mockDb.tickets.filter((t) => t.branchId === selectedBranchId)
    : mockDb.tickets;

  return (
    <div className="space-y-6">
      {/* 1. Executive Operations KPI Ribbon */}
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

      {/* 2. Operations Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-3 overflow-x-auto">
        <Button
          variant={activeTab === "overview" ? "primary" : "outline"}
          size="sm"
          onClick={() => setActiveTab("overview")}
          className="text-xs"
        >
          Operations Overview
        </Button>
        <Button
          variant={activeTab === "desk" ? "primary" : "outline"}
          size="sm"
          onClick={() => setActiveTab("desk")}
          className="text-xs"
        >
          Prime Desk Live Chat ({conversations.length})
        </Button>
        <Button
          variant={activeTab === "tickets" ? "primary" : "outline"}
          size="sm"
          onClick={() => setActiveTab("tickets")}
          className="text-xs"
        >
          Trouble Tickets ({filteredTickets.length})
        </Button>
        <Button
          variant={activeTab === "noc" ? "primary" : "outline"}
          size="sm"
          onClick={() => setActiveTab("noc")}
          className="text-xs"
        >
          NOC Optical Radar
        </Button>
        <Button
          variant={activeTab === "branches" ? "primary" : "outline"}
          size="sm"
          onClick={() => setActiveTab("branches")}
          className="text-xs"
        >
          20 Branch Offices
        </Button>
        <Button
          variant={activeTab === "rbac" ? "primary" : "outline"}
          size="sm"
          onClick={() => setActiveTab("rbac")}
          className="text-xs"
        >
          RBAC Permissions
        </Button>
      </div>

      {/* TAB 1: OPERATIONS OVERVIEW */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Live Inquiries Feed */}
            <Card className="lg:col-span-7 flex flex-col shadow-xs">
              <CardHeader className="p-4 border-b border-border bg-card-subtle/50 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-heading font-bold">
                    Live Subscriber Inquiries Feed
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Real-time WhatsApp & customer portal inquiries.
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab("desk")}
                  className="text-xs gap-1"
                >
                  <span>Open Desk</span>
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
                      <span
                        className="font-mono text-[10px] text-muted-foreground"
                        suppressHydrationWarning
                      >
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

            {/* SmartOLT Fleet Telemetry */}
            <Card className="lg:col-span-5 flex flex-col shadow-xs">
              <CardHeader className="p-4 border-b border-border bg-card-subtle/50 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-heading font-bold">
                    SmartOLT Optical Health
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Optical signal telemetry across core OLT hardware.
                  </CardDescription>
                </div>
                <Badge variant="success" hasPulse className="text-[9px] font-mono">
                  POLLING
                </Badge>
              </CardHeader>

              <CardContent className="p-4 space-y-3">
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
        </div>
      )}

      {/* TAB 2: PRIME DESK LIVE HELP DESK */}
      {activeTab === "desk" && <PrimeDeskWorkspace />}

      {/* TAB 3: TROUBLE TICKETS */}
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
            <Button
              variant="primary"
              size="sm"
              onClick={() =>
                toast.info("Lodge Ticket", "Opening field complaint registration...")
              }
              className="gap-1.5 shadow-xs"
            >
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
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* TAB 4: NOC RADAR */}
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
                  <TableCell className="font-mono text-primary font-bold">
                    {olt.onuSerial}
                  </TableCell>
                  <TableCell className="font-mono">
                    <span
                      className={
                        olt.rxPowerDbm < -24 ? "text-destructive font-bold" : "text-success font-bold"
                      }
                    >
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

      {/* TAB 5: 20 BRANCH HUBS */}
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

      {/* TAB 6: RBAC PERMISSIONS MATRIX */}
      {activeTab === "rbac" && <RBACMatrix />}

      {/* Customer 360 Drawer */}
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
    </div>
  );
}
