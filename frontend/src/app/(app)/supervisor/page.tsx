'use client';

import React from 'react';
import { Gauge, Users, Clock, AlertTriangle, CheckCircle2, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { mockDb, MockSupervisorAgent } from '@/mock-db';

export default function SupervisorHudPage() {
  const agents: MockSupervisorAgent[] = mockDb.getSupervisorAgents();

  return (
    <div className="p-6 max-w-7xl mx-auto w-full space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-border">
        <div>
          <div className="flex items-center gap-2">
            <Gauge className="w-5 h-5 text-primary" />
            <h1 className="font-heading font-black text-2xl tracking-tight uppercase">
              SUPERVISOR LIVE OPERATIONS HUD
            </h1>
          </div>
          <p className="text-xs font-mono text-muted-foreground mt-1">
            Real-time helpdesk agent occupancy, active queue load, and SLA breach countdown monitor.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => alert('Refreshing live telemetry sweeps...')}
          leftIcon={<RefreshCw className="w-3.5 h-3.5 text-primary" />}
        >
          LIVE TELEMETRY: ACTIVE (0.3s)
        </Button>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-xs">
        <div className="bg-card border-2 border-border p-4 shadow-sm">
          <div className="text-[10px] text-muted-foreground uppercase">ACTIVE QUEUED CHATS</div>
          <div className="font-heading font-black text-3xl mt-1 text-primary">4 IN QUEUE</div>
          <div className="text-[10px] text-muted-foreground mt-0.5">SLA Target: &lt; 2m</div>
        </div>

        <div className="bg-card border-2 border-border p-4 shadow-sm">
          <div className="text-[10px] text-muted-foreground uppercase">ONLINE AGENTS</div>
          <div className="font-heading font-black text-3xl mt-1 text-foreground">12 / 14</div>
          <div className="text-[10px] text-muted-foreground mt-0.5">Occupancy: 78%</div>
        </div>

        <div className="bg-card border-2 border-border p-4 shadow-sm">
          <div className="text-[10px] text-muted-foreground uppercase">MEAN RESPONSE TIME</div>
          <div className="font-heading font-black text-3xl mt-1 text-info">38 SECONDS</div>
          <div className="text-[10px] text-muted-foreground mt-0.5">Target: &lt; 60s</div>
        </div>

        <div className="bg-card border-2 border-border p-4 shadow-sm">
          <div className="text-[10px] text-muted-foreground uppercase">SLA BREACHES (TODAY)</div>
          <div className="font-heading font-black text-3xl mt-1 text-destructive">0 BREACHES</div>
          <div className="text-[10px] text-primary mt-0.5 font-bold">100% COMPLIANCE ✓</div>
        </div>
      </div>

      {/* Live Agent Occupancy Grid */}
      <div className="bg-card border-2 border-border shadow-md overflow-hidden">
        <div className="p-4 border-b-2 border-border bg-card-subtle flex items-center justify-between">
          <div className="font-heading font-black text-sm uppercase">
            ACTIVE HELPDESK OCCUPANCY RADAR
          </div>
          <Badge variant="primary" size="xs">
            LIVE MONITORING
          </Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-card-subtle border-b-2 border-border text-muted-foreground uppercase text-[10px]">
              <tr>
                <th className="p-3.5">AGENT / OFFICER</th>
                <th className="p-3.5">STATUS</th>
                <th className="p-3.5">ACTIVE CONCURRENT CHATS</th>
                <th className="p-3.5">BRANCH HUB</th>
                <th className="p-3.5">AVG RESPONSE TIME</th>
                <th className="p-3.5">CSAT RATING</th>
                <th className="p-3.5 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-border">
              {agents.map((a) => (
                <tr key={a.id} className="hover:bg-card-subtle/50 transition-colors">
                  <td className="p-3.5 font-heading font-bold text-foreground">{a.name}</td>
                  <td className="p-3.5">
                    <Badge variant={a.status === 'In Chat' ? 'primary' : 'outline'} size="xs">
                      {a.status}
                    </Badge>
                  </td>
                  <td className="p-3.5 font-bold">{a.activeChats} Conversations</td>
                  <td className="p-3.5 text-muted-foreground">{a.branch}</td>
                  <td className="p-3.5 font-bold text-info">{a.avgResponse}</td>
                  <td className="p-3.5 font-bold text-warning">{a.csat}</td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => alert(`Whispering / Monitoring ${a.name}`)}
                      className="px-2.5 py-1 bg-card hover:bg-card-subtle border border-border text-[10px] font-bold uppercase shadow-sm"
                    >
                      MONITOR STREAM
                    </button>
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
