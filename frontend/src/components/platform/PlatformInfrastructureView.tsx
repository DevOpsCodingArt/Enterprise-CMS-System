"use client";

import React from "react";
import {
  Server,
  Database,
  Radio,
  Zap,
  ShieldCheck,
  CheckCircle2,
  HardDrive,
  Cpu,
  RefreshCw,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ClusterHealthRadar } from "./ClusterHealthRadar";

export function PlatformInfrastructureView() {
  const nodes = [
    {
      id: "node-pg-01",
      name: "Postgres Shard 1 (Primary Write)",
      type: "Database",
      ip: "10.0.1.14",
      cpu: "18%",
      memory: "6.2 / 32 GB",
      connections: "140 / 500",
      status: "optimal",
      uptime: "48 days",
    },
    {
      id: "node-pg-02",
      name: "Postgres Read Replica 1 (Asia-South)",
      type: "Database",
      ip: "10.0.1.15",
      cpu: "12%",
      memory: "4.8 / 32 GB",
      connections: "85 / 500",
      status: "optimal",
      uptime: "48 days",
    },
    {
      id: "node-redis-01",
      name: "Redis Pub/Sub Cluster Leader",
      type: "Cache / Queue",
      ip: "10.0.2.10",
      cpu: "8%",
      memory: "1.4 / 16 GB",
      connections: "2,400 sockets",
      status: "optimal",
      uptime: "92 days",
    },
    {
      id: "node-ws-01",
      name: "Socket.io Edge Gateway 01",
      type: "Real-Time Gateway",
      ip: "10.0.3.21",
      cpu: "24%",
      memory: "3.1 / 16 GB",
      connections: "3,120 websockets",
      status: "optimal",
      uptime: "31 days",
    },
    {
      id: "node-radius-01",
      name: "FreeRADIUS Auth Cluster A",
      type: "Authentication",
      ip: "10.0.4.50",
      cpu: "15%",
      memory: "2.0 / 8 GB",
      connections: "Port 1812 UDP",
      status: "optimal",
      uptime: "120 days",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-heading font-extrabold text-foreground tracking-tight">
          Cloud Infrastructure & Cluster Node Telemetry
        </h2>
        <p className="text-xs text-muted-foreground">
          Live server cluster load, CPU/memory telemetry, and multi-tenant database connection pools.
        </p>
      </div>

      {/* Cluster Health Summary */}
      <ClusterHealthRadar />

      {/* Node Table */}
      <Card className="bg-card border-border shadow-xs">
        <CardHeader className="p-4 border-b border-border bg-card-subtle/50 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm font-heading font-bold">
              Active Cloud Server Nodes
            </CardTitle>
            <CardDescription className="text-xs">
              Hardware utilization polled every 5 seconds.
            </CardDescription>
          </div>

          <Badge variant="success" hasPulse className="text-[10px] font-mono">
            ALL NODES HEALTHY
          </Badge>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Node Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Private IP</TableHead>
                <TableHead>CPU Load</TableHead>
                <TableHead>Memory (RAM)</TableHead>
                <TableHead>Active Connections</TableHead>
                <TableHead>Uptime</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {nodes.map((n) => (
                <TableRow key={n.id}>
                  <TableCell className="font-bold text-foreground text-xs">
                    {n.name}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-[9px] font-mono">
                      {n.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {n.ip}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-foreground font-bold">
                    {n.cpu}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {n.memory}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-foreground">
                    {n.connections}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {n.uptime}
                  </TableCell>
                  <TableCell>
                    <Badge variant="success">OPTIMAL</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
