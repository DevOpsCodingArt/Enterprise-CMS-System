"use client";

import React from "react";
import {
  Database,
  Radio,
  Zap,
  Activity,
  Server,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function ClusterHealthRadar() {
  const clusters = [
    {
      name: "PostgreSQL Multi-Tenant DB",
      icon: Database,
      status: "optimal",
      latency: "2.4 ms",
      load: "28% Pool (140/500 conns)",
      badge: "99.99% SLA",
      badgeVariant: "success" as const,
    },
    {
      name: "Redis Pub/Sub & Sockets Queue",
      icon: Zap,
      status: "optimal",
      latency: "0.8 ms",
      load: "1,420 msgs/sec",
      badge: "CIRCUIT SAFE",
      badgeVariant: "success" as const,
    },
    {
      name: "Socket.io Gateway Cluster",
      icon: Radio,
      status: "optimal",
      latency: "4.2 ms",
      load: "12,480 Active WS Sockets",
      badge: "4 NODES LIVE",
      badgeVariant: "info" as const,
    },
    {
      name: "FreeRADIUS Auth Microservice",
      icon: Server,
      status: "optimal",
      latency: "3.8 ms",
      load: "Port 1812 UDP (0 dropped)",
      badge: "ONLINE",
      badgeVariant: "success" as const,
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-heading font-bold text-foreground">
          Platform Infrastructure Telemetry
        </h3>
        <Badge variant="success" hasPulse className="text-[10px] font-mono">
          ALL CLUSTERS NOMINAL
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {clusters.map((c) => {
          const Icon = c.icon;
          return (
            <Card key={c.name} className="p-4 bg-card border-border shadow-xs hover:border-primary/40 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <span className="font-heading font-bold text-xs text-foreground truncate max-w-[150px]">
                    {c.name}
                  </span>
                </div>
                <Badge variant={c.badgeVariant} className="text-[9px] py-0 px-1.5 font-mono">
                  {c.badge}
                </Badge>
              </div>

              <div className="mt-3 flex items-baseline justify-between">
                <span className="font-mono text-xs text-muted-foreground">Response Latency:</span>
                <span className="font-mono font-bold text-xs text-success">{c.latency}</span>
              </div>

              <div className="mt-1 flex items-baseline justify-between">
                <span className="font-mono text-[11px] text-muted-foreground">Throughput / Load:</span>
                <span className="font-mono text-[11px] text-foreground font-medium">{c.load}</span>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
