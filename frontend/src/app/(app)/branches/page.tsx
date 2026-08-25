'use client';

import React, { useState } from 'react';
import { Building2, Plus, MapPin, Wifi, Activity, Truck, User, Radio, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { mockDb, MockBranch } from '@/mock-db';

export default function BranchesPage() {
  const [branches, setBranches] = useState<MockBranch[]>(mockDb.getBranches());

  return (
    <div className="p-6 max-w-7xl mx-auto w-full space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Building2 className="w-5 h-5" />
            </div>
            <h1 className="font-heading font-bold text-2xl tracking-tight text-foreground">
              Regional Distribution Hubs & Network Matrix
            </h1>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Real-time subnet isolation, active helpdesk queues, and GPS van stock across Islamabad & Rawalpindi.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => alert('Add regional hub modal')}
          leftIcon={<Plus className="w-3.5 h-3.5" />}
        >
          Add Regional Hub
        </Button>
      </div>

      {/* Grid of Regional Hub Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {branches.map((b) => (
          <div key={b.id} className="bg-card rounded-xl border border-border p-5 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-start justify-between gap-2 pb-3 border-b border-border/70">
                <div>
                  <h3 className="font-heading font-semibold text-base text-foreground">
                    {b.name}
                  </h3>
                  <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-muted-foreground/80" />
                    <span className="truncate">{b.address}</span>
                  </div>
                </div>

                <Badge variant="primary" size="sm">
                  <span className="font-mono">{b.code}</span>
                </Badge>
              </div>

              {/* 4 Telemetry Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-4 text-xs">
                <div className="p-2.5 rounded-lg bg-muted/30 border border-border/70">
                  <div className="text-[11px] text-muted-foreground font-medium">Subscribers</div>
                  <div className="font-mono font-semibold text-base mt-0.5 text-foreground">{b.subscribers}</div>
                </div>

                <div className="p-2.5 rounded-lg bg-muted/30 border border-border/70">
                  <div className="text-[11px] text-muted-foreground font-medium">Optical Health</div>
                  <div className="font-mono font-semibold text-base text-primary mt-0.5">{b.opticalHealth}</div>
                </div>

                <div className="p-2.5 rounded-lg bg-muted/30 border border-border/70">
                  <div className="text-[11px] text-muted-foreground font-medium">Active Queue</div>
                  <div className="font-mono font-semibold text-base text-warning-foreground dark:text-warning mt-0.5">{b.activeQueues} queued</div>
                </div>

                <div className="p-2.5 rounded-lg bg-muted/30 border border-border/70">
                  <div className="text-[11px] text-muted-foreground font-medium">Van Fleet</div>
                  <div className="font-mono font-semibold text-base text-info-foreground dark:text-info mt-0.5">{b.vanFleet}</div>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Branch Supervisor:</span>
                  <span className="font-medium text-foreground">{b.supervisor}</span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Subnet Range:</span>
                  <span className="font-mono font-medium text-primary">{b.subnets}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-border/70 flex justify-between items-center text-xs">
              <span className="text-muted-foreground">
                Latency: <span className="font-mono font-medium text-foreground">{b.latency}</span>
              </span>
              <Button
                variant="outline"
                size="xs"
                onClick={() => alert(`Switching context to ${b.name}`)}
              >
                View Hub Queues →
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
