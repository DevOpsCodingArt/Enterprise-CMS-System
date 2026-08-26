'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Customer } from '@/types/customer.types';
import { getOpticalHealthStatus, formatCurrencyPKR } from '@/lib/utils';
import {
  Users,
  Search,
  Plus,
  Filter,
  Wifi,
  Phone,
  MapPin,
  Activity,
  MessageSquare,
  MoreHorizontal,
  Download,
  Building2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useToast } from '@/components/ui/Toast';
import { mockDb } from '@/mock-db';

export default function CustomersPage() {
  const [search, setSearch] = useState('');
  const [branchFilter, setBranchFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { showToast } = useToast();

  const [customers, setCustomers] = useState<Customer[]>(mockDb.getCustomers());

  // Add Customer Form state
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustUsername, setNewCustUsername] = useState('');
  const [newCustPackage, setNewCustPackage] = useState('50M');
  const [newCustBranch, setNewCustBranch] = useState('ISB-F10');

  const filteredCustomers = customers.filter((c) => {
    if (branchFilter !== 'all' && c.branch?.code !== branchFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        c.fullName.toLowerCase().includes(q) ||
        (c.username && c.username.toLowerCase().includes(q)) ||
        c.phone.includes(q) ||
        (c.cnic && c.cnic.includes(q)) ||
        c.customerCode.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName.trim() || !newCustPhone.trim()) {
      showToast('Validation Error', 'Full Name and Phone Number are required', 'error');
      return;
    }

    const newCust: Customer = {
      id: `cus_${Date.now()}`,
      companyId: 'cmp_01',
      customerCode: `CUS-${newCustBranch}-${Math.floor(1000 + Math.random() * 9000)}`,
      fullName: newCustName,
      phone: newCustPhone,
      username: newCustUsername || newCustName.toLowerCase().replace(/\s+/g, '_'),
      city: 'Islamabad',
      customerClass: 'residential',
      packageName: newCustPackage === '50M' ? '50 Mbps Ultra' : '100 Mbps Boost',
      packageSpeed: newCustPackage,
      monthlyBilling: newCustPackage === '50M' ? 3500 : 5500,
      pppoeStatus: 'online',
      onuSignalDbm: -19.0,
      oltPonPort: 'Huawei-01 // PON-1',
      status: 'active',
      languagePreference: 'en',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      branch: { id: 'br_f10', name: newCustBranch, code: newCustBranch },
    };

    setCustomers((prev) => [newCust, ...prev]);
    showToast('Customer Provisioned', `Subscribed ${newCust.fullName} to ${newCust.packageName}`, 'success');
    setIsAddModalOpen(false);
    setNewCustName('');
    setNewCustPhone('');
    setNewCustUsername('');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto w-full space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Users className="w-5 h-5" />
            </div>
            <h1 className="font-heading font-bold text-2xl tracking-tight text-foreground">
              Subscriber Directory & Customer 360°
            </h1>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Manage 18,420 fiber subscribers across all 20 regional distribution hubs.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => alert('Exporting subscriber ledger to CSV...')}
            leftIcon={<Download className="w-3.5 h-3.5" />}
          >
            Export CSV
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Add New Subscriber
          </Button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-card rounded-xl border border-border p-3.5 shadow-xs grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
        <div className="sm:col-span-7 relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by Name, PPPoE Username, CNIC, Phone number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-muted/30 rounded-lg border border-border/80 pl-9 pr-4 py-2 text-xs font-sans text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
        </div>

        <div className="sm:col-span-5 flex gap-2">
          <select
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            className="w-full bg-muted/30 rounded-lg border border-border/80 px-3 py-2 text-xs font-sans text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors cursor-pointer"
          >
            <option value="all">All Regional Hubs (20)</option>
            <option value="ISB-F10">Islamabad F-10 Main</option>
            <option value="ISB-G11">Islamabad G-11 Sub-Station</option>
            <option value="ISB-BLUE">Blue Area Corporate</option>
            <option value="RWP-SDR">Rawalpindi Saddar</option>
          </select>
        </div>
      </div>

      {/* Customer Directory Table */}
      <div className="bg-card rounded-xl border border-border shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-xs">
            <thead className="bg-muted/30 border-b border-border text-muted-foreground uppercase text-xs font-semibold tracking-wider">
              <tr>
                <th className="p-3.5">Subscriber Code & Name</th>
                <th className="p-3.5">PPPoE Username</th>
                <th className="p-3.5">Branch Hub</th>
                <th className="p-3.5">Package & Billing</th>
                <th className="p-3.5">SmartOLT Signal</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/70">
              {filteredCustomers.map((c) => {
                const opticalHealth = getOpticalHealthStatus(c.onuSignalDbm);
                return (
                  <tr key={c.id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-3.5">
                      <div>
                        <div className="font-heading font-semibold text-foreground text-sm">
                          {c.fullName}
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                          <span className="font-mono">{c.customerCode}</span>
                          <span>·</span>
                          <span className="font-mono">{c.phone}</span>
                        </div>
                      </div>
                    </td>

                    <td className="p-3.5">
                      <div className="flex items-center gap-1.5 font-medium text-foreground">
                        <Wifi className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                        <span className="font-mono text-primary">{c.username || 'n/a'}</span>
                      </div>
                    </td>

                    <td className="p-3.5">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Building2 className="w-3.5 h-3.5 text-muted-foreground/80 flex-shrink-0" />
                        <span>{c.branch?.name || 'Islamabad F-10'}</span>
                      </div>
                    </td>

                    <td className="p-3.5">
                      <div className="font-medium text-foreground">{c.packageName || '50 Mbps Unlimited'}</div>
                      <div className="text-xs text-muted-foreground font-semibold text-primary">
                        {formatCurrencyPKR(c.monthlyBilling || 3500)} / mo
                      </div>
                    </td>

                    <td className="p-3.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-medium text-xs border ${opticalHealth.bgClass} ${opticalHealth.colorClass} ${opticalHealth.borderClass}`}
                      >
                        <Activity className="w-3 h-3" />
                        <span className="font-mono">{c.onuSignalDbm} dBm</span>
                      </span>
                    </td>

                    <td className="p-3.5">
                      <Badge variant="primary" size="xs">
                        {c.status}
                      </Badge>
                    </td>

                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link href="/desk">
                          <Button variant="outline" size="xs" leftIcon={<MessageSquare className="w-3 h-3" />}>
                            Chat
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Subscriber Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Provision New Fiber Subscriber"
        subtitle="Create PPPoE credentials and bind to OLT PON port"
        size="md"
        footer={
          <div className="flex items-center justify-end gap-2 w-full">
            <Button variant="outline" size="sm" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleAddCustomer}>
              Provision Subscriber
            </Button>
          </div>
        }
      >
        <form onSubmit={handleAddCustomer} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="e.g. Imran Khan"
            value={newCustName}
            onChange={(e) => setNewCustName(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Phone Number"
              placeholder="+92 300 9876543"
              value={newCustPhone}
              onChange={(e) => setNewCustPhone(e.target.value)}
              required
            />
            <Input
              label="PPPoE Username"
              placeholder="e.g. imran_f10"
              value={newCustUsername}
              onChange={(e) => setNewCustUsername(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select
              label="Broadband Package"
              value={newCustPackage}
              onChange={(e) => setNewCustPackage(e.target.value)}
              options={[
                { value: '50M', label: '50 Mbps Ultra (PKR 3,500/mo)' },
                { value: '100M', label: '100 Mbps Boost (PKR 5,500/mo)' },
                { value: '250M', label: '250 Mbps Enterprise (PKR 12,000/mo)' },
              ]}
            />

            <Select
              label="Branch Hub"
              value={newCustBranch}
              onChange={(e) => setNewCustBranch(e.target.value)}
              options={[
                { value: 'ISB-F10', label: 'Islamabad F-10 Main Hub' },
                { value: 'ISB-G11', label: 'Islamabad G-11 Sub-Station' },
                { value: 'ISB-BLUE', label: 'Blue Area Corporate' },
                { value: 'RWP-SDR', label: 'Rawalpindi Saddar' },
              ]}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
