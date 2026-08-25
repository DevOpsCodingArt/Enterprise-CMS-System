'use client';

import React, { useState } from 'react';
import { Shield, Plus, Check, X, Lock, Save, Layers } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/components/ui/Toast';
import { mockDb, MockRole, PermissionMatrixRow } from '@/mock-db';

export default function RBACRolesPage() {
  const { showToast } = useToast();
  const [selectedRole, setSelectedRole] = useState('role_helpdesk');

  const [roles, setRoles] = useState<MockRole[]>(mockDb.getRoles());
  const [matrix, setMatrix] = useState<Record<string, PermissionMatrixRow[]>>(
    mockDb.getPermissionMatrix()
  );

  const currentRows = matrix[selectedRole] || matrix['role_helpdesk'];

  const handleToggle = (rowIndex: number, field: keyof PermissionMatrixRow) => {
    if (selectedRole === 'role_owner') {
      showToast('System Role Protected', 'Company Owner permissions cannot be modified.', 'warning');
      return;
    }

    const updated = [...currentRows];
    (updated[rowIndex] as any)[field] = !(updated[rowIndex] as any)[field];
    setMatrix((prev) => ({ ...prev, [selectedRole]: updated }));
  };

  const handleSave = () => {
    showToast('RBAC Matrix Saved', `Updated permissions for ${roles.find((r) => r.id === selectedRole)?.name}`, 'success');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto w-full space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-warning/15 text-warning-foreground dark:text-warning">
              <Shield className="w-5 h-5" />
            </div>
            <h1 className="font-heading font-bold text-2xl tracking-tight text-foreground">
              Custom RBAC Permission Matrix Builder
            </h1>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Build custom permission sets with hybrid module-level and action-level security controls.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="primary"
            size="sm"
            onClick={handleSave}
            leftIcon={<Save className="w-3.5 h-3.5" />}
          >
            Save Matrix Changes
          </Button>
        </div>
      </div>

      {/* 2-Column Layout: Roles on Left, Matrix on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Role Selector (4 cols) */}
        <div className="lg:col-span-4 bg-card rounded-xl border border-border p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-border/70">
            <span className="font-heading font-semibold text-xs uppercase text-muted-foreground tracking-wider">
              Permission Groups (Roles)
            </span>
            <button
              onClick={() => alert('New role builder')}
              className="p-1 rounded-md border border-border bg-muted/40 hover:bg-muted text-foreground transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2">
            {roles.map((r) => (
              <button
                key={r.id}
                onClick={() => setSelectedRole(r.id)}
                className={`w-full text-left p-3 rounded-lg border text-xs transition-all ${
                  selectedRole === r.id
                    ? 'bg-primary/5 border-primary shadow-xs font-semibold'
                    : 'bg-card border-border hover:border-primary/40 hover:bg-muted/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="truncate text-foreground font-medium">{r.name}</span>
                  {r.isSystem && (
                    <Badge variant="outline" size="xs">
                      System
                    </Badge>
                  )}
                </div>
                <div className="text-[11px] text-muted-foreground mt-1">
                  {r.usersCount} Active Staff Bound
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Permission Matrix Table (8 cols) */}
        <div className="lg:col-span-8 bg-card rounded-xl border border-border shadow-xs overflow-hidden">
          <div className="p-4 border-b border-border/70 bg-card flex items-center justify-between">
            <div>
              <h3 className="font-heading font-semibold text-sm text-foreground">
                Action Matrix: {roles.find((r) => r.id === selectedRole)?.name}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Toggle action permissions across system operational modules.
              </p>
            </div>
            {selectedRole === 'role_owner' && (
              <span className="inline-flex items-center gap-1 text-xs text-warning-foreground dark:text-warning font-medium">
                <Lock className="w-3.5 h-3.5" /> Read-Only Root Role
              </span>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-xs">
              <thead className="bg-muted/30 border-b border-border text-muted-foreground uppercase text-[11px] font-semibold tracking-wider">
                <tr>
                  <th className="p-3.5">Module & Description</th>
                  <th className="p-3.5 text-center">View</th>
                  <th className="p-3.5 text-center">Create</th>
                  <th className="p-3.5 text-center">Edit</th>
                  <th className="p-3.5 text-center">Delete</th>
                  <th className="p-3.5 text-center">Transfer</th>
                  <th className="p-3.5 text-center">Export</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/70">
                {currentRows.map((row, idx) => (
                  <tr key={row.module} className="hover:bg-muted/20 transition-colors">
                    <td className="p-3.5">
                      <div className="font-medium text-foreground">{row.module}</div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">{row.description}</div>
                    </td>

                    {/* View */}
                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => handleToggle(idx, 'canView')}
                        className={`p-1 rounded-md border transition-colors ${
                          row.canView
                            ? 'bg-primary/10 border-primary text-primary'
                            : 'bg-muted border-border text-muted-foreground'
                        }`}
                      >
                        {row.canView ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                      </button>
                    </td>

                    {/* Create */}
                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => handleToggle(idx, 'canCreate')}
                        className={`p-1 rounded-md border transition-colors ${
                          row.canCreate
                            ? 'bg-primary/10 border-primary text-primary'
                            : 'bg-muted border-border text-muted-foreground'
                        }`}
                      >
                        {row.canCreate ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                      </button>
                    </td>

                    {/* Edit */}
                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => handleToggle(idx, 'canEdit')}
                        className={`p-1 rounded-md border transition-colors ${
                          row.canEdit
                            ? 'bg-primary/10 border-primary text-primary'
                            : 'bg-muted border-border text-muted-foreground'
                        }`}
                      >
                        {row.canEdit ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                      </button>
                    </td>

                    {/* Delete */}
                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => handleToggle(idx, 'canDelete')}
                        className={`p-1 rounded-md border transition-colors ${
                          row.canDelete
                            ? 'bg-destructive/10 border-destructive text-destructive'
                            : 'bg-muted border-border text-muted-foreground'
                        }`}
                      >
                        {row.canDelete ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                      </button>
                    </td>

                    {/* Transfer */}
                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => handleToggle(idx, 'canTransfer')}
                        className={`p-1 rounded-md border transition-colors ${
                          row.canTransfer
                            ? 'bg-info/10 border-info text-info-foreground dark:text-info'
                            : 'bg-muted border-border text-muted-foreground'
                        }`}
                      >
                        {row.canTransfer ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                      </button>
                    </td>

                    {/* Export */}
                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => handleToggle(idx, 'canExport')}
                        className={`p-1 rounded-md border transition-colors ${
                          row.canExport
                            ? 'bg-primary/10 border-primary text-primary'
                            : 'bg-muted border-border text-muted-foreground'
                        }`}
                      >
                        {row.canExport ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
