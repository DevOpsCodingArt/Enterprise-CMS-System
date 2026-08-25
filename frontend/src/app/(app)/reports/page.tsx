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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h1 className="font-heading font-bold text-2xl tracking-tight text-foreground">
              Operational Analytics & CSAT Audit
            </h1>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Real-time resolution metrics, first response time (FRT), and customer satisfaction ratings.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => alert('Exporting monthly performance audit PDF...')}
          leftIcon={<Download className="w-3.5 h-3.5" />}
        >
          Export Audit PDF
        </Button>
      </div>

      {/* 4 Analytics KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
        <div className="bg-card rounded-xl border border-border p-4 shadow-xs">
          <div className="text-[11px] text-muted-foreground font-medium">Total Chats (This Month)</div>
          <div className="font-mono font-bold text-2xl mt-1 text-primary">{reports.totalChatsMonth.toLocaleString()}</div>
          <div className="text-[11px] text-muted-foreground mt-0.5">+14% vs last month</div>
        </div>

        <div className="bg-card rounded-xl border border-border p-4 shadow-xs">
          <div className="text-[11px] text-muted-foreground font-medium">First Response Time (FRT)</div>
          <div className="font-mono font-bold text-2xl mt-1 text-info-foreground dark:text-info">{reports.frtSeconds} Seconds</div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5 font-medium">Target: &lt; 60s ✓</div>
        </div>

        <div className="bg-card rounded-xl border border-border p-4 shadow-xs">
          <div className="text-[11px] text-muted-foreground font-medium">Mean Time to Resolve (MTTR)</div>
          <div className="font-mono font-bold text-2xl mt-1 text-foreground">{reports.mttrMinutes} Mins</div>
          <div className="text-[11px] text-muted-foreground mt-0.5">80% 1st-level resolution</div>
        </div>

        <div className="bg-card rounded-xl border border-border p-4 shadow-xs">
          <div className="text-[11px] text-muted-foreground font-medium">CSAT Rating Average</div>
          <div className="font-mono font-bold text-2xl mt-1 text-amber-600 dark:text-amber-400">{reports.csatRating} / 5.0</div>
          <div className="text-[11px] text-amber-600 dark:text-amber-400 mt-0.5 font-medium">★★★★★ ({reports.positivePercentage}% positive)</div>
        </div>
      </div>

      {/* CSAT Distribution & Volume Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border border-border p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border/70">
            <h3 className="font-heading font-semibold text-sm text-foreground">
              Customer Satisfaction (CSAT) Breakdown
            </h3>
            <Badge variant="primary" size="xs">
              98% Satisfaction
            </Badge>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">5 Stars (Excellent)</span>
                <span className="font-mono font-medium text-foreground">88.4% (3,396 votes)</span>
              </div>
              <div className="w-full bg-muted/40 rounded-full border border-border/70 h-2.5 overflow-hidden">
                <div className="bg-primary rounded-full h-full w-[88%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">4 Stars (Good)</span>
                <span className="font-mono font-medium text-foreground">9.6% (368 votes)</span>
              </div>
              <div className="w-full bg-muted/40 rounded-full border border-border/70 h-2.5 overflow-hidden">
                <div className="bg-info rounded-full h-full w-[10%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">3 Stars (Average)</span>
                <span className="font-mono font-medium text-foreground">1.5% (58 votes)</span>
              </div>
              <div className="w-full bg-muted/40 rounded-full border border-border/70 h-2.5 overflow-hidden">
                <div className="bg-warning rounded-full h-full w-[1.5%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">1-2 Stars (Poor / Critical)</span>
                <span className="font-mono font-medium text-foreground">0.5% (19 votes)</span>
              </div>
              <div className="w-full bg-muted/40 rounded-full border border-border/70 h-2.5 overflow-hidden">
                <div className="bg-destructive rounded-full h-full w-[0.5%]" />
              </div>
            </div>
          </div>
        </div>

        {/* Volume by Hour / Shift */}
        <div className="bg-card rounded-xl border border-border p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border/70">
            <h3 className="font-heading font-semibold text-sm text-foreground">
              Peak Traffic & Shift Volume
            </h3>
            <Badge variant="outline" size="xs">
              24/7 Rotational
            </Badge>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-lg bg-muted/30 border border-border/70 flex justify-between items-center">
              <div>
                <div className="font-medium text-foreground">Morning Shift (08:00 - 16:00)</div>
                <div className="text-[11px] text-muted-foreground">Fiber cuts & morning billing enquiries</div>
              </div>
              <div className="font-mono font-semibold text-primary">1,420 Chats (37%)</div>
            </div>

            <div className="p-3 rounded-lg bg-muted/30 border border-border/70 flex justify-between items-center">
              <div>
                <div className="font-medium text-foreground">Evening Prime Shift (16:00 - 00:00)</div>
                <div className="text-[11px] text-muted-foreground">Streaming buffer, gaming latency & speed tests</div>
              </div>
              <div className="font-mono font-semibold text-warning-foreground dark:text-warning">1,980 Chats (52%)</div>
            </div>

            <div className="p-3 rounded-lg bg-muted/30 border border-border/70 flex justify-between items-center">
              <div>
                <div className="font-medium text-foreground">Night Shift (00:00 - 08:00)</div>
                <div className="text-[11px] text-muted-foreground">Core NOC maintenance & autonomous bot triage</div>
              </div>
              <div className="font-mono font-semibold text-info-foreground dark:text-info">441 Chats (11%)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
