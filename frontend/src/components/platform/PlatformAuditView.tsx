"use client";

import React from "react";
import { ShieldAlert, ShieldCheck, Download, Filter, Search } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function PlatformAuditView() {
  const auditLogs = [
    {
      id: "LOG-8812",
      timestamp: "2024-09-02 13:10:44",
      actor: "Super-Admin (Root)",
      action: "TENANT_PROVISIONED",
      target: "FiberLink Telecom (fiberlink.primeone.io)",
      ipAddress: "182.180.44.12",
      status: "SUCCESS",
    },
    {
      id: "LOG-8811",
      timestamp: "2024-09-02 12:45:19",
      actor: "Super-Admin (Root)",
      action: "QUOTA_OVERRIDE",
      target: "Prime Networks (Branches: 20 -> 20, Subscribers: 150k)",
      ipAddress: "182.180.44.12",
      status: "SUCCESS",
    },
    {
      id: "LOG-8810",
      timestamp: "2024-09-02 11:20:05",
      actor: "System Engine",
      action: "INVOICE_GENERATED",
      target: "Monthly SaaS Invoicing Batch (8 Tenants)",
      ipAddress: "10.0.1.1",
      status: "SUCCESS",
    },
    {
      id: "LOG-8809",
      timestamp: "2024-09-02 09:14:32",
      actor: "Security Gateway",
      action: "RATE_LIMIT_TRIGGERED",
      target: "Blocked 140 unauthorized RADIUS requests from 103.22.14.9",
      ipAddress: "103.22.14.9",
      status: "BLOCKED",
    },
    {
      id: "LOG-8808",
      timestamp: "2024-09-01 18:30:00",
      actor: "Super-Admin (Root)",
      action: "CLUSTER_MAINTENANCE_TOGGLE",
      target: "PROD-CLUSTER-01 DB Index Optimization",
      ipAddress: "182.180.44.12",
      status: "SUCCESS",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-heading font-extrabold text-foreground tracking-tight">
          Global Platform Security & Audit Trail
        </h2>
        <p className="text-xs text-muted-foreground">
          Immutable audit log capturing all super-admin operations, tenant provisioning, and security triggers.
        </p>
      </div>

      <Card className="bg-card border-border shadow-xs">
        <CardHeader className="p-4 border-b border-border bg-card-subtle/50 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm font-heading font-bold">
              Audit Events Stream
            </CardTitle>
            <CardDescription className="text-xs">
              Retained for 365 days in accordance with telecom compliance standards.
            </CardDescription>
          </div>

          <Badge variant="info" className="font-mono text-[9px]">
            IMMUTABLE LOGS
          </Badge>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Log ID</TableHead>
                <TableHead>Timestamp (UTC+5)</TableHead>
                <TableHead>Actor</TableHead>
                <TableHead>Action Type</TableHead>
                <TableHead>Event Description & Target</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead className="text-right">Outcome</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auditLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-mono font-bold text-primary text-xs">
                    {log.id}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground" suppressHydrationWarning>
                    {log.timestamp}
                  </TableCell>
                  <TableCell className="font-bold text-foreground text-xs">
                    {log.actor}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-mono text-[9px]">
                      {log.action}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-foreground">
                    {log.target}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {log.ipAddress}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant={log.status === "SUCCESS" ? "success" : "destructive"}>
                      {log.status}
                    </Badge>
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
