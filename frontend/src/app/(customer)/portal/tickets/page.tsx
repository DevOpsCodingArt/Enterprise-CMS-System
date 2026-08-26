"use client";

import React, { useState } from "react";
import {
  Ticket,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Radio,
  Truck,
  Wrench,
  Search,
  MessageSquare,
  Sparkles,
  PhoneCall,
  Calendar,
  Layers,
  Check,
  FileText,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

interface TicketItem {
  id: string;
  ticketNo: string;
  category: string;
  priority: "Critical" | "High" | "Normal" | "Low";
  status: "In Progress" | "Resolved" | "Assigned" | "Open";
  lodgedAt: string;
  resolvedAt?: string;
  ettrHours?: number;
  engineer?: string;
  vanNumber?: string;
  opticalRxDbm?: number;
  description: string;
  resolutionNote?: string;
}

export default function CustomerTicketsPage() {
  const [activeFilter, setActiveFilter] = useState<"all" | "in_progress" | "resolved">("all");

  const ticketsList: TicketItem[] = [
    {
      id: "tkt-01",
      ticketNo: "TK-8842",
      category: "High Optical Attenuation",
      priority: "High",
      status: "In Progress",
      lodgedAt: "Today, 01:30 PM",
      ettrHours: 3.5,
      engineer: "Usman Ali (Lead Fiber Splicer)",
      vanNumber: "VAN #04",
      opticalRxDbm: -27.4,
      description: "Optical light power dropped to -27.4 dBm on GPON 0/2/4 Splitter #4. Splicing required.",
    },
    {
      id: "tkt-02",
      ticketNo: "TK-7721",
      category: "Fiber Patchcord Damage",
      priority: "Normal",
      status: "Resolved",
      lodgedAt: "July 14, 2026 10:20 AM",
      resolvedAt: "July 14, 2026 02:40 PM",
      engineer: "Zubair Ahmed",
      vanNumber: "VAN #02",
      opticalRxDbm: -18.2,
      description: "Physical drop at customer premise damaged by home maintenance.",
      resolutionNote: "Replaced yellow SC-APC patchcord from Splitter #2. Signal restored to -18.2 dBm nominal.",
    },
    {
      id: "tkt-03",
      ticketNo: "TK-6610",
      category: "New Gigabit ONT Installation",
      priority: "Normal",
      status: "Resolved",
      lodgedAt: "May 10, 2026 09:00 AM",
      resolvedAt: "May 10, 2026 01:15 PM",
      engineer: "Usman Ali",
      vanNumber: "VAN #04",
      opticalRxDbm: -17.8,
      description: "Standard residential FTTH connection provisioning.",
      resolutionNote: "Installed Dual-Band Gigabit ONT HWTC884291A. Initial drop signal -17.8 dBm verified.",
    },
  ];

  const inProgressTickets = ticketsList.filter(
    (t) => t.status === "In Progress" || t.status === "Assigned"
  );
  const resolvedTickets = ticketsList.filter((t) => t.status === "Resolved");

  return (
    <div className="space-y-6">
      {/* 1. Header with Stats (Lodge Button Removed) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-heading font-extrabold text-foreground tracking-tight">
            Trouble Tickets & Complaint Tracking
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Monitor real-time field engineering dispatch, optical attenuation calibration, and complaint history.
          </p>
        </div>
      </div>

      {/* 2. Modern Filter Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-border pb-3">
        <Button
          variant={activeFilter === "all" ? "primary" : "outline"}
          size="sm"
          onClick={() => setActiveFilter("all")}
          className="text-xs rounded-lg gap-1.5 cursor-pointer"
        >
          <span>All Tickets</span>
          <Badge variant={activeFilter === "all" ? "secondary" : "outline"} className="text-[10px] py-0 px-1 font-mono">
            {ticketsList.length}
          </Badge>
        </Button>

        <Button
          variant={activeFilter === "in_progress" ? "primary" : "outline"}
          size="sm"
          onClick={() => setActiveFilter("in_progress")}
          className="text-xs rounded-lg gap-1.5 cursor-pointer"
        >
          <span>In Progress</span>
          <Badge variant="warning" className="text-[10px] py-0 px-1 font-mono">
            {inProgressTickets.length}
          </Badge>
        </Button>

        <Button
          variant={activeFilter === "resolved" ? "primary" : "outline"}
          size="sm"
          onClick={() => setActiveFilter("resolved")}
          className="text-xs rounded-lg gap-1.5 cursor-pointer"
        >
          <span>Resolved</span>
          <Badge variant="success" className="text-[10px] py-0 px-1 font-mono">
            {resolvedTickets.length}
          </Badge>
        </Button>
      </div>

      {/* 3. In-Progress Tickets (Cards with 4-Stage Stepper & Splicer Info) */}
      {(activeFilter === "all" || activeFilter === "in_progress") && inProgressTickets.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-warning">
              Active Complaint In-Progress
            </span>
          </div>

          {inProgressTickets.map((tkt) => (
            <Card
              key={tkt.id}
              className="border-warning/60 ring-1 ring-warning/20 bg-card shadow-xs transition-all"
            >
              <CardHeader className="p-4 border-b border-border bg-card-subtle/40 flex flex-row items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl font-mono font-bold text-xs bg-warning/10 text-warning border border-warning/20">
                    TK
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-extrabold text-sm text-foreground">
                        Ticket #{tkt.ticketNo}
                      </span>
                      <Badge
                        variant="warning"
                        hasPulse
                        className="font-mono text-[9px] uppercase"
                      >
                        {tkt.status}
                      </Badge>
                      <Badge variant="secondary" className="font-mono text-[9px]">
                        {tkt.priority} Priority
                      </Badge>
                    </div>

                    <span className="text-xs font-semibold text-muted-foreground block mt-0.5">
                      Category: <strong className="text-foreground">{tkt.category}</strong> • Lodged: {tkt.lodgedAt}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-mono text-muted-foreground uppercase block">
                    Estimated Splicing ETTR
                  </span>
                  <span className="font-mono font-bold text-warning text-xs">
                    ~3.5 Hours Remaining
                  </span>
                </div>
              </CardHeader>

              <CardContent className="p-4 space-y-4">
                <p className="text-xs text-foreground leading-relaxed">
                  {tkt.description}
                </p>

                {/* 4-Stage Stepper for In-Progress Tickets */}
                <div className="rounded-xl border border-border bg-card-subtle p-4 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-success text-success-foreground text-[10px] font-bold">
                        <Check className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <span className="font-bold text-foreground block text-[11px]">1. Lodged</span>
                        <span className="text-[10px] text-muted-foreground font-mono">01:30 PM</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-success text-success-foreground text-[10px] font-bold">
                        <Check className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <span className="font-bold text-foreground block text-[11px]">2. NOC Assigned</span>
                        <span className="text-[10px] text-muted-foreground font-mono">01:35 PM</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold animate-pulse ring-2 ring-primary/30">
                        3
                      </div>
                      <div>
                        <span className="font-bold text-foreground block text-[11px]">3. Van Dispatched</span>
                        <span className="text-[10px] text-primary font-mono font-bold">En Route</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-card border border-border text-muted-foreground text-[10px] font-bold">
                        4
                      </div>
                      <div>
                        <span className="font-bold text-muted-foreground block text-[11px]">4. Calibrated</span>
                        <span className="text-[10px] text-muted-foreground font-mono">Pending</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-primary shrink-0" />
                      <span className="text-muted-foreground">
                        Assigned: <strong className="text-foreground">{tkt.engineer}</strong> ({tkt.vanNumber})
                      </span>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open("tel:+923005551101")}
                        className="h-7 text-xs gap-1 cursor-pointer"
                      >
                        <PhoneCall className="h-3 w-3" />
                        <span>Call Splicer</span>
                      </Button>

                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          window.location.href = "/portal/chat";
                        }}
                        className="h-7 text-xs gap-1 cursor-pointer"
                      >
                        <MessageSquare className="h-3 w-3" />
                        <span>Chat with CSR</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* 4. Resolved Tickets in Modern Table Format */}
      {(activeFilter === "all" || activeFilter === "resolved") && (
        <Card className="bg-card border-border shadow-xs">
          <CardHeader className="p-4 border-b border-border bg-card-subtle/50 flex flex-row items-center justify-between flex-wrap gap-2">
            <div>
              <CardTitle className="text-sm font-heading font-bold">
                Resolved Tickets & Calibration Records
              </CardTitle>
              <CardDescription className="text-xs">
                History of completed trouble complaints, field engineer notes, and optical signal restoration.
              </CardDescription>
            </div>

            <Badge variant="success" className="text-xs font-mono">
              {resolvedTickets.length} Resolved
            </Badge>
          </CardHeader>

          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticket #</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Lodged Date</TableHead>
                  <TableHead>Resolved Date</TableHead>
                  <TableHead>Assigned Engineer & Van</TableHead>
                  <TableHead>Resolution Summary</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {resolvedTickets.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="font-mono font-bold text-foreground">
                      {t.ticketNo}
                    </TableCell>
                    <TableCell className="font-medium text-xs">
                      {t.category}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {t.lodgedAt}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {t.resolvedAt}
                    </TableCell>
                    <TableCell className="text-xs text-foreground font-medium">
                      {t.engineer} ({t.vanNumber})
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-sm">
                      <div className="space-y-0.5">
                        <p>{t.resolutionNote}</p>
                        {t.opticalRxDbm && (
                          <span className="font-mono text-[10px] text-success font-bold block">
                            Calibrated Rx: {t.opticalRxDbm} dBm (Nominal)
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="success" className="text-[10px] py-0 px-1.5 font-mono">
                        RESOLVED
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
