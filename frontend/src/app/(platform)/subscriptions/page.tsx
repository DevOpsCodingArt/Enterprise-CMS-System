'use client';

import React, { useState } from 'react';
import {
  CreditCard,
  CheckCircle2,
  XCircle,
  Building2,
  Users,
  Server,
  Zap,
  TrendingUp,
  FileText,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/components/ui/Toast';
import { formatCurrencyPKR } from '@/lib/utils';
import { mockDb, MockSaaSTier, MockSaaSInvoice } from '@/mock-db';

export default function PlatformSubscriptionsPage() {
  const { showToast } = useToast();
  const tiers = mockDb.getSaaSTiers();
  const invoices = mockDb.getSaaSInvoices();

  const [activeTab, setActiveTab] = useState<'tiers' | 'invoices'>('tiers');

  const totalCollectedMrr = invoices
    .filter((inv) => inv.status === 'Paid')
    .reduce((sum, inv) => sum + inv.amountPKR, 0);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-border">
        <div>
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-primary" />
            <h1 className="font-heading font-black text-2xl tracking-tight uppercase">
              SAAS TIERS, LIMITS & BILLING LEDGER
            </h1>
          </div>
          <p className="text-xs font-mono text-muted-foreground mt-1">
            Configure multi-tenant SaaS pricing models, branch limits, feature flags, and collected monthly SaaS dues.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-card border-2 border-border p-1 font-mono text-xs">
          <button
            onClick={() => setActiveTab('tiers')}
            className={`px-3 py-1.5 font-bold uppercase cursor-pointer ${
              activeTab === 'tiers'
                ? 'bg-primary text-primary-foreground'
                : 'text-foreground hover:bg-card-subtle'
            }`}
          >
            SAAS TIERS & LIMITS (3)
          </button>
          <button
            onClick={() => setActiveTab('invoices')}
            className={`px-3 py-1.5 font-bold uppercase cursor-pointer ${
              activeTab === 'invoices'
                ? 'bg-primary text-primary-foreground'
                : 'text-foreground hover:bg-card-subtle'
            }`}
          >
            MONTHLY INVOICES ({invoices.length})
          </button>
        </div>
      </div>

      {activeTab === 'tiers' ? (
        <div className="space-y-6">
          {/* Tiers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
            {tiers.map((tier) => {
              const isEnterprise = tier.code === 'Enterprise';
              return (
                <div
                  key={tier.id}
                  className={`bg-card border-2 p-5 flex flex-col justify-between relative shadow-md ${
                    isEnterprise ? 'border-primary' : 'border-border'
                  }`}
                >
                  {isEnterprise && (
                    <div className="absolute -top-3 right-4">
                      <Badge variant="primary" size="xs">
                        MOST POPULAR
                      </Badge>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <div className="font-heading font-black text-xl text-foreground uppercase">
                        {tier.name}
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">
                        {tier.activeTenantsCount} ACTIVE TENANTS ON THIS PLAN
                      </div>
                    </div>

                    {/* Price Header */}
                    <div className="p-3 bg-card-subtle border border-border">
                      <div className="font-heading font-black text-2xl text-info">
                        {formatCurrencyPKR(tier.pricePKR)}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        Billed per tenant / monthly
                      </div>
                    </div>

                    {/* Quotas */}
                    <div className="space-y-2 border-y border-border py-3 text-[11px]">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">REGIONAL HUBS:</span>
                        <span className="font-bold text-foreground">
                          {tier.maxBranches === 999 ? 'Unlimited' : `Up to ${tier.maxBranches}`}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">SUBSCRIBERS:</span>
                        <span className="font-bold text-foreground">
                          Up to {tier.maxSubscribers.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">STAFF SEATS:</span>
                        <span className="font-bold text-foreground">
                          {tier.maxStaffSeats} Seats
                        </span>
                      </div>
                    </div>

                    {/* Feature Flags */}
                    <div className="space-y-2 text-[11px]">
                      <div className="text-[10px] font-bold text-muted-foreground uppercase">
                        INCLUDED MODULES:
                      </div>

                      <div className="flex items-center gap-2">
                        {tier.features.smartOltIntegration ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-muted-foreground opacity-40" />
                        )}
                        <span>SmartOLT PON Diagnostics</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {tier.features.mikrotikApiDiagnostics ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-muted-foreground opacity-40" />
                        )}
                        <span>MikroTik API Throughput Sweeps</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {tier.features.supervisorLiveHud ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-muted-foreground opacity-40" />
                        )}
                        <span>Supervisor Live Radar HUD</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {tier.features.customDomainBranding ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-muted-foreground opacity-40" />
                        )}
                        <span>White-Label Custom Subdomain</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {tier.features.dedicatedRedisCluster ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-muted-foreground opacity-40" />
                        )}
                        <span>Dedicated Redis Cluster</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-border">
                    <Button
                      variant={isEnterprise ? 'primary' : 'outline'}
                      size="sm"
                      className="w-full"
                      onClick={() =>
                        showToast('Plan Limits', `Editing quotas for ${tier.name}`, 'info')
                      }
                    >
                      CONFIGURE TIER LIMITS
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Invoices Ledger Table */
        <div className="bg-card border-2 border-border shadow-md overflow-hidden font-mono text-xs">
          <div className="p-4 border-b-2 border-border bg-card-subtle flex items-center justify-between">
            <div className="font-heading font-black text-sm uppercase">
              MONTHLY SAAS DUES // REVENUE LEDGER
            </div>
            <div className="font-bold text-info">
              TOTAL COLLECTED: {formatCurrencyPKR(totalCollectedMrr)}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-card-subtle border-b-2 border-border text-muted-foreground uppercase text-[10px]">
                <tr>
                  <th className="p-3.5">INVOICE #</th>
                  <th className="p-3.5">TENANT COMPANY</th>
                  <th className="p-3.5">TIER PLAN</th>
                  <th className="p-3.5">AMOUNT</th>
                  <th className="p-3.5">ISSUE DATE</th>
                  <th className="p-3.5">DUE DATE</th>
                  <th className="p-3.5">STATUS</th>
                  <th className="p-3.5 text-right">RECEIPT</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-border">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-card-subtle/50 transition-colors">
                    <td className="p-3.5 font-bold text-foreground">{inv.invoiceNumber}</td>
                    <td className="p-3.5 font-bold">{inv.tenantName}</td>
                    <td className="p-3.5 text-primary">{inv.tier}</td>
                    <td className="p-3.5 font-bold text-info">{formatCurrencyPKR(inv.amountPKR)}</td>
                    <td className="p-3.5 text-muted-foreground">{inv.issueDate}</td>
                    <td className="p-3.5 text-muted-foreground">{inv.dueDate}</td>
                    <td className="p-3.5">
                      <Badge
                        variant={
                          inv.status === 'Paid'
                            ? 'primary'
                            : inv.status === 'Pending'
                            ? 'warning'
                            : 'destructive'
                        }
                        size="xs"
                      >
                        {inv.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() =>
                          showToast('Invoice Receipt', `Downloading PDF for ${inv.invoiceNumber}`, 'success')
                        }
                        className="px-2.5 py-1 bg-card hover:bg-card-subtle border border-border text-[10px] font-bold uppercase shadow-sm cursor-pointer"
                      >
                        DOWNLOAD PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
