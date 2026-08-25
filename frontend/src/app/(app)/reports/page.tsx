'use client';

import React from 'react';
import { BarChart3, TrendingUp, Clock, Star, MessageSquare, CheckCircle2, Download } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { mockDb, MockOperationalReports } from '@/mock-db';

export default function ReportsPage() {
  const reports: MockOperationalReports = mockDb.getOperationalReports();

  return (
    <div className="p-6 max-w-7xl mx-auto w-full space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-border">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            <h1 className="font-heading font-black text-2xl tracking-tight uppercase">
              OPERATIONAL ANALYTICS & CSAT AUDIT
            </h1>
          </div>
          <p className="text-xs font-mono text-muted-foreground mt-1">
            Real-time resolution metrics, first response time (FRT), and customer satisfaction ratings.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => alert('Exporting monthly performance audit PDF...')}
          leftIcon={<Download className="w-3.5 h-3.5" />}
        >
          EXPORT AUDIT PDF
        </Button>
      </div>

      {/* 4 Analytics KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-xs">
        <div className="bg-card border-2 border-border p-4 shadow-sm">
          <div className="text-[10px] text-muted-foreground uppercase">TOTAL CHATS (THIS MONTH)</div>
          <div className="font-heading font-black text-3xl mt-1 text-primary">{reports.totalChatsMonth.toLocaleString()}</div>
          <div className="text-[10px] text-muted-foreground mt-0.5">+14% vs last month</div>
        </div>

        <div className="bg-card border-2 border-border p-4 shadow-sm">
          <div className="text-[10px] text-muted-foreground uppercase">FIRST RESPONSE TIME (FRT)</div>
          <div className="font-heading font-black text-3xl mt-1 text-info">{reports.frtSeconds} SECONDS</div>
          <div className="text-[10px] text-primary mt-0.5 font-bold">Target: &lt; 60s ✓</div>
        </div>

        <div className="bg-card border-2 border-border p-4 shadow-sm">
          <div className="text-[10px] text-muted-foreground uppercase">MEAN TIME TO RESOLVE (MTTR)</div>
          <div className="font-heading font-black text-3xl mt-1 text-foreground">{reports.mttrMinutes} MINS</div>
          <div className="text-[10px] text-muted-foreground mt-0.5">80% 1st-level resolution</div>
        </div>

        <div className="bg-card border-2 border-border p-4 shadow-sm">
          <div className="text-[10px] text-muted-foreground uppercase">CSAT RATING AVERAGE</div>
          <div className="font-heading font-black text-3xl mt-1 text-warning">{reports.csatRating} / 5.0</div>
          <div className="text-[10px] text-warning mt-0.5 font-bold">★★★★★ ({reports.positivePercentage}% POSITIVE)</div>
        </div>
      </div>

      {/* CSAT Distribution & Volume Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card border-2 border-border p-5 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b-2 border-border">
            <h3 className="font-heading font-black text-sm uppercase">
              CUSTOMER SATISFACTION (CSAT) BREAKDOWN
            </h3>
            <Badge variant="primary" size="xs">
              98% SATISFACTION
            </Badge>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span>5 Stars (Excellent)</span>
                <span className="font-bold">88.4% (3,396 votes)</span>
              </div>
              <div className="w-full bg-card-subtle border border-border h-3 overflow-hidden">
                <div className="bg-primary h-full w-[88%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span>4 Stars (Good)</span>
                <span className="font-bold">9.6% (368 votes)</span>
              </div>
              <div className="w-full bg-card-subtle border border-border h-3 overflow-hidden">
                <div className="bg-info h-full w-[10%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span>3 Stars (Average)</span>
                <span className="font-bold">1.5% (58 votes)</span>
              </div>
              <div className="w-full bg-card-subtle border border-border h-3 overflow-hidden">
                <div className="bg-warning h-full w-[2%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span>1-2 Stars (Poor / Cut)</span>
                <span className="font-bold text-destructive">0.5% (20 votes)</span>
              </div>
              <div className="w-full bg-card-subtle border border-border h-3 overflow-hidden">
                <div className="bg-destructive h-full w-[1%]" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card border-2 border-border p-5 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b-2 border-border">
            <h3 className="font-heading font-black text-sm uppercase">
              TOP INTERACTION RESOLUTION OUTCOMES
            </h3>
            <Badge variant="outline" size="xs">
              AUDITED
            </Badge>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 bg-card-subtle border border-border flex justify-between items-center">
              <div>
                <div className="font-bold">1st-Level Remote Desk Resolution</div>
                <div className="text-[10px] text-muted-foreground">Reboots, password resets, Wi-Fi config</div>
              </div>
              <span className="font-heading font-black text-base text-primary">64%</span>
            </div>

            <div className="p-3 bg-card-subtle border border-border flex justify-between items-center">
              <div>
                <div className="font-bold">Payment & Recharge Slip Verification</div>
                <div className="text-[10px] text-muted-foreground">Nayapay / Bank transfer ledger posts</div>
              </div>
              <span className="font-heading font-black text-base text-info">22%</span>
            </div>

            <div className="p-3 bg-card-subtle border border-border flex justify-between items-center">
              <div>
                <div className="font-bold">Field Trouble Ticket Escalation</div>
                <div className="text-[10px] text-muted-foreground">OTDR fiber splice repair, ONU replacement</div>
              </div>
              <span className="font-heading font-black text-base text-destructive">14%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
