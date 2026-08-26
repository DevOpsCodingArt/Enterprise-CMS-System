'use client';

import React from 'react';
import Link from 'next/link';
import {
  Wifi,
  Activity,
  Receipt,
  LifeBuoy,
  MessageSquare,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Clock,
  HardDrive,
  Download,
  Upload,
  UserCheck,
  AlertCircle,
} from 'lucide-react';
import { useCustomerPortalStore } from '@/stores/customer-portal-store';
import { OpticalPowerGauge } from '@/components/customer/OpticalPowerGauge';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatCurrencyPKR } from '@/lib/utils';

export default function CustomerDashboardPage() {
  const {
    customer,
    opticalRxDbm,
    opticalTxDbm,
    opticalStatus,
    pppoeStatus,
    sessionUptime,
    usageGb,
    usageLimitGb,
    tickets,
    setPaymentModalOpen,
    setComplaintModalOpen,
  } = useCustomerPortalStore();

  const isOnline = pppoeStatus === 'online';

  const activeTicket = tickets.find(
    (t) => t.status === 'open' || t.status === 'assigned' || t.status === 'in_progress'
  );

  return (
    <div className="space-y-6">
      {/* Top Welcome & Service Banner */}
      <div className="bg-gradient-to-r from-primary/15 via-primary/5 to-card rounded-2xl border border-primary/20 p-6 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant={isOnline ? 'primary' : 'destructive'} size="xs">
                {isOnline ? 'Broadband Online' : 'Optical Link Offline'}
              </Badge>
              <span className="text-xs text-muted-foreground font-mono">
                {customer.customerCode}
              </span>
            </div>
            <h1 className="font-heading font-bold text-2xl tracking-tight text-foreground mt-1.5">
              Welcome back, {customer.fullName}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {customer.address} · {customer.branch?.name}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              variant="primary"
              size="sm"
              onClick={() => setPaymentModalOpen(true)}
              leftIcon={<Receipt className="w-3.5 h-3.5" />}
            >
              Pay Bill / Upload Slip
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setComplaintModalOpen(true)}
              leftIcon={<LifeBuoy className="w-3.5 h-3.5 text-primary" />}
            >
              Report Issue
            </Button>
            <Link href="/chat">
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<MessageSquare className="w-3.5 h-3.5 text-primary" />}
              >
                Live Chat
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Active Ticket Alert (If in progress) */}
      {activeTicket && (
        <div className="bg-warning/10 border border-warning/30 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-warning text-primary-foreground flex-shrink-0 mt-0.5">
              <LifeBuoy className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-semibold text-xs text-foreground">
                  Active Trouble Ticket #{activeTicket.ticketNumber}
                </span>
                <Badge variant="warning" size="xs">
                  {activeTicket.status.toUpperCase()}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {activeTicket.title} —{' '}
                <span className="font-semibold text-foreground">
                  {activeTicket.assignedTechnician?.name || 'Assigned to NOC'}
                </span>{' '}
                ({activeTicket.assignedTechnician?.distanceEta || 'En Route'})
              </p>
            </div>
          </div>

          <Link href="/tickets">
            <Button variant="outline" size="xs" rightIcon={<ArrowUpRight className="w-3 h-3" />}>
              Track Live ETA
            </Button>
          </Link>
        </div>
      )}

      {/* 4 Primary Telemetry & Bento Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Active Subscription */}
        <div className="bg-card rounded-xl border border-border p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Wifi className="w-4 h-4" />
            </div>
            <Badge variant="primary" size="xs">
              Active Plan
            </Badge>
          </div>

          <div>
            <div className="font-heading font-bold text-xl text-foreground">
              {customer.packageSpeed}
            </div>
            <div className="text-xs text-muted-foreground font-medium mt-0.5 truncate">
              {customer.packageName}
            </div>
          </div>

          <div className="pt-2 border-t border-border/70 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Monthly Fee:</span>
            <span className="font-mono font-bold text-foreground">
              {formatCurrencyPKR(Number(customer.monthlyBilling))}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Billing Expiry:</span>
            <span className="font-mono text-success font-semibold">
              {customer.billingExpiryDate || '05 Sep 2026'}
            </span>
          </div>
        </div>

        {/* Card 2: PPPoE Session Status */}
        <div className="bg-card rounded-xl border border-border p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-lg bg-info/10 text-info-foreground dark:text-info">
              <Zap className="w-4 h-4" />
            </div>
            <Badge variant={isOnline ? 'primary' : 'destructive'} size="xs">
              {isOnline ? 'Online' : 'Disconnected'}
            </Badge>
          </div>

          <div>
            <div className="font-heading font-bold text-xl text-foreground">
              {customer.username || 'ali.fiber50'}
            </div>
            <div className="text-xs text-muted-foreground font-mono mt-0.5">
              IP: {customer.currentIp || '192.168.10.45'}
            </div>
          </div>

          <div className="pt-2 border-t border-border/70 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Session Uptime:</span>
            <span className="font-mono text-foreground font-medium">
              {sessionUptime}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">MAC Address:</span>
            <span className="font-mono text-muted-foreground text-xs">
              {customer.macAddress || 'BC:A9:93:4F:11:A2'}
            </span>
          </div>
        </div>

        {/* Card 3: Monthly Usage & Bandwidth */}
        <div className="bg-card rounded-xl border border-border p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <HardDrive className="w-4 h-4" />
            </div>
            <span className="text-xs text-muted-foreground font-mono">Aug 2026</span>
          </div>

          <div>
            <div className="font-heading font-bold text-xl text-foreground">
              {usageGb} GB
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              Consumed / <span className="font-semibold text-foreground">{usageLimitGb}</span>
            </div>
          </div>

          <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
            <div className="bg-primary h-full w-5/12" />
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
            <div className="flex items-center gap-1">
              <Download className="w-3 h-3 text-success" />
              <span>49.8 Mbps</span>
            </div>
            <div className="flex items-center gap-1">
              <Upload className="w-3 h-3 text-primary" />
              <span>48.9 Mbps</span>
            </div>
          </div>
        </div>

        {/* Card 4: Quick Action Launchpad */}
        <div className="bg-card rounded-xl border border-border p-4 shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-heading font-semibold text-xs uppercase text-muted-foreground tracking-wider">
              Quick Shortcuts
            </span>
            <ShieldCheck className="w-4 h-4 text-success" />
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => setPaymentModalOpen(true)}
              className="p-2.5 rounded-lg border border-border bg-card hover:bg-muted/40 hover:border-primary/50 text-left transition-colors"
            >
              <Receipt className="w-4 h-4 text-primary mb-1" />
              <div className="font-semibold text-foreground">Pay Bill</div>
              <div className="text-xs text-muted-foreground">Upload Slip</div>
            </button>

            <Link
              href="/chat"
              className="p-2.5 rounded-lg border border-border bg-card hover:bg-muted/40 hover:border-primary/50 text-left transition-colors"
            >
              <MessageSquare className="w-4 h-4 text-primary mb-1" />
              <div className="font-semibold text-foreground">CSR Chat</div>
              <div className="text-xs text-muted-foreground">2-Way Live</div>
            </Link>

            <button
              onClick={() => setComplaintModalOpen(true)}
              className="p-2.5 rounded-lg border border-border bg-card hover:bg-muted/40 hover:border-primary/50 text-left transition-colors"
            >
              <LifeBuoy className="w-4 h-4 text-primary mb-1" />
              <div className="font-semibold text-foreground">Diagnose</div>
              <div className="text-xs text-muted-foreground">Self-Help</div>
            </button>

            <Link
              href="/profile"
              className="p-2.5 rounded-lg border border-border bg-card hover:bg-muted/40 hover:border-primary/50 text-left transition-colors"
            >
              <UserCheck className="w-4 h-4 text-primary mb-1" />
              <div className="font-semibold text-foreground">Account</div>
              <div className="text-xs text-muted-foreground">Hardware QR</div>
            </Link>
          </div>
        </div>
      </div>

      {/* Optical Power Signal Meter (Full Width) */}
      <OpticalPowerGauge
        rxDbm={opticalRxDbm}
        txDbm={opticalTxDbm}
        oltPonPort={customer.oltPonPort}
      />
    </div>
  );
}
