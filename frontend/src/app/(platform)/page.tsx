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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-border">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            <h1 className="font-heading font-black text-2xl tracking-tight uppercase">
              SAAS PLATFORM HEALTH & FLEET OVERVIEW
            </h1>
          </div>
          <p className="text-xs font-mono text-muted-foreground mt-1">
            Global multi-tenant metrics across {tenants.length} tenant telecom companies and {totalSubscribers.toLocaleString()} active subscribers.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="/platform/companies">
            <Button variant="primary" size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />}>
              PROVISION NEW TENANT
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Super-Admin KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-xs">
        <div className="bg-card border-2 border-border p-4 shadow-sm">
          <div className="text-[10px] text-muted-foreground uppercase flex items-center justify-between">
            <span>ACTIVE TENANT ISPS</span>
            <Building2 className="w-3.5 h-3.5 text-primary" />
          </div>
          <div className="font-heading font-black text-3xl mt-1 text-primary">{tenants.length} TENANTS</div>
          <div className="text-[10px] text-primary mt-0.5 font-bold">100% RLS ISOLATION ✓</div>
        </div>

        <div className="bg-card border-2 border-border p-4 shadow-sm">
          <div className="text-[10px] text-muted-foreground uppercase flex items-center justify-between">
            <span>GLOBAL SUBSCRIBERS</span>
            <Users className="w-3.5 h-3.5 text-foreground" />
          </div>
          <div className="font-heading font-black text-3xl mt-1 text-foreground">{totalSubscribers.toLocaleString()}</div>
          <div className="text-[10px] text-muted-foreground mt-0.5">Across 46 Regional Hubs</div>
        </div>

        <div className="bg-card border-2 border-border p-4 shadow-sm">
          <div className="text-[10px] text-muted-foreground uppercase flex items-center justify-between">
            <span>PLATFORM MRR</span>
            <TrendingUp className="w-3.5 h-3.5 text-info" />
          </div>
          <div className="font-heading font-black text-3xl mt-1 text-info">{formatCurrencyPKR(totalMrr)}</div>
          <div className="text-[10px] text-muted-foreground mt-0.5">+18% this quarter</div>
        </div>

        <div className="bg-card border-2 border-border p-4 shadow-sm">
          <div className="text-[10px] text-muted-foreground uppercase flex items-center justify-between">
            <span>SYSTEM UPTIME</span>
            <Zap className="w-3.5 h-3.5 text-warning" />
          </div>
          <div className="font-heading font-black text-3xl mt-1 text-warning">{systemMetrics.uptimePercentage}%</div>
          <div className="text-[10px] text-warning mt-0.5 font-bold">LATENCY: {systemMetrics.apiGatewayLatencyMs}ms</div>
        </div>
      </div>

      {/* 2-Column Grid: Tenant Fleet & SaaS Revenue Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Tenant Fleet Table */}
        <div className="lg:col-span-2 bg-card border-2 border-border shadow-md overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-4 border-b-2 border-border bg-card-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="font-heading font-black text-sm uppercase">
                  ACTIVE TENANT COMPANIES (ISPS)
                </div>
                <Badge variant="primary" size="xs">
                  {filteredTenants.length} SHOWN
                </Badge>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1 font-mono text-[10px]">
                <button
                  onClick={() => setFilterPlan('all')}
                  className={`px-2.5 py-1 font-bold uppercase border cursor-pointer ${
                    filterPlan === 'all'
                      ? 'bg-primary text-primary-foreground border-border'
                      : 'bg-card border-border hover:bg-card-subtle'
                  }`}
                >
                  ALL
                </button>
                <button
                  onClick={() => setFilterPlan('enterprise')}
                  className={`px-2.5 py-1 font-bold uppercase border cursor-pointer ${
                    filterPlan === 'enterprise'
                      ? 'bg-primary text-primary-foreground border-border'
                      : 'bg-card border-border hover:bg-card-subtle'
                  }`}
                >
                  ENTERPRISE
                </button>
                <button
                  onClick={() => setFilterPlan('growth')}
                  className={`px-2.5 py-1 font-bold uppercase border cursor-pointer ${
                    filterPlan === 'growth'
                      ? 'bg-primary text-primary-foreground border-border'
                      : 'bg-card border-border hover:bg-card-subtle'
                  }`}
                >
                  GROWTH
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead className="bg-card-subtle border-b-2 border-border text-muted-foreground uppercase text-[10px]">
                  <tr>
                    <th className="p-3">COMPANY</th>
                    <th className="p-3">TIER</th>
                    <th className="p-3">BRANCHES</th>
                    <th className="p-3">SUBSCRIBERS</th>
                    <th className="p-3">MRR</th>
                    <th className="p-3 text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-border">
                  {filteredTenants.map((t) => (
                    <tr key={t.id} className="hover:bg-card-subtle/50 transition-colors">
                      <td className="p-3">
                        <div className="font-heading font-bold text-foreground text-sm">{t.name}</div>
                        <div className="text-[10px] text-primary">{t.subdomain}</div>
                      </td>

                      <td className="p-3">
                        <Badge variant={t.plan === 'Enterprise' ? 'primary' : 'outline'} size="xs">
                          {t.plan.toUpperCase()}
                        </Badge>
                      </td>

                      <td className="p-3 font-bold">{t.branchesCount} Hubs</td>

                      <td className="p-3 text-foreground font-bold">{t.subscribersCount.toLocaleString()}</td>

                      <td className="p-3 font-bold text-info">{formatCurrencyPKR(t.mrr)}</td>

                      <td className="p-3 text-right">
                        <Link
                          href="/desk"
                          className="inline-flex items-center gap-1 px-2 py-1 bg-card hover:bg-card-subtle border border-border text-[10px] font-bold uppercase shadow-sm cursor-pointer"
                          title="Impersonate & Enter Tenant Portal"
                        >
                          <span>IMPERSONATE</span>
                          <ArrowUpRight className="w-3 h-3 text-primary" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-3 border-t-2 border-border bg-card-subtle flex items-center justify-between text-xs font-mono">
            <span className="text-muted-foreground">Showing top provisioned tenants</span>
            <Link href="/platform/companies" className="text-primary font-bold hover:underline">
              View All {tenants.length} Companies →
            </Link>
          </div>
        </div>

        {/* Right 1 Col: SaaS Tier Revenue Breakdown & Live Activity Feed */}
        <div className="space-y-6">
          {/* SaaS Tier Breakdown */}
          <div className="bg-card border-2 border-border p-4 shadow-sm font-mono text-xs space-y-3">
            <div className="font-heading font-black text-sm uppercase flex items-center justify-between">
              <span>SAAS TIER REVENUE</span>
              <CreditCard className="w-4 h-4 text-info" />
            </div>

            <div className="space-y-2">
              <div>
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span>ENTERPRISE TIER (8 TENANTS)</span>
                  <span className="font-bold text-primary">PKR 1,000,000 (69%)</span>
                </div>
                <div className="w-full bg-card-subtle h-2 border border-border overflow-hidden">
                  <div className="bg-primary h-full w-[69%]" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span>GROWTH TIER (4 TENANTS)</span>
                  <span className="font-bold text-info">PKR 300,000 (21%)</span>
                </div>
                <div className="w-full bg-card-subtle h-2 border border-border overflow-hidden">
                  <div className="bg-info h-full w-[21%]" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span>STARTER TIER (2 TENANTS)</span>
                  <span className="font-bold text-warning">PKR 150,000 (10%)</span>
                </div>
                <div className="w-full bg-card-subtle h-2 border border-border overflow-hidden">
                  <div className="bg-warning h-full w-[10%]" />
                </div>
              </div>
            </div>
          </div>

          {/* Platform Live Events from mockDb */}
          <div className="bg-card border-2 border-border p-4 shadow-sm font-mono text-xs space-y-3">
            <div className="font-heading font-black text-sm uppercase flex items-center justify-between">
              <span>PLATFORM AUDIT PULSE</span>
              <Radio className="w-4 h-4 text-primary animate-pulse" />
            </div>

            <div className="space-y-3">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-2.5 bg-card-subtle border border-border text-[11px]">
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-foreground">{log.action}</span>
                    <span className="text-[9px] text-muted-foreground">{log.timestamp.split(' ')[1]}</span>
                  </div>
                  <div className="text-muted-foreground text-[10px] mt-0.5">{log.details}</div>
                </div>
              ))}
            </div>

            <Link
              href="/platform/audit"
              className="block text-center p-2 bg-card hover:bg-card-subtle border border-border font-bold uppercase text-[10px] text-primary"
            >
              VIEW FULL SECURITY AUDIT LOG →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
