'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Activity,
  Building2,
  CreditCard,
  Users,
  Plus,
  ArrowUpRight,
  Zap,
  TrendingUp,
  Radio,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatCurrencyPKR } from '@/lib/utils';
import { mockDb, MockTenant } from '@/mock-db';

export default function PlatformOverviewPage() {
  const [filterPlan, setFilterPlan] = useState<string>('all');

  const tenants: MockTenant[] = mockDb.getTenants();
  const systemMetrics = mockDb.getSystemMetrics();
  const auditLogs = mockDb.getAuditLogs().slice(0, 3);

  const filteredTenants =
    filterPlan === 'all'
      ? tenants
      : tenants.filter((t) => t.plan.toLowerCase() === filterPlan.toLowerCase());

  const totalSubscribers = tenants.reduce((acc, t) => acc + t.subscribersCount, 0);
  const totalMrr = tenants.reduce((acc, t) => acc + t.mrr, 0);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Activity className="w-5 h-5" />
            </div>
            <h1 className="font-heading font-bold text-2xl tracking-tight text-foreground">
              SaaS Platform Health & Fleet Overview
            </h1>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Global multi-tenant metrics across {tenants.length} tenant telecom companies and {totalSubscribers.toLocaleString()} active subscribers.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="/companies">
            <Button variant="primary" size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />}>
              Provision New Tenant
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Super-Admin KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
        <div className="bg-card rounded-xl border border-border p-4 shadow-xs">
          <div className="text-[11px] text-muted-foreground font-medium flex items-center justify-between">
            <span>Active Tenant ISPs</span>
            <Building2 className="w-3.5 h-3.5 text-primary" />
          </div>
          <div className="font-mono font-bold text-2xl mt-1 text-primary">{tenants.length} Tenants</div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5 font-medium">100% RLS Isolation ✓</div>
        </div>

        <div className="bg-card rounded-xl border border-border p-4 shadow-xs">
          <div className="text-[11px] text-muted-foreground font-medium flex items-center justify-between">
            <span>Global Subscribers</span>
            <Users className="w-3.5 h-3.5 text-foreground" />
          </div>
          <div className="font-mono font-bold text-2xl mt-1 text-foreground">{totalSubscribers.toLocaleString()}</div>
          <div className="text-[11px] text-muted-foreground mt-0.5">Across 46 Regional Hubs</div>
        </div>

        <div className="bg-card rounded-xl border border-border p-4 shadow-xs">
          <div className="text-[11px] text-muted-foreground font-medium flex items-center justify-between">
            <span>Platform MRR</span>
            <TrendingUp className="w-3.5 h-3.5 text-info-foreground dark:text-info" />
          </div>
          <div className="font-mono font-bold text-2xl mt-1 text-info-foreground dark:text-info">{formatCurrencyPKR(totalMrr)}</div>
          <div className="text-[11px] text-muted-foreground mt-0.5">+18% this quarter</div>
        </div>

        <div className="bg-card rounded-xl border border-border p-4 shadow-xs">
          <div className="text-[11px] text-muted-foreground font-medium flex items-center justify-between">
            <span>System Uptime</span>
            <Zap className="w-3.5 h-3.5 text-warning" />
          </div>
          <div className="font-mono font-bold text-2xl mt-1 text-warning-foreground dark:text-warning">{systemMetrics.uptimePercentage}%</div>
          <div className="text-[11px] text-muted-foreground mt-0.5">
            Latency: <span className="font-mono font-medium text-foreground">{systemMetrics.apiGatewayLatencyMs}ms</span>
          </div>
        </div>
      </div>

      {/* 2-Column Grid: Tenant Fleet & SaaS Revenue Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Tenant Fleet Table */}
        <div className="lg:col-span-2 bg-card rounded-xl border border-border shadow-xs overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-4 border-b border-border/70 bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="font-heading font-semibold text-sm text-foreground">
                  Active Tenant Companies (ISPs)
                </div>
                <Badge variant="primary" size="xs">
                  {filteredTenants.length} Shown
                </Badge>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1 text-xs">
                <button
                  onClick={() => setFilterPlan('all')}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors ${
                    filterPlan === 'all'
                      ? 'bg-primary text-white font-semibold'
                      : 'bg-muted/40 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterPlan('enterprise')}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors ${
                    filterPlan === 'enterprise'
                      ? 'bg-primary text-white font-semibold'
                      : 'bg-muted/40 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Enterprise
                </button>
                <button
                  onClick={() => setFilterPlan('growth')}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors ${
                    filterPlan === 'growth'
                      ? 'bg-primary text-white font-semibold'
                      : 'bg-muted/40 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Growth
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-sans text-xs">
                <thead className="bg-muted/30 border-b border-border text-muted-foreground uppercase text-[11px] font-semibold tracking-wider">
                  <tr>
                    <th className="p-3.5">Company</th>
                    <th className="p-3.5">Tier</th>
                    <th className="p-3.5">Branches</th>
                    <th className="p-3.5">Subscribers</th>
                    <th className="p-3.5">MRR</th>
                    <th className="p-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/70">
                  {filteredTenants.map((t) => (
                    <tr key={t.id} className="hover:bg-muted/20 transition-colors">
                      <td className="p-3.5">
                        <div className="font-heading font-semibold text-foreground text-sm">{t.name}</div>
                        <div className="text-[11px] font-mono text-primary">{t.subdomain}</div>
                      </td>

                      <td className="p-3.5">
                        <Badge variant={t.plan === 'Enterprise' ? 'primary' : 'outline'} size="xs">
                          {t.plan}
                        </Badge>
                      </td>

                      <td className="p-3.5 font-medium text-foreground">{t.branchesCount} Hubs</td>

                      <td className="p-3.5 font-mono font-medium text-foreground">{t.subscribersCount.toLocaleString()}</td>

                      <td className="p-3.5 font-mono font-semibold text-info-foreground dark:text-info">{formatCurrencyPKR(t.mrr)}</td>

                      <td className="p-3.5 text-right">
                        <Link href="/companies">
                          <Button variant="outline" size="xs" rightIcon={<ArrowUpRight className="w-3 h-3" />}>
                            Manage
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-3.5 bg-muted/20 border-t border-border/70 text-xs text-muted-foreground flex justify-between items-center">
            <span>Multi-Tenant Architecture: Row-Level Security Enabled</span>
            <span className="font-mono">100% Data Isolation</span>
          </div>
        </div>

        {/* Right 1 Col: SaaS System & Resource Telemetry */}
        <div className="space-y-6">
          {/* Infrastructure Health */}
          <div className="bg-card rounded-xl border border-border p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border/70">
              <h3 className="font-heading font-semibold text-sm text-foreground">
                Global Gateway Telemetry
              </h3>
              <Badge variant="primary" size="xs">
                Active
              </Badge>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Redis Real-Time Pub/Sub</span>
                <span className="font-mono font-medium text-emerald-600 dark:text-emerald-400">12,400 msg/sec</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">PostgreSQL Read Pool</span>
                <span className="font-mono font-medium text-foreground">18 / 60 Connections</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">SmartOLT Polling Frequency</span>
                <span className="font-mono font-medium text-foreground">Every 15 Seconds</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Active Socket.io Rooms</span>
                <span className="font-mono font-medium text-primary">1,840 Connected</span>
              </div>
            </div>
          </div>

          {/* Quick Security Audit Feed */}
          <div className="bg-card rounded-xl border border-border p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border/70">
              <h3 className="font-heading font-semibold text-sm text-foreground">
                Recent Security Audits
              </h3>
              <Link href="/audit" className="text-xs text-primary hover:underline font-medium">
                View All
              </Link>
            </div>

            <div className="space-y-2 text-xs">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-2.5 rounded-lg bg-muted/30 border border-border/70">
                  <div className="flex items-center justify-between font-mono text-[11px]">
                    <span className="font-semibold text-primary">{log.action}</span>
                    <span className="text-muted-foreground">{log.timestamp.split('T')[1]?.slice(0, 5)}</span>
                  </div>
                  <div className="text-xs text-foreground mt-0.5">{log.details}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
