'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  Search,
  Filter,
  Download,
  CheckCircle2,
  Lock,
  Calendar,
  Building2,
  FileCode,
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

  const handleExport = (format: 'CSV' | 'JSON') => {
    showToast('Audit Export', `Exporting platform audit records as ${format}`, 'success');
  };

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.tenantName.toLowerCase().includes(search.toLowerCase()) ||
      log.actor.toLowerCase().includes(search.toLowerCase()) ||
      log.details.toLowerCase().includes(search.toLowerCase()) ||
      log.ipAddress.includes(search);

    const matchesAction =
      selectedActionFilter === 'ALL' || log.action === selectedActionFilter;

    return matchesSearch && matchesAction;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-border">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <h1 className="font-heading font-black text-2xl tracking-tight uppercase">
              PLATFORM-WIDE IMMUTABLE SECURITY & AUDIT LOGS
            </h1>
          </div>
          <p className="text-xs font-mono text-muted-foreground mt-1">
            Cryptographically signed multi-tenant security events, schema provisioning, and impersonation logs.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport('CSV')}
            leftIcon={<Download className="w-3.5 h-3.5" />}
          >
            EXPORT CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport('JSON')}
            leftIcon={<FileCode className="w-3.5 h-3.5" />}
          >
            EXPORT JSON
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-card border-2 border-border p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm font-mono text-xs">
        <div className="w-full sm:w-80 relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search audit events, actors, or IP..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-card-subtle border border-border text-foreground font-mono text-xs focus:outline-none focus:border-primary"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end overflow-x-auto pb-1 sm:pb-0">
          <span className="text-muted-foreground text-[10px] uppercase font-bold">EVENT:</span>
          {[
            'ALL',
            'TENANT_PROVISIONED',
            'PLAN_UPGRADED',
            'IMPERSONATION_STARTED',
            'RLS_SCHEMA_MIGRATED',
          ].map((act) => (
            <button
              key={act}
              onClick={() => setSelectedActionFilter(act)}
              className={`px-2.5 py-1 text-[10px] font-bold uppercase border whitespace-nowrap cursor-pointer ${
                selectedActionFilter === act
                  ? 'bg-primary text-primary-foreground border-border'
                  : 'bg-card border-border hover:bg-card-subtle text-foreground'
              }`}
            >
              {act.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-card border-2 border-border shadow-md overflow-hidden font-mono text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-card-subtle border-b-2 border-border text-muted-foreground uppercase text-[10px]">
              <tr>
                <th className="p-3.5">TIMESTAMP</th>
                <th className="p-3.5">TENANT ORG</th>
                <th className="p-3.5">ACTION EVENT</th>
                <th className="p-3.5">ACTOR & IP</th>
                <th className="p-3.5">DETAILS</th>
                <th className="p-3.5 text-right">SHA-256 SIGNATURE</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-border">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-card-subtle/50 transition-colors">
                  <td className="p-3.5 text-muted-foreground whitespace-nowrap">
                    {log.timestamp}
                  </td>

                  <td className="p-3.5 font-bold">
                    <div className="text-foreground">{log.tenantName}</div>
                    <div className="text-[10px] text-primary">{log.tenantSlug}</div>
                  </td>

                  <td className="p-3.5">
                    <Badge variant="primary" size="xs">
                      {log.action}
                    </Badge>
                  </td>

                  <td className="p-3.5">
                    <div className="font-bold">{log.actor}</div>
                    <div className="text-[10px] text-muted-foreground font-mono">
                      IP: {log.ipAddress}
                    </div>
                  </td>

                  <td className="p-3.5 text-foreground max-w-xs">{log.details}</td>

                  <td className="p-3.5 text-right">
                    <span
                      className="inline-flex items-center gap-1 px-2 py-0.5 bg-card-subtle border border-border text-[9px] font-mono text-info font-bold"
                      title={log.sha256Hash}
                    >
                      <Lock className="w-2.5 h-2.5" />
                      <span>{log.sha256Hash.substring(0, 10)}...</span>
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
