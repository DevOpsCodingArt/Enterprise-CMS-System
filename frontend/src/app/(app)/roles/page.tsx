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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-border">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-warning" />
            <h1 className="font-heading font-black text-2xl tracking-tight uppercase">
              CUSTOM RBAC PERMISSION MATRIX BUILDER
            </h1>
          </div>
          <p className="text-xs font-mono text-muted-foreground mt-1">
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
            SAVE MATRIX CHANGES
          </Button>
        </div>
      </div>

      {/* 2-Column Layout: Roles on Left, Matrix on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Role Selector (4 cols) */}
        <div className="lg:col-span-4 bg-card border-2 border-border p-4 shadow-md space-y-3">
          <div className="flex items-center justify-between pb-2 border-b-2 border-border">
            <span className="font-heading font-bold text-xs uppercase text-muted-foreground">
              PERMISSION GROUPS (ROLES)
            </span>
            <button
              onClick={() => alert('New role builder')}
              className="p-1 border border-border bg-card-subtle hover:bg-card text-foreground"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2">
            {roles.map((r) => (
              <button
                key={r.id}
                onClick={() => setSelectedRole(r.id)}
                className={`w-full text-left p-3 border-2 font-mono text-xs transition-all ${selectedRole === r.id
                    ? 'bg-card-subtle border-primary shadow-sm font-bold'
                    : 'bg-card border-border hover:border-primary/50'
                  }`}
              >
                <div className="flex items-center justify-between">
                  <span className="truncate">{r.name}</span>
                  {r.isSystem && (
                    <Badge variant="outline" size="xs">
                      SYSTEM
                    </Badge>
                  )}
                </div>
                <div className="text-[10px] text-muted-foreground mt-1">
                  {r.usersCount} Active Staff Bound
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Interactive Permission Checkbox Matrix (8 cols) */}
        <div className="lg:col-span-8 bg-card border-2 border-border shadow-md overflow-hidden">
          <div className="p-4 border-b-2 border-border bg-card-subtle flex items-center justify-between">
            <div>
              <div className="font-heading font-black text-sm uppercase">
                {roles.find((r) => r.id === selectedRole)?.name}
              </div>
              <div className="text-[10px] font-mono text-muted-foreground mt-0.5">
                Toggle individual action capabilities for this role
              </div>
            </div>

            <Badge variant="primary" size="xs">
              ACTIVE EDITING
            </Badge>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-card-subtle border-b-2 border-border text-muted-foreground uppercase text-[10px]">
                <tr>
                  <th className="p-3.5">MODULE / RESOURCE</th>
                  <th className="p-3.5 text-center">VIEW</th>
                  <th className="p-3.5 text-center">CREATE</th>
                  <th className="p-3.5 text-center">EDIT</th>
                  <th className="p-3.5 text-center">TRANSFER</th>
                  <th className="p-3.5 text-center">EXPORT</th>
                  <th className="p-3.5 text-center">DELETE</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-border">
                {currentRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-card-subtle/50 transition-colors">
                    <td className="p-3.5">
                      <div className="font-heading font-bold text-foreground">{row.module}</div>
                      <div className="text-[10px] text-muted-foreground leading-snug">
                        {row.description}
                      </div>
                    </td>

                    {/* View */}
                    <td className="p-3.5 text-center">
                      <input
                        type="checkbox"
                        checked={row.canView}
                        onChange={() => handleToggle(idx, 'canView')}
                        className="w-4 h-4 accent-primary cursor-pointer"
                      />
                    </td>

                    {/* Create */}
                    <td className="p-3.5 text-center">
                      <input
                        type="checkbox"
                        checked={row.canCreate}
                        onChange={() => handleToggle(idx, 'canCreate')}
                        className="w-4 h-4 accent-primary cursor-pointer"
                      />
                    </td>

                    {/* Edit */}
                    <td className="p-3.5 text-center">
                      <input
                        type="checkbox"
                        checked={row.canEdit}
                        onChange={() => handleToggle(idx, 'canEdit')}
                        className="w-4 h-4 accent-primary cursor-pointer"
                      />
                    </td>

                    {/* Transfer */}
                    <td className="p-3.5 text-center">
                      <input
                        type="checkbox"
                        checked={row.canTransfer}
                        onChange={() => handleToggle(idx, 'canTransfer')}
                        className="w-4 h-4 accent-primary cursor-pointer"
                      />
                    </td>

                    {/* Export */}
                    <td className="p-3.5 text-center">
                      <input
                        type="checkbox"
                        checked={row.canExport}
                        onChange={() => handleToggle(idx, 'canExport')}
                        className="w-4 h-4 accent-primary cursor-pointer"
                      />
                    </td>

                    {/* Delete */}
                    <td className="p-3.5 text-center">
                      <input
                        type="checkbox"
                        checked={row.canDelete}
                        onChange={() => handleToggle(idx, 'canDelete')}
                        className="w-4 h-4 accent-destructive cursor-pointer"
                      />
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
