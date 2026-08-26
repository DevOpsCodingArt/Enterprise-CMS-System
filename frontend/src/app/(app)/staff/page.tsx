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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <UserCheck className="w-5 h-5" />
            </div>
            <h1 className="font-heading font-bold text-2xl tracking-tight text-foreground">
              Staff Directory & Access Control
            </h1>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Manage 52 staff members (12 helpdesk officers, 40 field technicians) across 20 branches.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsInviteModalOpen(true)}
          leftIcon={<Plus className="w-3.5 h-3.5" />}
        >
          Provision New Staff
        </Button>
      </div>

      {/* Filter & Search */}
      <div className="bg-card rounded-xl border border-border p-3.5 shadow-xs grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
        <div className="sm:col-span-8 relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search staff by Name, Email, Designation..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-muted/30 rounded-lg border border-border/80 pl-9 pr-4 py-2 text-xs font-sans text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
        </div>

        <div className="sm:col-span-4">
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="w-full bg-muted/30 rounded-lg border border-border/80 px-3 py-2 text-xs font-sans text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors cursor-pointer"
          >
            <option value="all">All Departments</option>
            <option value="helpdesk">Helpdesk Support</option>
            <option value="noc">NOC & Operations</option>
            <option value="field">Field Engineering</option>
            <option value="accounts">Accounts & Billing</option>
          </select>
        </div>
      </div>

      {/* Staff Table */}
      <div className="bg-card rounded-xl border border-border shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-xs">
            <thead className="bg-muted/30 border-b border-border text-muted-foreground uppercase text-xs font-semibold tracking-wider">
              <tr>
                <th className="p-3.5">Staff Member</th>
                <th className="p-3.5">Department & Designation</th>
                <th className="p-3.5">Assigned Branch</th>
                <th className="p-3.5">RBAC Role</th>
                <th className="p-3.5">Presence</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/70">
              {filteredStaff.map((s) => (
                <tr key={s.id} className="hover:bg-muted/20 transition-colors">
                  <td className="p-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar
                        name={s.fullName}
                        size="sm"
                        status={s.isOnline ? 'online' : 'offline'}
                      />
                      <div>
                        <div className="font-heading font-semibold text-foreground text-sm">
                          {s.fullName}
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                          <span>{s.email}</span>
                          <span>·</span>
                          <span className="font-mono">{s.phone}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="p-3.5">
                    <div className="font-medium text-foreground">{s.designation}</div>
                    <div className="text-xs text-muted-foreground">{s.department}</div>
                  </td>

                  <td className="p-3.5">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Building2 className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                      <span>{s.branchName}</span>
                    </div>
                  </td>

                  <td className="p-3.5">
                    <Badge variant="primary" size="xs">
                      {s.roleCode}
                    </Badge>
                  </td>

                  <td className="p-3.5">
                    {s.isOnline ? (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-success/10 text-success font-medium text-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                        Online ({s.activeChatsCount} active)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium text-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                        Offline
                      </span>
                    )}
                  </td>

                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => showToast('Impersonate', `Simulated login as ${s.fullName}`, 'info')}
                        className="p-1.5 rounded-md border border-border/80 bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground text-xs transition-colors"
                        title="Simulate Role"
                      >
                        <Shield className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => showToast('Toggle Active', `Toggled active state for ${s.fullName}`, 'info')}
                        className="p-1.5 rounded-md border border-border/80 bg-muted/40 hover:bg-destructive/10 text-muted-foreground hover:text-destructive text-xs transition-colors"
                        title="Deactivate Account"
                      >
                        <Power className="w-3.5 h-3.5" />
                      </button>
                    </div>
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
        title="Provision New Staff Member"
        subtitle="Create internal credentials and assign branch & department scopes"
        size="md"
        footer={
          <div className="flex items-center justify-end gap-2 w-full">
            <Button variant="outline" size="sm" onClick={() => setIsInviteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleInviteStaff}>
              Send Invitation
            </Button>
          </div>
        }
      >
        <form onSubmit={handleInviteStaff} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="e.g. Tariq Mehmood"
            value={inviteName}
            onChange={(e) => setInviteName(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Work Email"
              type="email"
              placeholder="tariq@primeisp.pk"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              required
            />
            <Input
              label="Phone Number"
              placeholder="+92 300 1234567"
              value={invitePhone}
              onChange={(e) => setInvitePhone(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select
              label="Department"
              value={inviteDept}
              onChange={(e) => setInviteDept(e.target.value)}
              options={[
                { value: 'helpdesk', label: 'Helpdesk Support' },
                { value: 'noc', label: 'NOC & Core Operations' },
                { value: 'field', label: 'Field Engineering' },
                { value: 'accounts', label: 'Accounts & Billing' },
              ]}
            />

            <Select
              label="Assigned Branch"
              value={inviteBranch}
              onChange={(e) => setInviteBranch(e.target.value)}
              options={[
                { value: 'ISB-F10', label: 'Islamabad F-10 Main Hub' },
                { value: 'RWP-SDR', label: 'Rawalpindi Saddar' },
                { value: 'LHR-DHA', label: 'Lahore DHA Phase 5' },
              ]}
            />
          </div>

          <Select
            label="RBAC Role"
            value={inviteRole}
            onChange={(e) => setInviteRole(e.target.value)}
            options={[
              { value: 'Helpdesk Agent', label: 'Helpdesk Agent (Ticket & Live Chat Access)' },
              { value: 'NOC Engineer', label: 'NOC Engineer (SmartOLT & Fiber Network Control)' },
              { value: 'Field Tech', label: 'Field Technician (Work Order & Splicing App)' },
              { value: 'Accounts Officer', label: 'Accounts Officer (ZL Ultra Billing & Invoices)' },
              { value: 'Branch Manager', label: 'Branch Manager (Regional Oversight)' },
            ]}
          />
        </form>
      </Modal>
    </div>
  );
}
