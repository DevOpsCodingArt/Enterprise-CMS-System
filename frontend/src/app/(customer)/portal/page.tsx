"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Wifi,
  Activity,
  ArrowDown,
  ArrowUp,
  CreditCard,
  MessageSquare,
  Ticket,
  Clock,
  CheckCircle2,
  HardDrive,
  Calendar,
  Zap,
  ArrowRight,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import { TicketProgressTracker } from "@/components/customer/TicketProgressTracker";
import { PaymentModal } from "@/components/customer/PaymentModal";
import { mockDb } from "@/mock/db";

export default function CustomerPortalPage() {
  const toast = useToast();
  const [isComplaintModalOpen, setIsComplaintModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [complaintCategory, setComplaintCategory] = useState("Optical / No Internet");
  const [complaintDesc, setComplaintDesc] = useState("");

  const activeTicket = mockDb.tickets[0]; // Active complaint #TK-8842

  const handleLodgeComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(
      "Complaint Lodged",
      "Ticket #TK-8902 registered. Assigned to Islamabad HQ Field Team."
    );
    setIsComplaintModalOpen(false);
    setComplaintDesc("");
  };

  return (
    <div className="space-y-5">
      {/* 1. Subscriber Profile & Live Connection Status Hero */}
      <Card className="bg-card border-border shadow-xs overflow-hidden">
        <div className="p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
          {/* Subscriber Identity */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar name="Ahmed Malik" size="lg" />
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-success ring-2 ring-card" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="font-heading font-extrabold text-lg text-foreground tracking-tight">
                  Ahmed Malik
                </h1>
                <Badge variant="success" className="font-mono text-[9px]">
                  FIBER ONLINE
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground font-mono">
                <span>Account: <strong className="text-foreground">CUS-99482</strong></span>
                <span>•</span>
                <span>PPPoE: <strong className="text-foreground">ahmed_malik_isb</strong></span>
                <span>•</span>
                <span>Branch: <strong className="text-foreground">Islamabad HQ</strong></span>
              </div>
            </div>
          </div>

          {/* Active Package & Bill Badge */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <div className="rounded-xl border border-border bg-card-subtle p-3 flex-1 lg:flex-initial">
              <span className="text-[10px] font-mono uppercase text-muted-foreground block">
                Subscribed Plan
              </span>
              <span className="font-heading font-bold text-sm text-foreground">
                Fiber Pro 50 Mbps
              </span>
            </div>

            <div className="rounded-xl border border-border bg-card-subtle p-3 flex-1 lg:flex-initial">
              <span className="text-[10px] font-mono uppercase text-muted-foreground block">
                Billing Due
              </span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-sm text-foreground">
                  PKR 3,500
                </span>
                <Badge variant="warning" className="text-[9px] py-0 px-1 font-mono">
                  DUE AUG 30
                </Badge>
              </div>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsPaymentModalOpen(true)}
              className="gap-1.5 font-bold shadow-xs shrink-0"
            >
              <CreditCard className="h-4 w-4" />
              <span>Pay Bill</span>
            </Button>
          </div>
        </div>
      </Card>

      {/* 2. Bandwidth & Quota Usage Dashboard (30-Day & Last 24 Hours) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 30-Day Total Usage Box */}
        <Card className="p-5 bg-card border-border shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HardDrive className="h-4 w-4 text-primary" />
                <span className="font-heading font-bold text-sm text-foreground">
                  30-Day Data Consumption
                </span>
              </div>
              <Badge variant="secondary" className="font-mono text-[10px]">
                BILLING CYCLE
              </Badge>
            </div>

            <div className="mt-3 flex items-baseline justify-between">
              <div>
                <span className="font-heading font-extrabold text-3xl text-foreground">
                  684.2
                </span>
                <span className="font-mono text-xs text-muted-foreground ml-1 font-bold">
                  GB Used
                </span>
              </div>
              <span className="text-xs text-success font-mono font-bold">
                Unlimited Quota Plan
              </span>
            </div>

            {/* Visual Usage Progress Bar */}
            <div className="mt-3 space-y-1.5">
              <div className="h-2.5 w-full rounded-full bg-card-subtle overflow-hidden border border-border flex">
                <div className="h-full bg-primary rounded-l-full" style={{ width: "89%" }} />
                <div className="h-full bg-info rounded-r-full" style={{ width: "11%" }} />
              </div>
              <div className="flex justify-between text-[11px] font-mono text-muted-foreground">
                <span className="flex items-center gap-1">
                  <ArrowDown className="h-3 w-3 text-primary" /> Download: <strong>612.4 GB</strong>
                </span>
                <span className="flex items-center gap-1">
                  <ArrowUp className="h-3 w-3 text-info" /> Upload: <strong>71.8 GB</strong>
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-border-subtle flex items-center justify-between text-xs text-muted-foreground font-mono">
            <span>Daily Average: <strong className="text-foreground">22.8 GB / Day</strong></span>
            <span>Period: <strong className="text-foreground">Aug 01 - Aug 26</strong></span>
          </div>
        </Card>

        {/* Last 24 Hours Usage Box */}
        <Card className="p-5 bg-card border-border shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-info" />
                <span className="font-heading font-bold text-sm text-foreground">
                  Last 24 Hours Usage
                </span>
              </div>
              <Badge variant="success" className="font-mono text-[10px]">
                LIVE SESSION
              </Badge>
            </div>

            <div className="mt-3 flex items-baseline justify-between">
              <div>
                <span className="font-heading font-extrabold text-3xl text-foreground">
                  28.4
                </span>
                <span className="font-mono text-xs text-muted-foreground ml-1 font-bold">
                  GB (24h)
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-muted-foreground block">
                  Current Active Throughput
                </span>
                <span className="font-heading font-bold text-sm text-primary font-mono">
                  14.2 Mbps
                </span>
              </div>
            </div>

            {/* 24h Metrics Grid */}
            <div className="grid grid-cols-2 gap-2 mt-3">
              <div className="rounded-lg border border-border bg-card-subtle p-2.5">
                <span className="text-[10px] font-mono text-muted-foreground block">
                  Peak Speed Measured
                </span>
                <span className="font-mono font-bold text-xs text-foreground">
                  49.8 Mbps (100% SLA)
                </span>
              </div>

              <div className="rounded-lg border border-border bg-card-subtle p-2.5">
                <span className="text-[10px] font-mono text-muted-foreground block">
                  Optical Line Rx Power
                </span>
                <span className="font-mono font-bold text-xs text-destructive">
                  -27.4 dBm (High Drop)
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-border-subtle flex items-center justify-between text-xs text-muted-foreground font-mono">
            <span>Session Uptime: <strong className="text-foreground">4 Days 12h</strong></span>
            <span>Packet Loss: <strong className="text-success">0.0%</strong></span>
          </div>
        </Card>
      </div>

      {/* 3. In-Progress Complaint Stepper (if active ticket) */}
      {activeTicket && (
        <TicketProgressTracker
          ticket={activeTicket}
          onOpenChat={() => {
            window.location.href = "/portal/chat";
          }}
        />
      )}

      {/* 4. Quick Action Shortcuts Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link
          href="/portal/chat"
          className="flex flex-col items-center justify-center p-4 rounded-xl border border-border bg-card hover:bg-card-subtle hover:border-primary/40 transition-all text-center group shadow-2xs cursor-pointer"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary mb-2 group-hover:scale-110 transition-transform">
            <MessageSquare className="h-5 w-5" />
          </div>
          <span className="font-heading font-bold text-xs text-foreground">
            Live Support
          </span>
          <span className="text-[10px] text-muted-foreground font-mono mt-0.5">
            24/7 CSR Chat
          </span>
        </Link>

        <button
          type="button"
          onClick={() => setIsPaymentModalOpen(true)}
          className="flex flex-col items-center justify-center p-4 rounded-xl border border-border bg-card hover:bg-card-subtle hover:border-primary/40 transition-all text-center group shadow-2xs cursor-pointer"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10 text-success mb-2 group-hover:scale-110 transition-transform">
            <CreditCard className="h-5 w-5" />
          </div>
          <span className="font-heading font-bold text-xs text-foreground">
            Pay Bill Online
          </span>
          <span className="text-[10px] text-muted-foreground font-mono mt-0.5">
            JazzCash / Raast
          </span>
        </button>

        <Link
          href="/portal/diagnostics"
          className="flex flex-col items-center justify-center p-4 rounded-xl border border-border bg-card hover:bg-card-subtle hover:border-primary/40 transition-all text-center group shadow-2xs cursor-pointer"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-info/10 text-info mb-2 group-hover:scale-110 transition-transform">
            <Activity className="h-5 w-5" />
          </div>
          <span className="font-heading font-bold text-xs text-foreground">
            Line Diagnostics
          </span>
          <span className="text-[10px] text-muted-foreground font-mono mt-0.5">
            Speed & Optical Test
          </span>
        </Link>

        <button
          type="button"
          onClick={() => setIsComplaintModalOpen(true)}
          className="flex flex-col items-center justify-center p-4 rounded-xl border border-border bg-card hover:bg-card-subtle hover:border-destructive/40 transition-all text-center group shadow-2xs cursor-pointer"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10 text-destructive mb-2 group-hover:scale-110 transition-transform">
            <Ticket className="h-5 w-5" />
          </div>
          <span className="font-heading font-bold text-xs text-foreground">
            Lodge Complaint
          </span>
          <span className="text-[10px] text-muted-foreground font-mono mt-0.5">
            Trouble Ticket
          </span>
        </button>
      </div>

      {/* Complaint Modal Dialog */}
      <Dialog
        isOpen={isComplaintModalOpen}
        onClose={() => setIsComplaintModalOpen(false)}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Ticket className="h-5 w-5 text-primary" />
            <span>Lodge Trouble Complaint</span>
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleLodgeComplaint}>
          <DialogContent className="space-y-4">
            <div className="rounded-lg border border-border bg-card-subtle p-3 text-xs space-y-1">
              <span className="font-mono text-muted-foreground text-[10px] uppercase block">
                Auto-Detected Line Telemetry
              </span>
              <p className="font-bold text-foreground">
                GPON 0/2/4 • ONU HWTC884291A • Optical Rx: -27.4 dBm (High Attenuation)
              </p>
            </div>

            <Input
              label="Complaint Category"
              value={complaintCategory}
              onChange={(e) => setComplaintCategory(e.target.value)}
              placeholder="e.g. Optical Power / Speed Drop / Billing"
              required
            />

            <Textarea
              label="Describe What Happened"
              placeholder="Please explain the issue you are experiencing..."
              value={complaintDesc}
              onChange={(e) => setComplaintDesc(e.target.value)}
              required
            />
          </DialogContent>

          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              onClick={() => setIsComplaintModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Submit Trouble Ticket
            </Button>
          </DialogFooter>
        </form>
      </Dialog>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        invoiceNo="INV-2026-08-99482"
        amount={3500}
      />
    </div>
  );
}
