'use client';

import React, { useState } from 'react';
import {
  Building2,
  Plus,
  Search,
  Globe,
  Lock,
  ExternalLink,
  Shield,
  Filter,
  CheckCircle2,
  HardDrive,
  Users,
  CreditCard,
  Sparkles,
  LayoutGrid,
  List,
  AlertTriangle,
  UserCheck,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useToast } from '@/components/ui/Toast';
import { formatCurrencyPKR } from '@/lib/utils';
import { mockDb, MockTenant } from '@/mock-db';

export default function PlatformCompaniesPage() {
  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedPlanFilter, setSelectedPlanFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [selectedTenantDrawer, setSelectedTenantDrawer] = useState<MockTenant | null>(null);

  const [companies, setCompanies] = useState<MockTenant[]>(mockDb.getTenants());

  // Form states for Provisioning Wizard
  const [wizardStep, setWizardStep] = useState(1);
  const [companyName, setCompanyName] = useState('');
  const [legalName, setLegalName] = useState('');
  const [taxId, setTaxId] = useState('');
  const [city, setCity] = useState('Islamabad');
  const [companySlug, setCompanySlug] = useState('');
  const [customDomain, setCustomDomain] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('+92 300 ');
  const [plan, setPlan] = useState<'Starter' | 'Growth' | 'Enterprise'>('Enterprise');
  const [primaryColor, setPrimaryColor] = useState('#2563EB');

  const colorPresets = [
    { label: 'Optic Blue', hex: '#2563EB' },
    { label: 'Fiber Cyan', hex: '#0284C7' },
    { label: 'Emerald Tech', hex: '#059669' },
    { label: 'Indigo Core', hex: '#4F46E5' },
    { label: 'Purple Spectrum', hex: '#7C3AED' },
  ];

  const handleCreateCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !companySlug || !ownerEmail) {
      showToast('Validation Error', 'Company Name, Slug, and Owner Email are required', 'error');
      return;
    }

    const cleanSlug = companySlug.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const newCmp: MockTenant = {
      id: `cmp_${Date.now()}`,
      name: companyName,
      slug: cleanSlug,
      subdomain: `${cleanSlug}.primeone.pk`,
      ownerName,
      ownerEmail,
      ownerPhone,
      plan,
      status: 'Active',
      databaseSchema: `tenant_${cleanSlug.replace(/-/g, '_')}`,
      branchesCount: plan === 'Enterprise' ? 20 : plan === 'Growth' ? 8 : 4,
      subscribersCount: 0,
      mrr: plan === 'Enterprise' ? 125000 : plan === 'Growth' ? 75000 : 35000,
      primaryColor,
      secondaryColor: '#00E5FF',
      health: '99.99%',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setCompanies([newCmp, ...companies]);
    showToast(
      'Tenant ISP Provisioned',
      `Allocated isolated schema ${newCmp.databaseSchema} with Row-Level Security for ${newCmp.name}`,
      'success'
    );
    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setWizardStep(1);
    setCompanyName('');
    setLegalName('');
    setTaxId('');
    setCompanySlug('');
    setCustomDomain('');
    setOwnerName('');
    setOwnerEmail('');
    setOwnerPhone('+92 300 ');
    setPlan('Enterprise');
    setPrimaryColor('#2563EB');
  };

  const handleToggleTenantStatus = (id: string) => {
    setCompanies((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const nextStatus = c.status === 'Active' ? 'Suspended' : 'Active';
          showToast(
            `Tenant ${nextStatus}`,
            `${c.name} access has been ${nextStatus.toLowerCase()}. Active JWT tokens revoked.`,
            nextStatus === 'Active' ? 'success' : 'warning'
          );
          return { ...c, status: nextStatus };
        }
        return c;
      })
    );
  };

  const filteredCompanies = companies.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.subdomain.toLowerCase().includes(search.toLowerCase()) ||
      c.ownerEmail.toLowerCase().includes(search.toLowerCase()) ||
      c.databaseSchema.toLowerCase().includes(search.toLowerCase());

    const matchesPlan =
      selectedPlanFilter === 'ALL' || c.plan.toUpperCase() === selectedPlanFilter.toUpperCase();

    return matchesSearch && matchesPlan;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Building2 className="w-5 h-5" />
            </div>
            <h1 className="font-heading font-bold text-2xl tracking-tight text-foreground">
              Tenant ISP Organizations & White-Label Fleet
            </h1>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Provision, white-label, and manage multi-tenant ISP instances with automated PostgreSQL Row-Level Security schemas.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          leftIcon={<Plus className="w-3.5 h-3.5" />}
        >
          Provision New Tenant ISP
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-xl bg-card border border-border text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by company, slug, schema, or email..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-muted/40 border border-border focus:outline-none focus:ring-1 focus:ring-primary text-xs"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          {/* Plan Selector Filter */}
          <div className="flex items-center gap-1">
            {['ALL', 'ENTERPRISE', 'GROWTH', 'STARTER'].map((tier) => (
              <button
                key={tier}
                onClick={() => setSelectedPlanFilter(tier)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                  selectedPlanFilter === tier
                    ? 'bg-primary text-white font-semibold'
                    : 'bg-muted/40 text-muted-foreground hover:text-foreground'
                }`}
              >
                {tier}
              </button>
            ))}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center border border-border rounded-lg p-0.5 bg-muted/30">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1 rounded-md transition-colors ${
                viewMode === 'table' ? 'bg-card text-foreground shadow-xs' : 'text-muted-foreground'
              }`}
              title="Table View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1 rounded-md transition-colors ${
                viewMode === 'grid' ? 'bg-card text-foreground shadow-xs' : 'text-muted-foreground'
              }`}
              title="Grid Cards"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid View or Table View */}
      {viewMode === 'table' ? (
        <div className="bg-card rounded-xl border border-border shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-xs">
              <thead className="bg-muted/30 border-b border-border text-muted-foreground uppercase text-[11px] font-semibold tracking-wider">
                <tr>
                  <th className="p-3.5">Company Legal Name</th>
                  <th className="p-3.5">Subdomain & Schema</th>
                  <th className="p-3.5">Plan Tier</th>
                  <th className="p-3.5">Hubs</th>
                  <th className="p-3.5">Subscribers</th>
                  <th className="p-3.5">Monthly MRR</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/70">
                {filteredCompanies.map((c) => (
                  <tr key={c.id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-3.5">
                      <div className="font-heading font-semibold text-foreground text-sm flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full flex-shrink-0 shadow-2xs"
                          style={{ backgroundColor: c.primaryColor || '#2563EB' }}
                        />
                        {c.name}
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">{c.ownerEmail}</div>
                    </td>

                    <td className="p-3.5">
                      <div className="font-mono text-primary font-medium">{c.subdomain}</div>
                      <div className="font-mono text-[10px] text-muted-foreground mt-0.5">
                        Schema: <span className="text-foreground">{c.databaseSchema}</span>
                      </div>
                    </td>

                    <td className="p-3.5">
                      <Badge variant={c.plan === 'Enterprise' ? 'primary' : 'outline'} size="xs">
                        {c.plan}
                      </Badge>
                    </td>

                    <td className="p-3.5 font-medium text-foreground">{c.branchesCount} Hubs</td>

                    <td className="p-3.5 font-mono font-medium text-foreground">
                      {c.subscribersCount.toLocaleString()}
                    </td>

                    <td className="p-3.5 font-mono font-semibold text-info-foreground dark:text-info">
                      {formatCurrencyPKR(c.mrr)}
                    </td>

                    <td className="p-3.5">
                      <Badge variant={c.status === 'Active' ? 'primary' : 'destructive'} size="xs">
                        {c.status}
                      </Badge>
                    </td>

                    <td className="p-3.5 text-right space-x-1">
                      <Button
                        variant="outline"
                        size="xs"
                        onClick={() => setSelectedTenantDrawer(c)}
                      >
                        Inspect
                      </Button>
                      <Button
                        variant={c.status === 'Active' ? 'ghost' : 'outline'}
                        size="xs"
                        onClick={() => handleToggleTenantStatus(c.id)}
                      >
                        {c.status === 'Active' ? 'Suspend' : 'Resume'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid Cards View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCompanies.map((c) => (
            <div
              key={c.id}
              className="bg-card rounded-xl border border-border p-5 shadow-xs flex flex-col justify-between space-y-4 text-xs"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-border/70">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3.5 h-3.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: c.primaryColor || '#2563EB' }}
                    />
                    <span className="font-heading font-semibold text-foreground text-sm truncate">
                      {c.name}
                    </span>
                  </div>
                  <Badge variant={c.plan === 'Enterprise' ? 'primary' : 'outline'} size="xs">
                    {c.plan}
                  </Badge>
                </div>

                <div className="space-y-2 mt-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subdomain:</span>
                    <span className="font-mono text-primary font-medium">{c.subdomain}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Database Schema:</span>
                    <span className="font-mono text-foreground font-medium">{c.databaseSchema}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Regional Hubs:</span>
                    <span className="font-medium text-foreground">{c.branchesCount} Branches</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Active Subscribers:</span>
                    <span className="font-mono font-medium text-foreground">
                      {c.subscribersCount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Monthly MRR:</span>
                    <span className="font-mono font-semibold text-info-foreground dark:text-info">
                      {formatCurrencyPKR(c.mrr)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-border/70 flex items-center justify-between">
                <Badge variant={c.status === 'Active' ? 'primary' : 'destructive'} size="xs">
                  {c.status}
                </Badge>
                <div className="flex items-center gap-1.5">
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => setSelectedTenantDrawer(c)}
                  >
                    Manage
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Multi-Step Provision New Tenant ISP Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Provision New Tenant ISP Organization"
        subtitle="Multi-step wizard with automated PostgreSQL Row-Level Security allocation"
        size="lg"
        footer={
          <div className="flex items-center justify-between w-full">
            <span className="text-xs text-muted-foreground">
              Step {wizardStep} of 2
            </span>
            <div className="flex items-center gap-2">
              {wizardStep > 1 && (
                <Button variant="outline" size="sm" onClick={() => setWizardStep(1)}>
                  Back
                </Button>
              )}
              {wizardStep === 1 ? (
                <Button variant="primary" size="sm" onClick={() => setWizardStep(2)}>
                  Next: Branding & RLS →
                </Button>
              ) : (
                <Button variant="primary" size="sm" onClick={handleCreateCompany}>
                  Provision Tenant Schema
                </Button>
              )}
            </div>
          </div>
        }
      >
        <form onSubmit={handleCreateCompany} className="space-y-4">
          {wizardStep === 1 ? (
            <div className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Company Legal Name"
                  placeholder="e.g. StormFiber Broadband (Pvt) Ltd"
                  value={companyName}
                  onChange={(e) => {
                    setCompanyName(e.target.value);
                    if (!companySlug) {
                      setCompanySlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''));
                    }
                  }}
                  required
                />
                <Input
                  label="Subdomain Slug"
                  placeholder="e.g. stormfiber"
                  value={companySlug}
                  onChange={(e) => setCompanySlug(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Owner / CEO Full Name"
                  placeholder="e.g. Tariq Mehmood"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  required
                />
                <Input
                  label="Owner Work Email"
                  placeholder="e.g. tariq@stormfiber.pk"
                  type="email"
                  value={ownerEmail}
                  onChange={(e) => setOwnerEmail(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Owner Mobile Number"
                  placeholder="+92 300 1234567"
                  value={ownerPhone}
                  onChange={(e) => setOwnerPhone(e.target.value)}
                />
                <Select
                  label="SaaS Plan Tier"
                  value={plan}
                  onChange={(e) => setPlan(e.target.value as any)}
                  options={[
                    { value: 'Enterprise', label: 'Enterprise (PKR 125k/mo - 20 Hubs / Unlimited Subs)' },
                    { value: 'Growth', label: 'Growth (PKR 75k/mo - 8 Hubs / 10k Subs)' },
                    { value: 'Starter', label: 'Starter (PKR 35k/mo - 4 Hubs / 2k Subs)' },
                  ]}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* White-Label Primary Color Selector */}
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">
                  White-Label Theme Primary Color
                </label>
                <div className="flex items-center gap-2">
                  {colorPresets.map((clr) => (
                    <button
                      key={clr.hex}
                      type="button"
                      onClick={() => setPrimaryColor(clr.hex)}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                        primaryColor === clr.hex
                          ? 'border-primary ring-2 ring-primary/20 shadow-xs'
                          : 'border-border hover:bg-muted/40'
                      }`}
                    >
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: clr.hex }} />
                      <span>{clr.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* RLS Database Schema Allocation Preview */}
              <div className="p-3.5 rounded-xl bg-muted/30 border border-border space-y-2 text-xs">
                <div className="font-semibold text-foreground flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-primary" />
                  Automated Database & RLS Allocation Preview
                </div>
                <div className="grid grid-cols-2 gap-2 text-muted-foreground text-[11px]">
                  <div>
                    Subdomain URL: <span className="font-mono text-primary font-medium">{companySlug ? `${companySlug}.primeone.pk` : '...'}</span>
                  </div>
                  <div>
                    Database Schema: <span className="font-mono text-foreground font-medium">tenant_{companySlug.replace(/-/g, '_') || '...'}</span>
                  </div>
                  <div>
                    Row-Level Security: <span className="text-emerald-600 dark:text-emerald-400 font-medium">100% Isolated</span>
                  </div>
                  <div>
                    Allowed Regional Hubs: <span className="font-medium text-foreground">{plan === 'Enterprise' ? 20 : plan === 'Growth' ? 8 : 4} Hubs</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </form>
      </Modal>

      {/* Tenant Detail & Controls Drawer */}
      {selectedTenantDrawer && (
        <Modal
          isOpen={!!selectedTenantDrawer}
          onClose={() => setSelectedTenantDrawer(null)}
          title={selectedTenantDrawer.name}
          subtitle={`Subdomain: ${selectedTenantDrawer.subdomain} // Schema: ${selectedTenantDrawer.databaseSchema}`}
          size="md"
          footer={
            <div className="flex items-center justify-between w-full">
              <Button
                variant={selectedTenantDrawer.status === 'Active' ? 'destructive' : 'primary'}
                size="sm"
                onClick={() => {
                  handleToggleTenantStatus(selectedTenantDrawer.id);
                  setSelectedTenantDrawer(null);
                }}
              >
                {selectedTenantDrawer.status === 'Active' ? 'Suspend Organization' : 'Reactivate Organization'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedTenantDrawer(null)}
              >
                Close Drawer
              </Button>
            </div>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-muted/20 border border-border">
              <div>
                <span className="text-muted-foreground block text-[11px]">Owner Contact:</span>
                <span className="font-medium text-foreground">{selectedTenantDrawer.ownerName}</span>
                <span className="text-muted-foreground block text-[11px]">{selectedTenantDrawer.ownerEmail}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">SaaS Plan Tier:</span>
                <Badge variant={selectedTenantDrawer.plan === 'Enterprise' ? 'primary' : 'outline'} size="xs">
                  {selectedTenantDrawer.plan} (PKR {selectedTenantDrawer.mrr.toLocaleString()}/mo)
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <div className="font-semibold text-foreground">Quota & Allocation Gauges</div>
              <div className="p-3 rounded-lg bg-muted/30 border border-border space-y-2">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-muted-foreground">Regional Distribution Hubs</span>
                  <span className="font-medium text-foreground">{selectedTenantDrawer.branchesCount} / 20 Active</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-muted-foreground">Subscribers Provisioned</span>
                  <span className="font-mono font-medium text-foreground">{selectedTenantDrawer.subscribersCount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-muted-foreground">Cloudflare R2 Storage</span>
                  <span className="font-mono text-foreground">12.4 GB Used</span>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-xs text-primary space-y-1">
              <div className="font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> 1-Click Super-Admin Impersonation
              </div>
              <p className="text-[11px] opacity-90">
                You can simulate logging in as the ISP CEO to verify tenant configurations without requesting their password.
              </p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
