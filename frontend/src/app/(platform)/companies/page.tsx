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
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useToast } from '@/components/ui/Toast';
import { mockDb, MockTenant } from '@/mock-db';

export default function PlatformCompaniesPage() {
  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedPlanFilter, setSelectedPlanFilter] = useState('ALL');

  const [companies, setCompanies] = useState<MockTenant[]>(mockDb.getTenants());

  // Form states
  const [companyName, setCompanyName] = useState('');
  const [companySlug, setCompanySlug] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('+92 300 ');
  const [plan, setPlan] = useState<'Starter' | 'Growth' | 'Enterprise'>('Enterprise');

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
      primaryColor: '#0047FF',
      secondaryColor: '#00E5FF',
      health: '100.0%',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setCompanies((prev) => [newCmp, ...prev]);
    showToast(
      'Tenant Provisioned',
      `Company "${newCmp.name}" successfully created with RLS schema "${newCmp.databaseSchema}"!`,
      'success'
    );
    setIsModalOpen(false);
    setCompanyName('');
    setCompanySlug('');
    setOwnerName('');
    setOwnerEmail('');
  };

  const filteredCompanies = companies.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.slug.toLowerCase().includes(search.toLowerCase()) ||
      c.ownerEmail.toLowerCase().includes(search.toLowerCase()) ||
      c.databaseSchema.toLowerCase().includes(search.toLowerCase());

    const matchesPlan =
      selectedPlanFilter === 'ALL' || c.plan.toUpperCase() === selectedPlanFilter;

    return matchesSearch && matchesPlan;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-border">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            <h1 className="font-heading font-black text-2xl tracking-tight uppercase">
              TENANT COMPANIES // PROVISIONING CONSOLE
            </h1>
          </div>
          <p className="text-xs font-mono text-muted-foreground mt-1">
            Provision isolated tenant ISP accounts, allocate dedicated RLS schemas, and manage company ownership.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsModalOpen(true)}
          leftIcon={<Plus className="w-3.5 h-3.5" />}
        >
          PROVISION NEW TENANT
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="bg-card border-2 border-border p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm font-mono text-xs">
        <div className="w-full sm:w-80 relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search company, schema, or owner email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-card-subtle border border-border text-foreground font-mono text-xs focus:outline-none focus:border-primary"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <span className="text-muted-foreground text-[10px] uppercase font-bold">PLAN:</span>
          {['ALL', 'ENTERPRISE', 'GROWTH', 'STARTER'].map((p) => (
            <button
              key={p}
              onClick={() => setSelectedPlanFilter(p)}
              className={`px-2.5 py-1 text-[10px] font-bold uppercase border cursor-pointer ${
                selectedPlanFilter === p
                  ? 'bg-primary text-primary-foreground border-border'
                  : 'bg-card border-border hover:bg-card-subtle text-foreground'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Companies List */}
      <div className="bg-card border-2 border-border shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-card-subtle border-b-2 border-border text-muted-foreground uppercase text-[10px]">
              <tr>
                <th className="p-3.5">COMPANY NAME & SUBDOMAIN</th>
                <th className="p-3.5">OWNER PROFILE</th>
                <th className="p-3.5">RLS ISOLATED SCHEMA</th>
                <th className="p-3.5">HUBS & SUBSCRIBERS</th>
                <th className="p-3.5">SAAS TIER</th>
                <th className="p-3.5">STATUS</th>
                <th className="p-3.5 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-border">
              {filteredCompanies.map((c) => (
                <tr key={c.id} className="hover:bg-card-subtle/50 transition-colors">
                  <td className="p-3.5">
                    <div className="font-heading font-bold text-foreground text-sm">{c.name}</div>
                    <div className="text-[10px] text-primary flex items-center gap-1 mt-0.5">
                      <Globe className="w-3 h-3" />
                      <span>{c.subdomain}</span>
                    </div>
                  </td>

                  <td className="p-3.5">
                    <div className="font-bold">{c.ownerName}</div>
                    <div className="text-[10px] text-muted-foreground">{c.ownerEmail}</div>
                  </td>

                  <td className="p-3.5 font-bold text-info flex items-center gap-1.5 pt-4">
                    <Lock className="w-3.5 h-3.5" />
                    <span>{c.databaseSchema}</span>
                  </td>

                  <td className="p-3.5">
                    <div className="font-bold">{c.branchesCount} Branches</div>
                    <div className="text-[10px] text-muted-foreground">{c.subscribersCount.toLocaleString()} subs</div>
                  </td>

                  <td className="p-3.5">
                    <Badge variant={c.plan === 'Enterprise' ? 'primary' : 'outline'} size="xs">
                      {c.plan.toUpperCase()}
                    </Badge>
                  </td>

                  <td className="p-3.5">
                    <Badge variant="primary" size="xs">
                      {c.status.toUpperCase()}
                    </Badge>
                  </td>

                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => showToast('Tenant Settings', `Configuring settings for ${c.name}`, 'info')}
                      className="px-2.5 py-1 bg-card hover:bg-card-subtle border border-border text-[10px] font-bold uppercase shadow-sm cursor-pointer"
                    >
                      MANAGE
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Provision Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="PROVISION NEW SAAS TENANT // RLS BOUND"
        subtitle="Generates company UUID, establishes database tenant context, and sends owner activation email."
        size="md"
      >
        <form onSubmit={handleCreateCompany} className="space-y-4 font-mono text-xs">
          <Input
            label="COMPANY LEGAL NAME"
            placeholder="e.g. FiberTech Broadband (Pvt) Ltd"
            value={companyName}
            onChange={(e) => {
              setCompanyName(e.target.value);
              if (!companySlug) {
                setCompanySlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-'));
              }
            }}
            required
          />

          <Input
            label="TENANT SLUG (URL IDENTIFIER)"
            placeholder="e.g. fibertech-pk"
            value={companySlug}
            onChange={(e) => setCompanySlug(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="COMPANY OWNER NAME"
              placeholder="e.g. Rashid Mehmood"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              required
            />
            <Input
              label="OWNER WORK EMAIL"
              type="email"
              placeholder="rashid@fibertech.pk"
              value={ownerEmail}
              onChange={(e) => setOwnerEmail(e.target.value)}
              required
            />
          </div>

          <Input
            label="OWNER MOBILE NUMBER"
            placeholder="+92 300 1234567"
            value={ownerPhone}
            onChange={(e) => setOwnerPhone(e.target.value)}
          />

          <Select
            label="SAAS TIER PLAN"
            options={[
              { value: 'Starter', label: 'Starter Tier (Up to 5 Branches, 5,000 Subscribers)' },
              { value: 'Growth', label: 'Growth Tier (Up to 10 Branches, 15,000 Subscribers)' },
              { value: 'Enterprise', label: 'Enterprise Tier (Unlimited Branches & SmartOLT)' },
            ]}
            value={plan}
            onChange={(e) => setPlan(e.target.value as 'Starter' | 'Growth' | 'Enterprise')}
          />

          <div className="pt-4 border-t border-border flex justify-end gap-2.5">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              PROVISION TENANT
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
