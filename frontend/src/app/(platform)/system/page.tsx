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
        ? 'Global platform maintenance banner active'
        : 'All 14 tenant portals operating normally',
      next ? 'warning' : 'success'
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-border">
        <div>
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5 text-primary" />
            <h1 className="font-heading font-black text-2xl tracking-tight uppercase">
              GLOBAL SYSTEM INFRASTRUCTURE & GATEWAY TELEMETRY
            </h1>
          </div>
          <p className="text-xs font-mono text-muted-foreground mt-1">
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
            REFRESH METRICS
          </Button>

          <Button
            variant={maintenanceMode ? 'destructive' : 'secondary'}
            size="sm"
            onClick={handleToggleMaintenance}
            leftIcon={<AlertTriangle className="w-3.5 h-3.5" />}
          >
            {maintenanceMode ? 'DISABLE MAINTENANCE' : 'ENABLE MAINTENANCE'}
          </Button>
        </div>
      </div>

      {/* Global Status Banner */}
      {maintenanceMode && (
        <div className="p-3.5 bg-destructive-light border-2 border-destructive text-destructive-foreground font-mono text-xs flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold">
            <AlertTriangle className="w-4 h-4 text-destructive" />
            <span className="text-destructive font-black">
              GLOBAL MAINTENANCE MODE ACTIVE: Read-only access enabled across all tenant portals.
            </span>
          </div>
          <Badge variant="destructive" size="xs">
            LIVE BROADCAST
          </Badge>
        </div>
      )}

      {/* 4 Infrastructure Health Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
        {/* API Gateway */}
        <div className="bg-card border-2 border-border p-4 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground text-[10px] uppercase font-bold">
            <span>API GATEWAY LATENCY</span>
            <Zap className="w-3.5 h-3.5 text-primary" />
          </div>
          <div className="font-heading font-black text-3xl text-primary">
            {metrics.apiGatewayLatencyMs} ms
          </div>
          <div className="text-[10px] text-primary font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>SUB-MILLISECOND RESPONSE</span>
          </div>
        </div>

        {/* Redis Cluster */}
        <div className="bg-card border-2 border-border p-4 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground text-[10px] uppercase font-bold">
            <span>REDIS PUB/SUB MEMORY</span>
            <Cpu className="w-3.5 h-3.5 text-info" />
          </div>
          <div className="font-heading font-black text-3xl text-info">
            {metrics.redis.memoryUsedMb} MB
          </div>
          <div className="text-[10px] text-muted-foreground">
            {metrics.redis.activeChannels} Channels across {metrics.redis.clusterNodes} Nodes
          </div>
        </div>

        {/* PostgreSQL RLS */}
        <div className="bg-card border-2 border-border p-4 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground text-[10px] uppercase font-bold">
            <span>POSTGRESQL RLS SCHEMAS</span>
            <Database className="w-3.5 h-3.5 text-warning" />
          </div>
          <div className="font-heading font-black text-3xl text-warning">
            {metrics.postgres.totalSchemasCount} SCHEMAS
          </div>
          <div className="text-[10px] text-warning font-bold">
            AVG QUERY: {metrics.postgres.rlsQueryAverageMs} ms
          </div>
        </div>

        {/* Active WebSockets */}
        <div className="bg-card border-2 border-border p-4 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground text-[10px] uppercase font-bold">
            <span>ACTIVE WEBSOCKET POOL</span>
            <Radio className="w-3.5 h-3.5 text-foreground animate-pulse" />
          </div>
          <div className="font-heading font-black text-3xl text-foreground">
            {metrics.activeWebsocketsCount.toLocaleString()}
          </div>
          <div className="text-[10px] text-muted-foreground">
            Staff & Customer Live Rooms
          </div>
        </div>
      </div>

      {/* Deep Dive 2-Column Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-mono text-xs">
        {/* Left: PostgreSQL Pool & WAL Replication */}
        <div className="bg-card border-2 border-border p-5 shadow-md space-y-4">
          <div className="font-heading font-black text-sm uppercase flex items-center justify-between border-b-2 border-border pb-3">
            <span>POSTGRESQL MULTI-TENANT ENGINE</span>
            <Badge variant="primary" size="xs">
              HEALTHY
            </Badge>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span>CONNECTION POOL UTILIZATION</span>
                <span className="font-bold">
                  {metrics.postgres.activeConnections} / {metrics.postgres.maxConnections} (28%)
                </span>
              </div>
              <div className="w-full bg-card-subtle h-2.5 border border-border">
                <div className="bg-primary h-full w-[28%]" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-card-subtle border border-border">
                <div className="text-[10px] text-muted-foreground">WAL REPLICATION LAG</div>
                <div className="font-bold text-foreground text-sm mt-0.5">
                  {metrics.postgres.walReplicationLagMs} ms
                </div>
              </div>

              <div className="p-3 bg-card-subtle border border-border">
                <div className="text-[10px] text-muted-foreground">TENANT SCHEMAS ISOLATION</div>
                <div className="font-bold text-primary text-sm mt-0.5">100% ENFORCED</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Cloudflare R2 Object Storage */}
        <div className="bg-card border-2 border-border p-5 shadow-md space-y-4">
          <div className="font-heading font-black text-sm uppercase flex items-center justify-between border-b-2 border-border pb-3">
            <span>CLOUDFLARE R2 OBJECT STORAGE</span>
            <HardDrive className="w-4 h-4 text-info" />
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-card-subtle border border-border">
                <div className="text-[10px] text-muted-foreground">TOTAL STORAGE CONSUMED</div>
                <div className="font-bold text-info text-sm mt-0.5">
                  {metrics.storage.usedGb} GB
                </div>
              </div>

              <div className="p-3 bg-card-subtle border border-border">
                <div className="text-[10px] text-muted-foreground">PAYMENT & TICKET ATTACHMENTS</div>
                <div className="font-bold text-foreground text-sm mt-0.5">
                  {metrics.storage.filesCount.toLocaleString()} files
                </div>
              </div>
            </div>

            <div className="p-3 bg-card-subtle border border-border">
              <div className="text-[10px] text-muted-foreground">MONTHLY EGRESS BANDWIDTH</div>
              <div className="font-bold text-foreground text-sm mt-0.5">
                {metrics.storage.monthlyBandwidthGb} GB / month (Unlimited free egress)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
