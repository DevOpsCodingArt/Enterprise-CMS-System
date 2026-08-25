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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Gauge className="w-5 h-5" />
            </div>
            <h1 className="font-heading font-bold text-2xl tracking-tight text-foreground">
              Supervisor Live Operations HUD
            </h1>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Real-time helpdesk agent occupancy, active queue load, and SLA breach countdown monitor.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => alert('Refreshing live telemetry sweeps...')}
          leftIcon={<RefreshCw className="w-3.5 h-3.5 text-primary" />}
        >
          Live Telemetry: <span className="font-mono ml-1 font-semibold text-primary">Active (0.3s)</span>
        </Button>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
        <div className="bg-card rounded-xl border border-border p-4 shadow-xs">
          <div className="text-[11px] text-muted-foreground font-medium">Active Queued Chats</div>
          <div className="font-mono font-bold text-2xl mt-1 text-primary">4 in Queue</div>
          <div className="text-[11px] text-muted-foreground mt-0.5">SLA Target: &lt; 2m</div>
        </div>

        <div className="bg-card rounded-xl border border-border p-4 shadow-xs">
          <div className="text-[11px] text-muted-foreground font-medium">Online Agents</div>
          <div className="font-mono font-bold text-2xl mt-1 text-foreground">12 / 14</div>
          <div className="text-[11px] text-muted-foreground mt-0.5">Occupancy: 78%</div>
        </div>

        <div className="bg-card rounded-xl border border-border p-4 shadow-xs">
          <div className="text-[11px] text-muted-foreground font-medium">Mean Response Time</div>
          <div className="font-mono font-bold text-2xl mt-1 text-info-foreground dark:text-info">38 Seconds</div>
          <div className="text-[11px] text-muted-foreground mt-0.5">Target: &lt; 60s</div>
        </div>

        <div className="bg-card rounded-xl border border-border p-4 shadow-xs">
          <div className="text-[11px] text-muted-foreground font-medium">SLA Breaches (Today)</div>
          <div className="font-mono font-bold text-2xl mt-1 text-emerald-600 dark:text-emerald-400">0 Breaches</div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5 font-medium">100% Compliance ✓</div>
        </div>
      </div>

      {/* Live Agent Occupancy Grid */}
      <div className="bg-card rounded-xl border border-border shadow-xs overflow-hidden">
        <div className="p-4 border-b border-border/70 bg-card flex items-center justify-between">
          <div className="font-heading font-semibold text-sm text-foreground">
            Active Helpdesk Occupancy Radar
          </div>
          <Badge variant="primary" size="xs">
            Live Monitoring
          </Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-xs">
            <thead className="bg-muted/30 border-b border-border text-muted-foreground uppercase text-[11px] font-semibold tracking-wider">
              <tr>
                <th className="p-3.5">Agent / Officer</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Active Concurrent Chats</th>
                <th className="p-3.5">Branch Hub</th>
                <th className="p-3.5">Avg Response Time</th>
                <th className="p-3.5">CSAT Rating</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/70">
              {agents.map((a) => (
                <tr key={a.id} className="hover:bg-muted/20 transition-colors">
                  <td className="p-3.5 font-heading font-semibold text-foreground">{a.name}</td>
                  <td className="p-3.5">
                    <Badge variant={a.status === 'In Chat' ? 'primary' : 'outline'} size="xs">
                      {a.status}
                    </Badge>
                  </td>
                  <td className="p-3.5 font-medium text-foreground">{a.activeChats} Conversations</td>
                  <td className="p-3.5 text-muted-foreground">{a.branch}</td>
                  <td className="p-3.5 font-mono font-medium text-info-foreground dark:text-info">{a.avgResponse}</td>
                  <td className="p-3.5 font-mono font-semibold text-amber-600 dark:text-amber-400">{a.csat}</td>
                  <td className="p-3.5 text-right">
                    <Button
                      variant="outline"
                      size="xs"
                      onClick={() => alert(`Opening silent supervisor barge session for ${a.name}`)}
                    >
                      Barge In
                    </Button>
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
