"use client";

import React from "react";
import {
  CheckCircle2,
  Clock,
  Truck,
  Wrench,
  AlertTriangle,
  Radio,
  PhoneCall,
  User,
  ShieldCheck,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TroubleTicket } from "@/mock/db";

export interface TicketProgressTrackerProps {
  ticket: TroubleTicket;
  onOpenChat?: () => void;
}

export function TicketProgressTracker({
  ticket,
  onOpenChat,
}: TicketProgressTrackerProps) {
  // Compute active step based on status
  const steps = [
    {
      id: 1,
      title: "Complaint Lodged",
      desc: "Auto-diagnostic detected optical drop.",
      time: "01:30 PM",
      status: "completed",
    },
    {
      id: 2,
      title: "Assigned to Branch NOC",
      desc: "Islamabad HQ Field Dispatch Queue.",
      time: "01:35 PM",
      status: "completed",
    },
    {
      id: 3,
      title: "Field Splicer En Route",
      desc: "Technician Usman Ali (Van #04).",
      time: "01:45 PM",
      status: "active",
    },
    {
      id: 4,
      title: "Signal Calibration",
      desc: "Target attenuation: < -20 dBm nominal.",
      time: "ETTR: ~2.5 hrs",
      status: "pending",
    },
  ];

  return (
    <Card className="bg-card border-border shadow-xs overflow-hidden">
      <CardHeader className="p-4 border-b border-border bg-card-subtle/50 flex flex-row items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-warning/10 text-warning font-mono font-bold text-xs">
            TK
          </div>
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-sm font-heading font-bold">
                Ticket #{ticket.ticketNo}
              </CardTitle>
              <Badge variant="warning" hasPulse className="font-mono text-[10px]">
                {ticket.status.toUpperCase()}
              </Badge>
            </div>
            <CardDescription className="text-xs">
              Category: <strong>{ticket.category}</strong> • Priority: <strong>{ticket.priority}</strong>
            </CardDescription>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right hidden sm:block">
            <span className="text-[10px] font-mono text-muted-foreground uppercase block">
              Estimated Resolution (ETTR)
            </span>
            <span className="font-mono font-bold text-foreground text-xs">
              3.5 Hours Remaining
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5 space-y-6">
        {/* Visual 4-Step Stepper */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {steps.map((step, idx) => (
              <div key={step.id} className="relative flex flex-col space-y-1.5">
                <div className="flex items-center gap-2">
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold font-mono transition-colors shrink-0 ${
                      step.status === "completed"
                        ? "bg-success text-success-foreground"
                        : step.status === "active"
                        ? "bg-primary text-primary-foreground animate-pulse ring-4 ring-primary/20"
                        : "bg-card-subtle border border-border text-muted-foreground"
                    }`}
                  >
                    {step.status === "completed" ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <span className="font-heading font-bold text-xs text-foreground">
                    {step.title}
                  </span>
                </div>

                <div className="pl-9 space-y-0.5">
                  <p className="text-[11px] text-muted-foreground leading-tight">
                    {step.desc}
                  </p>
                  <span className="text-[10px] font-mono text-primary/80 block font-semibold">
                    {step.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Assigned Technician & Van Dispatch Info Card */}
        <div className="rounded-xl border border-border bg-card-subtle p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-card border border-border text-primary shrink-0 shadow-xs">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-foreground">Usman Ali</span>
                <Badge variant="secondary" className="font-mono text-[9px]">
                  VAN #04 SPLICER
                </Badge>
              </div>
              <span className="text-[11px] text-muted-foreground block mt-0.5">
                Islamabad Blue Area (HQ) Field Operations Team
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs flex-1 sm:flex-initial"
              onClick={() => window.open("tel:+923005551101")}
            >
              <PhoneCall className="h-3.5 w-3.5" />
              <span>Call Technician</span>
            </Button>

            {onOpenChat && (
              <Button
                variant="primary"
                size="sm"
                className="gap-1.5 text-xs flex-1 sm:flex-initial"
                onClick={onOpenChat}
              >
                <span>Chat with NOC</span>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
