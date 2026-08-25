'use client';

import React from 'react';
import {
  LifeBuoy,
  Plus,
  Clock,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Phone,
  Truck,
  Wrench,
  Activity,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useCustomerPortalStore } from '@/stores/customer-portal-store';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/components/ui/Toast';

export function CustomerTicketsPage() {
  const {
    tickets,
    setComplaintModalOpen,
    simulateRestoreLink,
  } = useCustomerPortalStore();

  const { showToast } = useToast();

  const activeTicket = tickets.find((t) => t.status !== 'closed' && t.status !== 'resolved');

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <LifeBuoy className="w-5 h-5" />
            </div>
            <h1 className="font-heading font-bold text-2xl tracking-tight text-foreground">
              Trouble Tickets & Field Dispatch
            </h1>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Track real-time resolution ETA, fiber technician dispatch, and complaint audit log.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setComplaintModalOpen(true)}
          leftIcon={<Plus className="w-3.5 h-3.5" />}
        >
          Lodge New Complaint
        </Button>
      </div>

      {/* Live Ticket Progress Tracker (Hero Card if active) */}
      {activeTicket && (
        <div className="bg-card rounded-2xl border border-primary/30 p-6 shadow-xs space-y-6 relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-border">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="destructive" size="xs">
                  {activeTicket.priority.toUpperCase()} PRIORITY
                </Badge>
                <span className="font-mono font-bold text-xs text-foreground">
                  {activeTicket.ticketNumber}
                </span>
              </div>
              <h2 className="font-heading font-bold text-lg text-foreground">
                {activeTicket.title}
              </h2>
              <p className="text-xs text-muted-foreground">{activeTicket.description}</p>
            </div>

            <div className="text-left md:text-right">
              <div className="text-[11px] text-muted-foreground">Estimated Time to Resolve:</div>
              <div className="font-mono font-bold text-xl text-primary">
                {activeTicket.ettr}
              </div>
            </div>
          </div>

          {/* Assigned Technician Profile Box */}
          {activeTicket.assignedTechnician && (
            <div className="p-4 bg-muted/40 rounded-xl border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-heading font-semibold text-xs text-foreground flex items-center gap-2">
                    {activeTicket.assignedTechnician.name}
                    <Badge variant="primary" size="xs">
                      {activeTicket.assignedTechnician.vanCode}
                    </Badge>
                  </div>
                  <div className="text-[11px] text-muted-foreground flex items-center gap-2 mt-0.5">
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                      <MapPin className="w-3 h-3" />
                      {activeTicket.assignedTechnician.distanceEta}
                    </span>
                    <span>·</span>
                    <span className="font-mono">{activeTicket.assignedTechnician.phone}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => simulateRestoreLink()}
                  className="text-emerald-600 hover:text-emerald-700"
                >
                  Simulate Field Resolution ✓
                </Button>
              </div>
            </div>
          )}

          {/* 4-Step Resolution Progress Stepper */}
          <div className="space-y-2">
            <div className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider">
              Field Operations Workflow Stage:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>1. SmartOLT Fault Logged</span>
              </div>
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>2. NOC Dispatched Van 04</span>
              </div>
              <div className="p-3 rounded-lg bg-primary/15 border border-primary text-primary font-semibold flex items-center gap-2 shadow-xs ring-1 ring-primary">
                <Activity className="w-4 h-4 flex-shrink-0 animate-spin" />
                <span>3. Technician En Route</span>
              </div>
              <div className="p-3 rounded-lg bg-muted/40 border border-border text-muted-foreground flex items-center gap-2 opacity-60">
                <Clock className="w-4 h-4 flex-shrink-0" />
                <span>4. OTDR Joint Splicing</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Historical Tickets List */}
      <div className="bg-card rounded-2xl border border-border shadow-xs overflow-hidden">
        <div className="p-4 border-b border-border bg-card flex items-center justify-between">
          <div className="font-heading font-semibold text-sm text-foreground">
            Past Service Requests & Inquiries
          </div>
          <span className="text-xs text-muted-foreground font-mono">
            {tickets.length} Complaints Logged
          </span>
        </div>

        <div className="divide-y divide-border/70">
          {tickets.map((t) => (
            <div
              key={t.id}
              className="p-4 sm:p-5 hover:bg-muted/20 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs text-foreground">
                    {t.ticketNumber}
                  </span>
                  <Badge
                    variant={
                      t.status === 'closed' || t.status === 'resolved'
                        ? 'primary'
                        : 'destructive'
                    }
                    size="xs"
                  >
                    {t.status.toUpperCase()}
                  </Badge>
                  <span className="text-[11px] text-muted-foreground font-mono">
                    {new Date(t.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="font-heading font-semibold text-sm text-foreground">
                  {t.title}
                </div>
                <p className="text-xs text-muted-foreground">{t.description}</p>
                {t.resolutionNotes && (
                  <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-md text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                    ✓ Resolution: {t.resolutionNotes}
                  </div>
                )}
              </div>

              <div className="text-left sm:text-right flex-shrink-0 space-y-1">
                <div className="text-[11px] text-muted-foreground font-mono">{t.ettr}</div>
                {t.assignedTechnician && (
                  <div className="text-xs font-medium text-foreground">
                    {t.assignedTechnician.name}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CustomerTicketsPage;
