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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-border">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            <h1 className="font-heading font-black text-2xl tracking-tight uppercase">
              SUBSCRIBER DIRECTORY // CUSTOMER 360°
            </h1>
          </div>
          <p className="text-xs font-mono text-muted-foreground mt-1">
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
            EXPORT CSV
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            ADD NEW SUBSCRIBER
          </Button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-card border-2 border-border p-4 shadow-sm grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
        <div className="sm:col-span-7 relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by Name, PPPoE Username, CNIC, Phone number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-card-subtle border-2 border-border pl-9 pr-4 py-2 text-xs font-mono text-foreground focus:outline-none focus:border-primary"
          />
        </div>

        <div className="sm:col-span-5 flex gap-2">
          <select
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            className="w-full bg-card-subtle border-2 border-border px-3 py-2 text-xs font-mono text-foreground focus:outline-none focus:border-primary"
          >
            <option value="all">ALL REGIONAL HUBS (20)</option>
            <option value="ISB-F10">Islamabad F-10 Main</option>
            <option value="ISB-G11">Islamabad G-11 Sub-Station</option>
            <option value="ISB-BLUE">Blue Area Corporate</option>
            <option value="RWP-SDR">Rawalpindi Saddar</option>
          </select>
        </div>
      </div>

      {/* Customer Directory Table */}
      <div className="bg-card border-2 border-border shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-card-subtle border-b-2 border-border text-muted-foreground uppercase text-[10px]">
              <tr>
                <th className="p-3.5">SUBSCRIBER CODE & NAME</th>
                <th className="p-3.5">PPPOE USERNAME</th>
                <th className="p-3.5">BRANCH HUB</th>
                <th className="p-3.5">PACKAGE & BILLING</th>
                <th className="p-3.5">SMARTOLT SIGNAL</th>
                <th className="p-3.5">STATUS</th>
                <th className="p-3.5 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-border">
              {filteredCustomers.map((c) => {
                const opticalHealth = getOpticalHealthStatus(c.onuSignalDbm);
                return (
                  <tr key={c.id} className="hover:bg-card-subtle/70 transition-colors">
                    <td className="p-3.5">
                      <div className="font-heading font-bold text-foreground text-sm">
                        {c.fullName}
                      </div>
                      <div className="text-[10px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
                        <Badge variant="outline" size="xs">
                          {c.customerCode}
                        </Badge>
                        <span>{c.phone}</span>
                      </div>
                    </td>

                    <td className="p-3.5">
                      <div className="text-primary font-bold flex items-center gap-1">
                        <Wifi className="w-3.5 h-3.5" />
                        <span>{c.username}</span>
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">
                        IP: {c.currentIp || '192.168.10.1'}
                      </div>
                    </td>

                    <td className="p-3.5">
                      <div className="font-bold">{c.branch?.name}</div>
                      <div className="text-[10px] text-muted-foreground">{c.area}</div>
                    </td>

                    <td className="p-3.5">
                      <div className="font-bold text-foreground">{c.packageName}</div>
                      <div className="text-[10px] text-muted-foreground">
                        {formatCurrencyPKR(c.monthlyBilling)} // Exp: {c.billingExpiryDate}
                      </div>
                    </td>

                    <td className="p-3.5">
                      <span
                        className={`inline-block px-2 py-0.5 font-bold text-[10px] border ${opticalHealth.bgClass} ${opticalHealth.colorClass} ${opticalHealth.borderClass}`}
                      >
                        {c.onuSignalDbm} dBm ({opticalHealth.label})
                      </span>
                      <div className="text-[9px] text-muted-foreground mt-0.5">
                        {c.oltPonPort}
                      </div>
                    </td>

                    <td className="p-3.5">
                      <Badge
                        variant={c.status === 'active' ? 'primary' : 'destructive'}
                        size="xs"
                      >
                        {c.status.toUpperCase()}
                      </Badge>
                    </td>

                    <td className="p-3.5 text-right">
                      <Link
                        href="/app/desk"
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-card hover:bg-card-subtle border border-border hover:border-primary text-[10px] font-bold text-foreground uppercase shadow-sm mr-2"
                      >
                        <MessageSquare className="w-3 h-3 text-primary" />
                        <span>OPEN CHAT</span>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Subscriber Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="PROVISION NEW SUBSCRIBER // ZL ULTRA SYNC"
        subtitle="Registers new optical GPON customer account and binds to regional branch subnet."
        size="md"
      >
        <form onSubmit={handleAddCustomer} className="space-y-4 font-mono text-xs">
          <Input
            label="FULL NAME"
            placeholder="e.g. Muhammad Usman"
            value={newCustName}
            onChange={(e) => setNewCustName(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="PHONE NUMBER"
              placeholder="+92 300 1234567"
              value={newCustPhone}
              onChange={(e) => setNewCustPhone(e.target.value)}
              required
            />
            <Input
              label="PPPOE USERNAME"
              placeholder="e.g. usman_f10"
              value={newCustUsername}
              onChange={(e) => setNewCustUsername(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="REGIONAL HUB"
              options={[
                { value: 'ISB-F10', label: 'Islamabad F-10 Main' },
                { value: 'ISB-G11', label: 'Islamabad G-11 Sub-Station' },
                { value: 'ISB-BLUE', label: 'Blue Area Corporate' },
                { value: 'RWP-SDR', label: 'Rawalpindi Saddar' },
              ]}
              value={newCustBranch}
              onChange={(e) => setNewCustBranch(e.target.value)}
            />
            <Select
              label="BANDWIDTH PLAN"
              options={[
                { value: '50M', label: '50 Mbps Ultra (PKR 3,500)' },
                { value: '100M', label: '100 Mbps Boost (PKR 5,500)' },
                { value: '250M', label: '250 Mbps Enterprise (PKR 9,500)' },
              ]}
              value={newCustPackage}
              onChange={(e) => setNewCustPackage(e.target.value)}
            />
          </div>

          <div className="pt-4 border-t border-border flex justify-end gap-2.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              PROVISION & SYNC ZL ULTRA
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
