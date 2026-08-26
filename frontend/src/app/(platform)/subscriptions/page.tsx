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
  Shield,
  Layers,
  FileDown,
  Check,
  X,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/components/ui/Toast';
import { formatCurrencyPKR } from '@/lib/utils';
import { mockDb, MockSaaSTier, MockSaaSInvoice } from '@/mock-db';

export default function PlatformSubscriptionsPage() {
  const { showToast } = useToast();
  const [tiers, setTiers] = useState<MockSaaSTier[]>(mockDb.getSaaSTiers());
  const [invoices, setInvoices] = useState<MockSaaSInvoice[]>(mockDb.getSaaSInvoices());

  const [activeTab, setActiveTab] = useState<'tiers' | 'flags' | 'invoices'>('tiers');

  const [featureFlags, setFeatureFlags] = useState([
    {
      id: 'smartolt_telemetry',
      name: 'SmartOLT Live Optical dBm Polling',
      description: 'Real-time optical power gauge (-19.24 dBm) and LOS alarm polling',
      starter: false,
      growth: true,
      enterprise: true,
    },
    {
      id: 'zl_ultra_sync',
      name: 'ZL Ultra Billing Ledger Engine',
      description: 'Automated subscriber invoice synchronization and recharge ledger',
      starter: true,
      growth: true,
      enterprise: true,
    },
    {
      id: 'gps_van_dispatch',
      name: 'Field Engineer GPS & OTDR Splicing',
      description: 'Live field technician location routing, van stock, and fiber break logs',
      starter: false,
      growth: false,
      enterprise: true,
    },
    {
      id: 'custom_rbac_builder',
      name: 'Custom RBAC Permission Matrix',
      description: '2-dimensional module-level and action-level security configuration',
      starter: false,
      growth: true,
      enterprise: true,
    },
    {
      id: 'canned_replies_slash',
      name: 'Canned Slash Command Shortcuts (/)',
      description: 'Instant template insertion in live chat via / shortcuts',
      starter: true,
      growth: true,
      enterprise: true,
    },
    {
      id: 'ai_troubleshooting',
      name: 'Predictive AI Fault Detection',
      description: 'Proactive fiber degradation detection before customer complaint',
      starter: false,
      growth: false,
      enterprise: true,
    },
  ]);

  const handleToggleFlag = (idx: number, tier: 'starter' | 'growth' | 'enterprise') => {
    const updated = [...featureFlags];
    updated[idx][tier] = !updated[idx][tier];
    setFeatureFlags(updated);
    showToast(
      'Feature Flag Updated',
      `Toggled ${updated[idx].name} for ${tier.toUpperCase()} tier.`,
      'success'
    );
  };

  const handleMarkPaid = (invId: string) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === invId ? { ...inv, status: 'Paid' } : inv))
    );
    showToast('Invoice Paid', `Invoice ${invId} marked as settled`, 'success');
  };

  const totalCollectedMrr = invoices
    .filter((inv) => inv.status === 'Paid')
    .reduce((sum, inv) => sum + inv.amountPKR, 0);

  const getFeatureList = (features: MockSaaSTier['features']) => [
    { label: 'SmartOLT Live Optical Polling', enabled: features.smartOltIntegration },
    { label: 'MikroTik API Diagnostics', enabled: features.mikrotikApiDiagnostics },
    { label: 'Supervisor Live Occupancy HUD', enabled: features.supervisorLiveHud },
    { label: 'Custom Domain White-Labeling', enabled: features.customDomainBranding },
    { label: 'Dedicated Redis Socket Cluster', enabled: features.dedicatedRedisCluster },
    { label: '24/7 Priority SLA Response', enabled: features.priority24_7Sla },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <CreditCard className="w-5 h-5" />
            </div>
            <h1 className="font-heading font-bold text-2xl tracking-tight text-foreground">
              SaaS Plans, Feature Flags & Revenue Ledger
            </h1>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Configure multi-tenant SaaS pricing tiers, feature entitlement flags, and track collected platform dues.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-muted/40 border border-border p-1 rounded-lg text-xs">
          <button
            onClick={() => setActiveTab('tiers')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeTab === 'tiers'
                ? 'bg-primary text-white font-semibold shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            SaaS Tiers & Limits
          </button>
          <button
            onClick={() => setActiveTab('flags')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeTab === 'flags'
                ? 'bg-primary text-white font-semibold shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Feature Flag Matrix
          </button>
          <button
            onClick={() => setActiveTab('invoices')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeTab === 'invoices'
                ? 'bg-primary text-white font-semibold shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Invoices Ledger ({invoices.length})
          </button>
        </div>
      </div>

      {/* 3 SaaS Tiers View */}
      {activeTab === 'tiers' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tiers.map((tier) => {
              const isPopular = tier.code === 'Enterprise';
              const featureItems = getFeatureList(tier.features);

              return (
                <div
                  key={tier.id}
                  className={`bg-card rounded-xl border p-6 flex flex-col justify-between space-y-6 shadow-xs relative ${
                    isPopular ? 'border-primary ring-2 ring-primary/20' : 'border-border'
                  }`}
                >
                  {isPopular && (
                    <span className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-primary text-white text-[10px] font-semibold tracking-wide uppercase shadow-2xs">
                      Enterprise Tier
                    </span>
                  )}

                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-border/70">
                      <div>
                        <h3 className="font-heading font-bold text-lg text-foreground">{tier.name}</h3>
                        <p className="text-xs text-muted-foreground">{tier.activeTenantsCount} Tenants Bound</p>
                      </div>
                    </div>

                    <div className="my-4">
                      <div className="font-mono font-bold text-3xl text-foreground">
                        {formatCurrencyPKR(tier.pricePKR)}
                        <span className="text-xs text-muted-foreground font-normal"> / month</span>
                      </div>
                    </div>

                    {/* Limits */}
                    <div className="space-y-2 py-3 border-y border-border/70 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5" /> Max Regional Hubs:
                        </span>
                        <span className="font-semibold text-foreground">{tier.maxBranches} Branches</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5" /> Max Subscribers:
                        </span>
                        <span className="font-mono font-semibold text-foreground">
                          {tier.maxSubscribers ? tier.maxSubscribers.toLocaleString() : 'Unlimited'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground flex items-center gap-1.5">
                          <Server className="w-3.5 h-3.5" /> Max Staff Seats:
                        </span>
                        <span className="font-semibold text-foreground">{tier.maxStaffSeats} Seats</span>
                      </div>
                    </div>

                    {/* Included Features List */}
                    <div className="mt-4 space-y-2 text-xs">
                      <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                        Included Entitlements:
                      </span>
                      {featureItems.map((feat, idx) => (
                        <div
                          key={idx}
                          className={`flex items-center gap-2 ${
                            feat.enabled ? 'text-foreground' : 'text-muted-foreground line-through opacity-60'
                          }`}
                        >
                          {feat.enabled ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                          ) : (
                            <XCircle className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                          )}
                          <span>{feat.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button
                    variant={isPopular ? 'primary' : 'outline'}
                    size="sm"
                    className="w-full"
                    onClick={() =>
                      showToast('Plan Config', `Editing plan parameters for ${tier.name}`, 'info')
                    }
                  >
                    Configure Tier Limits
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Feature Flag Matrix View */}
      {activeTab === 'flags' && (
        <div className="bg-card rounded-xl border border-border shadow-xs overflow-hidden space-y-4">
          <div className="p-4 border-b border-border/70 bg-muted/20 flex items-center justify-between">
            <div>
              <h3 className="font-heading font-semibold text-sm text-foreground">
                SaaS Tier Feature Flag Entitlement Matrix
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Toggle module availability per SaaS plan tier. Changes take effect across all active tenant subdomains.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-xs">
              <thead className="bg-muted/30 border-b border-border text-muted-foreground uppercase text-[11px] font-semibold tracking-wider">
                <tr>
                  <th className="p-3.5">Feature & Module Name</th>
                  <th className="p-3.5 text-center">Starter Tier</th>
                  <th className="p-3.5 text-center">Growth Tier</th>
                  <th className="p-3.5 text-center">Enterprise Tier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/70">
                {featureFlags.map((flag, idx) => (
                  <tr key={flag.id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-3.5">
                      <div className="font-medium text-foreground">{flag.name}</div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">{flag.description}</div>
                    </td>

                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => handleToggleFlag(idx, 'starter')}
                        className={`p-1 rounded-md border transition-colors ${
                          flag.starter
                            ? 'bg-primary/10 border-primary text-primary'
                            : 'bg-muted border-border text-muted-foreground'
                        }`}
                      >
                        {flag.starter ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                      </button>
                    </td>

                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => handleToggleFlag(idx, 'growth')}
                        className={`p-1 rounded-md border transition-colors ${
                          flag.growth
                            ? 'bg-primary/10 border-primary text-primary'
                            : 'bg-muted border-border text-muted-foreground'
                        }`}
                      >
                        {flag.growth ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                      </button>
                    </td>

                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => handleToggleFlag(idx, 'enterprise')}
                        className={`p-1 rounded-md border transition-colors ${
                          flag.enterprise
                            ? 'bg-primary/10 border-primary text-primary'
                            : 'bg-muted border-border text-muted-foreground'
                        }`}
                      >
                        {flag.enterprise ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Invoices Ledger View */}
      {activeTab === 'invoices' && (
        <div className="bg-card rounded-xl border border-border shadow-xs overflow-hidden">
          <div className="p-4 border-b border-border/70 bg-card flex items-center justify-between">
            <div>
              <h3 className="font-heading font-semibold text-sm text-foreground">
                SaaS Subscription Revenue & Invoice Ledger
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Monthly recurring dues and overage billing across all 14 tenant ISP organizations.
              </p>
            </div>
            <div className="font-mono text-xs">
              <span className="text-muted-foreground">Total Settled: </span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {formatCurrencyPKR(totalCollectedMrr)}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-xs">
              <thead className="bg-muted/30 border-b border-border text-muted-foreground uppercase text-[11px] font-semibold tracking-wider">
                <tr>
                  <th className="p-3.5">Invoice ID</th>
                  <th className="p-3.5">Tenant Company</th>
                  <th className="p-3.5">Plan Tier</th>
                  <th className="p-3.5">Due Date</th>
                  <th className="p-3.5">Amount Due</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/70">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-3.5 font-mono text-primary font-medium">{inv.invoiceNumber}</td>

                    <td className="p-3.5">
                      <div className="font-medium text-foreground">{inv.tenantName}</div>
                      <div className="text-[11px] font-mono text-muted-foreground">ID: {inv.tenantId}</div>
                    </td>

                    <td className="p-3.5">
                      <Badge variant="outline" size="xs">
                        {inv.tier}
                      </Badge>
                    </td>

                    <td className="p-3.5 font-mono text-muted-foreground">{inv.dueDate}</td>

                    <td className="p-3.5 font-mono font-semibold text-foreground">
                      {formatCurrencyPKR(inv.amountPKR)}
                    </td>

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
                        {inv.status}
                      </Badge>
                    </td>

                    <td className="p-3.5 text-right space-x-1">
                      {inv.status !== 'Paid' && (
                        <Button
                          variant="primary"
                          size="xs"
                          onClick={() => handleMarkPaid(inv.id)}
                        >
                          Mark Paid
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="xs"
                        leftIcon={<FileDown className="w-3 h-3" />}
                        onClick={() =>
                          showToast('Invoice Downloaded', `PDF invoice ${inv.invoiceNumber} saved`, 'success')
                        }
                      >
                        PDF
                      </Button>
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
