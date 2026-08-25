'use client';

import React, { useState } from 'react';
import { UserCheck, Plus, Search, Mail, Phone, Building2, Shield, Lock, Power } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useToast } from '@/components/ui/Toast';
import { mockDb, MockStaffUser } from '@/mock-db';

export default function StaffPage() {
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const { showToast } = useToast();

  const [staffList, setStaffList] = useState<MockStaffUser[]>(mockDb.getStaff());

  // Invite form state
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [invitePhone, setInvitePhone] = useState('');
  const [inviteDept, setInviteDept] = useState('helpdesk');
  const [inviteBranch, setInviteBranch] = useState('ISB-F10');
  const [inviteRole, setInviteRole] = useState('Helpdesk Agent');

  const filteredStaff = staffList.filter((s) => {
    if (deptFilter !== 'all' && !s.department.toLowerCase().includes(deptFilter)) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        s.fullName.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.phone.includes(q) ||
        s.designation.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleInviteStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) {
      showToast('Validation Error', 'Name and Email are mandatory', 'error');
      return;
    }

    const newStaff: MockStaffUser = {
      id: `usr_${Date.now()}`,
      fullName: inviteName,
      email: inviteEmail,
      phone: invitePhone || '+92 300 0000000',
      username: inviteEmail.split('@')[0],
      department:
        inviteDept === 'helpdesk'
          ? 'Helpdesk'
          : inviteDept === 'noc'
            ? 'NOC'
            : inviteDept === 'accounts'
              ? 'Accounts'
              : 'Field Operations',
      designation: inviteRole,
      branchId: inviteBranch === 'ISB-F10' ? 'br_isb_f10' : 'br_rwp_sdr',
      branchName: inviteBranch === 'ISB-F10' ? 'Islamabad F-10 Main Hub' : 'Rawalpindi Saddar',
      roleCode: inviteRole,
      isOnline: false,
      activeChatsCount: 0,
      status: 'Active',
    };

    setStaffList((prev) => [newStaff, ...prev]);
    showToast('Invitation Sent', `Invited ${newStaff.fullName} as ${newStaff.roleCode}`, 'success');
    setIsInviteModalOpen(false);
    setInviteName('');
    setInviteEmail('');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto w-full space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-border">
        <div>
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-primary" />
            <h1 className="font-heading font-black text-2xl tracking-tight uppercase">
              STAFF DIRECTORY & ACCESS CONTROL
            </h1>
          </div>
          <p className="text-xs font-mono text-muted-foreground mt-1">
            Manage 52 staff members (12 helpdesk officers, 40 field technicians) across 20 branches.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsInviteModalOpen(true)}
          leftIcon={<Plus className="w-3.5 h-3.5" />}
        >
          PROVISION NEW STAFF
        </Button>
      </div>

      {/* Filter & Search */}
      <div className="bg-card border-2 border-border p-4 shadow-sm grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
        <div className="sm:col-span-8 relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search staff by Name, Email, Designation..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-card-subtle border-2 border-border pl-9 pr-4 py-2 text-xs font-mono text-foreground focus:outline-none focus:border-primary"
          />
        </div>

        <div className="sm:col-span-4">
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="w-full bg-card-subtle border-2 border-border px-3 py-2 text-xs font-mono text-foreground focus:outline-none focus:border-primary"
          >
            <option value="all">ALL DEPARTMENTS</option>
            <option value="helpdesk">Helpdesk Support</option>
            <option value="noc">NOC & Operations</option>
            <option value="field">Field Engineering</option>
            <option value="accounts">Accounts & Billing</option>
          </select>
        </div>
      </div>

      {/* Staff Table */}
      <div className="bg-card border-2 border-border shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-card-subtle border-b-2 border-border text-muted-foreground uppercase text-[10px]">
              <tr>
                <th className="p-3.5">STAFF MEMBER</th>
                <th className="p-3.5">DEPARTMENT & DESIGNATION</th>
                <th className="p-3.5">ASSIGNED BRANCH</th>
                <th className="p-3.5">RBAC ROLE</th>
                <th className="p-3.5">PRESENCE</th>
                <th className="p-3.5 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-border">
              {filteredStaff.map((s) => (
                <tr key={s.id} className="hover:bg-card-subtle/70 transition-colors">
                  <td className="p-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar
                        name={s.fullName}
                        size="sm"
                        status={s.isOnline ? 'online' : 'offline'}
                      />
                      <div>
                        <div className="font-heading font-bold text-foreground text-sm">
                          {s.fullName}
                        </div>
                        <div className="text-[10px] text-muted-foreground flex items-center gap-2 mt-0.5">
                          <span>{s.email}</span>
                          <span>·</span>
                          <span>{s.phone}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="p-3.5">
                    <div className="font-bold">{s.designation}</div>
                    <div className="text-[10px] text-muted-foreground">{s.department}</div>
                  </td>

                  <td className="p-3.5">
                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                      <span>{s.branchName}</span>
                    </div>
                  </td>

                  <td className="p-3.5">
                    <Badge variant="outline" size="xs">
                      <Shield className="w-3 h-3 text-warning mr-1 inline" />
                      {s.roleCode}
                    </Badge>
                  </td>

                  <td className="p-3.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-none ${s.isOnline ? 'bg-primary animate-pulse' : 'bg-muted-foreground'
                          }`}
                      />
                      <span>{s.isOnline ? 'ONLINE' : `OFFLINE (${s.status})`}</span>
                    </div>
                  </td>

                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => alert(`Editing permissions for ${s.fullName}`)}
                      className="px-2.5 py-1 bg-card hover:bg-card-subtle border border-border text-[10px] font-bold text-foreground uppercase shadow-sm"
                    >
                      EDIT PERMISSIONS
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Provision Staff Modal */}
      <Modal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        title="PROVISION NEW STAFF MEMBER // RBAC BOUND"
        subtitle="Creates staff credentials, binds to a regional branch hub, and attaches custom permissions."
        size="md"
      >
        <form onSubmit={handleInviteStaff} className="space-y-4 font-mono text-xs">
          <Input
            label="FULL NAME"
            placeholder="e.g. Eng. Hamza Tariq"
            value={inviteName}
            onChange={(e) => setInviteName(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="WORK EMAIL"
              type="email"
              placeholder="hamza@primenetworks.pk"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              required
            />
            <Input
              label="PHONE NUMBER"
              placeholder="+92 300 1234567"
              value={invitePhone}
              onChange={(e) => setInvitePhone(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="DEPARTMENT"
              options={[
                { value: 'helpdesk', label: 'Helpdesk & Support' },
                { value: 'noc', label: 'NOC Core Engineering' },
                { value: 'field', label: 'Field Operations' },
                { value: 'accounts', label: 'Accounts & Finance' },
              ]}
              value={inviteDept}
              onChange={(e) => setInviteDept(e.target.value)}
            />
            <Select
              label="ASSIGNED REGIONAL HUB"
              options={[
                { value: 'ISB-F10', label: 'Islamabad F-10 Main' },
                { value: 'ISB-G11', label: 'Islamabad G-11 Sub-Station' },
                { value: 'ISB-BLUE', label: 'Blue Area Corporate' },
                { value: 'RWP-SDR', label: 'Rawalpindi Saddar' },
              ]}
              value={inviteBranch}
              onChange={(e) => setInviteBranch(e.target.value)}
            />
          </div>

          <Select
            label="ASSIGN PERMISSION GROUP (ROLE)"
            options={[
              { value: 'Helpdesk Agent', label: 'Helpdesk Agent (Chat, Customer 360, Basic Tickets)' },
              { value: 'NOC Administrator', label: 'NOC Lead (Full SmartOLT Telemetry, Subnet Sweeps)' },
              { value: 'Field Technician', label: 'Field Splicer (Assigned Tickets, Van Stock QR)' },
              { value: 'Branch Manager', label: 'Branch Manager (Branch Dashboard, Staff & Queues)' },
            ]}
            value={inviteRole}
            onChange={(e) => setInviteRole(e.target.value)}
          />

          <div className="pt-4 border-t border-border flex justify-end gap-2.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsInviteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              PROVISION CREDENTIALS
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
