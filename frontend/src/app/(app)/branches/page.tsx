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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-border">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            <h1 className="font-heading font-black text-2xl tracking-tight uppercase">
              20 REGIONAL DISTRIBUTION HUBS // NETWORK MATRIX
            </h1>
          </div>
          <p className="text-xs font-mono text-muted-foreground mt-1">
            Real-time subnet isolation, active helpdesk queues, and GPS van stock across Islamabad & Rawalpindi.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => alert('Add branch modal')}
          leftIcon={<Plus className="w-3.5 h-3.5" />}
        >
          ADD REGIONAL HUB
        </Button>
      </div>

      {/* Grid of Regional Hub Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {branches.map((b) => (
          <div key={b.id} className="bg-card border-2 border-border p-5 shadow-md flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-start justify-between gap-2 pb-3 border-b-2 border-border">
                <div>
                  <h3 className="font-heading font-black text-base uppercase text-foreground">
                    {b.name}
                  </h3>
                  <div className="text-[11px] font-mono text-muted-foreground flex items-center gap-1.5 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{b.address}</span>
                  </div>
                </div>

                <Badge variant="primary" size="sm">
                  {b.code}
                </Badge>
              </div>

              {/* 4 Telemetry Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-4 font-mono text-xs">
                <div className="p-2.5 bg-card-subtle border border-border">
                  <div className="text-[9px] text-muted-foreground uppercase">SUBSCRIBERS</div>
                  <div className="font-heading font-bold text-lg mt-0.5">{b.subscribers}</div>
                </div>

                <div className="p-2.5 bg-card-subtle border border-border">
                  <div className="text-[9px] text-muted-foreground uppercase">OPTICAL HEALTH</div>
                  <div className="font-heading font-bold text-lg text-primary mt-0.5">{b.opticalHealth}</div>
                </div>

                <div className="p-2.5 bg-card-subtle border border-border">
                  <div className="text-[9px] text-muted-foreground uppercase">ACTIVE QUEUE</div>
                  <div className="font-heading font-bold text-lg text-warning mt-0.5">{b.activeQueues} QUEUED</div>
                </div>

                <div className="p-2.5 bg-card-subtle border border-border">
                  <div className="text-[9px] text-muted-foreground uppercase">VAN FLEET</div>
                  <div className="font-heading font-bold text-lg text-info mt-0.5">{b.vanFleet}</div>
                </div>
              </div>

              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>BRANCH SUPERVISOR:</span>
                  <span className="font-bold text-foreground">{b.supervisor}</span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>SUBNET RANGE:</span>
                  <span className="font-bold text-primary">{b.subnets}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-border flex justify-between items-center text-xs font-mono">
              <span className="text-muted-foreground">LATENCY: {b.latency}</span>
              <button
                onClick={() => alert(`Switching context to ${b.name}`)}
                className="px-3 py-1.5 bg-card-subtle hover:bg-card border border-border hover:border-primary font-bold uppercase transition-colors"
              >
                VIEW BRANCH QUEUES →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
