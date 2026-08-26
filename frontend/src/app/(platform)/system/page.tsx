'use client';

import React, { useState } from 'react';
import {
  Server,
  Activity,
  Database,
  Radio,
  HardDrive,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Layers,
  Zap,
  Globe,
  Lock,
  Clock,
  ShieldAlert,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/components/ui/Toast';
import { mockDb } from '@/mock-db';

export default function PlatformSystemPage() {
  const { showToast } = useToast();
  const [metrics, setMetrics] = useState(mockDb.getSystemMetrics());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState(
    'Scheduled core database optimization in progress. Expected return at 06:00 PKT.'
  );

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      showToast('Telemetry Refreshed', 'Live latency and Redis socket cluster synced', 'success');
    }, 600);
  };

  const handleToggleMaintenance = () => {
    const next = !maintenanceMode;
    setMaintenanceMode(next);
    showToast(
      next ? 'Maintenance Mode Enabled' : 'System Live',
      next
        ? 'Global platform maintenance banner active across all 14 tenant subdomains'
        : 'All 14 tenant portals operating normally',
      next ? 'warning' : 'success'
    );
  };

  const regionalNodes = [
    { city: 'Islamabad Core', ping: '0.2ms', status: 'Optimal', load: '14%' },
    { city: 'Rawalpindi Saddar Hub', ping: '0.4ms', status: 'Optimal', load: '22%' },
    { city: 'Lahore DHA Station', ping: '1.2ms', status: 'Optimal', load: '31%' },
    { city: 'Karachi Central DC', ping: '4.8ms', status: 'Optimal', load: '48%' },
  ];

  const workerQueues = [
    { name: 'smartolt-poller', description: 'Periodic optical power dBm poller', status: 'Healthy', jobsPerMin: '4,800/min' },
    { name: 'email-dispatcher', description: 'Staff invitation & OTP token sender', status: 'Active', jobsPerMin: '120/min' },
    { name: 'billing-reconciliation', description: 'ZL Ultra ledger invoice sync', status: 'Idle', jobsPerMin: '0/min' },
    { name: 'audit-archiver', description: 'Immutable log compression & R2 upload', status: 'Running', jobsPerMin: '850/min' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Server className="w-5 h-5" />
            </div>
            <h1 className="font-heading font-bold text-2xl tracking-tight text-foreground">
              Global System Infrastructure & Gateway Telemetry
            </h1>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Real-time multi-tenant Redis cluster health, PostgreSQL RLS query latency, and Cloudflare R2 storage telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            isLoading={isRefreshing}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Refresh Telemetry
          </Button>

          <Button
            variant={maintenanceMode ? 'destructive' : 'primary'}
            size="sm"
            onClick={handleToggleMaintenance}
            leftIcon={
              maintenanceMode ? (
                <AlertTriangle className="w-3.5 h-3.5" />
              ) : (
                <ShieldAlert className="w-3.5 h-3.5" />
              )
            }
          >
            {maintenanceMode ? 'Disable Maintenance' : 'Emergency Maintenance'}
          </Button>
        </div>
      </div>

      {/* Maintenance Mode Alert Banner if active */}
      {maintenanceMode && (
        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/30 flex items-center justify-between gap-4 text-xs text-destructive animate-pulse">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <div>
              <div className="font-bold text-sm">GLOBAL MAINTENANCE BROADCAST ACTIVE</div>
              <div className="text-xs opacity-90">{maintenanceMessage}</div>
            </div>
          </div>
          <Button variant="destructive" size="xs" onClick={handleToggleMaintenance}>
            Take System Live
          </Button>
        </div>
      )}

      {/* 4 Core Cluster Health Gauges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
        <div className="bg-card rounded-xl border border-border p-4 shadow-xs">
          <div className="text-xs text-muted-foreground font-medium flex items-center justify-between">
            <span>API Gateway Latency</span>
            <Activity className="w-3.5 h-3.5 text-success" />
          </div>
          <div className="font-mono font-bold text-2xl mt-1 text-success">
            {metrics.apiGatewayLatencyMs} ms
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">Ultra-Low Overhead</div>
        </div>

        <div className="bg-card rounded-xl border border-border p-4 shadow-xs">
          <div className="text-xs text-muted-foreground font-medium flex items-center justify-between">
            <span>Redis Pub/Sub Stream</span>
            <Radio className="w-3.5 h-3.5 text-primary" />
          </div>
          <div className="font-mono font-bold text-2xl mt-1 text-primary">12,400 /s</div>
          <div className="text-xs text-muted-foreground mt-0.5">{metrics.redis.clusterNodes} Cluster Nodes</div>
        </div>

        <div className="bg-card rounded-xl border border-border p-4 shadow-xs">
          <div className="text-xs text-muted-foreground font-medium flex items-center justify-between">
            <span>PostgreSQL Read/Write Pool</span>
            <Database className="w-3.5 h-3.5 text-info-foreground dark:text-info" />
          </div>
          <div className="font-mono font-bold text-2xl mt-1 text-info-foreground dark:text-info">
            {metrics.postgres.activeConnections} / {metrics.postgres.maxConnections}
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">RLS Latency: {metrics.postgres.rlsQueryAverageMs}ms</div>
        </div>

        <div className="bg-card rounded-xl border border-border p-4 shadow-xs">
          <div className="text-xs text-muted-foreground font-medium flex items-center justify-between">
            <span>Global Uptime</span>
            <Zap className="w-3.5 h-3.5 text-warning" />
          </div>
          <div className="font-mono font-bold text-2xl mt-1 text-warning-foreground dark:text-warning">
            {metrics.uptimePercentage}%
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">Zero Major Outages</div>
        </div>
      </div>

      {/* 2-Column Grid: Regional Edge Latency & Background Workers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Regional Network Latency Map */}
        <div className="bg-card rounded-xl border border-border p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border/70">
            <h3 className="font-heading font-semibold text-sm text-foreground flex items-center gap-2">
              <Globe className="w-4 h-4 text-primary" />
              Regional Edge Network Latency Sweeper
            </h3>
            <Badge variant="primary" size="xs">
              4 Edge Hubs
            </Badge>
          </div>

          <div className="space-y-2.5 text-xs">
            {regionalNodes.map((node) => (
              <div
                key={node.city}
                className="p-3 rounded-lg bg-muted/30 border border-border/70 flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold text-foreground">{node.city}</div>
                  <div className="text-xs text-muted-foreground">Node Load: {node.load}</div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge variant="primary" size="xs">
                    {node.status}
                  </Badge>
                  <span className="font-mono font-bold text-success">
                    {node.ping}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Background Worker Queues */}
        <div className="bg-card rounded-xl border border-border p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border/70">
            <h3 className="font-heading font-semibold text-sm text-foreground flex items-center gap-2">
              <Cpu className="w-4 h-4 text-warning" />
              Background Worker Queues & Dispatchers
            </h3>
            <Badge variant="outline" size="xs">
              4 Queues
            </Badge>
          </div>

          <div className="space-y-2.5 text-xs">
            {workerQueues.map((worker) => (
              <div
                key={worker.name}
                className="p-3 rounded-lg bg-muted/30 border border-border/70 flex items-center justify-between"
              >
                <div>
                  <div className="font-mono font-semibold text-foreground">{worker.name}</div>
                  <div className="text-xs text-muted-foreground">{worker.description}</div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-muted-foreground">{worker.jobsPerMin}</span>
                  <Badge
                    variant={worker.status === 'Healthy' || worker.status === 'Active' ? 'primary' : 'outline'}
                    size="xs"
                  >
                    {worker.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
