'use client';

import React, { useState } from 'react';
import {
  Shield,
  Search,
  Filter,
  FileDown,
  Lock,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Building2,
  User,
  Clock,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/components/ui/Toast';
import { mockDb, MockAuditLog } from '@/mock-db';

export default function PlatformAuditPage() {
  const { showToast } = useToast();
  const [logs, setLogs] = useState<MockAuditLog[]>(mockDb.getAuditLogs());
  const [search, setSearch] = useState('');
  const [selectedActionFilter, setSelectedActionFilter] = useState('ALL');

  const actionTypes = [
    'ALL',
    'TENANT_PROVISIONED',
    'PLAN_UPGRADED',
    'IMPERSONATION_STARTED',
    'RLS_SCHEMA_MIGRATED',
    'BRANCH_CREATED',
    'SUPER_ADMIN_LOGIN',
  ];

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.actor.toLowerCase().includes(search.toLowerCase()) ||
      log.actorRole.toLowerCase().includes(search.toLowerCase()) ||
      log.tenantName.toLowerCase().includes(search.toLowerCase()) ||
      log.tenantSlug.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.details.toLowerCase().includes(search.toLowerCase()) ||
      log.ipAddress.includes(search);

    const matchesAction =
      selectedActionFilter === 'ALL' || log.action === selectedActionFilter;

    return matchesSearch && matchesAction;
  });

  const handleExport = (format: 'json' | 'csv') => {
    showToast(
      'Audit Report Exported',
      `Full immutable platform compliance audit report exported as ${format.toUpperCase()}`,
      'success'
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Shield className="w-5 h-5" />
            </div>
            <h1 className="font-heading font-bold text-2xl tracking-tight text-foreground">
              Platform-Wide Security & Immutable Audit Trail
            </h1>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Cryptographically sealed cross-tenant audit log capturing administrative actions, schema allocations, and super-admin sessions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport('csv')}
            leftIcon={<FileDown className="w-3.5 h-3.5" />}
          >
            Export CSV
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleExport('json')}
            leftIcon={<FileDown className="w-3.5 h-3.5" />}
          >
            Export JSON
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-xl bg-card border border-border text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by actor, tenant, IP, or details..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-muted/40 border border-border focus:outline-none focus:ring-1 focus:ring-primary text-xs"
          />
        </div>

        {/* Action Type Filter */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {actionTypes.map((act) => (
            <button
              key={act}
              onClick={() => setSelectedActionFilter(act)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                selectedActionFilter === act
                  ? 'bg-primary text-primary-foreground font-semibold'
                  : 'bg-muted/40 text-muted-foreground hover:text-foreground'
              }`}
            >
              {act === 'ALL' ? 'All Actions' : act.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Immutable Audit Log Table */}
      <div className="bg-card rounded-xl border border-border shadow-xs overflow-hidden">
        <div className="p-4 border-b border-border/70 bg-card flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-success" />
            <h3 className="font-heading font-semibold text-sm text-foreground">
              Sealed Platform Events Stream
            </h3>
            <Badge variant="primary" size="xs">
              {filteredLogs.length} Events Logged
            </Badge>
          </div>
          <span className="text-xs text-muted-foreground font-mono">
            SHA-256 Immutable Signature ✓
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-xs">
            <thead className="bg-muted/30 border-b border-border text-muted-foreground uppercase text-xs font-semibold tracking-wider">
              <tr>
                <th className="p-3.5">Timestamp</th>
                <th className="p-3.5">Actor Identity</th>
                <th className="p-3.5">Tenant Organization</th>
                <th className="p-3.5">Action Executed</th>
                <th className="p-3.5">Details & Target Resource</th>
                <th className="p-3.5">IP Address</th>
                <th className="p-3.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/70">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-muted/20 transition-colors">
                  <td className="p-3.5 font-mono text-muted-foreground text-xs whitespace-nowrap">
                    {log.timestamp}
                  </td>

                  <td className="p-3.5">
                    <div className="font-medium text-foreground">{log.actor}</div>
                    <div className="text-xs font-mono text-primary">{log.actorRole}</div>
                  </td>

                  <td className="p-3.5">
                    <div className="font-medium text-foreground">{log.tenantName}</div>
                    <div className="text-xs font-mono text-muted-foreground">{log.tenantSlug}</div>
                  </td>

                  <td className="p-3.5">
                    <Badge variant="outline" size="xs">
                      <span className="font-mono text-xs">{log.action}</span>
                    </Badge>
                  </td>

                  <td className="p-3.5 text-foreground leading-relaxed">
                    {log.details}
                  </td>

                  <td className="p-3.5 font-mono text-muted-foreground text-xs">
                    {log.ipAddress}
                  </td>

                  <td className="p-3.5 text-right">
                    <span className="inline-flex items-center gap-1 text-xs text-success font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" /> {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
